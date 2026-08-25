import { Loader2, Plus } from 'lucide-react';

import { EmptyState } from '@/components/shared/empty-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RowActions } from '@/systems/ui/row-actions';

import type { DraftRow } from '../../hooks/use-collection-draft';

type Props<TValues> = {
  title: string;
  description: string;
  addLabel: string;
  emptyIcon: React.ComponentType<{ className?: string }>;
  emptyTitle: string;
  emptyDescription: string;
  rows: DraftRow<TValues>[];
  /** The row summary. Editing happens in the sheet, so this stays read-only. */
  renderRow: (values: TValues) => React.ReactNode;
  /** Names the row for the screen-reader labels on its two icon buttons. */
  rowSubject: (values: TValues) => string;
  onAdd: () => void;
  onEdit: (row: DraftRow<TValues>) => void;
  onRemove: (row: DraftRow<TValues>) => void;
  deletedCount: number;
  isDirty: boolean;
  isPending: boolean;
  onSave: () => void;
  onDiscard: () => void;
};

/** The three profile collections all save as one batched call, so the editor
 *  stages every add, edit and removal and commits them together. */
export function CollectionEditor<TValues>({
  title,
  description,
  addLabel,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  rows,
  renderRow,
  rowSubject,
  onAdd,
  onEdit,
  onRemove,
  deletedCount,
  isDirty,
  isPending,
  onSave,
  onDiscard,
}: Props<TValues>) {
  return (
    <div className="m-panel m-panel-shine overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-hairline p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-serif text-lg leading-tight text-text-hi">{title}</h2>
          <p className="mt-1 text-[13px] text-text-mid">{description}</p>
        </div>

        <Button variant="outline" size="sm" className="shrink-0" onClick={onAdd}>
          <Plus />
          {addLabel}
        </Button>
      </div>

      {rows.length === 0 ? (
        <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />
      ) : (
        <ul className="divide-y divide-hairline">
          {rows.map(row => (
            <li key={row.key} className="flex items-start gap-3 p-5">
              <div className="min-w-0 flex-1">{renderRow(row.values)}</div>

              {row.isChanged ? (
                <Badge variant="awaiting" className="mt-0.5 shrink-0">
                  {row.isNew ? 'New' : 'Edited'}
                </Badge>
              ) : null}

              <RowActions
                subject={rowSubject(row.values)}
                onEdit={() => onEdit(row)}
                onDelete={() => onRemove(row)}
                className="shrink-0"
              />
            </li>
          ))}
        </ul>
      )}

      {isDirty ? (
        <div className="flex flex-col gap-3 border-t border-hairline bg-surface-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-text-mid">
            Nothing is saved until you say so
            {deletedCount ? ` (${deletedCount} removed)` : ''}.
          </p>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={onDiscard}>
              Discard
            </Button>
            <Button
              type="button"
              size="sm"
              className="m-brand-fill"
              disabled={isPending}
              onClick={onSave}
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" />
                  Saving
                </>
              ) : (
                'Save changes'
              )}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
