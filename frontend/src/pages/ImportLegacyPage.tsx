import { PropsWithChildren, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CreateDatabase,
  CreateDatabaseFromLegacy,
  Load,
  LoadUserConfig,
  SaveUserConfig,
  SelectDirectory,
  VerifyLegacy,
} from "../../wailsjs/go/main/App";
import useStep from "../hooks/useStep";

const formSchema = z.object({
  password: z.string().min(1),
});

const formCreateSchema = z
  .object({
    directory: z.string().trim().min(1),
    filename: z.string().trim().min(1),
    password: z.string().min(6),
    repeatPassword: z.string().min(1),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords do not match",
    path: ["repeatPassword"],
  });

export default function ImportLegacyPage() {
  const stepper = useStep();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams({
    path: "",
  });

  const [serverCount, setServerCount] = useState<number>(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  const form2 = useForm<z.infer<typeof formCreateSchema>>({
    resolver: zodResolver(formCreateSchema),
    defaultValues: {
      directory: "",
      filename: "",
      password: "",
      repeatPassword: "",
    },
  });

  async function handleVerify(data: z.infer<typeof formSchema>) {
    const path = searchParams.get("path") ?? "";

    try {
      const count = await VerifyLegacy(path, data.password);

      if (count == 0) {
        form.setError("password", {
          type: "custom",
          message: "There are no servers to import",
        });
      }

      setServerCount(count);

      stepper.nextStep();
    } catch (e) {
      if (e instanceof Array) {
        form.setError("password", {
          type: "custom",
          message: "Invalid password",
        });
      }
    }
  }

  async function handleSubmit(data: z.infer<typeof formCreateSchema>) {
    try {
      const legacyPath = searchParams.get("path") ?? "";
      const path = `${data.directory}/${data.filename}.smm`;
      await CreateDatabaseFromLegacy(path, data.password, legacyPath, form.getValues("password"));
      await Load(path, data.password);
      const config = await LoadUserConfig();
      config.lastAccessedFile = path;
      await SaveUserConfig(config);
    } catch (e) {
      console.error(e);
    }
  }
  async function handleDirectorySelect() {
    try {
      const directory = await SelectDirectory();
      if (directory == "") return;
      form2.setValue("directory", directory);
      form2.trigger("directory");
    } catch (e) {}
  }

  return (
    <div className="w-full h-full grid place-items-center">
      <Step step={stepper.step} target={0}>
        <Card className="max-w-[380px] w-full">
          <CardHeader>
            <CardTitle>Import from legacy</CardTitle>
            <CardDescription>
              Import servers from legacy monitor.
            </CardDescription>
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleVerify)}>
              <CardContent>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input id="password" type="password" {...field} />
                      </FormControl>
                      <FormDescription>
                        Provide the password of your legacy dashboard.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={() => navigate(-1)}
                >
                  Back
                </Button>
                <Button>Next</Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </Step>
      <Step step={stepper.step} target={1}>
        <Card className="max-w-[380px] w-full">
          <Form {...form2}>
            <form onSubmit={form2.handleSubmit(handleSubmit)}>
              <CardHeader>
                <CardTitle>Create Dashboard</CardTitle>
                <CardDescription>
                  Select a directory and provide a name for your dashboard.
                  <br />
                  <br />
                  <span className="font-semibold">
                    {serverCount} servers will be imported.
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <FormField
                    control={form2.control}
                    name="directory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Directory</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input disabled {...field} />
                          </FormControl>
                          <Button
                            variant="outline"
                            type="button"
                            onClick={handleDirectorySelect}
                          >
                            Select
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
                  <FormField
                    control={form2.control}
                    name="filename"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="filename">File Name</FormLabel>
                        <FormControl>
                          <Input
                            id="filename"
                            placeholder="my-dashboard"
                            autoCorrect="off"
                            {...field}
                            onChange={(e) => {
                              if (e.target.value.includes(" ")) return;
                              field.onChange(e);
                            }}
                          />
                        </FormControl>

                        <FormDescription>
                          Your file will be saved as{" "}
                          <code className="text-wrap break-words">
                            {field.value}.smm
                          </code>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form2.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <FormControl>
                          <Input id="password" type="password" {...field} />
                        </FormControl>
                        <FormDescription>
                          Your password will be used for encryption and
                          decryption.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form2.control}
                    name="repeatPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="repeatPassword">
                          Repeat Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="repeatPassword"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="secondary" onClick={stepper.prevStep}>
                  Back
                </Button>
                <Button className="">Complete</Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </Step>
    </div>
  );
}

function Step(props: PropsWithChildren<{ step: number; target: number }>) {
  return <>{props.step === props.target ? props.children : null}</>;
}
