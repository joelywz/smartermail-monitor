import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { CheckUpdate, LoadUserConfig, SelectDashboardFile, SelectDirectory, Unload } from "../../wailsjs/go/main/App"
import { createSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function HomePage() {

  const [lastOpenedFile, setLastOpenedFile] = useState<string>("")

  const navigate = useNavigate();

  async function handleCreateClick() {
    navigate("/create-dashboard")
  }

  async function handleLoadClick() {
    await Unload();
    const path = await SelectDashboardFile()

    if (path == "") {
      return
    }

    const params = createSearchParams({
      path: path,
    })

    navigate(`/load?${params.toString()}`);
  }

  async function handleLoadRecentlyClick() {
    try {
      await Unload();
    } catch (e) {
      console.error(e);
    }

    const params = createSearchParams({
      path: lastOpenedFile,
    });

    navigate(`/load?${params.toString()}`);
  }

  useEffect(() => {
    async function loadConfig() {
      const config = await LoadUserConfig();
      setLastOpenedFile(config.lastAccessedFile);
    }

    loadConfig();
  }, [])


  return (
    <div className="w-full h-full grid place-items-center">
      <Card className="max-w-[380px] w-full">
        <CardHeader>
          <CardTitle>Smartermail Monitor</CardTitle>
          <CardDescription>Monitor your mail servers in a central location.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2.5">
          <Button className="w-full" onClick={handleCreateClick} >Create Dashboard</Button>
          { lastOpenedFile != "" && <Button variant={"secondary"} onClick={handleLoadRecentlyClick}>Load Recently Accessed</Button>}
          <Button variant="outline" className="w-full" onClick={handleLoadClick}>Load from File</Button>
          <Button variant="link" className="w-full">Import from Legacy Version</Button>          </div>
        </CardContent>
      </Card>
    </div>
  );
}