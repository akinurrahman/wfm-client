import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { DEFAULT_ROUTES_BY_ROLE } from '@/constants/routes';
import { useAuthSession } from '@/features/auth';
import { FullScreenLoader } from '../loader/loader';
import { useAuthStore } from '@/stores/auth.store';

export default function AuthLayout() {
    const navigate = useNavigate();
    const isAuthInitialized = useAuthStore(s => s.isAuthInitialized);
    const accessToken = useAuthStore(s => s.accessToken);
    const user = useAuthStore(s => s.user);

    // A fresh login only sets tokens. The role that decides where to land comes
    // from /auth/me, so this screen has to be the one that asks for it.
    useAuthSession();

    useEffect(() => {
        if (!isAuthInitialized) return;
        if (accessToken && user?.role) {
            const redirectTo = DEFAULT_ROUTES_BY_ROLE[user.role];
            if (redirectTo) navigate(redirectTo, { replace: true });
        }
    }, [isAuthInitialized, accessToken, user?.role, navigate]);

    if (!isAuthInitialized || (accessToken && !user)) {
        return <FullScreenLoader />;
    }

    return <Outlet />;
}