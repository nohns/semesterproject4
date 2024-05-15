import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useLogin } from "@repo/api";
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@repo/ui";
import { Button } from "@repo/ui";
import { FooBar } from "@repo/ui";
import { useNavigate } from "react-router-dom";

export default function LoginTab() {
  const login = useLogin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username === "admin" && password === "adminpassword") {
      login.mutate({ username, password });
      navigate("/admin");
    } else {
      setError("Incorrect Username or Password");
      console.error("Incorrect Username or Password");
    }
  };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setError("");
      setter(e.target.value);
    };

  return (
    <div>
      <Tabs defaultValue="account" className="w-[500px]">
        <TabsContent value="account">
          <Card>
            <form onSubmit={handleLogin}>
              <CardHeader className="items-center pb-2">
                <FooBar />
              </CardHeader>
              <CardContent className="space-y-2 pt-2">
                <div className="space-y-1">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={handleInputChange(setUsername)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={handleInputChange(setPassword)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <div className="space-x-6">
                  <Button type="submit">Enter</Button>
                </div>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
      {error && <p className="text-red-500 text-center mt-2">{error}</p>}
    </div>
  );
}
