import { ArrowLeft, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';

import { ErrorScreen } from './error-screen';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <ErrorScreen
      code="404"
      eyebrow="Err / not found"
      title="This page is not on the sheet"
      description="The link may be out of date, or the record it pointed at has since been removed. Nothing was lost — the rest of the workspace is where you left it."
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
