import { useEffect } from "react";
import useData from "../store";

export default function Updater() {
    const data = useData();

    useEffect(() => {
      const id = setInterval(() => {
        data.tick();
      }, 1000);
  
      return () => {
        clearInterval(id);
      }
    }, [])

    return (
        <></>
    )
}