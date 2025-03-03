interface IMoods {
  text: string
  icon: string
}

export const MOODS: IMoods[] = [
  {
    text: '焦虑',
    icon: 'fas fa-hands-helping', // Font Awesome 焦虑图标
  },
  {
    text: '平静',
    icon: 'fas fa-peace', // 双手合十图标
  },
  {
    text: '兴奋',
    icon: 'fas fa-star', // 星星闪烁图标
  },
  {
    text: '疲惫',
    icon: 'fas fa-bed', // 床铺图标
  },
  {
    text: '快乐',
    icon: 'fas fa-smile-beam', // 笑脸图标
  },
  {
    text: '悲伤',
    icon: 'fas fa-sad-tear', // 含泪图标
  },
  {
    text: '专注',
    icon: 'fas fa-brain', // 大脑图标
  },
  {
    text: '创意',
    icon: 'fas fa-lightbulb', // 灯泡图标
  },
]

// 可选：添加类型安全校验
type ValidMoods = '焦虑' | '平静' | '兴奋' | '疲惫' | '快乐' | '悲伤' | '专注' | '创意'

// 可选：映射到颜色方案
export const MOOD_COLORS: Record<ValidMoods, string> = {
  焦虑: 'bg-orange-100',
  平静: 'bg-blue-50',
  兴奋: 'bg-yellow-100',
  疲惫: 'bg-gray-200',
  快乐: 'bg-green-100',
  悲伤: 'bg-indigo-100',
  专注: 'bg-purple-100',
  创意: 'bg-pink-100',
}

export const WEATHER = [
  {
    text: '晴',
    icon: 'fas fa-sun', // 太阳图标
  },
  {
    text: '多云',
    icon: 'fas fa-cloud', // 云图标
  },
  {
    text: '雨天',
    icon: 'fas fa-cloud-showers-heavy', // 大雨图标
  },
  {
    text: '雷雨',
    icon: 'fas fa-bolt', // 闪电图标
  },
  {
    text: '雪天',
    icon: 'fas fa-snowflake', // 雪花图标
  },
  {
    text: '雾霾',
    icon: 'fas fa-smog', // 雾霾图标
  },
  {
    text: '风',
    icon: 'fas fa-wind', // 风图标
  },
  {
    text: '阴天',
    icon: 'fas fa-cloud-sun', // 阴天图标
  }
]
