---
title: Vite工程化配置
date: '2023-11-14T00:00:00Z'
modifiedTime: '2025-05-23T00:00:00Z'
intro: '工程化使项目开发更加规范化，利于后期维护修改和团队协作开发'
tags: ['vite','工程化']
cover: 'https://img.eonova.me/upload/vite-engineering-config.png'
---

## 前置

### 工程化目的

工程化使项目开发更加规范化，利于后期维护修改和团队协作开发

### 用到的工具

- [🐶 husky | 🐶 husky (typicode.github.io)](https://typicode.github.io/husky/)
- [lint-staged: 🚫💩 — Run linters on git staged files (github.com)](https://github.com/okonet/lint-staged)
- [检测并修复 JavaScript 代码中的问题。 - ESLint - 插件化的 JavaScript 代码检查工具](https://zh-hans.eslint.org/)
- [Home | Stylelint中文文档 | Stylelint中文网](https://www.stylelint.com.cn/)
- [Commitizen by commitizen](https://github.com/commitizen/cz-cli)
- [cz-emoji git commit emoji Message](https://github.com/ngryman/cz-emoji)

## Editorconfig统一编译器配置风格

> EditorConfig 有助于为不同 IDE 编辑器上处理同一项目的多个开发人员维护一致的代码风格。

可以下载一个插件生成本地的编译器配置
![image.png](https://img.eonova.me/upload/20231114210936.png)

## ESlint优化代码质量

> ESLint 是一款用于查找并报告代码中问题的工具，并且支持部分问题自动修复。其核心是通过对代码解析得到的 AST（Abstract
> Syntax
> Tree 抽象语法树）进行模式匹配，来分析代码达到检查代码质量和风格问题的能力。

官网： [eslint.org](https://eslint.org/)

- 初始化

```bash
npx eslint --init
```

ESLint 会询问一系列问题，根据你的回答生成对应的.eslintrc.\*配置文件。

```bash
/*
$ npx eslint --init
✔ How would you like to use ESLint? · style
✔ What type of modules does your project use? · esm
✔ Which framework does your project use? · react
✔ Does your project use TypeScript? · No / Yes
✔ Where does your code run? · browser
✔ How would you like to define a style for your project? · guide
✔ Which style guide do you want to follow? · standard
✔ What format do you want your config file to be in? · JSON
*/

// 上面的回答对应下面的 .eslint.json 文件

{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": ["plugin:react/recommended", "standard"],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": ["react", "@typescript-eslint"],
  "rules": {}
}

```

- 配置你的规则（参照后面配置部分）
- 至此，便可以使用 ESlint 来检查、修复代码中的问题了

## Prettier美化代码风格

> Prettier 是一款强大的代码格式化工具，支持JavaScript、Typescript、Css、Scss、Less、JSX、Angular、Vue、GraphQL、JSON、Markdown等，基本上前端能用到的文件格式都可以搞定，是当下最流行的格式化工具。

官网：[prettier.io/](https://link.juejin.cn?target=https%3A%2F%2Fprettier.io%2F)

- 安装Prettier

```bash
pnpm add prettier -D
```

- 创建 Prettier 配置文件Prettier 支持多种格式的配置文件，比如 .json、.yml、yaml、.js等。 在根目录下创建 .prettierrc 文件 .prettierrc.js

```js
// 此处的规则供参考，其中多半其实都是默认值，可以根据个人习惯改写
module.exports = {
  printWidth: 80, // 单行长度
  tabWidth: 2, // 缩进长度
  useTabs: false, // 使用空格代替tab缩进
  semi: false, // 句末使用分号
  singleQuote: true, // 使用单引号
  quoteProps: 'as-needed', // 仅在必需时为对象的key添加引号
  jsxSingleQuote: true, // jsx中使用单引号
  trailingComma: 'all', // 多行时尽可能打印尾随逗号
  bracketSpacing: true, // 在对象前后添加空格-eg: { foo: bar }
  jsxBracketSameLine: true, // 多属性html标签的‘>’折行放置
  arrowParens: 'always', // 单参数箭头函数参数周围使用圆括号-eg: (x) => x
  requirePragma: false, // 无需顶部注释即可格式化
  insertPragma: false, // 在已被preitter格式化的文件顶部加上标注
  proseWrap: 'preserve', // 不知道怎么翻译
  htmlWhitespaceSensitivity: 'ignore', // 对HTML全局空白不敏感
  vueIndentScriptAndStyle: false, // 不对vue中的script及style标签缩进
  endOfLine: 'lf', // 结束行形式
  embeddedLanguageFormatting: 'auto', // 对引用代码进行格式化
}
```

- 下载插件Prettiter
  ![image.png](https://img.eonova.me/upload/20231114211718.png)

## Stylelint规范CSS风格

> `StyleLint`
> 是『一个强大的、现代化的 CSS 检测工具』, 与 ESLint 类似, 是通过定义一系列的编码风格规则帮助我们避免在样式表中出现错误.

- 安装stylelint、[stylelint-config-standard](https://link.segmentfault.com/?url=https%3A%2F%2Fgithub.com%2Fstylelint%2Fstylelint-config-standard)，stylelint-config-standard继承stylelint-config-recommended，提供一些常用的CSS规则，是stylelint推荐的配置

```bash
pnpm add stylelint stylelint-config-standard -D
```

- 在根目录下生成.stylelintrc.json配置文件，并根据如下初始化配置

```json
{
  "extends": "stylelint-config-standard"
}
```

- 安装stylelint-order、stylelint-config-rational-order，stylelint-order用于强制你按照某个顺序编写 css，stylelint-config-rational-order提供了CSS顺序的规则，这两个插件可以帮助矫正样式顺序，根据如下完善配置：

```json
{
  "extends": ["stylelint-config-standard", "stylelint-config-rational-order"],
  "plugins": ["stylelint-order"],
  "rules": {
    "string-quotes": "single"
  }
}
```

- 安装stylelint拓展插件，并在.vscode/settings.json增加如下配置，按Ctrl+S后会自动触发对样式格式化
  ![image.png](https://img.eonova.me/upload/20231114221255.png)

```json
// .vscode/settings.json
"stylelint.validate": ["css", "scss"],
"editor.codeActionsOnSave": {
  "source.fixAll.stylelint": true
},
```

## Commitizen规范git提交信息

> commitizen 仓库名为
> [cz-cli](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fcommitizen%2Fcz-cli)
> ，它提供了一个 git cz 的指令用于代替 git commit，从而对 Git 提交进行规范化处理

- 全局安装

```bash
pnpm install -g commitizen
```

- 项目中初始化

```bash
commitizen init cz-conventional-changelog --save --save-exact
```

- package.json中添加script命令

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "commit": "git add .&& git cz", // <----添加这一行
    "push": "git push",
    "prepare": "husky install",
    "format": "prettier --write ."
  }
}
```

- 中文包或者emoji表情包（选择一个即可）中文包安装

```bash
pnpm i cz-conventional-changelog-zh
```

package.json中配置

```json
{
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-conventional-changelog-zh"
    }
  }
}
```

emoji（git-cz）安装

```bash
pnpm add commitizen cz-emoji --save
```

package.json中配置

```json
{
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-emoji"
    }
  }
}
```

## Husky推送检查

> Husky可以在项目中植入你设定的 git hooks，在 git 提交代码的前后，你预设的 git
> hooks 可以得到执行，以对代码、文件等进行预设的检查，一旦检查不通过，就可以阻止当前的代码提交，避免了不规范的代码和 git 提交出现在项目中。

- 安装依赖
- 启动 `hooks`， 生成 `.husky` 文件夹
- 在 `package.json` 中生成 `prepare`指令
  ![image.png](https://img.eonova.me/upload/20231114224240.png)
- 执行 `prepare`指令

```bash
pnpm prepare
```

- 添加 `commitlint` 的 `hook` 到 `husky`中

```bash
npx husky add .husky/pre-commit "npx eslint --ext .js,.jsx,.ts,.tsx"
```

## lint-staged提交前格式化

>  `lint-staged` 是一个专门用于在通过 `git` 提交代码之前，对暂存区的代码执行一系列的格式化。

- 安装

```bash
pnpm add lint-staged -D
```

- 配置package.json

```bash
{
  "lint-staged": {
    "**/*": "prettier --write --ignore-unknown",
    "src/**/*.{js,vue}": [
      "eslint --fix",
      "git add ."
      ]
  }
}
```
