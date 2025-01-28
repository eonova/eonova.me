import { Clock } from 'lucide-react'
import { calculateCodingYears } from '~/utils/calc-coding-age'

function FavoriteFramework() {
  return (
    <div className="shadow-feature-card dark:shadow-feature-card-dark flex flex-col gap-6 rounded-xl p-4 lg:p-6">
      <div className="flex items-center gap-2">
        <Clock className="size-[18px]" />
        <h2 className="text-sm font-light">码龄</h2>
      </div>
      <div className="font-title flex grow items-center justify-center text-4xl font-semibold">
        {calculateCodingYears()}
      </div>
    </div>
  )
}

export default FavoriteFramework
