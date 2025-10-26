"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import type * as React from "react";
import { getQueryClient } from "@/lib/react-query";

interface ReactQueryProviderProps {
  children: React.ReactNode;
}
const ReactQueryProvider = ({ children }: ReactQueryProviderProps) => {
  const queryClient = getQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default ReactQueryProvider;
