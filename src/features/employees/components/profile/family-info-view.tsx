import { Users } from 'lucide-react';

import { LookupBadge } from '@/systems/ui/lookup-badge';

import {
  emergencyContactRelationLookup,
  maritalStatusLookup,
} from '../../definitions/employee-profile.lookup';
import type { FamilyInfo } from '../../definitions/employee-profile.types';
import { DetailList } from './detail-list';
import { ProfileSectionView } from './profile-section-view';

type Props = {
  familyInfo: FamilyInfo | null;
  onEdit: () => void;
};

export function FamilyInfoView({ familyInfo, onEdit }: Props) {
  return (
    <ProfileSectionView
      title="Family"
      description="Next of kin, and who to call when something happens on site."
      isEmpty={!familyInfo}
      emptyIcon={Users}
      emptyTitle="No family details recorded"
      emptyDescription="Add parents, marital status and an emergency contact."
      onEdit={onEdit}
    >
      {familyInfo ? (
        <DetailList
          items={[
            { label: "Father's name", value: familyInfo.fathersName },
            { label: "Mother's name", value: familyInfo.mothersName },
            {
              label: 'Marital status',
              value: <LookupBadge lookup={maritalStatusLookup} value={familyInfo.maritalStatus} />,
            },
            { label: 'Spouse', value: familyInfo.spouseName || null },
            { label: 'Emergency contact', value: familyInfo.emergencyContactName },
            { label: 'Emergency number', value: familyInfo.emergencyContactNumber },
            {
              label: 'Relation',
              value: (
                <LookupBadge
                  lookup={emergencyContactRelationLookup}
                  value={familyInfo.emergencyContactRelation}
                />
              ),
            },
            { label: 'Emergency address', value: familyInfo.emergencyContactAddress },
          ]}
        />
      ) : null}
    </ProfileSectionView>
  );
}
