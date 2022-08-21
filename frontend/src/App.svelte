<script type="ts">
import Home from "./routes/Home.svelte";
import TailwindCss from "./TailwindCSS.svelte";
import { Route } from "./lib/router";
import Login from "./routes/Login.svelte";
import Register from "./routes/Register.svelte";
import { onMount } from "svelte";
import { data, init, login, register, type Source } from "./store/data";
import { onDestroy } from "svelte";

onMount(() => {
    init();
    // setPath("test")
})

let sources: Source[];

const unsubscribe = data.subscribe(d => {
    sources = d.sources;
})

onDestroy(() => {
    unsubscribe();
})


</script>

<TailwindCss />

<main class="bg-neutral-100 p-10 flex flex-col gap-5 min-h-screen max-h-screen">
    <Route path="">
        <Home/>
    </Route>
    <Route path="register">
        <Register register={register}/>
    </Route>
    <Route path="login">
        <Login login={login}/>
    </Route>

</main>

