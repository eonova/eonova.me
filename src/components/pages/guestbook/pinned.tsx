import { MessageCircleIcon, PinIcon } from 'lucide-react'

function Pinned() {
  return (
    <div className="relative overflow-hidden rounded-2xl border text-card-foreground">
      <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-purple-50 to-rose-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-rose-900/10" />

      <div className="absolute top-6 right-6">
        <PinIcon className="size-7 rotate-45 text-muted-foreground" />
      </div>

      <div className="relative p-6">
        <div className="flex items-start gap-4">
          <div className="hidden size-14 shrink-0 items-center justify-center rounded-full bg-muted sm:flex">
            <MessageCircleIcon className="size-7 text-primary" />
          </div>
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">嗨！ 👋</h2>
            <p className="text-md text-muted-foreground">感谢您造访我的网站。如果您有时间，我很乐意听取您对我作品的看法。请使用您的账户登入以留下评论。谢谢！</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pinned
