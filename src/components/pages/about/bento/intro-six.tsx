import { APPOINT_END_DATE, APPOINT_START_DATE } from '~/config/about-profiles'
import BackgroundFont from '../../../shared/background-font'
import AppointProgress from '../appoint-progress'
import IntroCard from './intro-card'

const IntroSix: React.FC = () => {
  return (
    <IntroCard
      className="col-span-1 h-80 backdrop-blur-xs md:col-span-4 lg:col-span-8 dark:bg-[#1d1e22]/30"
      subheading="约定"
      title="六年之约"
      desc="与jack叔叔的约定"
    >
      <div className="mt-10 flex flex-col gap-3">
        <AppointProgress
          className="h-12"
          startDate={new Date(APPOINT_START_DATE)}
          endDate={new Date(APPOINT_END_DATE)}
        />
        <ul className="flex w-full justify-between">
          <li>{APPOINT_START_DATE}</li>
          <li>{APPOINT_END_DATE}</li>
        </ul>
      </div>
      <BackgroundFont className="absolute bottom-0 left-20 z-[-1] overflow-hidden text-8xl text-black/10 sm:left-80 sm:text-[130px] dark:text-white/10">
        APPOINT
      </BackgroundFont>
    </IntroCard>
  )
}

export default IntroSix
