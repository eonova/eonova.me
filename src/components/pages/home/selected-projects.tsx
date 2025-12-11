'use client'

import { ArrowUpRightIcon, LightbulbIcon } from 'lucide-react'
import { motion, useInView } from 'motion/react'
import Link from 'next/link'
import { useRef } from 'react'
import { BlurImage } from '~/components/base/blur-image'
import { buttonVariants } from '~/components/base/button'
import { cn } from '~/utils'

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

interface ProjectData {
  slug: string
  name: string
  description: string
}

interface CardProps {
  project: ProjectData
}

interface SelectedProjectsProps {
  projects: ProjectData[]
}

function SelectedProjects({ projects }: SelectedProjectsProps) {
  console.log('===========SelectedProjects================', projects)
  const projectsRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(projectsRef, { once: true, margin: '-100px' })

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
        {projects.map(project => (
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
        width={600}
        height={342}
        src={`/images/projects/${slug}.png`}
        alt={description}
        className="rounded-lg"
        imageClassName="w-full aspect-7/4"
        blurGlass
      />
      <div className="absolute bottom-6 left-7 z-40 flex flex-col transition-[left] ease-out group-hover:left-[30px]">
        <h3 className="text-2xl font-semibold text-white">{name}</h3>
        <p className="dark:text-muted-foreground mt-2 text-zinc-100">{description}</p>
      </div>
    </Link>
  )
}

export default SelectedProjects
