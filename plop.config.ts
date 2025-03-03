import type { NodePlopAPI } from 'plop'
import { MOODS, WEATHER } from '~/config/notes'
import { CATEGORIES } from '~/config/posts'

export default async function (plop: NodePlopAPI) {
  /** 生成当前时间 */
  plop.setHelper('getCurrentTimestamp', () => new Date().toISOString())

  /** 添加 dashCase 转换器（确保文件名格式统一） */
  plop.setHelper('dashCase', (text: string) => {
    return text.replace(/\s+/g, '-').toLowerCase()
  })

  plop.setHelper('arrayFormat', (items: string[]) =>
    `[${items.map(item => `'${item}'`).join(', ')}]`)

  /** 文章生成器 */
  plop.setGenerator('post', {
    description: '📝 创建一篇有趣的文章',
    prompts: [
      {
        type: 'input',
        name: 'title',
        message: '文章标题 (✏️ 请输入有趣的名字):',
        validate: value => !!value.trim() || '标题不能为空哦～(>_<)',
      },
      {
        type: 'list',
        name: 'category',
        message: '选择分类 🗂️ :',
        choices: CATEGORIES.map(i => i.label),
        default: CATEGORIES[0]?.label,
      },
    ],
    actions: [{
      type: 'add',
      path: `data/posts/{{category}}/{{dashCase title}}.md`,
      templateFile: './src/templates/post.hbs',
      // 自动跳过已存在文件
      skipIfExists: true,
    }],
  })

  /** 手记生成器 */
  plop.setGenerator('note', {
    description: '📕 创建一篇灵感迸发的手记',
    prompts: [
      {
        type: 'input',
        name: 'topic',
        message: '手记主题 (💡 闪光的想法):',
        validate: value => !!value.trim() || '主题不能为空喵～(ฅ>ω<*ฅ)',
      },
      {
        type: 'list',
        name: 'mood',
        message: '今天心情怎么样？ 🎭 :',
        choices: MOODS.map(i => i.text),
        default: MOODS[0]?.text,
      },
      {
        type: 'list',
        name: 'weather',
        message: '今天天气怎么样？ 🎈 :',
        choices: WEATHER.map(i => i.text),
        default: WEATHER[0]?.text,
      },
    ],
    actions: [{
      type: 'add',
      path: 'data/notes/{{dashCase topic}}.md',
      templateFile: './src/templates/note.hbs',
    }],
  })

  /** 项目生成器 */
  plop.setGenerator('project', {
    description: '🚀 创建一篇炫酷项目文档',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: '项目名称 (🌟 请取个闪闪发光的名字):',
        validate: value => !!value.trim() || '项目名不能为空哦～(๑•́ ₃ •̀๑)',
      },
      {
        type: 'input',
        name: 'description',
        message: '项目描述 🌈 (用一句话惊艳世界吧):',
      },
      {
        type: 'input',
        name: 'homepage',
        message: '项目主页 URL 🌐 (可选，空着也没关系～):',
        validate: (value) => {
          if (!value)
            return true // 允许留空
          const pattern = /^(http|https):\/\/[^ "]+$/
          return pattern.test(value) || '请输入有效的 URL'
        },
      },
      {
        type: 'input',
        name: 'github',
        message: 'GitHub 仓库 URL 🐱 (让代码猫猫有个家):',
        validate: (value) => {
          if (!value)
            return true
          const pattern = /^(http|https):\/\/github.com\/.+/i
          return pattern.test(value) || '请输入 GitHub 仓库完整 URL'
        },
      },
      {
        type: 'confirm',
        name: 'selected',
        message: '是否标记为精选项目 ✨ ?',
        default: false,
      },
    ],
    actions: [{
      type: 'add',
      path: 'data/projects/{{dashCase name}}.md',
      templateFile: './src/templates/project.hbs',
    }],
  })
}
