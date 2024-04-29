import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
  SortingState,
  getSortedRowModel,
  HeaderContext,
  CellContext,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import {
  CaretSortIcon,
  ResetIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  DotsHorizontalIcon,
  MixerHorizontalIcon,
  ReloadIcon,
  DragHandleDots2Icon,
  TrashIcon,
  ChevronLeftIcon
} from "@radix-ui/react-icons";
import { Checkbox } from "../components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { useEffect, useMemo, useState } from "react";
import AddServerDialog from "../components/AddServerForm";
import { Stat, useDashboard } from "../context/DashboardContext";
import { DeleteServer, Refresh } from "../../wailsjs/go/main/App";
import { Input } from "../components/ui/input";
import useCountdownTimer from "../hooks/useCountdownTimer";
import { useNavigate } from "react-router-dom";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../components/ui/hover-card";

// const testData: Stat[] = Array.from({ length: 50 }, (_, i) => ({
//   id: `${i}`,
//   host: `https://host-${Math.floor(Math.random() * 100000000000000)}`,
//   spool: Math.floor(Math.random() * 100),
//   smtp: Math.random() > 0.5,
//   imap: Math.random() > 0.5,
//   pop: Math.random() > 0.5,
//   smtpThreads: Math.floor(Math.random() * 100),
//   popThreads: Math.floor(Math.random() * 100),
//   imapThreads: Math.floor(Math.random() * 100),
//   status: ["online", "fetching", "offline"][Math.floor(Math.random() * 3)] as "online" | "fetching" | "offline",
// }));

const columnHelper = createColumnHelper<Stat>();

const defaultColumns = [
  columnHelper.accessor("host", {
    header: "Host",
    cell: (props) => props.getValue(),
    minSize: 200,
    size: 200,
    enableHiding: false,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (props) => (
      <>
        {
          {
            online: <span className="text-green-600">Online</span>,
            offline: <span className="text-red-600">Offline</span>,
            fetching: <span className="text-amber-600">Fetching</span>,
          }[props.getValue() as string]
        }
      </>
    ),
    minSize: 115,
    size: 115,
    enableHiding: false,
    enableMultiSort: true,
  }),
  columnHelper.accessor("spool", {
    header: "Spool",
    sortingFn: "alphanumeric",
    cell: (props) => <span>{props.getValue()}</span>,
    minSize: 100,
    size: 100,
    sortUndefined: false,
    enableMultiSort: true,
  }),
  columnHelper.accessor("imap", {
    header: "IMAP",
    enableSorting: false,
    cell: (props) => <Checkbox checked={props.getValue()} disabled></Checkbox>,
    minSize: 70,
    size: 70,
    enableResizing: false,
  }),
  columnHelper.accessor("pop", {
    header: "POP",
    enableSorting: false,
    cell: (props) => <Checkbox checked={props.getValue()} disabled></Checkbox>,
    minSize: 70,
    size: 70,
    enableResizing: false,
  }),
  columnHelper.accessor("smtp", {
    header: "SMTP",
    enableSorting: false,
    cell: (props) => <Checkbox checked={props.getValue()} disabled></Checkbox>,
    minSize: 70,
    size: 70,
    enableResizing: false,
  }),
  columnHelper.accessor("imapThreads", {
    header: "IMAP Threads",
    cell: (props) => props.getValue(),
    minSize: 130,
    size: 130,
    enableResizing: false,
  }),
  columnHelper.accessor("popThreads", {
    header: "POP Threads",
    cell: (props) => props.getValue(),
    minSize: 130,
    size: 130,
    enableResizing: false,
  }),
  columnHelper.accessor("smtpThreads", {
    header: "SMTP Threads",
    cell: (props) => props.getValue(),
    minSize: 130,
    size: 130,
    enableResizing: false,
  }),
  columnHelper.display({
    id: "col-actions",
    header: "",
    cell: (props) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size={"sm"}>
            <DotsHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={async () => {
              await DeleteServer(props.row.original.id);
            }}
          >
            <TrashIcon className="mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    minSize: 70,
    size: 70,
    enableResizing: false,
    enableHiding: false,
  }),
];

export default function DashboardPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const dashboard = useDashboard();
  const seconds = useCountdownTimer(dashboard.refreshDate);
  const navigate = useNavigate();

  const table = useReactTable({
    data: dashboard.data,
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    enableSorting: true,
    isMultiSortEvent: (e) => true,
    // debugAll: true,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
  });

  async function handleRefresh() {
    await Refresh();
  }

  function handleBackClick() {
    navigate(-1);
  }

  const offlineServers = useMemo(
    () => dashboard.data.filter(s => s.status == 'offline'),
     [dashboard.data]
    );

  return (
    <div className="flex flex-col p-8 h-screen gap-2.5">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant={"outline"} onClick={handleBackClick}><ChevronLeftIcon className="mr-2"/>Back</Button>
          {
            offlineServers.length > 0 && (
            <HoverCard>
              <HoverCardTrigger>
                <div className="text-sm text-red-500 flex items-center gap-1 font-semibold select-none cursor-pointer">
                  <ExclamationTriangleIcon/>
                  { offlineServers.length } Server(s) Offline
                </div>
              </HoverCardTrigger>
              <HoverCardContent>
                { offlineServers.map(s => (
                  <div className="text-neutral-800 text-sm">{ s.host }</div>
                ))}
              </HoverCardContent>
            </HoverCard>

            )
          }
        </div>
        <div className="flex justify-normal gap-2.5 items-center">
          <p className="text-xs text-neutral-500">
            {seconds <= 9 ? "Refreshing..." : `Refreshing in ${seconds}s`}</p>
          <Button variant={"outline"} size={"sm"} onClick={handleRefresh}>
            <ReloadIcon className="mr-2" />
            Refresh
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} size={"sm"}>
                <MixerHorizontalIcon className="mr-2" />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {table.getAllColumns().map((col) => (
                <div key={`view-${col.id}`}>
                  {col.getCanHide() && (
                    <DropdownMenuCheckboxItem
                      checked={col.getIsVisible()}
                      onClick={() => col.toggleVisibility()}
                    >
                      {col.columnDef.header?.toString()}
                    </DropdownMenuCheckboxItem>
                  )}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <AddServerDialog />
        </div>
      </div>
      <div className="rounded-md border grid relative h-full overflow-auto">
        <Table className="h-full border-collapse w-full">
          <TableHeader className="sticky top-0 z-10 bg-white w-full select-none">
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id} className="w-full flex">
                {group.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-auto border-none w-full flex justify-between items-center relative group"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <TableHeaderCell ctx={header.getContext()} />
                    )}
                    {header.column.getCanResize() && (
                      <div
                        className={`h-full w-[15px] flex-shrink-0 flex items-center justify-center select-none cursor-col-resize transition opacity-0 ${
                          header.column.getIsResizing()
                            ? "text-neutral-800 opacity-100"
                            : "group-hover:text-neutral-500 group-hover:opacity-100"
                        }`}
                        onMouseDown={header.getResizeHandler()}
                      >
                        <DragHandleDots2Icon />
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="grid">
            {table.getRowModel().rows?.length
              ? table.getRowModel().rows.map((row) => (
                  <TableRow key={row.original.id} className="w-full flex">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        width={cell.column.getSize()}
                        className="overflow-hidden text-ellipsis flex items-center"
                      >
                        <TableBodyCell ctx={cell.getContext()} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : // <TableRow className="px-2.5">
                //   <TableCell
                //     colSpan={defaultColumns.length}
                //     className="text-center"
                //   >

                //   </TableCell>
                // </TableRow>
                null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

type TableHeaderCellProps = {
  ctx: HeaderContext<any, any>;
};

function TableHeaderCell({ ctx }: TableHeaderCellProps) {
  if (!ctx.column.getCanSort()) {
    return <>{flexRender(ctx.column.columnDef.header, ctx)}</>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={"sm"}>
          {flexRender(ctx.column.columnDef.header, ctx)}

          {ctx.column.getCanSort() && ctx.column.getIsSorted() == false && (
            <CaretSortIcon className="ml-1.5" />
          )}
          {{
            asc: <ArrowUpIcon className="ml-1.5" />,
            desc: <ArrowDownIcon className="ml-1.5" />,
          }[ctx.column.getIsSorted() as string] ?? null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-24">
        <DropdownMenuItem onClick={() => ctx.column.toggleSorting(false, true)}>
          <ArrowUpIcon className="mr-2 text-neutral-500 size-3" />
          Asc
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => ctx.column.toggleSorting(true, true)}>
          <ArrowDownIcon className="mr-2 text-neutral-500 size-3" />
          Desc
        </DropdownMenuItem>
        {ctx.column.getCanSort() && ctx.column.getIsSorted() != false && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => ctx.column.clearSorting()}>
              <ResetIcon className="mr-2 text-neutral-500 size-3" />
              Reset
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type TableBodyCellProps = {
  ctx: CellContext<any, any>;
};

function TableBodyCell({ ctx }: TableBodyCellProps) {
  if (!ctx.column.getCanSort()) {
    return (
      <span className="truncate">
        {flexRender(ctx.column.columnDef.cell, ctx)}
      </span>
    );
  }

  return (
    <span className="pl-2.5 whitespace-nowrap w-full truncate">
      {flexRender(ctx.column.columnDef.cell, ctx)}
    </span>
  );
}
