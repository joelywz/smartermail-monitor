import { writable  } from "svelte/store";

const url = writable("")

function setPath(path: string) {
    url.update(_ => path);
}

export { url, setPath}
