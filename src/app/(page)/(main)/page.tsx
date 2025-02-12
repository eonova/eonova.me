import AboutMe from '~/components/home/about-me'
import GetInTouch from '~/components/home/get-in-touch'
import Hero from '~/components/home/hero'
import LatestArticles from '~/components/home/latest-articles'
import SelectedProjects from '~/components/home/selected-projects'

export default function Home() {
  return (
    <>
      <Hero />
      <SelectedProjects />
      <AboutMe />
      <LatestArticles />
      <GetInTouch />
    </>
  )
}
