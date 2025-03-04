'use client'

import type { Note, Post } from 'content-collections'
import { allNotes, allPosts } from 'content-collections'
import { ArrowRight, ArrowUpRightIcon, NotebookPen, PencilIcon } from 'lucide-react'
import { motion, useInView } from 'motion/react'
import Link from 'next/link'

import { useRef } from 'react'
import { formatDate } from '~/utils'
import TimelineList from '../timeline-list'

const variants = {
  initial: {
    y: 40,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
  },
}

function LatestNews() {
  const projectsRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(projectsRef, { once: true, margin: '-100px' })
  const filteredPosts = allPosts
    .toSorted((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    .slice(0, 5)
  const filteredNotes = allNotes
    .toSorted((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    .slice(0, 5)

  return (
    <motion.div
      initial="initial"
      animate={isInView ? 'animate' : 'initial'}
      variants={variants}
      ref={projectsRef}
      transition={{
        duration: 0.5,
      }}
      className="my-24"
    >
      <motion.h2
        className="text-center text-3xl font-semibold"
        initial={{
          y: 30,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.3,
        }}
      >
        最新动态
      </motion.h2>
      <motion.div
        className="mt-12 grid gap-10 sm:gap-4 md:grid-cols-13"
        initial={{
          y: 40,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.3,
        }}
      >
        <Card articles={filteredPosts} />
        <div className=" hidden sm:flex justify-center ">
          <div className="h-full w-0.5 rounded-full bg-gray-500/20" />
        </div>
        <Card color text="手记" articles={filteredNotes} />
      </motion.div>
    </motion.div>
  )
}

interface CardProps {
  text?: string
  color?: boolean
  articles: Post[] | Note[]
}

function Card(props: CardProps) {
  const { articles, text = '文章', color = false } = props
  return (
    <div className="col-span-6 flex flex-col gap-4 px-2">
      <div className="flex items-center justify-between px-4 pl-0">
        <div className="flex items-center gap-3">
          {text === '文章' ? <PencilIcon className="size-[18px]" /> : <NotebookPen className="size-[18px]" />}
          <h2>{text}</h2>
        </div>
        <ArrowUpRightIcon className="size-[18px] opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <TimelineList className={color ? 'shiro-timeline-yellow' : ''}>
        {articles.map(child => {
          const date = new Date(child.date)

          return (
            <li
              key={child.slug}
              className="flex min-w-0 items-center justify-between leading-loose after:bg-[]"
            >
              <Link
                href={`/${child.type}/${child.slug}`}
                className="min-w-0 truncate"
              >
                {child.title}
              </Link>
              <span className="meta ml-2">
                {formatDate(date)}
              </span>
            </li>
          )
        })}
      </TimelineList>
      <div className="flex items-center justify-end gap-2  dark:text-gray-400 hover:text-[#FF6467] dark:hover:text-[#FF6467] transition-colors duration-100 text-xs">
        <ArrowRight className="size-3" />
        <Link
          href={text === '文章' ? '/posts' : '/notes'}
          className="rounded-xl"
        >
          查看所有
          {text}
        </Link>
      </div>
    </div>
  )
}

export default LatestNews
