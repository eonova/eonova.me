import React, { useEffect } from 'react'
import '~/styles/page/progress.css'

const PageProgress: React.FC = () => {
  useEffect(() => {
    const winHeight = window.innerHeight
    const docHeight = document.documentElement.scrollHeight
    const progressBar = document.getElementById(
      'content_progress',
    ) as HTMLProgressElement
    if (progressBar) {
      progressBar.max = docHeight - winHeight
      progressBar.value = window.scrollY

      const handleScroll = () => {
        progressBar.max
          = document.documentElement.scrollHeight - window.innerHeight
        progressBar.value = window.scrollY
      }

      document.addEventListener('scroll', handleScroll)
      return () => {
        document.removeEventListener('scroll', handleScroll)
      }
    }
    return undefined
  }, [])

  return <progress id="content_progress" value="0"></progress>
}

export default PageProgress
