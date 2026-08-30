import { useContext } from 'react';
import { createPortal } from 'react-dom';

import { PageTitleSlotContext } from '@/components/shared/page-title-slot';
import { cn } from '@/lib/utils';

type Props = {
  title: string;
  description?: string;
  /** Primary + secondary actions, rendered right-aligned on desktop and
   *  wrapped underneath on narrow screens. */
  actions?: React.ReactNode;
  className?: string;
};

export function PageHeader({ title, description, actions, className }: Props) {
  /** Non-null only on a landing page, where the header bar has room to spare. */
  const slot = useContext(PageTitleSlotContext);

  const content = (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between',
        // Hoisted into the bar, the bar owns the spacing below; inline, this does.
        slot ? 'min-w-0 flex-1' : 'pb-6',
        className
      )}
    >
      <div className="min-w-0">
        <h1 className="display-title text-[1.5rem] leading-[1.15] text-text-hi">{title}</h1>
        {description ? (
          <p className="mt-1.5 max-w-[70ch] text-[13px] leading-relaxed text-text-mid">
            {description}
          </p>
        ) : null}
      </div>

      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );

  return slot ? createPortal(content, slot) : content;
}
