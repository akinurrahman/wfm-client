import { formatDate } from '@/lib/format';

import { salaryPeriodLookup } from '../../definitions/employee-profile.lookup';
import type { EmploymentHistoryFormValues } from '../../definitions/employee-profile.schema';

/** Form values rather than the API record, because the editor stages rows in
 *  that shape and both screens have to describe a row identically. */
export function EmploymentSummary({ values }: { values: EmploymentHistoryFormValues }) {
  return (
    <>
      <span className="block font-medium text-text-hi">{values.designation}</span>
      <span className="block text-[13px] text-text-mid">{values.orgName}</span>
      <span data-numeric className="mt-1 block text-[12px] text-text-low">
        {formatDate(values.startDate, 'MMM yyyy')} to{' '}
        {values.isCurrentlyWorking ? 'present' : formatDate(values.endDate, 'MMM yyyy')}
        {values.salary
          ? ` - ${values.salary} ${values.salaryPeriod ? (salaryPeriodLookup.resolve(values.salaryPeriod)?.label ?? '') : ''}`
          : ''}
      </span>
    </>
  );
}
