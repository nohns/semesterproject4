import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
                <Button>Log in</Button>
                <CreateAccount />
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CreateAccount() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Account</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Account</DialogTitle>
          <DialogDescription>
            Create administrative account for Foobar here. Press Save Changes
            when done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="newusername" className="text-right">
              Username
            </Label>
            <Input id="newusername" className="col-span-3" defaultValue="" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="newpassword" className="text-right">
              Password
            </Label>
            <Input id="newpassword" className="col-span-3" defaultValue="" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" className="col-span-3" defaultValue="" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
