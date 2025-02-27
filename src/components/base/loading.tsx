import { cn } from '~/lib/utils'

export type LoadingProps = {
  loadingText?: string
  useDefaultLoadingText?: boolean
  className?: string
}

const defaultLoadingText = '别着急，坐和放宽'
export const Loading: React.FC<LoadingProps> = ({
  loadingText,
  className,
  useDefaultLoadingText = false,
}) => {
  const nextLoadingText = useDefaultLoadingText
    ? defaultLoadingText
    : loadingText
  return (
    <div
      data-hide-print
      className={cn('my-20 flex flex-col center', className)}
    >
      <span className="loading loading-ball loading-lg" />
      {!!nextLoadingText && (
        <span className="mt-6 block">{nextLoadingText}</span>
      )}
    </div>
  )
}

export const FullPageLoading = () => (
  <Loading useDefaultLoadingText className="h-[calc(100vh-6.5rem-10rem)]" />
)
