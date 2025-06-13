import { cn } from '~/utils/cn'

export type ShelfType = 'wishlist' | 'progress' | 'complete'

interface NeodbTabsProps {
  className?: string
  activeType: ShelfType
  setActiveType: (type: ShelfType) => void
}

const NeodbTabs: React.FC<Readonly<NeodbTabsProps>> = ({ className, activeType, setActiveType }) => {
  const modes = ['wishlist', 'progress', 'complete']
  const MODE_LABELS = {
    wishlist: '想看',
    progress: '在看',
    complete: '看过',
  }

  return (
    <>
      {/* 模式切换按钮 */}
      <div className={cn('flex gap-2 mb-6 overflow-x-auto pb-3 scrollbar-hide', className)}>
        {modes.map(mode => (
          <button
            key={mode}
            type="button"
            onClick={() => setActiveType(mode as ShelfType)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${activeType === mode
            ? 'bg-pink-500 text-white shadow-md'
            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          >
            {MODE_LABELS[mode as keyof typeof MODE_LABELS] ?? ''}
          </button>
        ))}
      </div>
    </>
  )
}

export default NeodbTabs
