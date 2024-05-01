import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useLogin } from "@repo/api";
import { FooBar } from "@repo/ui";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../../../../packages/ui/src/components/ui/card";
import { Button } from "../../../../packages/ui/src/components/ui/button";

export default function LoginTab() {
  const { mutate, error, data } = useLogin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  if (error)
    console.log("An error occurred while fetching the user data ", error);

  const handleLogin = () => {
    mutate({ username, password });
  };

  return (
    <div className="flex flex-row justify-center items-center">
      <Tabs defaultValue="account" className="w-[500px]">
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <FooBar />
            </CardHeader>

            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  defaultValue=""
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  defaultValue=""
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <div className="space-x-6">
                <Button onClick={handleLogin}>Enter</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
