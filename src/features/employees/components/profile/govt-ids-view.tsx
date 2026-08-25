import { Shield } from 'lucide-react';

import type { GovtIds } from '../../definitions/employee-profile.types';
import { DetailList } from './detail-list';
import { ProfileSectionView } from './profile-section-view';

type Props = {
  govtIds: GovtIds | null;
  onEdit: () => void;
};

const mono = (value: string | null) =>
  value ? (
    <span data-numeric className="font-mono">
      {value}
    </span>
  ) : null;

export function GovtIdsView({ govtIds, onEdit }: Props) {
  return (
    <ProfileSectionView
      title="Government IDs"
      description="Each number is unique across the company."
      isEmpty={!govtIds}
      emptyIcon={Shield}
      emptyTitle="No government IDs recorded"
      emptyDescription="Aadhaar and PAN are needed before payroll can process this employee."
      onEdit={onEdit}
    >
      {govtIds ? (
        <DetailList
          items={[
            { label: 'Aadhaar', value: mono(govtIds.aadharNo) },
            { label: 'PAN', value: mono(govtIds.panNo) },
            { label: 'UAN', value: mono(govtIds.uanNo) },
            { label: 'ESIC', value: mono(govtIds.esicNo) },
          ]}
        />
      ) : null}
    </ProfileSectionView>
  );
}
