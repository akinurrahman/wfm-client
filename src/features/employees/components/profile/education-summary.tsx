import { formatDate } from '@/lib/format';

import type { EducationFormValues } from '../../definitions/employee-profile.schema';

/** Form values rather than the API record, because the editor stages rows in
 *  that shape and both screens have to describe a row identically. */
export function EducationSummary({ values }: { values: EducationFormValues }) {
  return (
    <>
      <span className="block font-medium text-text-hi">{values.courseName}</span>
      <span className="block text-[13px] text-text-mid">{values.instituteName}</span>
      <span data-numeric className="mt-1 block text-[12px] text-text-low">
        {formatDate(values.startDate, 'MMM yyyy')} to{' '}
        {values.isCurrentlyStudying ? 'present' : formatDate(values.endDate, 'MMM yyyy')}
        {values.passingYear ? ` - passed ${values.passingYear}` : ''}
        {values.divisionGrade ? ` - ${values.divisionGrade}` : ''}
      </span>
    </>
  );
}
