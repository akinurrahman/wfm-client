import { Landmark } from 'lucide-react';

import { MaskedValue } from '@/systems/ui/masked-value';

import type { BankDetails } from '../../definitions/employee-profile.types';
import { DetailList } from './detail-list';
import { ProfileSectionView } from './profile-section-view';

type Props = {
  bankDetails: BankDetails | null;
  onEdit?: () => void;
  maskSensitive?: boolean;
};

export function BankDetailsView({ bankDetails, onEdit, maskSensitive = false }: Props) {
  return (
    <ProfileSectionView
      title="Bank"
      description="Where salary lands."
      isEmpty={!bankDetails}
      emptyIcon={Landmark}
      emptyTitle="No bank details recorded"
      emptyDescription="Payroll cannot pay this employee until an account is on file."
      onEdit={onEdit}
    >
      {bankDetails ? (
        <DetailList
          items={[
            { label: 'Account holder', value: bankDetails.accountHolder },
            {
              label: 'Account number',
              value: maskSensitive ? (
                <MaskedValue value={bankDetails.accountNo} label="account number" />
              ) : (
                <span data-numeric className="font-mono">
                  {bankDetails.accountNo}
                </span>
              ),
            },
            {
              label: 'IFSC',
              value: <span className="font-mono">{bankDetails.ifscCode}</span>,
            },
            { label: 'Bank', value: bankDetails.bankName },
            { label: 'Branch', value: bankDetails.branchName },
          ]}
        />
      ) : null}
    </ProfileSectionView>
  );
}
