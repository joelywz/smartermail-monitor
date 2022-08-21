<script type="ts">
import LockIcon from "../icons/LockIcon.svelte";

let password = "";
let repeatPassword = "";
export let register: (password: string) => void | Promise<void>;

let errorString = ""

async function handleSubmit() {
    errorString = "";


    if (password == "" || repeatPassword == "") {
        errorString = "Fields cannot be blank.";
    }

    if (password.length < 6) {
        errorString = "Password must be at least 6 characters."
    }

    if (password != repeatPassword) {
        errorString = "Password does not match.";
    }

    try {
        await register(password)
    } catch (error) {
        console.log(error)
    }
}

function resetErrorMessage() {
    errorString = ""
}


</script>
<div class="flex flex-col items-center gap-5 bg-white rounded-lg max-w-sm m-auto p-10 shadow-sm">
    <h1 class="text-2xl font-bold">Smartermail Monitor</h1>

    <div class="text-neutral-800">
        <LockIcon size={32}/>
    </div>


    <p class="text-sm text-neutral-60 text-center text-neutral-500">Create a password to store your server information in an encrypted format.</p>

    <form class="w-full flex flex-col gap-8" on:submit|preventDefault={handleSubmit}>

        <div class="flex flex-col gap-5 items-start">
            <div class="flex flex-col gap-2 w-full">
                <div class="text-xs text-red-500 h-4">{errorString}</div>
                <input bind:value={password} on:input={resetErrorMessage} class="bg-neutral-100 shadow-sm rounded-sm px-2 py-2 outline-none w-full text-sm mb-2" type="password" placeholder="Password"/>
                <input bind:value={repeatPassword} on:input={resetErrorMessage} class="bg-neutral-100 shadow-sm rounded-sm px-2 py-2 outline-none w-full text-sm" type="password" placeholder="Repeat Password"/>
            </div>
            <div class="flex flex-col items-start gap-2">
                <button class="text-blue-400 text-xs">Import data</button>
            </div>
        </div>

        <button type="submit" class="rounded-sm text-white py-2" disabled={password == "" || repeatPassword == ""}>Create</button>
    </form>

</div>