import AboutMe from '~/components/home/about-me'
import GetInTouch from '~/components/home/get-in-touch'
import Hero from '~/components/home/hero'
import LatestNews from '~/components/home/latest-news'
import SelectedProjects from '~/components/home/selected-projects'

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
