import { Button } from "../components/ui/button";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../components/ui/input";
import { z } from "zod";
import { CreateDatabase, Load, SelectDirectory } from "../../wailsjs/go/main/App";
import { useNavigate } from "react-router-dom";

const formSchema = z
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
export default function CreateDashboardPage() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      directory: "",
      filename: "",
      password: "",
      repeatPassword: "",
    },
  });

  async function handleSubmit(data: z.infer<typeof formSchema>) {
    try {
      const path = `${data.directory}/${data.filename}.smm`;
      await CreateDatabase(path, data.password);
      await Load(path, data.password);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDirectorySelect() {
    try {
      const directory = await SelectDirectory();
      if (directory == "") return;
      form.setValue("directory", directory);
      form.trigger("directory");
    } catch (e) {}
  }

  return (
    <div className="w-full h-full grid place-items-center">
      <Card className="max-w-[380px] w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <CardHeader>
              <CardTitle>Create Dashboard</CardTitle>
              <CardDescription>
                Select a directory and provide a name for your dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <FormControl>
                        <Input id="password" type="password" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your password will be used for encryption and decryption.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="repeatPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="repeatPassword">
                        Repeat Password
                      </FormLabel>
                      <FormControl>
                        <Input id="repeatPassword" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="secondary" onClick={() => navigate(-1)}>
                Back
              </Button>
              <Button className="">Continue</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
