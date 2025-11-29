'use client'

import { Button } from '~/components/base'

import { useSignInDialog } from '~/hooks/use-sign-in-dialog'

function SignIn() {
  const { setOpen } = useSignInDialog()

  return (
    <>
      <Button
        className="dark:text-foreground inline-block bg-linear-to-br from-[#fcd34d] via-[#ef4444] to-[#ec4899] font-extrabold"
        onClick={() => setOpen(true)}
      >
        登入
      </Button>
      <span className="ml-2">以留下评论</span>
    </>
  )
}

export default SignIn
