import dynamic from 'next/dynamic'

interface BentoProps {

}

const IntroFive = dynamic(() => import('~/components/pages/about/bento/intro-five'))
const IntroFour = dynamic(() => import('~/components/pages/about/bento/intro-four'))
const IntroOne = dynamic(() => import('~/components/pages/about/bento/intro-one'))
const IntroSix = dynamic(() => import('~/components/pages/about/bento/intro-six'))
const IntroThree = dynamic(() => import('~/components/pages/about/bento/intro-three'))
const IntroTwo = dynamic(() => import('~/components/pages/about/bento/intro-two'))
const VelocityScroll = dynamic(() => import('~/components/pages/about/scrollbasedvelocity').then(mod => mod.VelocityScroll))

const Bento: React.FC<BentoProps> = () => {
  return (
    <ul className="relative w-full grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-5 mt-5">
      <IntroOne />
      <IntroTwo />
      <IntroThree />
      <IntroFour />
      <IntroFive />
      <VelocityScroll
        className="font-sans text-center text-3xl font-bold  text-black dark:text-white md:text-4xl"
        text="KEEP GOING EONOVA.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
        default_velocity={5}
      />
      <IntroSix />
    </ul>
  )
}

export default Bento
