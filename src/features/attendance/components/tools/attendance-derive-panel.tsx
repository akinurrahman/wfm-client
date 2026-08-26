import { useState } from 'react';

import { Loader2, RefreshCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { todayCalendarDate } from '@/lib/time';
import { DateField, Form, InputField, SwitchField } from '@/systems/form';
import { PanelSection } from '@/systems/ui/panel-section';

import { useDeriveAttendance } from '../../api/attendance-tools.mutations';
import {
  deriveFormSchema,
  type DeriveFormValues,
} from '../../definitions/attendance-tools.schema';
import type { DerivationSummary } from '../../definitions/attendance-tools.types';
import { AttendanceResultMetrics } from './attendance-result-metrics';
import { AttendanceSkippedList } from './attendance-skipped-list';

export function AttendanceDerivePanel() {
  const [summary, setSummary] = useState<DerivationSummary | null>(null);
  const derive = useDeriveAttendance();

  const handleSubmit = (values: DeriveFormValues) =>
    derive.mutate(
      {
        from: values.from,
        to: values.to,
        employeeCode: values.employeeCode || undefined,
        force: values.force,
      },
      { onSuccess: response => setSummary(response.data) }
    );

  return (
    <PanelSection
      title="Re-derive from punches"
      description="Recomputes days from punches already stored. Ingestion does this inline, so this is the repair path after a shift correction or a late-declared holiday. Source precedence still holds, so it can never flatten a manual row."
    >
      <Form<DeriveFormValues>
        schema={deriveFormSchema}
        defaultValues={{
          from: todayCalendarDate(),
          to: todayCalendarDate(),
          employeeCode: '',
          force: false,
        }}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <DateField name="from" label="From" required />
          <DateField name="to" label="To" required />
        </div>

        <InputField
          name="employeeCode"
          label="Employee badge code"
          placeholder="WFM-EMP-07"
          description="The badge code, not the UUID. Leave it empty to run for everyone."
        />

        <SwitchField
          name="force"
          label="Force"
          description="Re-derives days already processed. Needed when the answer changed rather than the input."
        />

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={derive.isPending} className="m-brand-fill">
            {derive.isPending ? <Loader2 className="animate-spin" /> : <RefreshCcw />}
            {derive.isPending ? 'Deriving' : 'Run derive'}
          </Button>
        </div>
      </Form>

      {summary ? (
        <div className="space-y-3 border-t border-hairline pt-4">
          <AttendanceResultMetrics
            items={[
              { label: 'Derived', value: summary.derived },
              { label: 'Created', value: summary.rowsCreated },
              { label: 'Updated', value: summary.rowsUpdated },
              {
                label: 'Conflicts',
                value: summary.conflicts,
                tone: summary.conflicts ? 'overdue' : undefined,
              },
            ]}
          />

          <AttendanceSkippedList skipped={summary.skipped} />
        </div>
      ) : null}
    </PanelSection>
  );
}
