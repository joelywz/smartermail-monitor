import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { EventsOn } from "../../wailsjs/runtime";
import { useNavigate } from "react-router-dom";
import LoadedEvent from "../events/LoadedEvent";
import StatsEvent from "../events/StatsEvent";
import RefreshTimeEvent from "../events/RefreshTimeEvent";

type DashboardContextType = {
  hasLoaded: boolean;
  path: string | null;
  data: Stat[];
  refreshDate: Date;
};


export type Stat = {
  id: string;
  host: string;
  spool?: number;
  smtp?: boolean;
  imap?: boolean;
  pop?: boolean;
  smtpThreads?: number;
  popThreads?: number;
  imapThreads?: number;
  status: "online" | "offline" | "fetching";
};


const DashboardContext = createContext<DashboardContextType | null>(null);

export const DashboardProvider = (props: PropsWithChildren) => {

  const navigate = useNavigate();

  const [path, setPath] = useState<DashboardContextType["path"]>("");
  const [hasLoaded, setHasLoaded] = useState<DashboardContextType["hasLoaded"]>(false);
  const [data, setData] = useState<DashboardContextType["data"]>([]);
  const [refreshDate, setRefreshDate] = useState<DashboardContextType["refreshDate"]>(new Date());
  
  useEffect(() => {

    const cancelLoaded = EventsOn("loaded", (data: LoadedEvent) => {
      setPath(data.path);
      setHasLoaded(true);
      
      navigate("/dashboard", {
        replace: true,
      })
    });

    const cancelUnloaded = EventsOn("unloaded", () => {
      setPath(null);
      setHasLoaded(false);
      setData([])

      navigate("/", {
        replace: true,
      });
    });

    const cancelStats = EventsOn("stats", (event: StatsEvent) => {
      if (event == null) {
        setData([])
        return;
      }
      
      const newData: Stat[] = [];

      for (const stat of event) {
        const id = stat.ID
        if (stat.Status === "offline") {
          newData.push({
            id,
            host: stat.Host,
            status: "offline",
          })
        } else if (stat.Status === "fetching") {
          newData.push({
            id,
            host: stat.Host,
            status: "fetching",
          });
        } else {
          newData.push({
            id,
            host: stat.Host,
            imap: stat.Result.Imap,
            imapThreads: stat.Result.ImapThreadCount,
            pop: stat.Result.Pop,
            popThreads: stat.Result.PopThreadCount,
            smtp: stat.Result.Smtp,
            smtpThreads: stat.Result.SmtpThreadCount,
            spool: stat.Result.SpoolCount,
            status: "online"
          });
        }
      }

      setData(newData);
    })

    const cancelRefreshTime = EventsOn("refreshTime", (event: RefreshTimeEvent) => {
      setRefreshDate(new Date(event));
      // console.log(event);
    })

    return () => {
      cancelLoaded();
      cancelUnloaded();
      cancelStats();
      cancelRefreshTime();
    }
  }, []);

  return (
    <DashboardContext.Provider value={{
      path,
      hasLoaded,
      data,
      refreshDate,
    }}>
      {props.children}
    </DashboardContext.Provider>
  );
};


export const useDashboard = () => {
  const dashboard = useContext(DashboardContext);
  return dashboard as DashboardContextType;
}
