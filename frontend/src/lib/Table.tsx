import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import TableBodyCell from './TableBodyCell';
import TableHeaderCell, { SortState } from './TableHeaderCell';

interface Props<T extends DataSource> {
  datasource: T[];
  columns: Columns<T>;
  index?: boolean;
  paddingX?: number;
  paddingY?: number;
}

export interface PropsWithValue {
  value: any | string | number | boolean;
}

export interface Column<T extends DataSource, P extends PropsWithValue> {
  key: string;
  target: keyof T | null;
  name: string;
  width: number;
  sorter?: (a: any, b: any) => number;
  generateProps?: (source: T) => { [key: string]: any };
  component?: React.FC<P>;
}

export interface DataSource {
  key: string;
}

export type Columns<T extends DataSource> = Column<T, any>[]


export default function Table<T extends DataSource>({ datasource, columns, paddingX = 5, paddingY = 2, index = false}: Props<T>) {

  const [sortStates, setSortStates] = useState<SortState[]>(columns.map((): SortState => "default"));
  const [sortedDataSource, setSortedDataSource] = useState<T[]>(datasource);

  const [sortIndex, setSortIndex] = useState(0);
  const isSorting = useMemo(() => sortStates.includes("ascend") || sortStates.includes("descend"), sortStates);

  useEffect(() => {
    if (isSorting) {
      handleSort(sortIndex, sortStates[sortIndex])
    }
  }, [datasource])


  function handleSort(index: number, state: SortState) {
    let s = [...sortStates];

    if (state == "ascend") {
      s = s.map((): SortState => "default");
    }

    s[index] = state;

    let sorted = [...datasource];

    sorted = sorted.sort((s1, s2) => {
      const target = columns[index].target;

      if (target == null) return 0;

      const a = s1[target] as any
      const b = s2[target] as any
      const sorter = columns[index].sorter;

      let sortNumber = sorter ? sorter(a, b) : 0

      return state == "ascend" ? sortNumber : -sortNumber;
    })


    setSortIndex(index);
    setSortedDataSource(sorted);
    setSortStates(s);
  }


  function getDataSource() {
    if (isSorting) {
      return sortedDataSource;
    } else {
      return datasource;
    }
  }

  function generateProps(col: Column<T, any>, source: T) {
    if (!col.generateProps) {
      return {}
    } else {
      return col.generateProps(source);
    }
  }

  return (
    <div className="flex flex-grow bg-white px-8 py-8 rounded-md overflow-x-auto">
      <table className="border-collapse max-h-full w-full flex flex-col overflow-x-auto bg-white">
        <thead>
          <tr className='flex'>
            {index && <TableHeaderCell value="#" width={50} paddingX={paddingX} paddingY={paddingY}/>}
            {columns.map((col, index) => (
              <TableHeaderCell
                key={col.key}
                width={col.width}
                value={col.name}
                paddingX={paddingX}
                paddingY={paddingY}
                sortable={col.sorter ? true : false}
                onSort={(s) => handleSort(index, s)}
                sortState={sortStates[index]}
              />
            ))}

          </tr>
        </thead>

        <tbody className="overflow-y-auto overflow-x-hidden w-fit min-w-full">
          <AnimatePresence>
            {getDataSource().map((source, i) => (
              <motion.tr
                key={`row-${source.key}`}
                className="w-fit hover:bg-neutral-100"
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ ease: "easeInOut", duration: 0.25 }}
              >
                {index && <TableBodyCell key={`col-${source.key}-${index}`} width={50} paddingX={paddingX} paddingY={paddingY}>{i+1}</TableBodyCell>}
                {columns.map((col) => {
                  const unknownVal = col.target != null ? source[col.target] as unknown : null;
                  const val = unknownVal == null ? "-" : unknownVal as string

                  return (
                    <TableBodyCell key={`col-${source.key}-${col.target as string}`} width={col.width} paddingX={paddingX} paddingY={paddingY}>
                      {col.component ? <col.component value={unknownVal} {...generateProps(col, source)} /> : val}
                    </TableBodyCell>
                  )
                })}
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>

      </table>
    </div>

  )
}


interface CheckCellProps {
  value: boolean;
}

export function CheckCell(props: CheckCellProps) {
  return (
    <input type="checkbox" checked={props.value ? props.value : false} onChange={() => { }} />
  )
}