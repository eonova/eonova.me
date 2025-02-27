'use client'

import { Link, linkVariants } from '~/components/base/link'
import { useNoteContext } from '~/contexts/note'
import { useFormattedDate } from '~/hooks/use-formatted-date'

function editURL(slug: string) {
  return `https://github.com/ileostar/leospark/blob/main/data/notes/${slug}.md?plain=1`
}

function Footer() {
  const { title, modifiedTime } = useNoteContext()

  const formattedDate = useFormattedDate(modifiedTime, {
    format: 'MMMM D, YYYY',
    loading: '...',
  })

  return (
    <div className="my-2 flex w-full items-center justify-between py-2 text-sm">
      <Link href={editURL(title)} className={linkVariants({ variant: 'muted' })}>
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
