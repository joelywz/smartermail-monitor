import { setPath } from "../lib/router";
import { writable } from "svelte/store"
import { HasSavedData, ReadData, SaveData } from "../../wailsjs/go/main/App";
import { fetch } from "../api/smartermail";

const VERSION = "1.0"

type ServerInfo = {
    host: string;
    username: string;
    password: string;
}

export type Source = {
    key: string;
    host: string;
    imap: boolean;
    imapThreads: number;
    pop: boolean;
    popThreads: number;
    smtp: boolean;
    smtpThreads: number;
    spool: boolean;
    spoolCount: number;
    spoolThreads: number;
    uptime: number;
}

type Data = {
    sources: Source[];
}

type Store = {
    version: string;
    serverList: ServerInfo[];
}

export const data = writable<Data>({
    sources: []
});



let password: string = null;
let store: Store = null;

export async function init() {
    setPath("loading");
    reset();
    if (await isRegistered()) {
        setPath("login");
    } else {
        setPath("register");
    }
}


export async function login(pwd: string) {
    let rawData: string = await ReadData(pwd)
    if (rawData == "") throw new Error("failed to unlock")
    password = pwd;

    await load();

    setPath("")
}

export async function register(pwd: string) {
    const newStore: Store = {
        version: VERSION,
        serverList: []
    }

    if (!await SaveData(JSON.stringify(newStore), password)) {
        throw new Error("failed  to create new save file")
    }

    password = pwd;
    store = newStore;

    setPath("")
}

export function logout() {
    init();
}

export function addServer(host: string, username: string, password: string) {
    if (!store.serverList) {
        console.log("failed to add server because server list is not initialized");
        return;
    }

    if (store.serverList.find(info => info.host == host)) {
        throw new Error("already exist");
    }

    console.log("new")
    store.serverList.push({
        host,
        username,
        password
    });
    update()
    save();

}

export function removeServer(host: string) {
    if (!store.serverList) {
        console.log("failed to remove server because server list is not initialized");
        return;
    }
    console.log("remove", host)
    store.serverList = store.serverList.filter(info => info.host != host)
    update();
    save();
}



export async function update ()  {
    
    data.update($data => {
        if (store.serverList && $data.sources.length != store.serverList.length) {
            console.log("syncing data source with server list");
            $data.sources = syncWithServerList($data.sources, store.serverList)
            console.log("synced succesfully")
        }

        console.log("refreshing data");


        store.serverList.map((server, index) => {
            fetch(server.host, server.username, server.password).then(m => {

                data.update($data => {
                    let source = $data.sources[index];
                    source.spoolCount = m.spoolCount;
                    source.imap = m.imap;
                    source.imapThreads = m.imapThreads;
                    source.pop = m.pop;
                    source.popThreads = m.popThreads;
                    source.smtp = m.smtp;
                    source.smtpThreads = m.smtpThreads;
                    source.spool = m.spool;
                    source.spoolThreads = m.spoolThreads;
                    source.uptime = m.uptime;
                    return $data;
                })
                
            }).catch(() => console.log(`error on fetching for ${server.host}`))
        })


        return $data;
    })
}

function syncWithServerList(sources: Source[], serverList: ServerInfo[]): Source[] {

    if (!store.serverList) {
        console.log("failed to sync because server list is not initialized");
        return sources;
    }

    const newDataSources: Source[] = [];
    let notAddedServers: ServerInfo[] = [...store.serverList];

    console.log(sources);

    // Remove deleted
    for (let source of sources) {
        serverList.map((server, index) => {
            if (source.host == server.host) {
                newDataSources.push(source);
                notAddedServers = notAddedServers.filter(n => n.host != server.host)
            }
        })
    }

    console.log(notAddedServers);

    // Add new
    for (let server of notAddedServers) {
        newDataSources.push({
            host: server.host,
            key: server.host,
            spoolCount: null,
            imap: null,
            imapThreads: null,
            pop: null,
            popThreads: null,
            smtp: null,
            smtpThreads: null,
            spool: null,
            spoolThreads: null,
            uptime: null,
        })
    }

    console.log("new data sources", newDataSources)

    return newDataSources;
}

function reset() {
    password = null;
    store = {
        version: VERSION,
        serverList: []
    }
    data.update($data => {
        $data.sources = [];
        return $data;
    })
}

async function save() {
    if (password == "") throw new Error("not logged in");
    await SaveData(JSON.stringify(store), password);
}

async function isRegistered(): Promise<boolean> {
    return await HasSavedData();
}

async function load() {
    if (!password) throw new Error("not logged in");
    if (!store) throw new Error("store is not initialized");
    let rawData: string = await ReadData(password);
    if (rawData  == "") throw new Error("failed to unlock data")

    try {
        let parsedData: Store = JSON.parse(rawData)
        if (!parsedData.serverList) throw new Error("bad file")
        store = parsedData;
        update();
    } catch (e) {
        throw new Error("Failed to unlock data");
    }



}