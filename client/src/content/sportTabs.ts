import type { Sport } from './sports'
import { useLocale } from './locale'

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

const labelsEn = {
  roster: 'Roster',
  coaches: 'Coaching Staff',
  training: 'Training',
  venue: 'Where We Play',
  performance: 'Performance',
  recruiting: 'Recruiting',
  alumni: 'Alumni',
  seasons: 'Past Seasons',
}

const labelsZh = {
  roster: '球员名单',
  coaches: '教练团队',
  training: '训练',
  venue: '训练场地',
  performance: '体能表现',
  recruiting: '招募',
  alumni: '校友',
  seasons: '历史赛季',
}

export const tabLabel = (sport: Sport, tab: SportTab) =>
  (tab === 'schedule' ? sport.scheduleTab : labelsEn[tab])

const tabLabelZh = (sport: Sport, tab: SportTab) =>
  (tab === 'schedule' ? sport.scheduleTab : labelsZh[tab])

export function useTabLabel() {
  const locale = useLocale()
  return locale === 'zh' ? tabLabelZh : tabLabel
}
