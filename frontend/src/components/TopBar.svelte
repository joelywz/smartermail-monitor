<script type="ts">
import { createEventDispatcher } from "svelte";
import PlusIcon from "./icons/PlusIcon.svelte";
import RefreshIcon from "./icons/RefreshIcon.svelte";

    const dispatch = createEventDispatcher();


    function handleRefresh() {
        dispatch("refresh")
    }

    function handleAddServer() {
        dispatch("addserver")
    }
</script>



<div class="flex justify-between h-full">
    <div>
        <h1 class="text-lg font-bold">Smartermail Monitor</h1>
    </div>
    <div class="flex gap-2">
        <button
            class="bg-emerald-600 text-white px-3 rounded-md text-xs font-medium"
            on:click={handleRefresh}
        >
            <div class="flex items-center">
                <RefreshIcon size={13} />
            </div>
        </button>
        <button
            on:click={handleAddServer}
            class="bg-blue-500 text-white px-3 py-1.5 rounded-md text-xs font-medium "
        >
            <div class="flex items-center">
                <PlusIcon size={13} />
            </div>
        </button>
    </div>
</div>