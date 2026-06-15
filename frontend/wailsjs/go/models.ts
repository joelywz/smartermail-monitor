export namespace monitor {
	
	export class ServerDto {
	    host: string;
	    username: string;
	    password: string;
	
	    static createFrom(source: any = {}) {
	        return new ServerDto(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.host = source["host"];
	        this.username = source["username"];
	        this.password = source["password"];
	    }
	}

}

export namespace smartermail {
	
	export class RequestStats {
	    Imap: boolean;
	    ImapThreadCount: number;
	    Pop: boolean;
	    PopThreadCount: number;
	    Uptime: number;
	    Smtp: boolean;
	    SmtpThreadCount: number;
	    Spool: boolean;
	    SpoolCount: number;
	
	    static createFrom(source: any = {}) {
	        return new RequestStats(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Imap = source["Imap"];
	        this.ImapThreadCount = source["ImapThreadCount"];
	        this.Pop = source["Pop"];
	        this.PopThreadCount = source["PopThreadCount"];
	        this.Uptime = source["Uptime"];
	        this.Smtp = source["Smtp"];
	        this.SmtpThreadCount = source["SmtpThreadCount"];
	        this.Spool = source["Spool"];
	        this.SpoolCount = source["SpoolCount"];
	    }
	}

}

export namespace updater {
	
	export class CheckUpdateRes {
	    name: string;
	    version: string;
	    // Go type: time
	    publishedAt?: any;
	    releaseNotes: string;
	    repoName: string;
	    latest: boolean;
	
	    static createFrom(source: any = {}) {
	        return new CheckUpdateRes(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.version = source["version"];
	        this.publishedAt = this.convertValues(source["publishedAt"], null);
	        this.releaseNotes = source["releaseNotes"];
	        this.repoName = source["repoName"];
	        this.latest = source["latest"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace userconf {
	
	export class Config {
	    lastAccessedFile: string;
	
	    static createFrom(source: any = {}) {
	        return new Config(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.lastAccessedFile = source["lastAccessedFile"];
	    }
	}

}

