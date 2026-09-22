import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]',
  {
    variants: {
      variant: {
        default:
          'bg-linear-to-r from-brand-pink via-brand-magenta to-brand-pink text-white shadow-sm hover:shadow-md',
        outline: 'border border-neutral-200 bg-white hover:border-brand-lilac hover:bg-neutral-50 hover:text-brand-magenta',
        selected: 'border border-brand-blush bg-brand-blush font-semibold text-brand-magenta hover:bg-brand-blush',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3',
        lg: 'h-10 px-6'
      }
    },
    defaultVariants: { variant: 'default', size: 'default' }
  }
)

function Button ({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button }
