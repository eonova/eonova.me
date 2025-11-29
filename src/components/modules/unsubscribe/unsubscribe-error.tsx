import { BellOffIcon } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '~/components/base/card'

function UnsubscribeError() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="space-y-4 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-accent">
          <BellOffIcon className="size-8" />
        </div>
        <div className="space-y-4">
          <CardTitle className="text-2xl text-balance">无效退订链接</CardTitle>
          <CardDescription className="text-base text-pretty text-muted-foreground">
            请检查您的退订链接是否正确。如果问题持续存在，请联系我们。
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  )
}

export default UnsubscribeError
