import Hero from '../components/home/Hero'
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
