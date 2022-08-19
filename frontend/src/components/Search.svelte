<script type="ts">
    import CloseIcon from "./icons/CloseIcon.svelte";
    import {createEventDispatcher} from 'svelte'

    const dispatch = createEventDispatcher()

    export let value = "";

    function clearField() {
        value = ""
        dispatch("clear")
    }

    function handleChange() {
        dispatch("input")
    }

</script>

<div class="flex">
    <input
        class="bg-neutral-100 rounded-md py-2 px-2 outline-none text-xs w-72 rounded-r-none"
        placeholder="Search"
        bind:value={value}
        on:input={handleChange}
    />

    <div class="text-neutral-500 bg-neutral-100 px-2 rounded-r-md h-full flex justify-center">
        <button disabled={value == ""} class="align-middle disabled:opacity-0 disabled:scale-y-0 transition-all duration-200" on:click={clearField}>
            <CloseIcon size={15} />
        </button>
    </div>

</div>
