import { Button } from '~/components/base/button'
import { Card } from '~/components/base/card'
import { Skeleton } from '~/components/base/skeleton'

function ProfileSkeleton() {
  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-muted-foreground">头像</span>
          <Skeleton className="size-24 rounded-full" />
        </div>
        <Button variant="outline">更新头像</Button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-muted-foreground">显示名称</span>
          <Skeleton className="h-6 w-20" />
        </div>
        <Button variant="outline">编辑名称</Button>
      </div>
      <div>
        <div className="flex flex-col gap-2">
          <span className="text-muted-foreground">邮箱</span>
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
      <div>
        <div className="flex flex-col gap-2">
          <span className="text-muted-foreground">账户已创建</span>
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </Card>
  )
}

export default ProfileSkeleton
