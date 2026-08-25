import { formatDate } from '@/lib/format';

import type { CertificateFormValues } from '../../definitions/employee-profile.schema';

/** Form values rather than the API record, because the editor stages rows in
 *  that shape and both screens have to describe a row identically. */
export function CertificateSummary({ values }: { values: CertificateFormValues }) {
  return (
    <>
      <span className="block font-medium text-text-hi">{values.certificateName}</span>
      <span className="block text-[13px] text-text-mid">{values.issuingOrg}</span>

      {values.issueDate || values.expiryDate ? (
        <span data-numeric className="mt-1 block text-[12px] text-text-low">
          {values.issueDate ? `Issued ${formatDate(values.issueDate, 'MMM yyyy')}` : ''}
          {values.issueDate && values.expiryDate ? ' - ' : ''}
          {values.expiryDate ? `expires ${formatDate(values.expiryDate, 'MMM yyyy')}` : ''}
        </span>
      ) : null}

      {values.certificateUrl ? (
        <a
          href={values.certificateUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-1 inline-block text-[12px] text-brand underline underline-offset-2"
        >
          Open certificate
        </a>
      ) : null}
    </>
  );
}
