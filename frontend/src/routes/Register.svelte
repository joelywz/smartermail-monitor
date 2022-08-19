<script>
import LockIcon from "../components/icons/LockIcon.svelte";
import InputField from "../components/addserver/InputField.svelte";

</script>
<div class="flex flex-col items-center gap-8 bg-white rounded-lg max-w-sm m-auto p-10 shadow-sm">
    <h1 class="text-2xl font-bold">Smartermail Monitor</h1>

    <div class="text-neutral-800">
        <LockIcon size={32}/>
    </div>


    <p class="text-sm text-neutral-60 text-center text-neutral-500">Create a password to store your server information in an encrypted format.</p>

    <form class="w-full flex flex-col gap-8" on:submit|preventDefault>

        <div class="flex flex-col gap-4 items-start">
            <input class="bg-neutral-100 shadow-sm rounded-sm px-2 py-2 outline-none w-full text-sm" type="password" placeholder="Password"/>
            <input class="bg-neutral-100 shadow-sm rounded-sm px-2 py-2 outline-none w-full text-sm" type="password" placeholder="Repeat Password"/>
            <button class="text-blue-400 text-xs">Import data</button>
        </div>

        <button type="submit" class="rounded-sm text-white py-2">Create</button>
    </form>

</div>