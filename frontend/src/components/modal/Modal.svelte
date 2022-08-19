
<script type="ts">
    import CloseIcon from "../icons/CloseIcon.svelte";
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher()

    export let show = false;

    function handleClose() {
        show = false;
        dispatch("close")
    }

    
</script>

{#if show}
<div class="h-screen w-screen fixed z-50 bg-black left-0 top-0 opacity-40">
</div>

<div class="h-screen w-screen fixed z-50 left-0 top-0 flex justify-center items-center">
    <div class="bg-white shadow-sm rounded-md relative max-h-full overflow-scroll">
        <div class="absolute top-0 right-0 text-neutral-600 pr-4 pt-4">
            <button on:click={handleClose}>
                <CloseIcon/>
            </button>
        </div>
        <slot/>
    </div>

</div>
{/if}

