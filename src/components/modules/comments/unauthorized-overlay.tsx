import { Button } from '~/components/base/button'
import { useDialogsStore } from '~/stores/dialogs'

function UnauthorizedOverlay() {
  const dialogStore = useDialogsStore()

  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/5 backdrop-blur-[0.8px]">
      <Button
        size="sm"
        onClick={() => {
          dialogStore.setIsSignInOpen(true)
        }}
      >
        登录
      </Button>
    </div>
  )
}

export default UnauthorizedOverlay
