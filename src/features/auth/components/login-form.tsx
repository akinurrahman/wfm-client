import { useState, type ReactNode } from 'react';

import { ArrowRight, Eye, EyeOff, Loader2, TriangleAlert } from 'lucide-react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getErrorMessage } from '@/lib/api/error';

import { useLogin } from '../api/auth.mutations';
import {
  loginFormSchema,
  type LoginFormValues,
} from '../definitions/auth.schema';

type FieldErrors = Partial<Record<keyof LoginFormValues, string>>;

const EMPTY_VALUES: LoginFormValues = { email: '', password: '' };

const FIELD_CLASS =
  'h-11 rounded-lg border-hairline-strong bg-surface-2 px-3.5 text-sm transition-colors placeholder:text-text-low';

export function LoginForm() {
  const login = useLogin();

  const [values, setValues] = useState<LoginFormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [revealed, setRevealed] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  const setField = (name: keyof LoginFormValues, value: string) => {
    setValues(current => ({ ...current, [name]: value }));
    setErrors(current => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = loginFormSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors = z.flattenError(parsed.error).fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    setErrors({});
    login.mutate(parsed.data);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
      <Field id="email" label="Email" error={errors.email}>
        <Input
          id="email"
          type="email"
          autoComplete="username"
          autoFocus
          placeholder="you@company.com"
          value={values.email}
          aria-invalid={Boolean(errors.email)}
          onChange={event => setField('email', event.target.value)}
          className={FIELD_CLASS}
        />
      </Field>

      <Field
        id="password"
        label="Password"
        error={errors.password}
        hint={capsLock ? 'Caps lock is on' : undefined}
      >
        <div className="relative">
          <Input
            id="password"
            type={revealed ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="At least 8 characters"
            value={values.password}
            aria-invalid={Boolean(errors.password)}
            onChange={event => setField('password', event.target.value)}
            onKeyUp={event => setCapsLock(event.getModifierState('CapsLock'))}
            onBlur={() => setCapsLock(false)}
            className={`${FIELD_CLASS} pr-11`}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={revealed ? 'Hide password' : 'Show password'}
            onClick={() => setRevealed(current => !current)}
            className="absolute top-1/2 right-2 -translate-y-1/2 text-text-low hover:text-text-hi"
          >
            {revealed ? <EyeOff /> : <Eye />}
          </Button>
        </div>
      </Field>

      {login.isError ? (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-overdue/30 bg-overdue-soft px-3 py-2.5 text-[12px] leading-snug text-overdue"
        >
          <TriangleAlert className="mt-px size-3.5 shrink-0" />
          {getErrorMessage(login.error)}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={login.isPending}
        className="m-brand-fill h-11 w-full text-[13px] tracking-wide"
      >
        {login.isPending ? (
          <>
            <Loader2 className="animate-spin" />
            Signing in
          </>
        ) : (
          <>
            Sign in
            <ArrowRight className="transition-transform group-hover/button:translate-x-0.5" />
          </>
        )}
      </Button>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5 sm:space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={id}
          className="font-mono text-[10px] tracking-[0.18em] text-text-mid uppercase"
        >
          {label}
        </label>
        {hint ? (
          <span className="font-mono text-[9px] tracking-[0.14em] text-awaiting uppercase">
            {hint}
          </span>
        ) : null}
      </div>
      {children}
      {error ? <p className="text-[12px] text-overdue">{error}</p> : null}
    </div>
  );
}
