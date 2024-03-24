import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { CheckUpdate, GetCurrentVersion, Update} from "../../wailsjs/go/main/App";
import { updater } from "../../wailsjs/go/models";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

export default function CheckUpdateButton() {
  const { toast } = useToast();
  const [version, setVersion] = useState<string>("");
  const [releaseInfo, setReleaseInfo] = useState<null | updater.CheckUpdateRes>(
    null
  );

  async function getVersion() {
    const version = await GetCurrentVersion();
    setVersion(version);
  }

  async function checkForUpdates() {
    setReleaseInfo(null);

    // await new Promise((res) => setTimeout(res, 2000));
    // setReleaseInfo({
    //   convertValues: (a, b, _) => {},
    //   latest: false,
    //   name: "Release 1.0.0",
    //   releaseNotes: "Test Release",
    //   repoName: "smartermail-monitor",
    //   version: "1.0.0",
    // });
    const data = await CheckUpdate();
    setReleaseInfo(data);
  }

  async function update() {
    try {
      await Update();
      toast({
        title: "Sucess",
        description: "Update completed, restart the application."
      
      })
    } catch (e) {
      if (e instanceof Array) {
        toast({
          title: "Failed",
          description: `Update failed, ${e[0]}`,
        });
      }
      
    }
  }

  useEffect(() => {
    getVersion();
  }, []);

  return (
    <div className="fixed bottom-0 right-0 z-50 m-2 text text-neutral-500">
      <Dialog
        onOpenChange={(b) => {
          if (b) {
            checkForUpdates();
          }
        }}
      >
        <DialogTrigger asChild>
          <p className="text-xs">v{version}</p>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {releaseInfo == null
                ? "Checking for updates..."
                : releaseInfo?.latest
                ? "You are on the latest release"
                : "Update available"}
              {}
            </DialogTitle>
            <DialogDescription>
              Your current version is {version}
            </DialogDescription>
          </DialogHeader>
          <h5 className="font-medium text-sm leading-none">
            {releaseInfo?.name}
          </h5>
          <p className="text-sm text-neutral-500 leading-1">
            {releaseInfo?.releaseNotes.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </p>

          <DialogFooter>
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              <Button disabled={!(releaseInfo?.latest === false)} onClick={update}>
                Update
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
