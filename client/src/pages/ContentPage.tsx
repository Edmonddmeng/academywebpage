import { useParams } from 'react-router-dom'
import PlaceholderPage from './PlaceholderPage'
import SportPage from './SportPage'
import { sports } from '../content/sports'

// Chooses a dedicated template for pages that have one, otherwise the generic placeholder.
export default function ContentPage() {
  const { section, page } = useParams()
  const sport = section === 'athletics' ? sports.find((s) => s.slug === page) : undefined

  return sport ? <SportPage key={sport.slug} sport={sport} /> : <PlaceholderPage />
}
