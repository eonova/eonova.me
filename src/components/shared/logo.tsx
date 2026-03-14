import Image from 'next/image'
import { cn } from '~/utils'

function Logo({ className, style }: { className?: string, style?: React.CSSProperties }) {
  return (
    <div className={cn('flex flex-col gap-4 md:flex-row', className)} style={{ display: 'flex', ...style }}>
      <div className="flex w-full items-center justify-center rounded-lg" style={{ display: 'flex' }}>
        <Image src="/favicon/apple-touch-icon.png" alt="alt" width={48} height={48} />
      </div>
    </div>
  )
}

export default Logo
