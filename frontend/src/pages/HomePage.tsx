import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

export default function HomePage() {
  return (
    <div className="w-full h-full grid place-items-center">
      <Card className="max-w-[380px] w-full">
        <CardHeader>
          <CardTitle>Smartermail Monitor</CardTitle>
          <CardDescription>Monitor your mail servers in a central location.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2.5">
          <Button className="w-full">Create</Button>
          <Button variant="outline" className="w-full">Load from File</Button>
          <Button variant="link" className="w-full">Import from Legacy Version</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}