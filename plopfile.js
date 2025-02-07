export default async function (plop) {
  // 定义一个自定义辅助函数，用于获取时间戳
  plop.setHelper('getCurrentTimestamp', function () {
    return new Date().toISOString();
  });
  plop.setGenerator('basicAlgo', {
    description: '🎉 开写博客',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: '博客文件名',
      },
    ],
    actions: [{
      type: 'add',
      path: 'data/posts/{{dashCase name}}.md',
      templateFile: './src/template/post.hbs',
    }]
  })
};
