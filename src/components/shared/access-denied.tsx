import { ArrowLeft, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';

import { ErrorScreen } from './error-screen';

export default function AccessDeniedPage() {
  const navigate = useNavigate();

  return (
    <ErrorScreen
      code="403"
      eyebrow="Err / forbidden"
      title="You do not have access to this"
      description="Your role does not cover this page. If you think that is wrong, ask an administrator to widen your permissions, signing in again will not change it."
      actions={
        <>
          <Button size="lg" className="m-brand-fill cursor-pointer" render={<Link to="/dashboard" />}>
            <LayoutDashboard />
            Back to dashboard
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
        </>
      }
    />
  );
}
