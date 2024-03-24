import { useState } from "react";
import { TestConnection } from "../../wailsjs/go/main/App";

export type ConnectionState = "online" | "offline" | "fetching" | "unknown";

export default function useTestConnection() {

  const [status, setStatus] = useState<ConnectionState>("unknown");
  const [errMsg, setErrMsg] = useState<string | null>(null);


  async function handleTest(host: string, username: string, password: string) {

    reset();

    try {
      setStatus("fetching");
      setErrMsg(null);
      await TestConnection(host, username, password)
      setStatus("online");
    } catch (e) {
      setStatus("offline");
      if (e instanceof Array) {
        setErrMsg(e[0])
        return
      }

      console.error(e)
    }
  }

  function reset() {
    setStatus("unknown");
    setErrMsg(null);
  }

  return {
    status,
    errMsg,
    handleTest,
    reset,
  }
}