/** @format */

import { FooBar } from "@repo/ui";
import { ReactNode } from "react";

interface MobileContainerProps {
  children: ReactNode;
}

function MobileContainer({ children }: MobileContainerProps) {
  return (
    <div className="flex flex-col items-center max-w-full min-h-[100dvh] justify-between">
      <FooBar />
      {children}
    </div>
  );
}

export default MobileContainer;
