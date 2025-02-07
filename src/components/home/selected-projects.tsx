'use client'

import type { Project } from 'mdx/generated'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRightIcon, LightbulbIcon } from 'lucide-react'
import { allProjects } from 'mdx/generated'
import Link from 'next/link'
import { useRef } from 'react'
import { cn } from '~/lib/utils'
import { BlurImage } from '../base/blur-image'
import { buttonVariants } from '../base/button'

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

interface CardProps {
  project: Project
}

function SelectedProjects() {
  const projectsRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(projectsRef, { once: true, margin: '-100px' })
  const filteredProjects = allProjects.filter(
    project => project.selected,
  )

  return (
    <motion.div
      initial="initial"
      animate={isInView ? 'animate' : 'initial'}
      variants={variants}
      ref={projectsRef}
      transition={{
        duration: 0.5,
      }}
      className="relative my-24"
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
        精选项目
      </motion.h2>
      <motion.div
        className="mt-12 grid gap-4 md:grid-cols-2"
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
        {filteredProjects.map(project => (
          <Card key={project.slug} project={project} />
        ))}
      </motion.div>
      <div className="my-8 flex items-center justify-center">
        <Link
          href="/projects"
          className={cn(
            buttonVariants({
              variant: 'outline',
            }),
            'rounded-xl',
          )}
        >
          查看所有项目
        </Link>
      </div>
    </motion.div>
  )
}

function Card(props: CardProps) {
  const { project } = props
  const { slug, name, description } = project

  return (
    <Link
      key={slug}
      href={`/projects/${slug}`}
      className="shadow-feature-card dark:shadow-feature-card-dark group relative rounded-xl p-2"
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <LightbulbIcon className="size-[18px]" />
          <h2>项目</h2>
        </div>
        <ArrowUpRightIcon className="size-[18px] opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <BlurImage
        width={1280}
        height={832}
        src={`/images/projects/${slug}.png`}
        alt={description}
        className="rounded-lg"
      />
      <div className="absolute bottom-6 left-7 flex flex-col transition-[left] ease-out group-hover:left-[30px]">
        <h3 className="text-2xl font-semibold text-white">{name}</h3>
        <p className="dark:text-muted-foreground mt-2 text-zinc-100">{description}</p>
      </div>
    </Link>
  )
}

export default SelectedProjects
