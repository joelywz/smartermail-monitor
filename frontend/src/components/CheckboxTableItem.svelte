<script type="ts">
    export let value: boolean;
</script>

{#if value == null || value == undefined}
    -
{:else}
    <input type="checkbox" checked={value} on:click|preventDefault/>
{/if}
