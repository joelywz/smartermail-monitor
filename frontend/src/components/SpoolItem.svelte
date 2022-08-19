<script type="ts">
    export let value: any = "-";
</script>

{#if value == undefined || value == null}
    -
{:else} 
    {value}
{/if}