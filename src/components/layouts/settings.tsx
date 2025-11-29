'use client'

import { toast } from 'sonner'
import { Card } from '~/components/base/card'
import { Label } from '~/components/base/label'
import { Skeleton } from '~/components/base/skeleton'
import { Switch } from '~/components/base/switch'

import { useReplyPrefs, useUpdateReplyPrefs } from '~/hooks/queries/unsubscribe.query'

function Settings() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">通知设置</h2>
      <Card className="p-4 sm:p-6">
        <ReplyNotificationSettings />
      </Card>
    </div>
  )
}

function ReplyNotificationSettings() {
  const { isSuccess, isLoading, isError, data } = useReplyPrefs()
  const { mutate: updatePrefs, isPending: isUpdating } = useUpdateReplyPrefs(() => {
    toast.success('设置已保存')
  })

  const handleUpdatePrefs = (isEnabled: boolean) => {
    if (isUpdating)
      return
    updatePrefs({ isEnabled })
  }

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label className="text-base">回复通知</Label>
        <p className="text-muted-foreground">收到回复时是否发送通知</p>
      </div>
      {isLoading && <Skeleton className="h-6 w-10" />}
      {isError && <p className="text-sm">加载失败</p>}
      {isSuccess && <Switch checked={data.isEnabled} onCheckedChange={handleUpdatePrefs} disabled={isUpdating} />}
    </div>
  )
}

export default Settings
