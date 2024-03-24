import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Load, LoadUserConfig, SaveUserConfig } from "../../wailsjs/go/main/App";
import { toast } from "../components/ui/use-toast";

const formSchema = z.object({
  password: z.string().min(1),
});

export default function LoadDashboardPage() {
  const [searchParams] = useSearchParams({ path: "" });
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  async function handleSubmit(data: z.infer<typeof formSchema>) {
    const path = searchParams.get("path") ?? "";

    if (path == "") {
      // TODO: display error
      return;
    }

    try {
      await Load(path, data.password);
    } catch (e) {
      if (e instanceof Array) {
        if (e[0] === "invalid password") {
          form.setError("password", {
            type: "custom",
            message: "Invalid password",
          });
          return
        } else if (e[0] === "file does not exist") {
          form.setError("password", {
            type: "custom",
            message: "Selected file does not exist",
          });
        } 
        
        else {
          form.setError("password", {
            type: "custom",
            message: e[0],
          });
        }
      }
      return
    }

    try {
      const conf = await LoadUserConfig();
      conf.lastAccessedFile = path;
      await SaveUserConfig(conf);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="w-full h-full grid place-items-center">
      <Card className="max-w-[380px] w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <CardHeader>
              <CardTitle>Load Dashboard</CardTitle>
              <CardDescription>
                Provide your password to unlock the dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="text-xs bg- bg-neutral-50 p-2 text-neutral-500 rounded-md">{searchParams.get("path")}</div>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="secondary" onClick={() => navigate(-1)} type="button">
                Back
              </Button>
              <Button className="">Load</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
