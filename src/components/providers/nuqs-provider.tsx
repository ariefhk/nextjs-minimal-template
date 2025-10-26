"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";

interface NuqsProviderProps {
  children: React.ReactNode;
}
const NuqsProvider = ({ children }: NuqsProviderProps) => {
  return <NuqsAdapter>{children}</NuqsAdapter>;
};

export default NuqsProvider;
