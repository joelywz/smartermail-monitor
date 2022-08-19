<script type="ts">

    export let label = ""
    export let id = "";
    export let disabled: boolean = false;
    export let value = "";
    export let type = "";

    function typeAction(node) {
        node.type = type;
    }
</script>


<div class="flex flex-col gap-0.5">
    <label
      for={id}
      class="text-neutral-600 font-medium">{label}</label
    >
    <input
      use:typeAction
      id={id}
      class="bg-neutral-100 rounded-sm py-1 px-2 text-sm outline-none"
      disabled={disabled}
      bind:value={value}
    />
  </div>