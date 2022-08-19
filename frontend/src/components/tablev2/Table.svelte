<script type="ts">
import type { Column, SortStates } from ".";
import AddServer from "../addserver/AddServer.svelte";
import BodyCell from "./BodyCell.svelte";
import HeadCell from "./HeadCell.svelte";
    type T = $$Generic;

    export let columns: Column<T>[] = [];
    export let dataSources: T[] = [];
    export let cellPaddingY: number = 3;
    export let cellPaddingX: number = 5;
    
    let sortedDataSources: T[] = [];
    let sortStates: SortStates[] = columns.map(_ => "default");
    let sortColIndex: number = 0;

    $: minTableWidth = columns.reduce((a, col) => a + col.width, 0);
    $: isSorted = sortStates.includes("ascend") || sortStates.includes("descend");
    $: dsToDisplay = isSorted ? sortedDataSources : dataSources;
    $: {
        dataSources;
        update()
    }


    function sort(colIndex: number) {
        // Update Sortstate
        sortStates = sortStates.map((s, i) => {
            if (i != colIndex && s != "default") {
                return "default";
            }
            return s;
        })

        sortColIndex = colIndex

        let targetSortState = sortStates[colIndex];
        if (targetSortState == "default") return;
        let indexName = columns[colIndex].index;
        sortedDataSources = [...dataSources];

        sortedDataSources = sortedDataSources.sort((a, b) => {
            let sorter = columns[colIndex].sorter;
            if (sorter == undefined) return 0;
            
            let val = sorter(a[indexName], b[indexName]);

            if (targetSortState == "descend") {
                return -val;
            }
            return val;
        })

        
    }

    function update() {
        if (isSorted) {
            sort(sortColIndex)
        }
    }




</script>

<table class="border-collapse flex flex-col h-full" style={`min-width: ${minTableWidth}px`}>
    <thead class="border-b">
        <tr class="block" style={`padding: ${cellPaddingY}px 0`}>
            {#each columns as col, i}
                <th style={`width: ${col.width}px; padding: 0 ${cellPaddingX}px;`}>
                    <HeadCell value={col.name} sortable={col.sorter != undefined} on:sort={() => sort(i)} bind:sortState={sortStates[i]}/>
                </th>
            {/each}
        </tr>
    </thead>
    <tbody class="overflow-y-scroll h-full text-sm">
        {#each dsToDisplay as source}
            <tr class="block hover:bg-neutral-100 rounded-sm" style={`padding: ${cellPaddingY}px 0`}>
                {#each columns as col}
                    <td style={`width: ${col.width}px; padding: 0 ${cellPaddingX}px;`}>
                        <BodyCell value={source[col.index]} component={col.component} cellProps={col.genereateProps && col.genereateProps(source)}/>
                    </td>
                {/each}
            </tr>
        {/each}
    </tbody>
</table>

<style>

</style>