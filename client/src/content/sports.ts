export type SportKind = 'golf' | 'ice-hockey' | 'lacrosse'

type Session = { day: string; morning: string; afternoon: string }

type KindDetails = {
  sport: string
  scheduleTab: string
  opponentColumn: string
  intro: (title: string) => string
  detail: string
  // PLACEHOLDER venue copy: confirm facility details once the campus and partners are final.
  venue: { text: string; images: [string, string] }
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

const kinds: Record<SportKind, KindDetails> = {
  'ice-hockey': {
    sport: 'Ice Hockey',
    scheduleTab: 'Schedule',
    opponentColumn: 'Opponent',
    intro: (title) =>
      `${title} is built for players who aim to compete at the highest levels of prep and college hockey without compromising their education. Players train on the ice all year under a full professional coaching staff, with individualized development plans for skating, skills, hockey sense, and physical preparation.`,
    detail:
      'Daily ice sessions are paired with strength and conditioning, video analysis, and recovery work led by our sports performance team. A competitive schedule, combined with our 5-to-1 college counseling model, gives every player a clear path to the next level.',
    venue: {
      text: 'Our players practice and compete at a dedicated home rink with team locker rooms, a video room, and direct access to strength training and sports medicine. Year-round ice time means development never pauses for an off-season.',
      images: ['Home rink', 'Team locker room'],
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
      'Every player is supported by an athlete recruiter, coach, education consultant, student assistant, and family advisor who together build a recruiting plan, prepare game film, lead outreach to college coaches, and guide families through NCAA rules and offers.',
  },
  golf: {
    sport: 'Golf',
    scheduleTab: 'Tournaments',
    opponentColumn: 'Tournament',
    intro: (title) =>
      `${title} develops complete players for top junior, prep, and college competition. Golfers train year-round in Southern California’s ideal climate, with individualized plans covering full swing, short game, course management, and the mental game.`,
    detail:
      'Practice combines technology-assisted swing analysis, on-course play, and dedicated short-game work, supported by strength, mobility, and nutrition programs designed for golfers. A competitive tournament schedule and our 5-to-1 counseling model help each player build a college golf résumé.',
    venue: {
      text: 'Golfers practice and play at courses near campus, with access to full practice ranges, short-game areas, and indoor swing analysis. Southern California weather allows outdoor training in every month of the year.',
      images: ['Home course', 'Short game practice area'],
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
      'Every golfer is supported by an athlete recruiter, coach, education consultant, student assistant, and family advisor who together plan tournament exposure, prepare swing video and scoring records, lead outreach to college coaches, and guide families through NCAA rules and offers.',
  },
  lacrosse: {
    sport: 'Lacrosse',
    scheduleTab: 'Schedule',
    opponentColumn: 'Opponent',
    intro: (title) =>
      `${title} gives players a year-round path to elite prep and college lacrosse. Athletes develop stick skills, lacrosse IQ, and athleticism under a full coaching staff, with individualized plans for every position.`,
    detail:
      'Field sessions are complemented by film study, speed and agility work, and strength training from our sports performance team. Fall and summer showcase play, a competitive spring schedule, and our 5-to-1 counseling model keep players visible to college coaches.',
    venue: {
      text: 'Our teams train and compete on a full-size turf field, supported by indoor training space for speed, agility, and wall-ball work, with strength training and sports medicine close by.',
      images: ['Game field', 'Training facility'],
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
      'Every player is supported by an athlete recruiter, coach, education consultant, student assistant, and family advisor who together plan showcase exposure, prepare highlight film, lead outreach to college coaches, and guide families through NCAA rules and offers.',
  },
}

const makeSport = (team: Sport['team'], kind: SportKind): Sport => {
  const details = kinds[kind]
  const title = `${team}’ ${details.sport}`
  return {
    ...details,
    kind,
    team,
    title,
    slug: `${team.toLowerCase()}-${kind}`,
    intro: () => details.intro(title),
  }
}

export const sports: Sport[] = [
  makeSport('Boys', 'golf'),
  makeSport('Girls', 'golf'),
  makeSport('Boys', 'ice-hockey'),
  makeSport('Girls', 'ice-hockey'),
  makeSport('Boys', 'lacrosse'),
  makeSport('Girls', 'lacrosse'),
]

export const isSportPath = (pathname: string) =>
  sports.some((sport) => pathname === `/athletics/${sport.slug}`)
