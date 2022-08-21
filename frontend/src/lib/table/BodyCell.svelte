<script type="ts">
    type T = $$Generic;

    export let value: any = "";
    export let component: any = undefined;
    export let cellProps = {}

</script>

{#if component != undefined}
    <svelte:component this={component} value={value} {...cellProps}/>
{:else}
    {value}
{/if}

