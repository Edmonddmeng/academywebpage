// Chinese translations for the per-sport content in sports.ts. Consumed by useSports().
import type { KindDetails, SportKind } from './sports'

export const kinds: Record<SportKind, KindDetails> = {
  'ice-hockey': {
    sport: '冰球',
    campus: '尔湾校区',
    scheduleTab: '赛程',
    opponentColumn: '对手',
    hero: {
      src: '/images/hockey-action.jpg',
      alt: '一名冰球运动员在开阔冰面上带球突破',
    },
    intro: (title) =>
      `${title}专为有志于在青年及大学冰球最高水平竞技的球员打造。球员在完整职业教练团队的带领下,全季持续上冰训练,并制定涵盖滑行、技术、冰球智商与体能的个人发展计划。`,
    detail:
      '每日冰上训练课与体能团队主导的力量体能训练、录像分析和恢复训练相结合。高水平的俱乐部与公开赛赛程,加上我们的5比1辅导模式,为每一位球员通向更高水平提供清晰的路径。',
    venue: {
      text: '球员在专属主场冰场训练与比赛,配备球队更衣室、录像分析室,并可直接使用力量训练与运动医学设施。',
      features: ['主场冰场', '球队更衣室', '录像分析室', '力量训练与运动医学'],
      gallery: [{ src: '/images/hockey-sticks.jpg', alt: '靠在挡板上的冰球杆' }],
    },
    staff: ['主教练', '助理教练', '守门员教练', '技术与滑行教练', '录像分析师', '体能教练'],
    rosterColumns: ['号码', '姓名', '位置', '年级', '家乡'],
    focus: ['滑行与技术', '团队体系与小场地对抗训练', '守门员培养', '录像分析', '力量与爆发力', '灵活性与恢复'],
    week: [
      { day: '周一', morning: '力量训练', afternoon: '冰上训练' },
      { day: '周二', morning: '滑行与技术', afternoon: '录像课与训练' },
      { day: '周三', morning: '力量训练', afternoon: '冰上训练' },
      { day: '周四', morning: '灵活性与恢复', afternoon: '冰上训练' },
      { day: '周五', morning: '赛前激活', afternoon: '比赛或训练' },
      { day: '周六', morning: '比赛日', afternoon: '恢复' },
      { day: '周日', morning: '休息', afternoon: '休息' },
    ],
    recruiting:
      '每一位球员都由运动员招募专员、教练、学术顾问、学生事务助理与家庭顾问共同支持,他们协作制定招募规划、准备比赛录像、主动联系大学与青年队教练,并指导家庭理解NCAA规则与录取通知。',
  },

  golf: {
    sport: '高尔夫',
    campus: '圣地亚哥校区',
    scheduleTab: '赛事',
    opponentColumn: '赛事',
    hero: {
      src: '/images/golf-course-aerial.jpg',
      alt: '太平洋沿岸高尔夫球场航拍',
    },
    intro: (title) =>
      `${title}为顶尖青年赛、业余赛与大学赛事培养全面型选手。球员在圣地亚哥理想的气候条件下全季训练,个人计划涵盖全挥杆、短杆、球场管理与心理素质。`,
    detail:
      '训练结合科技辅助挥杆分析、实战打球与专项短杆训练,并配有为高尔夫球员设计的力量、灵活性与营养项目。具有竞争力的赛事日程,加上我们的5比1辅导模式,帮助每位球员建立起大学高尔夫履历。',
    venue: {
      text: '球员在校园附近的高水准球场训练与比赛,配备完整练习场、短杆区域与室内挥杆分析设备。南加州的天气让大部分赛季都能进行户外训练。',
      features: ['练习场', '短杆区域', '室内挥杆分析', '实战打球'],
      gallery: [{ src: '/images/golf-course-hole.jpg', alt: '夕阳下悬崖球场旁海边的果岭' }],
    },
    staff: ['主教练', '助理教练', '短杆教练', '挥杆分析教练', '心理表现教练', '体能教练'],
    rosterColumns: ['姓名', '年级', '差点', '家乡'],
    focus: ['全挥杆与击球', '短杆与推杆', '球场管理', '挥杆与弹道分析', '高尔夫专项体能', '心理表现'],
    week: [
      { day: '周一', morning: '高尔夫体能训练', afternoon: '练习场与全挥杆' },
      { day: '周二', morning: '短杆训练', afternoon: '实战打球(9洞)' },
      { day: '周三', morning: '高尔夫体能训练', afternoon: '挥杆分析与推杆' },
      { day: '周四', morning: '灵活性与恢复', afternoon: '实战打球(9洞)' },
      { day: '周五', morning: '短杆训练', afternoon: '赛前准备' },
      { day: '周六', morning: '比赛或18洞回合', afternoon: '恢复' },
      { day: '周日', morning: '休息', afternoon: '休息' },
    ],
    recruiting:
      '每位球员都由运动员招募专员、教练、学术顾问、学生事务助理与家庭顾问共同支持,他们协作规划赛事曝光、准备挥杆录像与成绩记录、主动联系大学教练,并指导家庭理解NCAA规则与录取通知。',
  },

  tennis: {
    sport: '网球',
    campus: '两个校区',
    scheduleTab: '赛事',
    opponentColumn: '赛事',
    hero: {
      src: '/images/tennis-court.jpg',
      alt: '背景是棕榈树与群山的网球场',
    },
    intro: (title) =>
      `${title}为全国青年赛事与大学网球培养球员。运动员每周每天都在场上训练,个人计划涵盖技术、打法套路、移动步伐与比赛策略。`,
    detail:
      '场上训练课与体能团队提供的移动训练、力量训练和录像回顾相结合。USTA与ITF赛事日程,加上我们的5比1辅导模式,让每位球员持续获得大学教练的关注,并不断提升排名。',
    venue: {
      text: '球员在两个校区的硬地球场训练,场边配备发球机、录像设备与体能训练区。南加州的天气让大部分赛季都能进行户外场地训练。',
      features: ['硬地网球场', '录像拍摄', '发球机与专项训练', '场边体能训练'],
      gallery: [{ src: '/images/tennis-court.jpg', alt: '背景是棕榈树与群山的网球场' }],
    },
    staff: ['主教练', '助理教练', '击球教练', '步伐教练', '心理表现教练', '体能教练'],
    rosterColumns: ['姓名', '年级', '惯用手', 'UTR评分', '家乡'],
    focus: ['击球技术', '打法套路', '发球与接发球', '移动与步伐', '比赛策略与录像', '网球专项体能'],
    week: [
      { day: '周一', morning: '力量训练', afternoon: '技术场地训练' },
      { day: '周二', morning: '移动与步伐', afternoon: '实战对抗训练' },
      { day: '周三', morning: '力量训练', afternoon: '发球与接发球训练' },
      { day: '周四', morning: '灵活性与恢复', afternoon: '比赛训练与录像' },
      { day: '周五', morning: '激活训练', afternoon: '练习赛或出行' },
      { day: '周六', morning: '赛事比赛', afternoon: '恢复' },
      { day: '周日', morning: '休息', afternoon: '休息' },
    ],
    recruiting:
      '每位球员都由运动员招募专员、教练、学术顾问、学生事务助理与家庭顾问共同支持,他们协作规划赛事日程、追踪UTR评分与战绩、准备比赛录像、主动联系大学教练,并指导家庭理解NCAA规则与录取通知。',
  },

  lacrosse: {
    sport: '长曲棍球',
    campus: '两个校区',
    scheduleTab: '赛程',
    opponentColumn: '对手',
    hero: {
      src: '/images/lacrosse-field.jpg',
      alt: '夕阳下放在草坪场地上的长曲棍球杆',
    },
    intro: (title) =>
      `${title}为球员提供通向顶尖俱乐部、高中与大学长曲棍球的整季发展路径。运动员在完整教练团队的带领下培养杆法技术、比赛智商与运动能力,并为每个位置制定个人计划。`,
    detail:
      '场地训练课与录像分析、速度敏捷训练及体能团队的力量训练相辅相成。秋季与夏季公开赛、具有竞争力的春季赛程,加上我们的5比1辅导模式,让球员持续获得大学教练的关注。',
    venue: {
      text: '我们的球队在标准尺寸草坪场地训练与比赛,配备用于速度、敏捷与墙壁传接训练的室内训练空间,并可就近使用力量训练与运动医学设施。',
      features: ['标准尺寸草坪场地', '室内速度敏捷训练空间', '墙壁传接训练区', '力量训练与运动医学'],
      gallery: [
        { src: '/images/lacrosse-action.jpg', alt: '一名长曲棍球运动员带球推进' },
        { src: '/images/lacrosse-scoop.jpg', alt: '一名球员快速铲起地滚球' },
      ],
    },
    staff: ['主教练', '进攻协调教练', '防守协调教练', '守门员教练', '体能教练'],
    rosterColumns: ['号码', '姓名', '位置', '年级', '家乡'],
    focus: ['杆法技术与墙壁传接', '进攻与防守体系', '守门员培养', '录像分析', '速度与敏捷', '力量与伤病预防'],
    week: [
      { day: '周一', morning: '力量训练', afternoon: '场地训练' },
      { day: '周二', morning: '速度与敏捷', afternoon: '录像课与训练' },
      { day: '周三', morning: '力量训练', afternoon: '场地训练' },
      { day: '周四', morning: '灵活性与恢复', afternoon: '位置分组训练' },
      { day: '周五', morning: '赛前激活', afternoon: '比赛或训练' },
      { day: '周六', morning: '比赛或公开赛', afternoon: '恢复' },
      { day: '周日', morning: '休息', afternoon: '休息' },
    ],
    recruiting:
      '每位球员都由运动员招募专员、教练、学术顾问、学生事务助理与家庭顾问共同支持,他们协作规划公开赛曝光、准备集锦录像、主动联系大学教练,并指导家庭理解NCAA规则与录取通知。',
  },
}
