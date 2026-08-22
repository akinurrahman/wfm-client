import { Toaster } from '@/components/ui/sonner';
import { ConfirmationDialog } from '@/systems/confirmation/components/confirmation-dialog';
// import '@/lib/api/interceptors';

import { QueryProvider } from './query-provider';
import { ThemeProvider } from './theme-provider';



export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <QueryProvider>
                {children}
                <ConfirmationDialog />
                <Toaster richColors />
            </QueryProvider>
        </ThemeProvider>
    );
}
