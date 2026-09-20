import { useLocale } from './locale'
import { kinds as kindsZh } from './sports.zh'

export type SportKind = 'ice-hockey' | 'golf' | 'tennis' | 'lacrosse' | 'fencing'

type Session = { day: string; morning: string; afternoon: string }

// A real photo when we have one; a placeholder label when we don't yet (e.g. a newly
// announced program with no venue photography shot).
type SportImage = { src: string; alt: string } | { placeholder: string }

export type KindDetails = {
  sport: string
  campus: string
  scheduleTab: string
  opponentColumn: string
  hero: SportImage
  intro: (title: string) => string
  detail: string
  // PLACEHOLDER venue copy: confirm facility details once partner venues are final.
  venue: { text: string; features: string[]; gallery: SportImage[] }
  staff: string[]
  rosterColumns: string[]
  focus: string[]
  week: Session[]
  recruiting: string
}

export type Sport = KindDetails & {
  slug: string
  team: 'Boys' | 'Girls'
  title: string
  kind: SportKind
}

export const kinds: Record<SportKind, KindDetails> = {
  'ice-hockey': {
    sport: 'Ice Hockey',
    campus: 'Irvine Campus',
    scheduleTab: 'Schedule',
    opponentColumn: 'Opponent',
    hero: {
      src: '/images/hockey-action.jpg',
      alt: 'A hockey player driving with the puck on open ice',
    },
    intro: (title) =>
      `${title} is built for players who intend to compete at the highest levels of junior and college hockey. Players are on the ice through the season under a full professional coaching staff, with individual development plans for skating, skills, hockey sense, and physical preparation.`,
    detail:
      'Daily ice sessions are paired with strength and conditioning, video analysis, and recovery work led by our performance team. A high-tier club and showcase schedule, combined with our 5-to-1 counseling model, gives every player a clear route to the next level.',
    venue: {
      text: 'Players train and compete at Great Park Ice Arena in Irvine, with team locker rooms, a video room, and direct access to strength training and sports medicine.',
      features: ['Great Park Ice Arena', 'Team locker rooms', 'Video room', 'Strength & sports medicine'],
      gallery: [
        { src: '/images/great-park-ice-arena.jpg', alt: 'Aerial view of Great Park Ice Arena in Irvine' },
        { src: '/images/hockey-sticks.jpg', alt: 'Sticks resting against the boards at the rink' },
      ],
    },
    staff: [
      'Head Coach',
      'Assistant Coach',
      'Goaltending Coach',
      'Skills & Skating Coach',
      'Video Analyst',
      'Strength & Conditioning Coach',
    ],
    rosterColumns: ['No.', 'Name', 'Position', 'Grade', 'Hometown'],
    focus: [
      'Skating & skills',
      'Team systems & small-area games',
      'Goaltending development',
      'Video analysis',
      'Strength & power',
      'Mobility & recovery',
    ],
    week: [
      { day: 'Monday', morning: 'Strength training', afternoon: 'On-ice practice' },
      { day: 'Tuesday', morning: 'Skating & skills', afternoon: 'Video session & practice' },
      { day: 'Wednesday', morning: 'Strength training', afternoon: 'On-ice practice' },
      { day: 'Thursday', morning: 'Mobility & recovery', afternoon: 'On-ice practice' },
      { day: 'Friday', morning: 'Pre-game activation', afternoon: 'Game or practice' },
      { day: 'Saturday', morning: 'Game day', afternoon: 'Recovery' },
      { day: 'Sunday', morning: 'Rest', afternoon: 'Rest' },
    ],
    recruiting:
      'Every player is supported by an athlete recruiter, coach, academic advisor, student assistant, and family advisor who together build a recruiting plan, prepare game film, lead outreach to college and junior coaches, and guide families through NCAA rules and offers.',
  },

  golf: {
    sport: 'Golf',
    campus: 'San Diego Campus',
    scheduleTab: 'Tournaments',
    opponentColumn: 'Tournament',
    hero: {
      src: '/images/golf-course-aerial.jpg',
      alt: 'Aerial view of a coastal golf course along the Pacific',
    },
    intro: (title) =>
      `${title} develops complete players for top junior, amateur, and college competition. Golfers train through the season in San Diego's ideal climate, on individual plans covering full swing, short game, course management, and the mental game.`,
    detail:
      'Practice combines technology-assisted swing analysis, on-course play, and dedicated short-game work, supported by strength, mobility, and nutrition programs designed for golfers. A competitive tournament schedule and our 5-to-1 counseling model help each player build a college golf résumé.',
    venue: {
      text: 'Golfers train and play at Strawberry Farms Golf Course, an elite SCPGA Junior development course, with regular access to Torrey Pines Golf Course in San Diego for tournament-caliber rounds. Southern California weather supports outdoor training for most of the season.',
      features: ['Strawberry Farms Golf Course', 'Torrey Pines Golf Course', 'Indoor swing analysis', 'On-course play'],
      gallery: [
        { src: '/images/strawberry-farms-golf.jpg', alt: 'A lakeside green at Strawberry Farms Golf Course' },
        { src: '/images/torrey-pines-golf.jpg', alt: 'A cliffside green above the Pacific at Torrey Pines Golf Course at sunset' },
      ],
    },
    staff: [
      'Head Coach',
      'Assistant Coach',
      'Short Game Coach',
      'Swing Analysis Coach',
      'Mental Performance Coach',
      'Strength & Conditioning Coach',
    ],
    rosterColumns: ['Name', 'Grade', 'Handicap', 'Hometown'],
    focus: [
      'Full swing & ball striking',
      'Short game & putting',
      'Course management',
      'Swing & launch analysis',
      'Golf-specific fitness',
      'Mental performance',
    ],
    week: [
      { day: 'Monday', morning: 'Golf fitness', afternoon: 'Range & full swing' },
      { day: 'Tuesday', morning: 'Short game', afternoon: 'On-course play (9 holes)' },
      { day: 'Wednesday', morning: 'Golf fitness', afternoon: 'Swing analysis & putting' },
      { day: 'Thursday', morning: 'Mobility & recovery', afternoon: 'On-course play (9 holes)' },
      { day: 'Friday', morning: 'Short game', afternoon: 'Tournament preparation' },
      { day: 'Saturday', morning: 'Tournament or 18-hole round', afternoon: 'Recovery' },
      { day: 'Sunday', morning: 'Rest', afternoon: 'Rest' },
    ],
    recruiting:
      'Every golfer is supported by an athlete recruiter, coach, academic advisor, student assistant, and family advisor who together plan tournament exposure, prepare swing video and scoring records, lead outreach to college coaches, and guide families through NCAA rules and offers.',
  },

  tennis: {
    sport: 'Tennis',
    campus: 'Both campuses',
    scheduleTab: 'Tournaments',
    opponentColumn: 'Tournament',
    hero: {
      src: '/images/tennis-court.jpg',
      alt: 'A tennis court with palm trees and mountains in the background',
    },
    intro: (title) =>
      `${title} trains players for national junior competition and college tennis. Athletes work on court every day of the week on individual plans covering technique, patterns of play, movement, and match strategy.`,
    detail:
      'On-court blocks are paired with movement training, strength work, and video review from our performance team. A USTA and ITF tournament schedule, combined with our 5-to-1 counseling model, keeps every player visible to college coaches and climbing the rankings.',
    venue: {
      text: 'Players train on hard courts at both campuses, with ball machines, video capture, and a fitness area beside the courts. Southern California weather supports outdoor court time for most of the season.',
      features: ['Hard courts', 'Video capture', 'Ball machines & drilling', 'Court-side fitness'],
      gallery: [
        { src: '/images/tennis-court.jpg', alt: 'A tennis court with palm trees and mountains in the background' },
      ],
    },
    staff: [
      'Head Coach',
      'Assistant Coach',
      'Hitting Coach',
      'Movement & Footwork Coach',
      'Mental Performance Coach',
      'Strength & Conditioning Coach',
    ],
    rosterColumns: ['Name', 'Grade', 'Plays', 'UTR', 'Hometown'],
    focus: [
      'Stroke technique',
      'Patterns of play',
      'Serve & return',
      'Movement & footwork',
      'Match strategy & video',
      'Tennis-specific fitness',
    ],
    week: [
      { day: 'Monday', morning: 'Strength training', afternoon: 'Technical court block' },
      { day: 'Tuesday', morning: 'Movement & footwork', afternoon: 'Live-ball drilling' },
      { day: 'Wednesday', morning: 'Strength training', afternoon: 'Serve & return blocks' },
      { day: 'Thursday', morning: 'Mobility & recovery', afternoon: 'Match play & video' },
      { day: 'Friday', morning: 'Activation', afternoon: 'Practice sets or travel' },
      { day: 'Saturday', morning: 'Tournament play', afternoon: 'Recovery' },
      { day: 'Sunday', morning: 'Rest', afternoon: 'Rest' },
    ],
    recruiting:
      'Every player is supported by an athlete recruiter, coach, academic advisor, student assistant, and family advisor who together plan the tournament calendar, track UTR and results, prepare match video, lead outreach to college coaches, and guide families through NCAA rules and offers.',
  },

  lacrosse: {
    sport: 'Lacrosse',
    campus: 'Both campuses',
    scheduleTab: 'Schedule',
    opponentColumn: 'Opponent',
    hero: {
      src: '/images/lacrosse-field.jpg',
      alt: 'A lacrosse stick resting on a turf field at sunset',
    },
    intro: (title) =>
      `${title} gives players a season-long path to elite club, high school, and college lacrosse. Athletes develop stick skills, lacrosse IQ, and athleticism under a full coaching staff, with individual plans for every position.`,
    detail:
      'Field sessions are complemented by film study, speed and agility work, and strength training from our performance team. Fall and summer showcase play, a competitive spring schedule, and our 5-to-1 counseling model keep players visible to college coaches.',
    venue: {
      text: 'Our teams train and compete on full-size turf fields, supported by indoor training space for speed, agility, and wall-ball work, with strength training and sports medicine close by.',
      features: ['Full-size turf field', 'Indoor speed & agility space', 'Wall-ball area', 'Strength & sports medicine'],
      gallery: [
        { src: '/images/lacrosse-action.jpg', alt: 'A lacrosse player carrying the ball upfield' },
        { src: '/images/lacrosse-scoop.jpg', alt: 'A player scooping a ground ball at speed' },
      ],
    },
    staff: [
      'Head Coach',
      'Offensive Coordinator',
      'Defensive Coordinator',
      'Goalie Coach',
      'Strength & Conditioning Coach',
    ],
    rosterColumns: ['No.', 'Name', 'Position', 'Grade', 'Hometown'],
    focus: [
      'Stick skills & wall ball',
      'Offensive & defensive systems',
      'Goalie development',
      'Film study',
      'Speed & agility',
      'Strength & injury prevention',
    ],
    week: [
      { day: 'Monday', morning: 'Strength training', afternoon: 'Field practice' },
      { day: 'Tuesday', morning: 'Speed & agility', afternoon: 'Film session & practice' },
      { day: 'Wednesday', morning: 'Strength training', afternoon: 'Field practice' },
      { day: 'Thursday', morning: 'Mobility & recovery', afternoon: 'Position-group training' },
      { day: 'Friday', morning: 'Pre-game activation', afternoon: 'Game or practice' },
      { day: 'Saturday', morning: 'Game or showcase', afternoon: 'Recovery' },
      { day: 'Sunday', morning: 'Rest', afternoon: 'Rest' },
    ],
    recruiting:
      'Every player is supported by an athlete recruiter, coach, academic advisor, student assistant, and family advisor who together plan showcase exposure, prepare highlight film, lead outreach to college coaches, and guide families through NCAA rules and offers.',
  },

  fencing: {
    sport: 'Fencing',
    campus: 'Irvine Campus',
    scheduleTab: 'Competitions',
    opponentColumn: 'Competition',
    hero: {
      src: '/images/irvine-fencing-center.jpg',
      alt: 'The indoor fencing strips at the Irvine Fencing Center',
    },
    intro: (title) =>
      `${title} is our newest program, built for fencers competing toward national qualifiers and college recruitment. Fencers train daily under a dedicated coaching staff, with individual plans by weapon, covering footwork, blade work, tactics, and bout strategy.`,
    detail:
      'Daily bouting and drill work are paired with footwork and conditioning sessions, video review, and recovery support from our performance team. A regional and national competition schedule, combined with our 5-to-1 counseling model, gives every fencer a clear route to college fencing.',
    venue: {
      text: 'Fencers train at the Irvine Fencing Center, with direct access to strength training and sports medicine at the Irvine campus.',
      features: ['Irvine Fencing Center', 'Electric scoring equipment', 'Video review', 'Strength & sports medicine'],
      gallery: [{ src: '/images/irvine-fencing-center.jpg', alt: 'The indoor fencing strips at the Irvine Fencing Center' }],
    },
    staff: ['Head Coach', 'Assistant Coach', 'Footwork & Conditioning Coach', 'Strength & Conditioning Coach'],
    rosterColumns: ['Name', 'Weapon', 'Grade', 'Hometown'],
    focus: [
      'Footwork & distance',
      'Blade work by weapon',
      'Bout tactics & strategy',
      'Video analysis',
      'Strength & power',
      'Mobility & recovery',
    ],
    week: [
      { day: 'Monday', morning: 'Strength training', afternoon: 'Footwork & blade work' },
      { day: 'Tuesday', morning: 'Footwork & conditioning', afternoon: 'Bouting practice' },
      { day: 'Wednesday', morning: 'Strength training', afternoon: 'Footwork & blade work' },
      { day: 'Thursday', morning: 'Mobility & recovery', afternoon: 'Bouting practice' },
      { day: 'Friday', morning: 'Pre-competition activation', afternoon: 'Competition or practice' },
      { day: 'Saturday', morning: 'Competition day', afternoon: 'Recovery' },
      { day: 'Sunday', morning: 'Rest', afternoon: 'Rest' },
    ],
    recruiting:
      'Every fencer is supported by an athlete recruiter, coach, academic advisor, student assistant, and family advisor who together build a recruiting plan, prepare bout footage, lead outreach to college coaches, and guide families through NCAA rules and offers.',
  },
}

const teamLabelZh: Record<Sport['team'], string> = { Boys: '男子', Girls: '女子' }

const makeSport = (team: Sport['team'], kind: SportKind, kindsSource: Record<SportKind, KindDetails>, locale: 'en' | 'zh'): Sport => {
  const details = kindsSource[kind]
  const title = locale === 'zh' ? `${teamLabelZh[team]}${details.sport}` : `${team}’ ${details.sport}`
  return {
    ...details,
    kind,
    team,
    title,
    // Slug stays English-based regardless of locale, since it's the URL and must match between languages.
    slug: `${team.toLowerCase()}-${kind}`,
    intro: () => details.intro(title),
  }
}

export const sportKinds: SportKind[] = ['ice-hockey', 'golf', 'tennis', 'lacrosse', 'fencing']

const buildSports = (kindsSource: Record<SportKind, KindDetails>, locale: 'en' | 'zh'): Sport[] =>
  sportKinds.flatMap((kind) => [
    makeSport('Boys', kind, kindsSource, locale),
    makeSport('Girls', kind, kindsSource, locale),
  ])

export const sports: Sport[] = buildSports(kinds, 'en')

export const isSportPath = (pathname: string) =>
  sports.some((sport) => pathname === `/athletic/${sport.slug}`)

const sportsZh: Sport[] = buildSports(kindsZh, 'zh')

export function useSports(): Sport[] {
  return useLocale() === 'zh' ? sportsZh : sports
}
