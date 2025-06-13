import { cn } from '~/utils/cn'

interface CategoriesTabsProps {
  className?: string
  categories: { label: string, value: string }[]
  activeCategory: string
  setActiveCategory: (category: string) => void
}

const CategoriesTabs: React.FC<Readonly<CategoriesTabsProps>> = ({ className, categories, activeCategory, setActiveCategory }) => {
  return (
    <div className={cn('flex gap-8 font-world text-base md:text-xl items-center font-weight-400 px-3', className)}>
      {categories.map(cat => (
        <div
          key={cat.value}
          onClick={() => setActiveCategory(cat.value)}
          className={cn(
            'relative cursor-pointer transition-colors',
            activeCategory === cat.value ? 'text-pink-500 font-bold' : 'text-gray-500',
          )}
        >
          {cat.label}
          {activeCategory === cat.value && (
            <div
              className="absolute bottom-[-8] left-0 right-0 h-0.75 bg-pink-500 rounded-sm"
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default CategoriesTabs
