import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useLogin } from "@repo/api";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@repo/ui";
import { Button } from "@repo/ui";
import { FooBar } from "@repo/ui";

export default function LoginTab() {
  const { mutate } = useLogin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username == "admin" && password == "adminpassword")
      mutate({ username, password });
    else console.log("Incorrect Username or Password");
  };

  return (
    <div>
      <Tabs defaultValue="account" className="w-[500px]">
        <TabsContent value="account">
          <Card>
            <CardHeader className="items-center pb-2">
              <FooBar />
            </CardHeader>
            <CardContent className="space-y-2 pt-2">
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <div className="space-x-6">
                <Button onClick={handleLogin}>Sign In</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
