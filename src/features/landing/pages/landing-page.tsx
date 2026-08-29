import { CalendarRange, RotateCcw } from 'lucide-react';
import { createSearchParams, useNavigate } from 'react-router';

import { APP_NAME } from '@/constants';

import { useBackendHealth } from '../api/landing.queries';
import { DemoAccountCard } from '../components/demo-account-card';
import { WalkthroughVideo } from '../components/walkthrough-video';
import {
  DEMO_ACCOUNTS,
  DEMO_PASSWORD,
  RESET_SCHEDULE,
} from '../definitions/landing.constants';
import type { DemoAccount } from '../definitions/landing.types';

/** The left column is four separate grid items, so the gutter is repeated
 *  rather than set once on a wrapper. A wrapper would have to be a grid item
 *  itself, and then the phone could not reorder past it. */
const COLUMN_PADDING = 'px-6 sm:px-10 xl:px-16 2xl:px-24';

const PROSE = 'max-w-xl text-text-mid 2xl:max-w-2xl';

export default function LandingPage() {
  const navigate = useNavigate();

  // Silent on purpose. The only job is waking the sleeping free tier instance
  // so the sign-in that follows is not the request that pays for the cold start.
  useBackendHealth();

  // The password rides the query string on purpose. It is a shared, published
  // demo credential on a database that is wiped on a schedule, and the point is
  // a one-click sign-in.
  const signInAs = (account: DemoAccount) => {
    const params = createSearchParams({
      email: account.email,
      password: DEMO_PASSWORD,
    });
    navigate(`/login?${params.toString()}`);
  };

  // DOM order is the phone order: the accounts sit above the sandbox notes so
  // the thing a visitor came for is not below a screen of prose. From desk up
  // the grid puts the notes back under the pitch in the left column.
  return (
    <main className="m-sheet flex min-h-svh flex-col bg-background desk:grid desk:h-svh desk:min-h-0 desk:grid-cols-[1fr_minmax(0,46%)] desk:grid-rows-[1fr_auto_auto_1fr] desk:overflow-hidden">
      <div
        className={`${COLUMN_PADDING} pt-8 desk:col-start-1 desk:row-start-1 desk:self-start desk:pt-10`}
      >
        <span className="inline-flex items-center gap-2.5">
          <span className="m-brand-fill flex size-7 items-center justify-center rounded-md">
            <CalendarRange className="size-4" />
          </span>
          <span className="font-serif text-2xl leading-none tracking-tight text-text-hi">
            {APP_NAME}
          </span>
        </span>
      </div>

      <div
        className={`${COLUMN_PADDING} mt-7 desk:col-start-1 desk:row-start-2 desk:mt-0 desk:py-3`}
        style={{
          animation: 'm-rise 600ms cubic-bezier(0.22, 1, 0.36, 1) both',
        }}
      >
        <div className={PROSE}>
          <p className="font-mono text-[10px] tracking-[0.24em] text-text-low uppercase">
            Demo sandbox
          </p>
          <h1 className="mt-3 font-serif text-[1.75rem] leading-[1.1] text-text-hi sm:text-[2.125rem] desk:text-[2.5rem] desk:leading-[1.06] xl:text-[2.875rem] 2xl:text-[3.25rem]">
            An HRMS portal I built to show the level of work I deliver.
          </h1>
          <p className="mt-4 text-[13.5px] leading-relaxed sm:text-[14px] 2xl:text-[15px]">
            This is not a client project and no client data appears anywhere in
            it. Real client work is under NDA, so I can't hand out credentials
            or logins for live systems, for obvious reasons. This is a small
            demo sandbox I put together from scratch (about 1% of the real
            client build) so you can log in, click through and stress-test the
            interface yourself.
          </p>
        </div>
      </div>

      <section className="mt-9 flex flex-col border-hairline bg-surface-1 px-6 pt-8 pb-10 sm:px-10 desk:col-start-2 desk:row-span-4 desk:row-start-1 desk:mt-0 desk:min-w-0 desk:border-l desk:px-10 desk:py-10 2xl:px-14">
        <div className="flex flex-1 flex-col justify-center gap-5 2xl:gap-7">
          <WalkthroughVideo />

          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-mono text-[10px] tracking-[0.2em] text-text-mid uppercase">
              Demo accounts
            </h2>
            <span className="font-mono text-[10px] tracking-[0.16em] text-text-low uppercase">
              Copy or sign in
            </span>
          </div>

          <div className="grid min-h-0 gap-4 sm:grid-cols-2 2xl:gap-6">
            {DEMO_ACCOUNTS.map((account, index) => (
              <DemoAccountCard
                key={account.email}
                account={account}
                featured={index === 0}
                onSignIn={signInAs}
              />
            ))}
          </div>
        </div>
      </section>

      <div
        className={`${COLUMN_PADDING} mt-9 desk:col-start-1 desk:row-start-3 desk:mt-0 desk:py-3`}
      >
        <div className={`${PROSE} border-t border-hairline pt-6 2xl:pt-8`}>
          <h2 className="font-serif text-[1.375rem] leading-tight text-text-hi sm:text-[1.5rem] 2xl:text-[1.75rem]">
            Break it. Please.
          </h2>
          <p className="mt-3 text-[13.5px] leading-relaxed sm:text-[14px] 2xl:text-[15px]">
            All data in the portal is seeded: fake employees, fake payroll
            cycles, fake leave balances. You can approve, reject, edit, delete
            or mangle anything you like. Nothing is precious and nothing is
            real.
          </p>

          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-2 px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-text-mid uppercase">
            <RotateCcw aria-hidden="true" className="size-3 shrink-0" />
            Wiped and re-seeded {RESET_SCHEDULE}
          </p>
        </div>
      </div>

      <p
        className={`${COLUMN_PADDING} mt-8 pb-8 font-mono text-[9px] tracking-[0.2em] text-text-low uppercase desk:col-start-1 desk:row-start-4 desk:mt-0 desk:self-end desk:pb-10`}
      >
        Seeded data / nothing here is real
      </p>
    </main>
  );
}
