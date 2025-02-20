import { NodePlopAPI } from 'plop';
import { CATEGORIES } from '~/config/posts';

export default async function (plop: NodePlopAPI) {
  // 定义一个自定义辅助函数，用于获取时间戳
  plop.setHelper('getCurrentTimestamp', () => {
    return new Date().toISOString()
  })
  plop.setGenerator('basicAlgo', {
    description: '🎉 开写博客',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: '博客文件名',
      },
      {
        type: 'list', // 选择类型
        name: 'categories', // 输入项的名称
        message: '选择分类', // 提示信息
        choices: CATEGORIES, // 选项列表
        default: CATEGORIES[0], // 默认值
      },
    ],
    actions: [{
      type: 'add',
      path: 'data/posts/{{dashCase name}}.md',
      templateFile: './src/template/post.hbs',
    }],
  })
};
