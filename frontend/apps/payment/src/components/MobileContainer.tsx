/** @format */

import AnimationPage from "@/page/AnimationPage";
import { FooBar } from "@repo/ui";
import { ReactNode } from "react";

interface MobileContainerProps {
  children: ReactNode;
  shouldAnimate: boolean;
}

function MobileContainer({ children, shouldAnimate }: MobileContainerProps) {
  return (
    <div className="flex flex-col items-center max-w-full min-h-[100dvh] justify-between">
      <FooBar />
      {shouldAnimate ? <AnimationPage>{children}</AnimationPage> : children}
    </div>
  );
}

export default MobileContainer;
