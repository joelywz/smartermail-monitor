<script type="ts">
import Home from "./routes/Home.svelte";
import TailwindCss from "./TailwindCSS.svelte";
import { Route, setPath} from "./components/router";
import Login from "./routes/Register.svelte";


setPath("/register")
</script>

<TailwindCss />

<main class="bg-neutral-100 p-10 flex flex-col gap-5 min-h-screen">
    <Route path="">
        <Home/>
    </Route>
    <Route path="/register">
        <Login/>
    </Route>

</main>

