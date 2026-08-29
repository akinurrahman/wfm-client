import { CalendarRange } from 'lucide-react';
import { useSearchParams } from 'react-router';

import { APP_NAME } from '@/constants';

import { CoverageSchematic } from '../components/coverage-schematic';
import { LoginForm } from '../components/login-form';

const CAPABILITIES = ['Scheduling', 'Timesheets', 'Coverage', 'Approvals'];

export default function LoginPage() {
  const [searchParams] = useSearchParams();

  // The demo landing page deep-links here with a seeded account attached.
  const email = searchParams.get('email');
  const password = searchParams.get('password');
  const prefill = email && password ? { email, password } : undefined;

  return (
    <main className="flex min-h-svh flex-col desk:grid desk:grid-cols-[1.1fr_minmax(24rem,31rem)]">
      {/* Below desk this is the band the form card tucks into. From desk up it
          becomes the left half of the split and carries the full pitch. */}
      <section className="m-sheet bg-background px-6 pt-8 pb-14 sm:pt-10 sm:pb-16 desk:flex desk:px-10 desk:py-9 xl:px-16">
        {/* One column for wordmark, pitch and footer so all three share a left
            edge, and the whole block centres on a wide monitor. */}
        <div className="mx-auto flex w-full max-w-2xl flex-col xl:max-w-3xl">
          <Wordmark />

          {/* my-auto rather than justify-center: on a short laptop the block
              pushes the page taller instead of being clipped. */}
          <div className="mt-6 sm:mt-8 desk:my-auto desk:mt-0 desk:py-8">
            <p className="font-mono text-[10px] tracking-[0.24em] text-text-low uppercase">
              Workforce operations
            </p>
            <p className="mt-2.5 font-serif text-[1.625rem] leading-[1.08] text-text-hi sm:mt-3 sm:text-[1.875rem] desk:mt-4 desk:text-[2.5rem] desk:leading-[1.05] xl:text-[3rem]">
              Every shift,
              <br />
              drawn to scale.
            </p>
            {/* The band has to clear the card on a short phone, so the pitch
                waits until there is room for it. */}
            <p className="mt-3 hidden max-w-md text-[13px] leading-relaxed text-text-mid sm:block desk:mt-4 desk:text-[14px]">
              Plan coverage, approve swaps and close the week without a
              spreadsheet.
            </p>

            <div className="mt-8 hidden max-w-xl desk:block">
              <CoverageSchematic />
            </div>
          </div>

          <ul className="hidden flex-wrap gap-x-5 gap-y-2 desk:flex">
            {CAPABILITIES.map(item => (
              <li
                key={item}
                className="font-mono text-[9px] tracking-[0.2em] text-text-low uppercase"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative z-10 -mt-10 flex flex-1 flex-col rounded-t-[1.75rem] border border-b-0 border-hairline bg-surface-1 px-6 pt-6 pb-8 shadow-lift sm:px-8 sm:pt-8 sm:pb-12 desk:mt-0 desk:rounded-none desk:border-0 desk:border-l desk:px-12 desk:py-12 desk:shadow-none">
        {/* The pull tab on the sheet edge. Desktop has no card, so no tab. */}
        <span
          aria-hidden="true"
          className="mx-auto mb-5 h-1 w-9 rounded-full bg-hairline-strong sm:mb-7 desk:hidden"
        />

        {/* my-auto, not a centred section: the pull tab stays pinned to the
            sheet edge while the form takes the slack below it. */}
        <div
          className="mx-auto my-auto w-full max-w-sm sm:max-w-md desk:max-w-sm"
          style={{
            animation: 'm-rise 600ms cubic-bezier(0.22, 1, 0.36, 1) both',
          }}
        >
          <p className="font-mono text-[10px] tracking-[0.24em] text-text-low uppercase">
            Sign in
          </p>
          <h1 className="mt-2.5 font-serif text-[1.75rem] leading-tight text-text-hi sm:mt-3 sm:text-[2rem]">
            Welcome back
          </h1>
          <p className="mt-2 text-[13px] leading-relaxed text-text-mid">
            Use the account your site admin set up for you. One sign-in for
            every role.
          </p>

          <div className="my-6 h-px bg-hairline sm:my-7 desk:my-8" />

          {prefill ? (
            <p className="mb-5 rounded-lg border border-brand-line bg-brand-soft px-3 py-2.5 text-[12px] leading-snug text-text-mid">
              Demo credentials filled in for you. Press sign in to continue.
            </p>
          ) : null}

          <LoginForm initialValues={prefill} />

          {/* The sign-in copy above already says accounts come from the admin,
              so this repeat is the first thing to go when height is scarce. */}
          <p className="hidden text-[11px] leading-relaxed text-text-low sm:mt-8 sm:block sm:border-t sm:border-hairline sm:pt-5">
            Accounts are issued by your site admin. There is no self sign-up.
          </p>
        </div>
      </section>
    </main>
  );
}

function Wordmark() {
  return (
    <span className="inline-flex items-center gap-2.5 self-start">
      <span className="m-brand-fill flex size-7 items-center justify-center rounded-md">
        <CalendarRange className="size-4" />
      </span>
      <span className="font-serif text-2xl leading-none tracking-tight text-text-hi">
        {APP_NAME}
      </span>
    </span>
  );
}
