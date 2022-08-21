<script type="ts">
    import DeleteIcon from "../icons/DeleteIcon.svelte";

    export let remove: () => any;
</script>

<div class="flex justify-between">
    <button on:click={remove} class="text-neutral-500">
        <DeleteIcon size={14} />
    </button>
</div>
