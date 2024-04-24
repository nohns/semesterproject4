/** @format */
import LoginTab from "@/components/LoginTab";

function Login() {
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
