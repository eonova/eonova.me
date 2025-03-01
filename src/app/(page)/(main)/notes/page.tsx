import { allNotes } from 'content-collections'
import { redirect } from 'next/navigation'

export default async function NotesPage() {
  // 服务端排序避免客户端计算
  const sortedNotes = [...allNotes].sort((a, b) =>
    new Date(b.createTime).getTime() - new Date(a.createTime).getTime(),
  )

  if (!sortedNotes.length) {
    redirect('/404') // 处理空数据
  }

  redirect(`/notes/${sortedNotes[0].slug}`)
}
