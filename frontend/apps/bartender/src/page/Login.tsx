/** @format */
import React from "react";
import { Button } from "@/components/ui/button";
import { useWebsocket } from "@repo/api";
import Foobar from "@/components/Foobar";
import LoginTab from "@/components/LoginTab";

function Login() {
  const { isConnected } = useWebsocket("ws://localhost:9090/ws");

  return (
    <div>
      {/* {isConnected ? <p>Connected</p> : <p>Not connected</p>} */}
      <div className="login-tab-container">
        <LoginTab />
      </div>
    </div>
  );
}

export default Login;
