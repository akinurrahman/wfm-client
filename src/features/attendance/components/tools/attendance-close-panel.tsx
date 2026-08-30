import { useState } from 'react';

import { Loader2, Lock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/format';
import { todayCalendarDate } from '@/lib/time';
import { useConfirmation } from '@/systems/confirmation/hooks/use-confirmation';
import { DateField, Form } from '@/systems/form';
import { PanelSection } from '@/systems/ui/panel-section';

import { useCloseAttendanceDay } from '../../api/attendance-tools.mutations';
import { closeFormSchema, type CloseFormValues } from '../../definitions/attendance-tools.schema';
import type { CloseSummary } from '../../definitions/attendance-tools.types';
import { AttendanceResultMetrics } from './attendance-result-metrics';
import { AttendanceSkippedList } from './attendance-skipped-list';

export function AttendanceClosePanel() {
  const [summary, setSummary] = useState<CloseSummary | null>(null);
  const closeDay = useCloseAttendanceDay();
  const { confirm } = useConfirmation<string>();

  const handleSubmit = (values: CloseFormValues) =>
    confirm({
      item: values.date,
      title: 'Close this day',
      description: date =>
        `Every employee with no row for ${formatDate(date, 'dd MMM yyyy')} gets one. Rows it writes are SYSTEM, the lowest rank, so no evidence is destroyed - and re-running writes nothing.`,
      onConfirm: date =>
        closeDay
          .mutateAsync(date)
          .then(response => setSummary(response.data))
          .catch(() => undefined),
    });

  return (
    <PanelSection
      title="Close a finished day"
      description="The same pass the nightly job runs, for a night the scheduler was down. A derive pass runs first, then every eligible employee with no row gets one."
    >
      <Form<CloseFormValues>
        schema={closeFormSchema}
        defaultValues={{ date: todayCalendarDate() }}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <DateField
          name="date"
          label="Day to close"
          description="Close a day only once it is finished. Closing today mid-shift marks people absent who have not gone home."
          required
        />

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={closeDay.isPending} className="m-brand-fill">
            {closeDay.isPending ? <Loader2 className="animate-spin" /> : <Lock />}
            {closeDay.isPending ? 'Closing' : 'Close day'}
          </Button>
        </div>
      </Form>

      {summary ? (
        <div className="space-y-3 border-t border-hairline pt-4">
          <AttendanceResultMetrics
            items={[
              { label: 'Considered', value: summary.employeesConsidered },
              { label: 'Absent', value: summary.created.absent },
              { label: 'On leave', value: summary.created.onLeave },
              { label: 'Not applicable', value: summary.created.notApplicable },
              { label: 'Untouched', value: summary.untouched },
              {
                label: 'Checkouts fixed',
                value: summary.missingCheckoutFixed,
                tone: summary.missingCheckoutFixed ? 'settled' : undefined,
              },
              {
                label: 'Conflicts flagged',
                value: summary.conflictsFlagged,
                tone: summary.conflictsFlagged ? 'overdue' : undefined,
              },
            ]}
          />

          <p className="meta-label text-text-low">
            From the derive pass
          </p>
          <AttendanceResultMetrics
            items={[
              { label: 'Derived', value: summary.derivation.derived },
              { label: 'Created', value: summary.derivation.rowsCreated },
              { label: 'Updated', value: summary.derivation.rowsUpdated },
              {
                label: 'Conflicts',
                value: summary.derivation.conflicts,
                tone: summary.derivation.conflicts ? 'overdue' : undefined,
              },
            ]}
          />

          <AttendanceSkippedList
            skipped={[...summary.skipped, ...summary.derivation.skipped]}
          />
        </div>
      ) : null}
    </PanelSection>
  );
}
