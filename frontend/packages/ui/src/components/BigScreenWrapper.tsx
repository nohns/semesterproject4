/** @format */

import { FooBar } from "@repo/ui";
import { ReactNode } from "react";

interface BigScreenWrapperProps {
  children: ReactNode;
}

export function BigScreenWrapper({ children }: BigScreenWrapperProps) {
  return (
    <div className="flex flex-col items-center max-w-full min-h-[100vh] justify-start">
      <FooBar />
      <main className="flex-1 w-full">{children}</main>
    </div>
  );
}
