import AboutMe from '~/components/pages/home/about-me'
import GetInTouch from '~/components/pages/home/get-in-touch'
import Hero from '~/components/pages/home/hero'
import LatestNews from '~/components/pages/home/latest-news'
import SelectedProjects from '~/components/pages/home/selected-projects'

export default function Home() {
  return (
    <>
      <Hero />
      <LatestNews />
      <SelectedProjects />
      <AboutMe />
      <GetInTouch />
    </>
  )
}

export const dynamic = 'force-static'
