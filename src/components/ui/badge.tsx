import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/** Variant names and the alias table live in `@/lib/badge-variant` so features
 *  can resolve a lookup's `badgeVariant` string without importing a component. */
const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded-full border px-2 py-0.5 text-[11px] leading-4 font-medium whitespace-nowrap transition-colors [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3",
  {
    variants: {
      variant: {
        default: "border-brand-line bg-brand-soft text-brand",
        secondary: "border-hairline bg-surface-3 text-text-mid",
        outline: "border-hairline-strong bg-transparent text-text-mid",
        settled: "border-transparent bg-settled-soft text-settled",
        awaiting: "border-transparent bg-awaiting-soft text-awaiting",
        overdue: "border-transparent bg-overdue-soft text-overdue",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span data-slot="badge" className={cn(badgeVariants({ variant, className }))} {...props} />
  )
}

export { Badge }
