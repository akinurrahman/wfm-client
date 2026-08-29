import { ArrowLeft, LayoutDashboard, RotateCcw } from 'lucide-react';
import { Link, isRouteErrorResponse, useNavigate, useRouteError } from 'react-router';

import { Button } from '@/components/ui/button';

import { ErrorScreen } from './error-screen';

const HOME = '/dashboard';

type Copy = { code: string; eyebrow: string; title: string; description: string };

/** Status-specific copy. Anything unmapped falls through to the generic 5xx
 *  wording — a made-up explanation for an unknown status is worse than none. */
const BY_STATUS: Record<number, Copy> = {
  400: {
    code: '400',
    eyebrow: 'Err / bad request',
    title: 'That request could not be read',
    description:
      'Something in the link or the form data was malformed. Go back and try the action again from the page you started on.',
  },
  401: {
    code: '401',
    eyebrow: 'Err / signed out',
    title: 'Your session has ended',
    description: 'Sign in again to pick up where you left off.',
  },
  403: {
    code: '403',
    eyebrow: 'Err / forbidden',
    title: 'You do not have access to this',
    description:
      'Your role does not cover this page. Ask an administrator if you think you should have it.',
  },
  404: {
    code: '404',
    eyebrow: 'Err / not found',
    title: 'This page is not on the sheet',
    description:
      'The link may be out of date, or the record it pointed at has since been removed.',
  },
  409: {
    code: '409',
    eyebrow: 'Err / conflict',
    title: 'This record changed while you were working',
    description:
      'Someone else updated it first. Reload to pull the current version before you try again.',
  },
};

function describe(error: unknown): { copy: Copy; detail?: string } {
  if (isRouteErrorResponse(error)) {
    const copy = BY_STATUS[error.status] ?? {
      code: String(error.status),
      eyebrow: 'Err / server',
      title: 'The server could not complete that',
      description:
        'This one is on our side, not yours. Retry in a moment — if it keeps failing, send the technical detail below to support.',
    };

    const body = typeof error.data === 'string' ? error.data : JSON.stringify(error.data, null, 2);

    return { copy, detail: `${error.status} ${error.statusText}\n${body ?? ''}`.trim() };
  }

  const copy: Copy = {
    code: 'ERR',
    eyebrow: 'Err / unexpected',
    title: 'Something broke on this screen',
    description:
      'The page stopped part way through rendering. Reloading usually clears it; the rest of the app is unaffected.',
  };

  if (error instanceof Error) {
    // Stacks name internal files, so they stay out of production builds.
    return { copy, detail: import.meta.env.DEV ? (error.stack ?? error.message) : undefined };
  }

  return { copy };
}

/** Router-level `errorElement`. Replaces React Router's built-in error screen,
 *  which dumps a stack trace on an unstyled white page. */
export default function RouteErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  const { copy, detail } = describe(error);

  return (
    <ErrorScreen
      {...copy}
      detail={detail}
      actions={
        <>
          <Button size="lg" className="m-brand-fill cursor-pointer" onClick={() => window.location.reload()}>
            <RotateCcw />
            Try again
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="cursor-pointer"
            onClick={() => void navigate(-1)}
          >
            <ArrowLeft />
            Go back
          </Button>

          <Button variant="ghost" size="lg" className="cursor-pointer" render={<Link to={HOME} />}>
            <LayoutDashboard />
            Dashboard
          </Button>
        </>
      }
    />
  );
}
