import { employeeTypeLookup, genderLookup, type EmployeeType } from '@/features/employees';
import { cn } from '@/lib/utils';

import type { AdminWorkforce } from '../../definitions/admin-dashboard.types';
import { ChartLegend, type LegendEntry } from '../chart-legend';
import { employeeTypeFill, GENDER_FILL } from '../chart-palette';

type Props = {
  workforce: AdminWorkforce;
  /** The head count the slices sum to. Shown so a reader can check the sum
   *  rather than take it on trust. */
  onRolls: number;
};

export function AdminWorkforcePanel({ workforce, onRolls }: Props) {
  const designations = workforce.byDesignation;
  const largest = Math.max(...designations.map(row => row.count), 1);

  const typeEntries: LegendEntry[] = employeeTypeLookup.values
    .filter(type => workforce.byEmployeeType[type] > 0)
    .map(type => ({
      key: type,
      label: employeeTypeLookup.resolve(type)?.label ?? type,
      style: employeeTypeFill(type),
      value: workforce.byEmployeeType[type],
    }));

  const genderEntries: LegendEntry[] = genderLookup.values
    .filter(gender => workforce.byGender[gender] > 0)
    .map(gender => ({
      key: gender,
      label: genderLookup.resolve(gender)?.label ?? gender,
      className: GENDER_FILL[gender],
      value: workforce.byGender[gender],
    }));

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <Heading title="By designation" note={`${designations.length} in use`} />

        {/* Already ordered largest first by the API. Re-sorting here would
            answer a different question from the one the endpoint answered. */}
        <ul className="space-y-2.5">
          {designations.map(row => (
            <li key={row.id}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="truncate text-[13px] text-text-mid" title={row.title}>
                  {row.title}
                </span>
                <span data-numeric className="text-[13px] font-medium text-text-hi">
                  {row.count}
                </span>
              </div>
              {/* One series, so one hue for every bar: colouring these by size
                  would spend the identity channel on what length already says. */}
              <div
                title={`${row.title}: ${row.count} of ${onRolls}`}
                style={{ width: `${(row.count / largest) * 100}%` }}
                className="mt-1 h-1.5 min-w-[4px] rounded-full bg-data"
              />
            </li>
          ))}
        </ul>
      </section>

      <MixBar
        title="By employee type"
        note="Skill bands, darkest first"
        entries={typeEntries}
        total={onRolls}
        fills={employeeTypeLookup.values.map(type => ({
          key: type,
          value: workforce.byEmployeeType[type],
          style: employeeTypeFill(type as EmployeeType),
        }))}
      />

      <MixBar
        title="By gender"
        entries={genderEntries}
        total={onRolls}
        fills={genderLookup.values.map(gender => ({
          key: gender,
          value: workforce.byGender[gender],
          className: GENDER_FILL[gender],
        }))}
      />
    </div>
  );
}

function Heading({ title, note }: { title: string; note?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <h4 className="meta-label text-text-low">{title}</h4>
      {note ? (
        <span data-numeric className="text-[11px] text-text-low">
          {note}
        </span>
      ) : null}
    </div>
  );
}

type Fill = { key: string; value: number; className?: string; style?: React.CSSProperties };

function MixBar({
  title,
  note,
  entries,
  fills,
  total,
}: {
  title: string;
  note?: string;
  entries: LegendEntry[];
  fills: Fill[];
  total: number;
}) {
  return (
    <section className="space-y-3">
      <Heading title={title} note={note} />

      <div className="flex h-2.5 w-full gap-[2px] overflow-hidden rounded-full bg-surface-3">
        {fills
          .filter(fill => fill.value > 0)
          .map(fill => (
            <div
              key={fill.key}
              title={`${fill.value} of ${total}`}
              style={{ flexGrow: fill.value, ...fill.style }}
              className={cn('h-full min-w-[3px] shrink-0 basis-0', fill.className)}
            />
          ))}
      </div>

      <ChartLegend entries={entries} />
    </section>
  );
}
