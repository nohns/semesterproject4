/** @format */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { ReactNode } from "react";

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: AxiosError;
  }
}

// Create react-query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 15, // 15 minutes
      gcTime: 1000 * 60 * 15, // 15 minutes

      notifyOnChangeProps: ["data", "isLoading", "error"],
    },
  },
});

interface ChildrenProps {
  children: ReactNode;
}

export function ReactQueryClientProvider({
  children,
}: ChildrenProps): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
