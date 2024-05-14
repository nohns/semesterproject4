import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useLogin } from "@repo/api";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
} from "../../../../packages/ui/src/components/ui/card";
import { Button } from "../../../../packages/ui/src/components/ui/button";
import { Navigate } from "react-router-dom";

export default function LoginTab() {
  const login = useLogin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const handleLogin = () => {
    if (username == "admin" && password == "adminpassword") {
      login.mutate({ username: username, password: password });
      setShouldRedirect(true);
    } else console.log("wrong username or password");
  };

  return (
    <div>
      <Tabs defaultValue="account" className="w-[500px]">
        <TabsContent value="account">
          <form onSubmit={handleLogin}>
            <Card>
              <CardContent className="space-y-2">
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
                  {shouldRedirect && <Navigate to="/admin" />}
                  <Button type="submit">Enter</Button>
                </div>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
