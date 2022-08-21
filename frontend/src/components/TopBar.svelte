<script type="ts">
    import { logout, update } from "../store/data";
    import { createEventDispatcher } from "svelte";
    import LockIcon from "../icons/LockIcon.svelte";
    import PlusIcon from "../icons/PlusIcon.svelte";
    import RefreshIcon from "../icons/RefreshIcon.svelte";

    const dispatch = createEventDispatcher();

    function handleRefresh() {
        update();
    }

    function handleAddServer() {
        dispatch("showAddServerClick");
    }

    function handleLogout() {
        logout();
    }
</script>

<div class="flex justify-between h-full">
    <div>
        <h1 class="text-lg font-bold">Smartermail Monitor</h1>
    </div>
    <div class="flex gap-2 items-center">
        <button
            class="bg-blue-500 text-white px-3 rounded-md text-xs font-medium h-full"
            on:click={handleLogout}
        >
            <div class="flex items-center">
                <LockIcon size={13} />
            </div>
        </button>
        <button
            class="bg-blue-500 text-white px-3 rounded-md text-xs font-medium h-full"
            on:click={handleRefresh}
        >
            <div class="flex items-center">
                <RefreshIcon size={13} />
            </div>
        </button>
        <button
            on:click={handleAddServer}
            class="bg-blue-500 text-white px-3 py-1.5 rounded-md text-xs font-medium h-full"
        >
            <div class="flex items-center">
                <PlusIcon size={13} />
            </div>
        </button>
    </div>
</div>
