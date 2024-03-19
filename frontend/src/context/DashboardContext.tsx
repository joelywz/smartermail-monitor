import { PropsWithChildren, createContext, useEffect } from "react";
import { EventsOn } from "../../wailsjs/runtime";
import { useNavigate } from "react-router-dom";

type DashboardContextType = {
  path: string;
};

const DashboardContext = createContext<DashboardContextType | null>(null);

export const DashboardProvider = (props: PropsWithChildren) => {

  const navigate = useNavigate();
  
  useEffect(() => {

    const cancelLoaded = EventsOn("loaded", (data) => {
      console.log(data);
      navigate("/dashboard", {
        replace: true,
      })
    });

    const cancelUnloaded = EventsOn("unloaded", () => {
      console.log("unloaded");
    })

    return () => {
      cancelLoaded();
      cancelUnloaded();
    }
  }, []);

  return (
    <DashboardContext.Provider value={null}>
      {props.children}
    </DashboardContext.Provider>
  );
};
