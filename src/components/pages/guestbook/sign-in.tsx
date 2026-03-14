'use client'

import { Button } from '~/components/base/button'
import { useSignInDialog } from '~/hooks/use-sign-in-dialog'

function SignIn() {
  const { openDialog } = useSignInDialog()

  return (
    <>
      <Button
        className="inline-block bg-linear-to-br from-[#fcd34d] via-[#ef4444] to-[#ec4899] font-extrabold dark:text-foreground"
        onClick={openDialog}
      >
        登入
      </Button>
      <span className="ml-2">以留下评论</span>
    </>
  )
}

export default SignIn
