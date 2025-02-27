import type { NodePlopAPI } from 'plop'
import { CATEGORIES } from '~/config/posts'

export default async function (plop: NodePlopAPI) {
  /** 生成当前时间 */
  plop.setHelper('getCurrentTimestamp', () => new Date().toISOString())

  /** 添加 dashCase 转换器（确保文件名格式统一） */
  plop.setHelper('dashCase', (text: string) => {
    return text.replace(/\s+/g, '-').toLowerCase()
  })

  /** 博客文章生成器 */
  plop.setGenerator('post', {
    description: '📝 创建一篇文章',
    prompts: [
      {
        type: 'input',
        name: 'title',
        message: '文章标题（支持中文）:',
        validate: (value) => !!value.trim() || '标题不能为空'
      },
      {
        type: 'list',
        name: 'category',
        message: '选择分类:',
        choices: CATEGORIES,
        default: CATEGORIES[0]
      },
      {
        type: 'confirm',
        name: 'addDate',
        message: '是否添加创建时间?',
        default: true
      }
    ],
    actions: [{
      type: 'add',
      path: `data/posts/{{dashCase title}}.md`,
      templateFile: './src/templates/post.hbs',
      // 自动跳过已存在文件
      skipIfExists: true
    }]
  })

  // 速记笔记生成器
  plop.setGenerator('note', {
    description: '✏️ 创建一篇手记',
    prompts: [
      {
        type: 'input',
        name: 'topic',
        message: '手记主题:',
        validate: (value) => !!value.trim() || '主题不能为空'
      }
    ],
    actions: [{
      type: 'add',
      path: 'data/notes/{{dashCase topic}}.md',
      templateFile: './src/templates/note.hbs'
    }]
  })
}
