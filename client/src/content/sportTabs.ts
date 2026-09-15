import type { Sport } from './sports'

export const sportTabs = [
  'schedule',
  'roster',
  'coaches',
  'training',
  'venue',
  'performance',
  'recruiting',
  'alumni',
  'seasons',
] as const

export type SportTab = (typeof sportTabs)[number]

export const tabLabel = (sport: Sport, tab: SportTab) =>
  ({
    schedule: sport.scheduleTab,
    roster: 'Roster',
    coaches: 'Coaching Staff',
    training: 'Training',
    venue: 'Where We Play',
    performance: 'Performance',
    recruiting: 'Recruiting',
    alumni: 'Alumni',
    seasons: 'Past Seasons',
  })[tab]
