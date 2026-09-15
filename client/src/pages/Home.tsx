import Hero from '../components/home/Hero'
import AtAGlance from '../components/home/AtAGlance'
import Journey from '../components/home/Journey'
import AcademicsFeature from '../components/home/AcademicsFeature'
import AthleticsSection from '../components/home/AthleticsSection'
import CounselingModel from '../components/home/CounselingModel'
import LifeSection from '../components/home/LifeSection'
import PlaceSection from '../components/home/PlaceSection'
import AdmissionCta from '../components/home/AdmissionCta'
import StayConnected from '../components/home/StayConnected'

export default function Home() {
  return (
    <>
      <Hero />
      <AtAGlance />
      <Journey />
      <AcademicsFeature />
      <AthleticsSection />
      <CounselingModel />
      <LifeSection />
      <PlaceSection />
      <AdmissionCta />
      <StayConnected />
    </>
  )
}
