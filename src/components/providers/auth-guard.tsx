import { useEffect } from 'react';

import { useLocation, useNavigate } from 'react-router';

import { DEFAULT_ROUTES_BY_ROLE } from '@/constants/routes';
import { canAccessRoute, isAuthRoute } from '@/lib';
import { type UserRole } from '@/constants/ROLES';

import { FullScreenLoader } from '../loader/loader';
import { useAuthStore } from '@/stores/auth.store';
import { useSidebarStore } from '@/stores/sidebar';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const navigate = useNavigate();
    const pathname = location.pathname;

    const isAuthInitialized = useAuthStore(s => s.isAuthInitialized);
    const accessToken = useAuthStore(s => s.accessToken);
    const user = useAuthStore(s => s.user);

    const buildSidebar = useSidebarStore(s => s.buildSidebar);

    useEffect(() => {
        if (!user?.role) return;
        buildSidebar(user.role);
    }, [user?.role, buildSidebar]);

    useEffect(() => {
        if (!isAuthInitialized) return;

        if (!accessToken) {
            if (!isAuthRoute(pathname)) {
                navigate('/login', { replace: true });
            }
            return;
        }

        if (!user) return;

        if (isAuthRoute(pathname)) {
            const redirectTo = DEFAULT_ROUTES_BY_ROLE[user.role as UserRole];
            if (redirectTo) navigate(redirectTo, { replace: true });
            return;
        }

        const allowed = canAccessRoute(pathname, user.role as UserRole);
        if (!allowed) navigate('/access-denied', { replace: true });
    }, [isAuthInitialized, accessToken, user, pathname, navigate]);

    if (!isAuthInitialized || (accessToken && !user)) {
        return <FullScreenLoader />;
    }

    return <>{children}</>;
}
