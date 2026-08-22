import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { type UserRole } from '@/constants/ROLES';
import { DEFAULT_ROUTES_BY_ROLE } from '@/constants/routes';
import { FullScreenLoader } from '../loader/loader';
import { useAuthStore } from '@/stores/auth.store';

export default function AuthLayout() {
    const navigate = useNavigate();
    const isAuthInitialized = useAuthStore(s => s.isAuthInitialized);
    const accessToken = useAuthStore(s => s.accessToken);
    const user = useAuthStore(s => s.user);

    useEffect(() => {
        if (!isAuthInitialized) return;
        if (accessToken && user?.role) {
            const redirectTo = DEFAULT_ROUTES_BY_ROLE[user.role as UserRole];
            if (redirectTo) navigate(redirectTo, { replace: true });
        }
    }, [isAuthInitialized, accessToken, user?.role, navigate]);

    if (!isAuthInitialized || (accessToken && !user)) {
        return <FullScreenLoader />;
    }

    return <Outlet />;
}