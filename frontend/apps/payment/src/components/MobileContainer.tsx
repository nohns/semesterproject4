/** @format */

import { FooBar } from "@repo/ui";
import { ReactNode } from "react";

function MobileContainer({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center max-w-full min-h-[100dvh] justify-between">
      <FooBar />
      {children}
    </div>
  );
}

export default MobileContainer;
