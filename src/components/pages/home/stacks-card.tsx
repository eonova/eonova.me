'use client'

import {
  SiApifox,
  SiBun,
  SiCloudflare,
  SiCss3,
  SiDiscord,
  SiDrizzle,
  SiFigma,
  SiFirebase,
  SiGit,
  SiGithub,
  SiHtml5,
  SiIconify,
  SiJavascript,
  SiMarkdown,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiOllama,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRenovate,
  SiTailwindcss,
  SiTampermonkey,
  SiThreedotjs,
  SiTypescript,
  SiVite,
  SiVitest,
  SiVuedotjs,
  SiWakatime,
} from '@icons-pack/react-simple-icons'
import { ZapIcon } from 'lucide-react'
import { Marquee } from '~/components/base/marquee'

function StacksCard() {
  return (
    <div className="shadow-feature-card dark:shadow-feature-card-dark flex h-60 flex-col gap-2 overflow-hidden rounded-xl p-4 lg:p-6">
      <div className="flex items-center gap-2">
        <ZapIcon className="size-[18px]" />
        <h2 className="text-sm font-light">技术栈</h2>
      </div>
      <Marquee gap="20px" className="py-4" fade pauseOnHover>
        <SiHtml5 className="size-10" />
        <SiCss3 className="size-10" />
        <SiJavascript className="size-10" />
        <SiTypescript className="size-10" />
        <SiFigma className="size-10" />
        <SiTailwindcss className="size-10" />
        <SiNextdotjs className="size-10" />
        <SiVuedotjs className="size-10" />
        <SiReact className="size-10" />
        <SiPython className="size-10" />
        <SiPostgresql className="size-10" />
        <SiThreedotjs className="size-10" />
        <SiRenovate className="size-10" />
        <SiApifox className="size-10" />
        <SiIconify className="size-10" />
      </Marquee>
      <Marquee gap="20px" className="py-4" reverse fade pauseOnHover>
        <SiBun className="size-10" />
        <SiMysql className="size-10" />
        <SiFirebase className="size-10" />
        <SiGit className="size-10" />
        <SiVite className="size-10" />
        <SiDrizzle className="size-10" />
        <SiCloudflare className="size-10" />
        <SiMarkdown className="size-10" />
        <SiVitest className="size-10" />
        <SiNodedotjs className="size-10" />
        <SiGithub className="size-10" />
        <SiDiscord className="size-10" />
        <SiWakatime className="size-10" />
        <SiOllama className="size-10" />
        <SiTampermonkey className="size-10" />
      </Marquee>
    </div>
  )
}

export default StacksCard
