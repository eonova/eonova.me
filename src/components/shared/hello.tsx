'use client'

import { useEffect } from 'react'

function Hello() {
  useEffect(() => {
    console.log(
      `\
%cHey there, awesome developer!

If you're digging this code, check out my GitHub:

https://github.com/eonova/eonova.me

and give it a star ⭐
`,
      'font-size: 16px',
    )
  }, [])

  return null
}

export default Hello
