import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import type { ResponsiveSpan, SpanValue } from '../types';

interface Props {
    label: string;
    span?: SpanValue | ResponsiveSpan;
    children: ReactNode;
}

function getSpanClasses(span: SpanValue | ResponsiveSpan = 'half'): string {
    if (typeof span === 'string') {
        return span === 'full' ? 'col-span-2' : 'col-span-1';
    }
    const { mobile = 'full', desktop = 'half' } = span;
    const mobileClass = mobile === 'full' ? 'col-span-2' : 'col-span-1';
    const desktopClass = desktop === 'full' ? 'md:col-span-2' : 'md:col-span-1';
    return `${mobileClass} ${desktopClass}`;
}

export function FilterField({ label, span = 'half', children }: Props) {
    return (
        <div className={cn(getSpanClasses(span))}>
            <label className="mb-1 block text-sm font-medium">{label}</label>
            {children}
        </div>
    );
}
