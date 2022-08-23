import { GetSpoolMessageCount, GetStatus } from "../../wailsjs/go/main/App";

type MailMetric = {
    imap: boolean;
    imapThreads: number;
    pop: boolean;
    popThreads: number;
    smtp: boolean;
    smtpThreads: number;
    spool: boolean
    spoolCount: number;
    spoolThreads: number;
    uptime: number;
}

export async function fetch(host: string, username: string, password: string ): Promise<MailMetric> {
    const result = await GetStatus(host, username, password)    
    return result
}

export async function ping(host: string, username: string, password: string): Promise<boolean> {
    let result = await GetSpoolMessageCount(host, username, password);

    if (result != -1) {
        return true;
    }

    return false;
}

export default {fetch, ping}
