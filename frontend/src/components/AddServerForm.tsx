import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  Form,
  FormControl,
  FormDescription,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
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
import { PlusIcon } from "@radix-ui/react-icons";
import { Badge } from "./ui/badge";
import { AddServer } from "../../wailsjs/go/main/App";
import { useState } from "react";
import useTestConnection from "../hooks/useTestConnection";

const formSchema = z.object({
  host: z.string().trim().min(1),
  username: z.string().trim().min(1),
  password: z.string().min(1),
});

export default function AddServerDialog() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      host: "",
      username: "",
      password: "",
    },
  });

  const connection = useTestConnection();

  async function handleSubmit(data: z.infer<typeof formSchema>) {
    try {
      await AddServer(data.host, data.username, data.password);
      setOpen(false);
    } catch (e) {
      if (e instanceof Array) {
        if (e[0] == "server already exists") {
          form.setError("host", {
            type: "custom",
            message: "Server with host already exists",
          });
          return
        }
      }

      console.error(e);
    }

  }

  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(b) => {
        form.reset();
        connection.reset();
        setOpen(b);
      }}
    >
      <DialogTrigger asChild>
        <Button variant={"outline"} size={"sm"}>
          <PlusIcon className="mr-2" />
          Add Server
        </Button>
      </DialogTrigger>
      <Form {...form}>
        <DialogContent className="w-[380px]">
          <form onSubmit={() => console.log("submit")}>
            <DialogHeader>
              <DialogTitle>Add Server</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="host"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="host">Host</FormLabel>
                    <FormControl>
                      <Input id="host" type="text" {...field} />
                    </FormControl>
                    <FormDescription>
                      Use <code>https</code> protocol to enhance security.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <FormControl>
                      <Input id="username" type="text" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide the username of any account that has
                      administrative privileges on the server.
                    </FormDescription>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <FormControl>
                      <Input id="password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2 items-center">
                {
                  {
                    online: (
                      <div className="size-2 bg-green-500 rounded-full"></div>
                    ),
                    fetching: (
                      <div className="size-2 bg-amber-500 rounded-full"></div>
                    ),
                    offline: (
                      <div className="size-2 bg-red-500 rounded-full"></div>
                    ),
                    unknown: (
                      <div className="size-2 bg-neutral-500 rounded-full"></div>
                    ),
                  }[connection.status]
                }
                <Button
                  variant={"link"}
                  size="sm"
                  type="button"
                  className="px-0"
                  onClick={async () => {
                    const valid = await form.trigger();

                    if (!valid) return;

                    connection.handleTest(
                      form.getValues("host"),
                      form.getValues("username"),
                      form.getValues("password")
                    );
                  }}
                >
                  Test Connection
                </Button>
              </div>
              <p className="text-red-500 text-xs">{connection.errMsg}</p>
              <DialogFooter>
                <div className="flex justify-between w-full">
                  <DialogClose asChild>
                    <Button variant="secondary" type="button">
                      Close
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    onClick={form.handleSubmit(handleSubmit)}
                  >
                    Add Server
                  </Button>
                </div>
              </DialogFooter>
            </div>
          </form>
        </DialogContent>
      </Form>
    </Dialog>
  );
}
