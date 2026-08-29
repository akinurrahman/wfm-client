import { Award } from 'lucide-react';

import { toCertificateFormValues } from '../../definitions/employee-profile.schema';
import type { Certificate } from '../../definitions/employee-profile.types';
import { CertificateSummary } from './certificate-summary';
import { ProfileSectionView } from './profile-section-view';

type Props = {
  records: Certificate[];
  onEdit?: () => void;
};

export function CertificatesView({ records, onEdit }: Props) {
  return (
    <ProfileSectionView
      title="Certificates"
      description="Training and licences. A link is stored as text until there is an upload service."
      isEmpty={records.length === 0}
      emptyIcon={Award}
      emptyTitle="No certificates recorded"
      emptyDescription="Add the training or licences this employee holds."
      onEdit={onEdit}
    >
      <ul className="divide-y divide-hairline">
        {records.map(record => (
          <li key={record.id} className="py-3 first:pt-0 last:pb-0">
            <CertificateSummary values={toCertificateFormValues(record)} />
          </li>
        ))}
      </ul>
    </ProfileSectionView>
  );
}
