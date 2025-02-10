---
title: RegExp
id: 04d32643-af0b-45cb-bc74-275a624e1ec8
date: 2023-12-02 21:33:20
auther: leostar
cover:
excerpt: RegExp的创建 首先，得先创建正则表达式 /ab+c/i; //字面量形式new RegExp('ab+c', 'i'); // 首个参数为字符串模式的构造函数new RegExp(/ab+c/, 'i'); // 首个参数为常规字面量的构造函数 其中的ab+c是正则表达式的pattern
permalink: /archives/gGzttYgX
categories:
 - jsji-jin
tags:
 - zheng-ze-biao-da-shi
 - jsji-chu
---

## RegExp的创建

首先，得先创建正则表达式

```javascript
/ab+c/i // 字面量形式
new RegExp('ab+c', 'i') // 首个参数为字符串模式的构造函数
new RegExp(/ab+c/, 'i') // 首个参数为常规字面量的构造函数
```

其中的`ab+c`是正则表达式的pattern（模式），i表示匹配模式的flags（标记），也称修饰符，用于控制正则表达式的行为。下面给出了表示匹配模式的修饰符：

1. `i`：忽略大小写进行匹配。
2. `g`：全局搜索，不止找到第一个匹配项。
3. `m`：多行匹配模式，将 `^` 和 `$` 应用于每一行的开头和结尾。
4. `y`：粘附模式，表示只查找从lastIndex开始及之后的字符串。
5. `u`：Unicode模式，启用Unicode匹配
6. `s`：dotAll模式，表示元字符，匹配任何字符（包括\n或\r)

## RegExp实例属性

![image-20230721150410661](https://img.leostar.top/study/image-20230721150410661.png)

RegExp实例属性包括：

1. `global`：布尔值，表示是否启用全局匹配模式。
2. `ignoreCase`：布尔值，表示是否启用忽略大小写匹配模式。
3. `unicode`:布尔值，表示是否启用Unicode匹配模式。
4. `sticky`：布尔值，表示是否启用粘性匹配模式。
5. `multiline`：布尔值，表示是否启用多行匹配模式。
6. `dotAll`：布尔值，表示是否启用元字符匹配模式。
7. `source`：字符串，表示正则表达式的源代码。
8. `lastIndex`：整数，表示下一次匹配的起始位置。只有在使用全局匹配模式时才有意义。
9. `unicode`：布尔值，表示是否启用Unicode匹配模式。

这些属性可以通过正则表达式对象的实例来访问和修改。例如：

```javascript
const regex = /abc/gi
console.log(regex.global) // true
console.log(regex.ignoreCase) // true
console.log(regex.multiline) // false
console.log(regex.unicode) // false
console.log(regex.dotAll) // false
console.log(regex.source) // "abc"
console.log(regex.lastIndex) // 0
console.log(regex.sticky) // false
console.log(regex.unicode) // false

regex.global = false
regex.ignoreCase = false
regex.multiline = true
regex.lastIndex = 10
regex.sticky = true
regex.unicode = true
```

上面的代码中，首先创建了一个正则表达式对象regex，然后通过实例属性访问了各个属性的值。最后通过赋值操作修改了部分属性的值。

## RegExp实例方法

![image-20230721150308904](https://img.leostar.top/study/image-20230721150308904.png)

原型上的方法`exec()`、`test()`

1. test(string)：测试字符串是否与正则表达式匹配，并返回布尔值。

   ```javascript
   const regex = /pattern/
   const string = 'example string'
   const result = regex.test(string) // 返回 true 或 false
   ```

2. exec(string)：在字符串中执行正则表达式匹配，并返回匹配结果的详细信息。

   ```javascript
   const regex = /pattern/
   const string = 'example string'
   const match = regex.exec(string) // 返回一个数组，包含匹配结果的详细信息
   ```

常用方法

1. match() 方法：

   - `match()` 方法用于在字符串中查找与正则表达式匹配的内容，并返回一个数组。
   - 如果未找到匹配项，则返回 `null`；如果找到了匹配项，则返回包含匹配项的数组。
   - 数组的第一个元素是完整的匹配项，接下来的元素（如果有）是每个捕获组的匹配结果。

   示例代码如下所示：

   ```javascript
   const regex = /\d+/
   const text = 'Today is 2023-07-21.'
   const matches = text.match(regex)

   console.log(matches) // ["2023"]
   ```

   上述代码中，`/\d+/` 是一个正则表达式，表示匹配一个或多个连续的数字。使用 `match()` 方法，我们在字符串 "Today is 2023-07-21." 中找到了一个匹配项 "2023"，并将其作为数组返回。

   如果正则表达式中存在捕获组 `( )`，则 `match()` 方法会将捕获组的匹配结果作为数组的额外元素返回。例如：

   ```javascript
   const regex = /(\d{2})-(\d{2})-(\d{4})/
   const text = 'Today is 2023-07-21.'
   const matches = text.match(regex)

   console.log(matches) // ["2023-07-21", "20", "07", "2023"]
   ```

   上述代码中，正则表达式 `(\d{2})-(\d{2})-(\d{4})` 匹配了日期格式 "MM-DD-YYYY"。`match()` 方法返回的数组中，第一个元素是完整的匹配项 "2023-07-21"，接下来的元素分别是每个捕获组的匹配结果 "20"、"07" 和 "2023"。

   >需要注意的是，如果正则表达式使用了全局修饰符 `g`，则 `match()` 方法将返回所有匹配项组成的数组，而不仅仅是第一个匹配项。在不使用全局修饰符的情况下，`match()` 方法只返回第一个匹配项。

2. search() 方法：

   - `search()` 方法用于搜索字符串中第一个与正则表达式匹配的内容，并返回匹配的起始位置。
   - 如果找到匹配项，则返回匹配的起始位置（索引值）；如果未找到匹配项，则返回 -1。

   示例代码如下所示：

   ```javascript
   const regex = /world/
   const text = 'Hello, world!'
   const position = text.search(regex)

   console.log(position) // 7
   ```

   上述代码中，`/world/` 是一个正则表达式，表示在字符串中搜索 "world"。使用 `search()` 方法，我们找到第一个匹配项 "world" 在字符串中的起始位置，结果返回为 7。

3. replace() 方法：

   - `replace()` 方法用于在字符串中替换与正则表达式匹配的内容，并返回替换后的新字符串。
   - 可以通过指定替换值或替换函数来进行替换操作。

   示例代码如下所示：

   ```javascript
   const regex = /apple/
   const text = 'I have an apple.'
   const newText = text.replace(regex, 'banana')

   console.log(newText) // "I have a banana."
   ```

   上述代码中，`/apple/` 是一个正则表达式，表示匹配 "apple"。使用 `replace()` 方法，我们将字符串中的第一个 "apple" 替换为 "banana"，得到新的字符串 "I have a banana."。

4. matchAll() 方法：

   - `matchAll()` 方法用于获取字符串中与正则表达式匹配的所有结果，并返回一个迭代器（Iterator）对象。
   - 迭代器对象包含了多个匹配结果，每个结果都是一个数组。数组的第一个元素是完整的匹配项，接下来的元素（如果有）是每个捕获组的匹配结果。
   - `matchAll()` 方法适用于需要获取多个匹配结果的场景，且支持使用捕获组进行分组。

   示例代码如下所示：

   ```javascript
   const regex = /\w+/g
   const text = 'Hello world! How are you?'
   const matches = text.matchAll(regex)

   for (const match of matches) {
     console.log(match[0])
   }
   ```

   上述代码中，`/\w+/g` 是一个正则表达式，表示匹配一个或多个连续的单词字符。使用 `matchAll()` 方法，我们可以遍历字符串中所有匹配到的单词，将其打印出来。

5. split() 方法：

   - `split()` 方法用于根据正则表达式将字符串拆分成多个子字符串，并返回一个由拆分后的子字符串组成的数组。
   - 拆分的位置是基于正则表达式的匹配结果。正则表达式可以是普通的字符串，也可以是包含捕获组的表达式。
   - 拆分时，匹配结果本身不会包含在返回的数组中。

   示例代码如下所示：

   ```javascript
   const regex = /[\s,]+/
   const text = 'apple, banana, orange'
   const words = text.split(regex)

   console.log(words) // ["apple", "banana", "orange"]
   ```

   上述代码中，`/[\s,]+/` 是一个正则表达式，表示匹配一个或多个连续的空格字符或逗号。使用 `split()` 方法，我们将字符串根据空格字符和逗号进行拆分，得到一个由水果名称组成的数组。

## 正则常用语法

详细参考[正则表达式 – 语法 | 菜鸟教程 (runoob.com)](https://www.runoob.com/regexp/regexp-syntax.html)

### 字符匹配：

- 普通字符：只匹配自身，例如 `a` 匹配字符 "a"。
- 元字符（特殊字符）：具有特殊含义的字符，如 `.`、`*`、`+` 等。

### 字符

- .：匹配除换行符（`\n`、`\r`）之外的所有单字符；
- []：定义匹配的字符范围；在 `[]`里的 *，+，？，. 等表示的是字符
- \d：匹配数字 [0-9]；
- \D：匹配非数字 [^0-9]；
- \w：匹配 [0-9a-zA-Z_]；
- \W：匹配 [^0-9a-zA-Z_]；
- \s：匹配一个空白字符；
- \S：匹配一个非空白字符；
- [\s\S] 或 [\d\D] 或 [\w\W]：匹配所有字符
- \u2028：行分隔符
- \u2029：段分隔符

### 量词

- `*`：匹配前面的元素零次或多次。
- `+`：匹配前面的元素一次或多次。
- `?`：匹配前面的元素零次或一次。
- `{n}`：匹配前面的元素恰好 n 次。
- `{n,}`：匹配前面的元素至少 n 次。
- `{n,m}`：匹配前面的元素至少 n 次，但不超过 m 次。

### 定位符

- `^`：匹配字符串的开头。
- `$`：匹配字符串的结尾。
- `\b`：匹配单词的边界。
- `\B`：匹配非单词边界。

### 特殊字符转义

- 反斜杠 `\`：用于转义具有特殊含义的字符，如 `\.` 表示匹配点（.）而不是任意字符。

### 分组和捕获

- 圆括号 `( )`：将多个元素组合成一个单元，可用于分组或捕获。
- `(?:...)`：非捕获分组，不会生成捕获结果。

## 应用场景

正则RegExp在前端的应用：

1. 表单验证：可以使用正则表达式对用户输入的表单数据进行验证。例如，验证电子邮件地址、手机号码、密码强度等。

   ```javascript
   // 匹配16进制频色值
   var regex =/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/g;
   // 匹配日期，如yyyy-mm-dd格式
   var regex=/[8-9]{4}-(o[1-9]1[8-2])-(o[1-9]l[12][0-9]3[81])$/;
   // 匹配qq号
   var regex=/^[1-9][0-9]{4,10}$/g;
   // 手机号码正则
   var regex=/^1[34578]d{9}$/g;
   // 用户名正则
   var regex =/^[a-ZA-Z\$][a-ZA-Z0-9_\$]{4,16)$/;
   ```

2. 搜索关键词高亮显示：
   ```javascript
   const keyword = 'example'
   const regex = new RegExp(keyword, 'gi')
   const highlightedText = text.replace(regex, '<span class="highlight">$&</span>')
   ```
   上述代码使用正则表达式将文本中所有匹配到的关键词 "example" 替换为带有高亮样式的 HTML `<span>` 标签。

3. URL解析：
   ```javascript
   const url = 'https://www.example.com/path?param1=value1&param2=value2'
   const regex = /^(https?):\/\/([^:/?]+)(:\d+)?([^?#]*)\??([^#]*)#?(\w*)$/
   const matches = url.match(regex)
   ```
   此正则表达式可以将URL按照协议、域名、端口、路径、查询参数和片段等分组进行解析，并将结果存储在 `matches` 数组中。

4. 提取日期：
   ```javascript
   const text = 'Today is 2023-07-21.'
   const regex = /\d{4}-\d{2}-\d{2}/
   const date = text.match(regex)[0]
   ```
   上述代码使用正则表达式提取出文本中的日期，即形如 "YYYY-MM-DD" 的格式。

5. 批量替换文本中的指定内容：
   ```javascript
   const text = 'Replace all occurrences of foo and bar.'
   const regex = /foo|bar/g
   const replacedText = text.replace(regex, 'replacement')
   ```
   此正则表达式可以用于全局替换文本中所有匹配到的 "foo" 和 "bar" 为指定的 "replacement"。

6. 从逗号分隔的字符串中提取值：
   ```javascript
   const csv = 'John,Doe,30,Male'
   const values = csv.split(/,/)
   ```
   上述代码使用正则表达式 `/,/` 将逗号分隔的字符串拆分成数组，每个元素为一个值。

7. 只允许输入数字、限制字符长度：
   ```javascript
   const input = '12345'
   const numericRegex = /^\d+$/
   const maxLength = 10
   if (numericRegex.test(input) && input.length <= maxLength) {
     // 符合要求的输入
   }
   else {
     // 输入不符合要求
   }
   ```
   此正则表达式 `/^\d+$/` 用于检查输入是否只包含数字，且通过判断输入的长度是否超过给定的最大长度来限制字符长度。

以上示例仅展示了一小部分正则表达式在前端应用中的应用场景。实际上，正则表达式非常灵活，几乎可以处理任何基于模式匹配和搜索的需求。根据具体的需求，可以使用不同的正则表达式来实现相应的功能。
