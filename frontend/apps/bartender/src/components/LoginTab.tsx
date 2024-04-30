import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MiniFoobar from "./MiniFoobar";
import { useLogin } from "@repo/api";

export default function LoginTab() {
  return (
    <div className="flex flex-row justify-center items-center">
      <Tabs defaultValue="account" className="w-[500px]">
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <MiniFoobar />
            </CardHeader>

            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input id="password" defaultValue="" />
              </div>
            </CardContent>
            <CardFooter>
              <div className="space-x-6">
                <Button>Enter</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
