<script type="ts">
    import {url} from "./router";

    export let path = "";


</script>

{#if $url == path}
    <slot/>
{/if}
