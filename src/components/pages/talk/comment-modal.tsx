import type { Talk } from './box'
import { Suspense } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/base'
import Comments from '~/components/modules/comment-section/comment-section'
import { useTalkStore } from '~/stores/talk'
import { cn } from '~/utils'

interface CommentDialogProps {
  className?: string
  isVisible: boolean
  talk: Talk
}

const CommentModal: React.FC<CommentDialogProps> = ({
  className,
  talk,
  isVisible,
}) => {
  const { setIsOpenCommentDialog } = useTalkStore()
  return (
    <Dialog modal={false} open={isVisible} onOpenChange={setIsOpenCommentDialog}>
      <DialogContent className={cn('max-h-[70vh] bg-background/80 max-w-5xl! overflow-x-hidden overflow-y-auto backdrop-blur-[10px] md:w-[550px] lg:w-[600px] xl:w-[800px]', className)}>
        <DialogHeader>
          <DialogTitle>评论</DialogTitle>
        </DialogHeader>
        <div>
          <div className="mb-5 p-2">
            {talk.content}
          </div>
          <Suspense>
            <Comments slug={talk.id} contentType="talks" />
          </Suspense>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CommentModal
