'use client'

import type { Project } from 'content-collections'
import Link from 'next/link'
import { BlurImage } from './base/blur-image'

type ProjectCardProps = Project
interface ProjectCardsProps {
  projects: Project[]
}

function ProjectCards(props: ProjectCardsProps) {
  const { projects } = props

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {projects.map(project => (
        <ProjectCard key={project.slug} {...project} />
      ))}
    </div>
  )
}

function ProjectCard(props: ProjectCardProps) {
  const { name, description, techstack, slug } = props

  return (
    <Link
      href={`/projects/${slug}`}
      className="shadow-feature-card dark:shadow-feature-card-dark group rounded-xl px-2 py-4"
    >
      <BlurImage
        src={`/images/projects/${slug}.png`}
        width={1280}
        height={832}
        imageClassName="group-hover:scale-105"
        alt={name}
        className="rounded-lg"
      />
      <div className="flex-1 px-2 py-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">{name}</h2>
          <div className="text-muted-foreground">{description}</div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {techstack.map((tech) => {
            return (
              <div
                key={tech}
                className="rounded-full border bg-zinc-50 px-3 py-2 text-xs leading-4 dark:bg-zinc-900"
              >
                {tech}
              </div>
            )
          })}
        </div>
      </div>
    </Link>
  )
}

export default ProjectCards
