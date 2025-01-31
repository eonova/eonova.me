import { useEffect, useState } from 'react'

function useIsScroll(threshold = 100) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const changeBackground = () => {
      if (window.scrollY > threshold) {
        setIsScrolled(true)
      }
      else {
        setIsScrolled(false)
      }
    }

    document.addEventListener('scroll', changeBackground)

    return () => {
      document.removeEventListener('scroll', changeBackground)
    }
  }, [threshold])

  return isScrolled
}

export default useIsScroll
