'use client'

import { Link, linkVariants } from '~/components/base/link'
import { usePostContext } from '~/contexts/post'
import { useFormattedDate } from '~/hooks/use-formatted-date'

function editURL(slug: string) {
  return `https://github.com/ileostar/leospark/blob/main/apps/web/src/content/blog/${slug}.mdx?plain=1`
}

function Footer() {
  const { slug, modifiedTime } = usePostContext()

  const formattedDate = useFormattedDate(modifiedTime, {
    format: 'MMMM D, YYYY',
    loading: '...',
  })

  return (
    <div className="my-8 flex w-full items-center justify-between py-4 text-sm">
      <Link href={editURL(slug)} className={linkVariants({ variant: 'muted' })}>
        在 GitHub 上编辑
      </Link>
      <div className="text-muted-foreground">
        最后更新于
        {' '}
        {formattedDate}
      </div>
    </div>
  )
}

export default Footer
