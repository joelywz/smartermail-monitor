type StatsEvent = {
    ID: string;
    ErrMessage: string;
    Status: "online" | "offline" | "fetching";
    Host: string;
    Result: {
      Imap: boolean;
      ImapThreadCount: number;
      Pop: boolean;
      PopThreadCount: number;
      Smtp: boolean;
      SmtpThreadCount: number;
      Spool: boolean;
      SpoolCount: number;
      Uptime: number;
    };
}[] | null;

export default StatsEvent;
