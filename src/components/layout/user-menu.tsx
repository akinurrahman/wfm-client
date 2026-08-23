import { useNavigate } from 'react-router';

import { LogOut, UserCircle } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLogout } from '@/features/auth';
import { getInitials } from '@/lib';
import { useAuthStore } from '@/stores/auth.store';

export function UserMenu() {
    const navigate = useNavigate();
    const user = useAuthStore(state => state.user);
    const logout = useLogout();

    // The token payload carries no display name, so the email local part is the
    // most human handle available.
    const fullName = user ? user.email.split('@')[0].replace(/[._-]+/g, ' ') : 'Guest User';
    const email = user?.email ?? 'not signed in';

    const handleLogout = () => {
        logout.mutate(undefined, {
            onSettled: () => navigate('/login', { replace: true }),
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <button
                        type="button"
                        aria-label="Account menu"
                        className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-brand-soft text-[11px] font-medium tracking-wide text-brand ring-1 ring-brand-line transition-shadow hover:shadow-glow data-popup-open:shadow-glow"
                    />
                }
            >
                {getInitials(fullName)}
            </DropdownMenuTrigger>

            <DropdownMenuContent
                side="bottom"
                align="end"
                sideOffset={10}
                className="w-60 min-w-60 border border-hairline bg-surface-2 p-1.5 shadow-lift ring-0"
            >
                <div className="flex items-center gap-2.5 px-2 pt-1.5 pb-2.5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[11px] font-medium text-brand ring-1 ring-brand-line">
                        {getInitials(fullName)}
                    </span>
                    <span className="grid flex-1 leading-tight">
                        <span className="truncate text-[13px] font-medium text-text-hi capitalize">
                            {fullName}
                        </span>
                        <span className="truncate text-[11px] text-text-low">{email}</span>
                    </span>
                </div>

                <div className="my-1 h-px bg-hairline" />

                <DropdownMenuItem
                    onClick={() => navigate('/customers')}
                    className="gap-2.5 rounded-md px-2 py-2 text-[13px] text-text-hi focus:bg-surface-3"
                >
                    <UserCircle className="size-4 text-text-mid" />
                    Profile
                </DropdownMenuItem>

                <div className="my-1 h-px bg-hairline" />

                <DropdownMenuItem
                    onClick={handleLogout}
                    className="gap-2.5 rounded-md px-2 py-2 text-[13px] text-overdue focus:bg-overdue-soft"
                >
                    <LogOut className="size-4" />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
