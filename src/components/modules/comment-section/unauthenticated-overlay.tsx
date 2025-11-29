import { Button } from '~/components/base/button'

import { useSignInDialog } from '~/hooks/use-sign-in-dialog'

function UnauthenticatedOverlay() {
  const { openDialog } = useSignInDialog()

  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/5 backdrop-blur-[0.8px]">
      <Button size="sm" onClick={openDialog}>
        登录
      </Button>
    </div>
  )
}

export default UnauthenticatedOverlay
