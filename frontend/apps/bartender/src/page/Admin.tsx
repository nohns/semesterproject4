/** @format */

import { BigScreenWrapper } from "@repo/ui";
import Dashboard from "@/components/Dashboard";

function Admin() {
  return (
    <>
      <BigScreenWrapper>
        <div className="h-full flex flex-col items-center w-full gap-6">
          <Dashboard />
        </div>
      </BigScreenWrapper>
    </>
  );
}

export default Admin;
