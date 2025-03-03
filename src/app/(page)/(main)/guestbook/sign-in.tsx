'use client'

import { Button } from '~/components/base'

import { useDialogsStore } from '~/stores/dialogs'

function SignIn() {
  const { setIsSignInOpen } = useDialogsStore()

  return (
    <>
      <Button
        className="dark:text-foreground bg-linear-to-br inline-block from-[#fcd34d] via-[#ef4444] to-[#ec4899] font-extrabold"
        onClick={() => setIsSignInOpen(true)}
      >
        登入
      </Button>
      <span className="ml-2">以留下评论</span>
    </>
  )
}

export default SignIn
