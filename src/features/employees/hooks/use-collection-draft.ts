import { useCallback, useState } from 'react';

export type ServerRow<TValues> = { id: string; values: TValues };

export type DraftRow<TValues> = {
  /** Stable across edits, so a list of unsaved rows keeps its React identity. */
  key: string;
  /** Absent until the row has been saved once. */
  id?: string;
  values: TValues;
  isNew: boolean;
  isChanged: boolean;
};

let keyCounter = 0;
const nextKey = () => `draft-${(keyCounter += 1)}`;

const seed = <TValues,>(rows: ServerRow<TValues>[]): DraftRow<TValues>[] =>
  rows.map(row => ({ key: row.id, id: row.id, values: row.values, isNew: false, isChanged: false }));

/** Staging for the three profile collections, which take additions, edits and
 *  removals as one call. Nothing reaches the API until the tab is saved, so the
 *  editor can hold a half-built list the way a spreadsheet would. */
export function useCollectionDraft<TValues>(serverRows: ServerRow<TValues>[]) {
  const [rows, setRows] = useState<DraftRow<TValues>[]>(() => seed(serverRows));
  const [deleteIds, setDeleteIds] = useState<string[]>([]);
  const [seededFrom, setSeededFrom] = useState(serverRows);

  const isDirty = rows.some(row => row.isChanged) || deleteIds.length > 0;

  // A save invalidates the employee detail query, and the refetched records
  // arrive as a new array. Re-seeding from them keeps the editor showing what
  // the server actually stored. Adjusting state during render rather than in an
  // effect avoids a frame of stale rows. A dirty draft is left alone, so a
  // background refetch cannot throw away work in progress.
  if (serverRows !== seededFrom && !isDirty) {
    setSeededFrom(serverRows);
    setRows(seed(serverRows));
  }

  const add = useCallback((values: TValues) => {
    setRows(current => [...current, { key: nextKey(), values, isNew: true, isChanged: true }]);
  }, []);

  const update = useCallback((key: string, values: TValues) => {
    setRows(current =>
      current.map(row => (row.key === key ? { ...row, values, isChanged: true } : row))
    );
  }, []);

  const remove = useCallback(
    (key: string) => {
      // Looked up outside the updater on purpose: an updater runs twice under
      // StrictMode, so queueing the delete from inside one would record the id
      // twice.
      const target = rows.find(row => row.key === key);
      const id = target?.id;

      if (id) setDeleteIds(ids => (ids.includes(id) ? ids : [...ids, id]));
      setRows(current => current.filter(row => row.key !== key));
    },
    [rows]
  );

  const reset = useCallback(() => {
    setRows(seed(seededFrom));
    setDeleteIds([]);
  }, [seededFrom]);

  /** Called once a save succeeds. The rows on screen are what the server now
   *  holds, so they stop reading as pending edits, and clearing the flags is
   *  what lets the refetched records re-seed the draft with their real ids. */
  const commit = useCallback(() => {
    setRows(current => current.map(row => ({ ...row, isNew: false, isChanged: false })));
    setDeleteIds([]);
  }, []);

  return {
    rows,
    /** What the upsert half of the payload is built from. */
    changedRows: rows.filter(row => row.isChanged),
    deleteIds,
    isDirty,
    add,
    update,
    remove,
    reset,
    commit,
  };
}
