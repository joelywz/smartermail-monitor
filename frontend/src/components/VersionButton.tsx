import { useState } from "react";
import useData from "../store";

export default function VersionButton() {

    const checkForUpdates = useData(state => state.checkForUpdates);
    const appVersion = useData(state => state.appVersion)

    const [loading, setLoading] = useState(false);

    async function handleCheckUpdate() {
        if (loading) {
            return;
          }
      
          setLoading(true)
      
          try {
            await checkForUpdates(false)
          } catch (e) {
      
          }
      
          setLoading(false)
    }
  


    return (
        <div className="fixed right-0 bottom-0 text-neutral-400 text-xs p-2.5 z-50">
        <p className="cursor-pointer" onClick={handleCheckUpdate}>{appVersion}</p>
      </div>
    )
}