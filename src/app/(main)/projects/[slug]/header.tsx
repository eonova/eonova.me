'use client'

import type { Project } from 'mdx/generated'

import { motion } from 'framer-motion'
import { ArrowUpRightIcon } from 'lucide-react'

import Link from 'next/link'
import { buttonVariants } from '~/components/base/button'
import { GITHUB_USERNAME } from '~/config/constants'
import { cn } from '~/lib/utils'

const animation = {
  hide: {
    x: -30,
    opacity: 0,
  },
  show: {
    x: 0,
    opacity: 1,
  },
}

type HeaderProps = Project

function Header(props: HeaderProps) {
  const { name, description, homepage, github } = props

  const repo = github.split('/').pop()

  return (
    <div className="space-y-8 pt-10">
      <motion.div
        className="flex items-center gap-3"
        initial={animation.hide}
        animate={animation.show}
      >
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold">{name}</h1>
          <h2 className="text-muted-foreground">{description}</h2>
        </div>
      </motion.div>
      <motion.div
        className="flex flex-col items-start gap-2 sm:flex-row sm:gap-4"
        initial={animation.hide}
        animate={animation.show}
        transition={{ delay: 0.1 }}
      >
        {homepage
          ? (
            <Link href={homepage} className={cn(buttonVariants(), 'group')}>
              前往网站
              <ArrowUpRightIcon className="ml-2 size-5 transition-transform group-hover:-rotate-12" />
            </Link>
          )
          : null}
        <Link href={github} className={cn(buttonVariants(), 'group')}>
          {GITHUB_USERNAME}
          /
          {repo}
          <ArrowUpRightIcon className="ml-2 size-5 transition-transform group-hover:-rotate-12" />
        </Link>
      </motion.div>
    </div>
  )
}
export default Header
