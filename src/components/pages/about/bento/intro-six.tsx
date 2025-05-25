import { APPOINT_END_DATE, APPOINT_START_DATE } from '~/config/about-profiles'
import BackgroundFont from '../../../shared/background-font'
import AppointProgress from '../appoint-progress'
import IntroCard from './intro-card'

const IntroSix: React.FC = () => {
  return (
    <IntroCard
      className="h-80 col-span-1 md:col-span-4 lg:col-span-8 dark:bg-[#1d1e22]/30 backdrop-blur-xs"
      subheading="约定"
      title="六年之约"
      desc="与jack叔叔的约定"
    >
      <div className="mt-10 flex gap-3 flex-col">
        <AppointProgress className="h-12" startDate={new Date(APPOINT_START_DATE)} endDate={new Date(APPOINT_END_DATE)} />
        <ul className="w-full flex justify-between">
          <li>
            {APPOINT_START_DATE}
          </li>
          <li>
            {APPOINT_END_DATE}
          </li>
        </ul>
      </div>
      <BackgroundFont className="z-[-1] absolute text-black/10 dark:text-white/10 bottom-0 left-20 sm:left-80 text-8xl sm:text-[130px] overflow-hidden">APPOINT</BackgroundFont>
    </IntroCard>
  )
}

export default IntroSix
