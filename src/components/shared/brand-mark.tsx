import { hrmsIcon, hrmsIconDark, hrmsLogo, hrmsLogoDark } from '@/assets';
import { APP_NAME } from '@/constants';
import { cn } from '@/lib/utils';

type Props = {
  /** `icon` is the mark alone, for the collapsed rail and any square slot. */
  variant?: 'logo' | 'icon';
  className?: string;
};

const SOURCES = {
  logo: { light: hrmsLogo, dark: hrmsLogoDark },
  icon: { light: hrmsIcon, dark: hrmsIconDark },
} as const;

/** Both variants render and CSS picks one, rather than swapping `src` on a
 *  theme hook. Reading the theme in JS costs a re-render the CSS variables do
 *  not wait for, and the incoming file is only fetched once the toggle has
 *  already fired, so the mark lands visibly after the rest of the theme. This
 *  way both are decoded at load and the swap is the same instant as every
 *  other token. `display: none` also keeps the inactive one out of the
 *  accessibility tree, so the name is announced once. */
export function BrandMark({ variant = 'logo', className }: Props) {
  const src = SOURCES[variant];

  return (
    <>
      <img
        src={src.light}
        alt={APP_NAME}
        className={cn('object-contain dark:hidden', className)}
      />
      <img
        src={src.dark}
        alt={APP_NAME}
        className={cn('hidden object-contain dark:block', className)}
      />
    </>
  );
}
