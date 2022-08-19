import Table from "./Table.svelte";

export interface Column<T> {
    name: string;
    index: string;
    width: number;
    sorter?: (a: any, b: any) => number;
    component?: any;
    genereateProps?: (dataSource: T) => {};
}

export type SortStates = "ascend" | "descend" | "default";

export { Table };