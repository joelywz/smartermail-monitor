<script type="ts">
import HiddenEyeIcon from "../icons/HiddenEyeIcon.svelte";
    
    export let login: (password: string) => void | Promise<void>;
    
    let password = "";
    let loading = false;
    let errorMessage = ""; 

    $: filled = password != ""


    async function handleSubmit() {
        if (!filled) return;

        loading = true;
        try {
            await login(password);
        } catch (err) {
            errorMessage = "Invalid password"
        }

        loading = false;

    }

    function clearErrorMessage() {
        errorMessage = "";
    }
</script>

<div class="flex flex-col items-center gap-5 bg-white rounded-lg max-w-sm m-auto p-10 shadow-sm w-full  ">
    <h1 class="text-2xl font-bold">Smartermail Monitor</h1>

    <div class="text-neutral-800">
        <HiddenEyeIcon size={32}/>
    </div>


    <p class="text-sm text-neutral-60 text-center text-neutral-500">Enter your password to unlock your data.</p>

    <form class="w-full flex flex-col gap-8" on:submit|preventDefault={handleSubmit}>

        <div class="flex flex-col gap-2 items-start">
            <div class="flex flex-col gap-2 w-full">
                <p class="text-red-500 text-xs h-4">{errorMessage}</p>
                <input on:input={clearErrorMessage} bind:value={password} class="bg-neutral-100 shadow-sm rounded-sm px-2 py-2 outline-none w-full text-sm mb-2" type="password" placeholder="Password" disabled={loading}/>
            </div>
            <div class="flex flex-col items-start gap-2">
                <button class="text-blue-400 text-xs">Reset data</button>
            </div>
        </div>

        <button type="submit" class="rounded-sm text-white py-2 flex justify-center gap-2 items-center" disabled={!filled || loading}>
            <!-- {#if loading}
                <div class="animate-spin">
                    <LoadingIcon size={15}/>
                </div>
            {/if} -->
            <div>
                {#if loading}
                    Unlocking...
                {:else}
                    Unlock
                {/if}
            </div>
        </button>
    </form>

</div>