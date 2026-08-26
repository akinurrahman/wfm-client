import { Link } from 'react-router';

import { CalendarCheck } from 'lucide-react';

import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';

import { AttendanceClosePanel } from '../../components/tools/attendance-close-panel';
import { AttendanceDerivePanel } from '../../components/tools/attendance-derive-panel';

export default function AttendanceToolsPage() {
  return (
    <div className="pb-4">
      <PageHeader
        title="Attendance tools"
        description="Repair passes over days that are already decided. Neither belongs in the daily routine: ingestion derives inline, and the nightly job closes."
        actions={
          <Button variant="outline" size="sm" render={<Link to="/attendance" />}>
            <CalendarCheck />
            Daily roster
          </Button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-2 xl:items-start">
        <AttendanceDerivePanel />
        <AttendanceClosePanel />
      </div>
    </div>
  );
}
