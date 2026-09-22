import { assetPath, cn } from '@/lib/utils'

export function BrandMark ({
  size = 40,
  className,
  alt = ''
}: {
  size?: number
  className?: string
  alt?: string
}) {
  const decorative = alt === ''
  return (
    <span
      className={cn('inline-flex shrink-0 items-center justify-center overflow-hidden', className)}
      style={{ width: size, height: size }}
      aria-hidden={decorative || undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- SVG brand mark */}
      <img src={assetPath('/images/logo.svg')} alt={alt} width={size} height={size} className="h-full w-full object-contain" />
    </span>
  )
}
