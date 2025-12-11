'use client'

import { Link, linkVariants } from '~/components/base/link'
import { Donate } from '~/components/shared/donate'
import { usePostContext } from '~/contexts/post'
import { useFormattedDate } from '~/hooks/use-formatted-date'

function editURL(slug: string) {
  return `https://github.com/eonova/eonova.me/blob/main/data/posts/${slug}.md?plain=1`
}

function Footer() {
  const { slug, modifiedTime } = usePostContext()

  const formattedDate = useFormattedDate(modifiedTime ?? '', {
    format: 'MMMM D, YYYY',
    loading: '...',
  })

  return (
    <div className="my-8 flex w-full items-center justify-between py-4 text-sm">
      <div className="flex items-center gap-4">
        <Link href={editURL(slug)} className={linkVariants({ variant: 'muted' })}>
          在 GitHub 上编辑
        </Link>
        <Donate />
      </div>
      <div className="text-muted-foreground">
        最后更新于
        {formattedDate}
      </div>
    </div>
  )
}

export default Footer
