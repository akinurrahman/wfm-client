import { Pencil, Plus } from 'lucide-react';

import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';

type Props = {
  title: string;
  description?: string;
  isEmpty: boolean;
  emptyIcon: React.ComponentType<{ className?: string }>;
  emptyTitle: string;
  emptyDescription: string;
  onEdit?: () => void;
  children: React.ReactNode;
};

const READ_ONLY_EMPTY_DESCRIPTION = 'HR keeps this section. Ask them to add it to your record.';

/** The read side of one profile section. Editing lives on its own screen, so
 *  this only reads the record back and points at where it is changed. */
export function ProfileSectionView({
  title,
  description,
  isEmpty,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  onEdit,
  children,
}: Props) {
  return (
    <section className="m-panel m-panel-shine overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-hairline p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-serif text-lg leading-tight text-text-hi">{title}</h2>
          {description ? <p className="mt-1 text-[13px] text-text-mid">{description}</p> : null}
        </div>

        {isEmpty || !onEdit ? null : (
          <Button variant="outline" size="sm" className="shrink-0" onClick={onEdit}>
            <Pencil />
            Edit
          </Button>
        )}
      </div>

      {isEmpty ? (
        <EmptyState
          icon={emptyIcon}
          title={emptyTitle}
          description={onEdit ? emptyDescription : READ_ONLY_EMPTY_DESCRIPTION}
          action={
            onEdit ? (
              <Button size="sm" className="m-brand-fill" onClick={onEdit}>
                <Plus />
                Add details
              </Button>
            ) : null
          }
        />
      ) : (
        <div className="p-5">{children}</div>
      )}
    </section>
  );
}
