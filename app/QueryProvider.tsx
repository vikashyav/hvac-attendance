'use client'
import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { staleTime: 60_000 } },
  })
}

let browserClient: QueryClient | undefined

function getQueryClient() {
  return isServer
    ? makeQueryClient()
    : browserClient ??= makeQueryClient()
}

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const client = getQueryClient()
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
