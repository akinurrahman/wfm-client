import { Shield } from 'lucide-react';

import { MaskedValue } from '@/systems/ui/masked-value';

import type { GovtIds } from '../../definitions/employee-profile.types';
import { DetailList } from './detail-list';
import { ProfileSectionView } from './profile-section-view';

type Props = {
  govtIds: GovtIds | null;
  onEdit?: () => void;
  maskSensitive?: boolean;
};

const mono = (value: string | null) =>
  value ? (
    <span data-numeric className="font-mono">
      {value}
    </span>
  ) : null;

export function GovtIdsView({ govtIds, onEdit, maskSensitive = false }: Props) {
  const number = (value: string | null, label: string) =>
    maskSensitive ? <MaskedValue value={value} label={label} /> : mono(value);

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
            { label: 'Aadhaar', value: number(govtIds.aadharNo, 'Aadhaar number') },
            { label: 'PAN', value: number(govtIds.panNo, 'PAN') },
            { label: 'UAN', value: number(govtIds.uanNo, 'UAN') },
            { label: 'ESIC', value: number(govtIds.esicNo, 'ESIC number') },
          ]}
        />
      ) : null}
    </ProfileSectionView>
  );
}
