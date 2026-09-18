import Hero from '../components/home/Hero'
import AtAGlance from '../components/home/AtAGlance'
import MissionBand from '../components/home/MissionBand'
import AcademicSplit from '../components/home/AcademicSplit'
import AthleticShowcase from '../components/home/AthleticShowcase'
import RecruitingStat from '../components/home/RecruitingStat'
import StudentLifeGallery from '../components/home/StudentLifeGallery'
import Campuses from '../components/home/Campuses'
import NewsEvents from '../components/home/NewsEvents'
import AdmissionCta from '../components/home/AdmissionCta'
import StayConnected from '../components/home/StayConnected'

export default function Home() {
  return (
    <>
      <Hero />
      <AtAGlance />
      <MissionBand />
      <AcademicSplit />
      <AthleticShowcase />
      <RecruitingStat />
      <StudentLifeGallery />
      <Campuses />
      <NewsEvents />
      <AdmissionCta />
      <StayConnected />
    </>
  )
}
