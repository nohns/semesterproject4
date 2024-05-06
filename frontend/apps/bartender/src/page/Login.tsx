/** @format */
import LoginTab from "@/components/LoginTab";
import { BigScreenWrapper } from "@repo/ui";

function Login() {
  return (
    <div>
      <BigScreenWrapper>
        <div className="flex flex-row justify-center items-center">
          <LoginTab />
        </div>
      </BigScreenWrapper>
    </div>
  );
}

export default Login;
