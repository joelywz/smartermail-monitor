import create from 'zustand';
import { DataSource } from '../lib/Table';
import smartermailapi from '../api/smartermail';
import { GetSpoolMessageCount, HasSavedData, ReadData, SaveData, DeleteData, CheckForUpdates} from '../../wailsjs/go/main/App';

const APP_VERSION = "0.2.2";
const SAVE_VERSION = "1.0";
export const ConflictError = new Error("conflict encounted");
export const NotFoundError = new Error("not found");
export const AccessError = new Error("no access");
export const InvalidDataError = new Error("invalid data");

interface Store {
    password: string | null;
    servers: Server[];
    dataSources: MonitorDataSource[];
    appVersion: string;
    saveVersion: string;
    timer: number;
    refreshTime: number;
    reset: () => void;
    hasRegistered: () => Promise<boolean>;
    login: (password: string) => Promise<void>
    register: (password: string) => Promise<void>
    addServer: (host: string, username: string, password: string) => Promise<void>
    removeServer: (host: string) => Promise<void>
    update: () => Promise<void>
    ping: (host: string, username: string, password: string) => Promise<boolean>
    resetData: () => Promise<boolean>
    tick: () => void
    setRefreshTime: (val: number) => void;
    checkForUpdates: (silent: boolean) => Promise<string>;

}

export interface MonitorDataSource extends DataSource {
    host: string;
    online: boolean | null;
    imap: boolean | null;
    imapThreads: number | null;
    pop: boolean | null;
    popThreads: number | null;
    smtp: boolean | null;
    smtpThreads: number | null;
    spool: boolean | null;
    spoolCount: number | null;
    spoolThreads: number | null;
    uptime: number | null;
}

interface Server {
    host: string;
    username: string;
    password: string;
}

interface Save {
    version: string,
    servers: Server[],
    refreshTime: number,
}




const useData = create<Store>((set, get) => {


    function hasServer(host: string) {
        for (const server of get().servers) {
            if (server.host == host) return true;
        }
        return false;
    }

    async function fetchMetrics(host: string, username: string, password: string): Promise<MonitorDataSource> {

        try {
            // Online
            const res = await smartermailapi.fetch(host, username, password);
            return {
                key: host,
                host,
                online: true,
                imap: res.imap,
                imapThreads: res.imapThreads,
                pop: res.pop,
                popThreads: res.popThreads,
                smtp: res.smtp,
                smtpThreads: res.smtpThreads,
                spool: res.spool,
                spoolCount: res.spoolCount,
                spoolThreads: res.spoolThreads,
                uptime: res.uptime,
            }
        } catch (e) {
            // Offline
            return {...emptyDataSource(host), online: false}
        }
    }

    function emptyDataSource(host: string): MonitorDataSource {
        return {
            key: host,
            host,
            online: null,
            imap: null,
            imapThreads: null,
            pop: null,
            popThreads: null,
            smtp: null,
            smtpThreads: null,
            spool: null,
            spoolCount: null,
            spoolThreads: null,
            uptime: null
        }
    }

    async function load(password: string) {

        let rawData = await ReadData(password);
        if (rawData == "") throw AccessError;

        try {
            let parsedData: Save = JSON.parse(rawData);
            if (!parsedData.servers) throw InvalidDataError;
            if (!parsedData.version) throw InvalidDataError;

            console.log("set refresh timer")
            set(prev => ({
                ...prev,
                servers: parsedData.servers,
                dataSources: parsedData.servers.map(s => emptyDataSource(s.host)),
                timer: parsedData.refreshTime || 30,
                refreshTime: parsedData.refreshTime || 30,
                loadedData: parsedData,
                saveVersion: parsedData.version,
                password: password,
            }))

            get().update();
        } catch (e) {
            throw AccessError;
        }
    }

    async function save() {
        const $ = get()
        if (!$.password) throw AccessError;

        const save: Save = {
            servers: $.servers,
            version: $.saveVersion,
            refreshTime: $.refreshTime,
        };

        await SaveData(JSON.stringify(save), $.password);
    }


    return {
        dataSources: [],
        password: "joelyong",
        servers: [],
        appVersion: APP_VERSION,
        saveVersion: SAVE_VERSION,
        timer: 30,
        refreshTime: 30,
        reset: () => {
            set(prev => ({
                ...prev,
                dataSources: [],
                password: null,
                servers: [],
                saveVersion: SAVE_VERSION,
            }))
        },
        hasRegistered: HasSavedData,
        login: load,
        register: async (password: string) => {
      

            set(prev => ({
                ...prev,
                password: password,
                servers: [],
                saveVersion: SAVE_VERSION,
            }))

            await save();
        },
        addServer: async (host, username, password) => {

            if (hasServer(host)) throw ConflictError;
            if (!get().password) throw AccessError;

            set(prev => ({
                ...prev,
                servers: [...prev.servers, {
                    host,
                    username,
                    password,
                }],
                dataSources: [...prev.dataSources, emptyDataSource(host)]
            }))

            await save();
            get().update();


        },
        removeServer: async (host) => {

            if (!hasServer(host)) throw NotFoundError;

            set(prev => ({
                ...prev,
                servers: prev.servers.filter(server => server.host != host),
                dataSources: prev.dataSources.filter(source => source.host != host)
            }))

            await save();
        },
        update: async () => {
            get().servers.map((server, index) => {
                fetchMetrics(server.host, server.username, server.password).then((newSource) => {
                    set(prev => {

                        let temp = [...prev.dataSources];

                        temp[index] = newSource

                        return {
                            ...prev,
                            dataSources: temp,
                        }
                    })
                })
            })

            set(prev => ({
                ...prev,
                timer: prev.refreshTime,
            }))
        },
        ping: async(host, username, password) => {
            let result = await GetSpoolMessageCount(host, username, password);

            if (result != -1) {
                return true;
            }
        
            return false;
        },
        resetData: DeleteData,
        tick: () => {
            const $ = get();
            if ($.timer == 0) {
                get().update();
                
            } else {
                if ($.password == null) return
                set(prev => ({
                    ...prev,
                    timer: prev.timer - 1,
                }))
            }
        },
        setRefreshTime: (val) => {
            set(prev => ({
                ...prev,
                refreshTime: val,
                timer: val,
            }));
            save()
        },
        checkForUpdates: CheckForUpdates
    }
})

export default useData;