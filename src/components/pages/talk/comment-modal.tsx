import { Suspense } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/base'
import Comments from '~/components/modules/comments/comments'
import { useTalkStore } from '~/stores/talk'

interface CommentDialogProps {
  className?: string
  isVisible: boolean
}

const CommentModal: React.FC<CommentDialogProps> = ({ isVisible }) => {
  const { setIsOpenCommentDialog } = useTalkStore()
  return (
    <Dialog modal={false} open={isVisible} onOpenChange={setIsOpenCommentDialog}>
      <DialogContent className="bg-background/80 !max-w-5xl overflow-x-hidden overflow-y-auto backdrop-blur-[10px] md:w-[550px] lg:w-[600px] xl:w-[800px]">
        <DialogHeader>
          <DialogTitle>评论</DialogTitle>
        </DialogHeader>
        <div>
          <div className="mb-5">🚧 施工 ing</div>
          <Suspense>
            <Comments slug="demo" />
          </Suspense>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CommentModal
