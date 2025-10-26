/** biome-ignore-all lint/suspicious/noExplicitAny: navigator.connection is not typed */
import {
  type DefaultOptions,
  defaultShouldDehydrateQuery,
  isServer,
  QueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> = Awaited<ReturnType<FnType>>;

export type QueryConfig<T extends (...args: any[]) => any> = Omit<ReturnType<T>, "queryKey" | "queryFn">;

export type MutationConfig<MutationFnType extends (...args: any) => Promise<any>, TError = Error> = Omit<
  UseMutationOptions<Awaited<ReturnType<MutationFnType>>, TError, Parameters<MutationFnType>[0]>,
  "mutationFn"
>;
export type TypedMutationConfig<MutationFnType extends (...args: any) => Promise<any>, TError = Error> = Omit<
  MutationConfig<MutationFnType, TError>,
  "onError"
> & {
  onError?: (error: TError) => void;
};

const INITIAL_DATA_QUERY_KEY = "queryDataNextjsMinimalTemplate";
const queryConfig: DefaultOptions = {
  queries: {
    // Smarter refetch: allow focus refetch except for heavy queries
    refetchOnWindowFocus: false,

    // Retry up to 2 times with exponential backoff
    retry: 2,

    // Exponential backoff with jitter (aware of network type)
    retryDelay: (attemptIndex) => {
      const connection = (navigator as any)?.connection;
      const baseDelay = connection?.effectiveType === "4g" ? 1000 : 3000;
      return Math.min(baseDelay * 2 ** attemptIndex + Math.random() * 1000, 30_000);
    },

    // Freshness & caching (optimized for chat)
    staleTime: 30_000, // 30 seconds - chat data should be fresh
    gcTime: 30 * 60_000, // 30 min - keep chat history longer

    networkMode: "online",
    refetchOnMount: true,
    refetchOnReconnect: true,
    structuralSharing: true,

    //  Keep previous data while refetching (good for lists)
    placeholderData: (prev: unknown) => prev,

    //  Optional: use persisted cache as initial data (localStorage/sessionStorage)
    initialData: () => {
      const cached = localStorage.getItem(INITIAL_DATA_QUERY_KEY);
      return cached ? JSON.parse(cached) : undefined;
    },
  },
  dehydrate: {
    // include pending queries in dehydration
    shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === "pending",
  },
  mutations: {
    retry: 1,
    networkMode: "online",
    retryDelay: (i) => Math.min(1000 * 2 ** i, 5000),
  },
};

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: queryConfig,

    // Enable query deduplication
    queryCache: new QueryClient().getQueryCache(),

    // Enable mutation deduplication
    mutationCache: new QueryClient().getMutationCache(),
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
