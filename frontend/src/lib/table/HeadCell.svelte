<script type="ts">
import type { SortStates } from ".";
import ArrowDownIcon from "../../icons/ArrowDownIcon.svelte";
import {createEventDispatcher} from 'svelte';


    const dispatch = createEventDispatcher();

    export let value: string;
    export let sortable: boolean = false;
    export let sortState: SortStates = "default";

    function handleSortClick() {
        switch(sortState) {
            case "default":
                sortState = "descend";
                break;
            case "descend":
                sortState = "ascend";
                break;
            case "ascend":
                sortState = "default";
                break;
        }

        dispatch("sort")
    }

</script>

<div class="flex justify-between text-neutral-500 text-xs font-semibold">
    {value}
    {#if sortable}
    <button on:click={handleSortClick}>
        <div class={`${sortState != "default" ? "text-blue-500" : null} ${sortState == "ascend" ? "rotate-180" : null} transition-all duration-200`}>
            <ArrowDownIcon size={15}/>
        </div>
    </button> 
    {/if}
</div>