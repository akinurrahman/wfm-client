import { CalendarClock, Clock3, Download, Plus, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PageHeader } from '@/components/shared/page-header';

import { CoverageBar } from '../components/coverage-bar';
import { ShiftSpan } from '../components/shift-span';
import { StatCard } from '../components/stat-card';

const STATS = [
  { label: 'Active staff', value: '248', delta: '+4.2%', trend: 'up', icon: Users },
  { label: 'Shifts today', value: '96', delta: '+1.8%', trend: 'up', icon: CalendarClock },
  { label: 'Open requests', value: '12', delta: '-6.5%', trend: 'down', icon: Clock3 },
  { label: 'Hours booked', value: '1,842', delta: '+3.1%', trend: 'up', icon: Clock3 },
] as const;

const SHIFTS = [
  { id: 1, name: 'Amelia Hart', role: 'Floor lead', start: 480, end: 960, hours: '8.0', status: 'settled' },
  { id: 2, name: 'Noah Whitfield', role: 'Support', start: 570, end: 1050, hours: '8.0', status: 'awaiting' },
  { id: 3, name: 'Priya Raman', role: 'Dispatch', start: 720, end: 1200, hours: '8.0', status: 'settled' },
  { id: 4, name: 'Tomas Alvarez', role: 'Night crew', start: 1320, end: 360, hours: '8.0', status: 'overdue' },
  { id: 5, name: 'Grace Nkemdi', role: 'Support', start: 420, end: 780, hours: '6.0', status: 'awaiting' },
] as const;

function formatWindow(start: number, end: number) {
  const clock = (minutes: number) =>
    `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

  return `${clock(start)} - ${clock(end)}`;
}

const STATUS_LABEL = {
  settled: 'Approved',
  awaiting: 'Pending',
  overdue: 'Missed',
} as const;

const COVERAGE_TARGET = 80;

const COVERAGE = [
  { day: 'Mon', filled: 92 },
  { day: 'Tue', filled: 78 },
  { day: 'Wed', filled: 64 },
  { day: 'Thu', filled: 87 },
  { day: 'Fri', filled: 96 },
  { day: 'Sat', filled: 41 },
  { day: 'Sun', filled: 33 },
];

export default function DashboardPage() {
  return (
    <div className="pb-4">
      <PageHeader
        title="Overview"
        description="Dummy data, here to preview the Cyanotype theme."
        actions={
          <>
            <Button variant="outline" size="lg">
              <Download />
              Export
            </Button>
            <Button size="lg" className="m-brand-fill">
              <Plus />
              New shift
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map(stat => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <section className="m-panel m-panel-shine xl:col-span-2">
          <div className="flex items-center justify-between gap-3 px-5 py-4">
            <div>
              <h2 className="font-serif text-lg leading-tight text-text-hi">Today&apos;s roster</h2>
              <p className="mt-0.5 text-[12px] text-text-mid">5 of 96 shifts shown</p>
            </div>
            <Button variant="ghost" size="sm">
              View all
            </Button>
          </div>

          <Separator />

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Window</TableHead>
                  <TableHead className="text-right">Hours</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {SHIFTS.map(shift => (
                  <TableRow key={shift.id} data-interactive>
                    <TableCell>
                      <span className="block font-medium text-text-hi">{shift.name}</span>
                      <span className="block text-[12px] text-text-low">{shift.role}</span>
                    </TableCell>
                    <TableCell>
                      <ShiftSpan
                        start={shift.start}
                        end={shift.end}
                        label={formatWindow(shift.start, shift.end)}
                      />
                    </TableCell>
                    <TableCell className="tnum text-right text-text-mid">{shift.hours}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={shift.status} className="ml-auto">
                        {STATUS_LABEL[shift.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <section className="m-panel m-panel-shine p-5">
          <h2 className="font-serif text-lg leading-tight text-text-hi">Coverage</h2>
          <p className="mt-0.5 text-[12px] text-text-mid">
            Filled slots per day, against a {COVERAGE_TARGET}% target
          </p>

          <div className="mt-5 space-y-3.5">
            {COVERAGE.map(row => (
              <CoverageBar
                key={row.day}
                day={row.day}
                filled={row.filled}
                target={COVERAGE_TARGET}
              />
            ))}
          </div>

          <Separator className="my-5" />

          <div className="flex flex-wrap gap-1.5">
            <Badge>Brand</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="settled">Settled</Badge>
            <Badge variant="awaiting">Awaiting</Badge>
            <Badge variant="overdue">Overdue</Badge>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm">Primary</Button>
            <Button size="sm" variant="secondary">
              Secondary
            </Button>
            <Button size="sm" variant="outline">
              Outline
            </Button>
            <Button size="sm" variant="ghost">
              Ghost
            </Button>
            <Button size="sm" variant="destructive">
              Destructive
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
