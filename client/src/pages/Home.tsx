import Hero from '../components/home/Hero'
import AtAGlance from '../components/home/AtAGlance'
import {
  AcademicPillar,
  AthleticPillar,
  PillarsIntro,
  RecruitingPillar,
  StudentLifePillar,
} from '../components/home/Pillars'
import Campuses from '../components/home/Campuses'
import Experience from '../components/home/Experience'
import AdmissionCta from '../components/home/AdmissionCta'
import StayConnected from '../components/home/StayConnected'

export default function Home() {
  return (
    <>
      <Hero />
      <AtAGlance />
      <PillarsIntro />
      <AcademicPillar />
      <AthleticPillar />
      <RecruitingPillar />
      <StudentLifePillar />
      <Campuses />
      <Experience />
      <AdmissionCta />
      <StayConnected />
    </>
  )
}
