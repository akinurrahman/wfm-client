import { useEffect, useRef, useState } from 'react';

import { ArrowRight, Check, Copy, ShieldCheck, UserRound } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { USER_ROLES } from '@/constants/ROLES';

import { DEMO_PASSWORD } from '../definitions/landing.constants';
import type { DemoAccount } from '../definitions/landing.types';

type Props = {
  account: DemoAccount;
  featured?: boolean;
  onSignIn: (account: DemoAccount) => void;
};

const ROLE_ICON = {
  SITE_ADMIN: ShieldCheck,
  EMPLOYEE: UserRound,
} as const;

export function DemoAccountCard({
  account,
  featured = false,
  onSignIn,
}: Props) {
  const roleLabel = USER_ROLES.resolve(account.role)?.label ?? account.role;
  const Icon = ROLE_ICON[account.role];

  return (
    <article
      className={`m-panel m-panel-shine flex flex-col p-4 sm:p-5 ${
        featured ? 'shadow-lift ring-1 ring-brand-line' : ''
      }`}
    >
      <header className="flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className={`flex size-8 shrink-0 items-center justify-center rounded-md ${
            featured ? 'm-brand-fill' : 'bg-surface-3 text-text-mid'
          }`}
        >
          <Icon className="size-4" />
        </span>
        <h3 className="font-serif text-lg leading-tight text-text-hi">
          {roleLabel}
        </h3>
      </header>

      <p className="mt-2.5 text-[12.5px] leading-relaxed text-text-mid">
        {account.blurb}
      </p>

      <dl className="mt-4 space-y-1.5">
        <CredentialRow label="Email" value={account.email} />
        <CredentialRow label="Password" value={DEMO_PASSWORD} />
      </dl>

      <Button
        size="lg"
        variant={featured ? 'default' : 'outline'}
        onClick={() => onSignIn(account)}
        className={`group/button mt-4 h-10 w-full cursor-pointer text-[13px] tracking-wide ${
          featured ? 'm-brand-fill' : ''
        }`}
      >
        Sign in as {roleLabel}
        <ArrowRight className="transition-transform group-hover/button:translate-x-0.5" />
      </Button>
    </article>
  );
}

function CredentialRow({ label, value }: { label: string; value: string }) {
  const [isCopied, setIsCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setIsCopied(false), 1600);
    } catch {
      // Clipboard is blocked on insecure origins and in some embedded webviews.
      toast.error('Copy failed. Select the text and copy it by hand.');
    }
  };

  return (
    <div className="rounded-md bg-surface-2 px-3 py-1.5">
      <dt className="font-mono text-[9px] tracking-[0.18em] text-text-low uppercase">
        {label}
      </dt>
      <div className="flex items-center gap-2">
        <dd className="min-w-0 flex-1 truncate font-mono text-[12px] text-text-hi">
          {value}
        </dd>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={handleCopy}
          aria-label={`Copy ${label.toLowerCase()}`}
          className="-mr-1.5 size-8 shrink-0 cursor-pointer text-text-low transition-colors hover:text-text-hi"
        >
          {isCopied ? (
            <Check className="size-3.5 text-settled" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </Button>
      </div>
      <span role="status" aria-live="polite" className="sr-only">
        {isCopied ? `${label} copied` : ''}
      </span>
    </div>
  );
}
