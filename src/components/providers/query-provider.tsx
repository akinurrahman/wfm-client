import { useState } from 'react';

import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { toast } from 'sonner';

import { getErrorMessage } from '@/lib/api/error';

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                // Fires for every rejected mutation that does not define its own
                // onError, so no write can fail silently and feature mutation
                // hooks only handle onSuccess.
                mutationCache: new MutationCache({
                    onError: error => toast.error(getErrorMessage(error)),
                }),
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60 * 5,
                        gcTime: 1000 * 60 * 10,
                        retry: (failureCount: number, error: Error) => {
                            if (
                                'status' in error &&
                                typeof error.status === 'number' &&
                                error.status >= 400 &&
                                error.status < 500
                            ) {
                                return false;
                            }
                            return failureCount < 3;
                        },
                        refetchOnWindowFocus: false,
                    },
                    mutations: { retry: false },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
