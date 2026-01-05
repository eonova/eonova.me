---
title: 从作用域到闭包的全面解析
date: '2025-12-11T03:13:39.164Z'
modifiedTime: '2025-12-11T00:00:00Z'
intro:
  ''
tags: ['js进阶', 'JavaScript核心原理']
cover: ''
---

## 词法作用域与动态作用域：作用域的底层逻辑
作用域是变量的可访问范围，决定了变量的查找规则，JS采用**词法作用域（静态作用域）**，与动态作用域形成本质区别。

### 词法作用域的核心规则
词法作用域的作用域范围在**函数定义时**即确定，而非函数调用时。也就是说，函数的作用域由其在代码中的书写位置决定：
```javascript
var value = 1;

function foo() {
    console.log(value);
}

function bar() {
    var value = 2;
    foo();
}

bar(); // 输出1
```
上述代码中，`foo`函数定义时的上层作用域为全局作用域，因此调用时会查找全局的`value`（值为1），而非`bar`函数内的`value`（值为2）。

### 动态作用域的对比
动态作用域的作用域范围在**函数调用时**确定，变量查找会从调用栈的当前作用域向上追溯。例如bash脚本采用动态作用域：
```bash
value=1
function foo () {
    echo $value;
}
function bar () {
    local value=2;
    foo;
}
bar # 输出2
```
此处`foo`调用时的作用域为`bar`函数，因此读取的是`bar`内的`value`。

### 经典面试题：作用域与函数执行位置
两段代码执行结果相同，但执行逻辑存在本质差异：
```javascript
// case1
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f();
}
checkscope(); // local scope

// case2
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}
checkscope()(); // local scope
```
两者的核心区别在于**执行上下文栈的变化**：case1中`f`函数在`checkscope`执行时直接调用，`checkscope`与`f`的执行上下文同时存在于栈中；case2中`checkscope`先执行完毕并出栈，再调用返回的`f`函数，`f`的执行上下文单独入栈，但因词法作用域的特性，依然能读取`checkscope`的`scope`。

## 执行上下文与执行上下文栈：代码的执行机制
JS引擎通过**执行上下文**管理代码执行环境，通过**执行上下文栈**管理多个执行上下文的生命周期，这是代码顺序执行与函数调用的底层逻辑。

### 可执行代码的三类场景
JS的可执行代码分为三类，每类代码执行时都会创建对应的执行上下文：
1. **全局代码**：整个脚本的顶层代码，初始化时创建全局执行上下文；
2. **函数代码**：函数调用时创建函数执行上下文；
3. **eval代码**：eval函数执行时创建eval执行上下文（工程中不推荐使用）。

### 执行上下文栈的工作流程
执行上下文栈（ECS）是管理执行上下文的栈结构，遵循“先进后出”原则：
1. 程序启动时，全局执行上下文率先入栈，且始终处于栈底直至程序结束；
2. 函数调用时，对应的函数执行上下文入栈；
3. 函数执行完毕，其执行上下文出栈；
4. 所有代码执行完毕，仅全局执行上下文留存于栈中。

以嵌套函数调用为例：
```javascript
function fun3() {
    console.log('fun3')
}
function fun2() {
    fun3();
}
function fun1() {
    fun2();
}
fun1();
```
其执行上下文栈的变化为：
```
ECStack.push(globalContext) // 初始化
ECStack.push(fun1Context)   // 调用fun1
ECStack.push(fun2Context)   // fun1调用fun2
ECStack.push(fun3Context)   // fun2调用fun3
ECStack.pop()               // fun3执行完毕
ECStack.pop()               // fun2执行完毕
ECStack.pop()               // fun1执行完毕
```

### 执行上下文的三个核心属性
每个执行上下文都包含三个关键属性，共同决定了代码的执行环境：
1. **变量对象（VO）**：存储上下文内的变量、函数声明等；
2. **作用域链**：实现变量的分层查找；
3. **this**：确定函数执行时的上下文对象。

## 变量对象：变量与函数的存储容器
变量对象（VO）是执行上下文的核心数据结构，负责存储当前上下文的变量和函数声明，在不同上下文下有不同的表现形式。

### 全局上下文的变量对象
全局上下文的变量对象即为**全局对象**（浏览器环境为`window`），具备以下特性：
1. 可通过`this`直接访问，`this === window`；
2. 是全局变量的宿主，全局变量会成为其属性；
3. 包含JS内置的方法和属性（如`Math`、`parseInt`）。
```javascript
var a = 1;
console.log(this.a); // 1（全局变量a挂载到window）
console.log(window.parseInt('123')); // 123（调用全局对象方法）
```

### 函数上下文的活动对象
函数上下文的变量对象称为**活动对象（AO）**，仅在函数执行时激活，其创建分为两个阶段：
1. **进入执行上下文阶段**：初始化AO，依次处理形参、函数声明、变量声明：
   - 形参：按实参赋值，无实参则为`undefined`；
   - 函数声明：直接赋值为函数对象，若存在同名变量则覆盖变量；
   - 变量声明：赋值为`undefined`，若与形参/函数同名则不覆盖。
   
   示例：
   ```javascript
   function foo(a) {
     var b = 2;
     function c() {}
     var d = function() {};
   }
   foo(1);
   ```
   进入阶段的AO为：
   ```javascript
   AO = {
       arguments: { 0: 1, length: 1 },
       a: 1,
       b: undefined,
       c: 函数c的引用,
       d: undefined
   }
   ```

2. **代码执行阶段**：按代码顺序修改变量对象的属性值，上述示例执行后的AO为：
   ```javascript
   AO = {
       arguments: { 0: 1, length: 1 },
       a: 1,
       b: 2,
       c: 函数c的引用,
       d: 函数d的引用
   }
   ```

## 作用域链：变量的查找路径
作用域链是由多个执行上下文的变量对象组成的链表，其核心作用是**实现变量的分层查找**，遵循“从内到外”的查找规则。

### 作用域链的创建过程
1. **函数创建时**：函数会通过内部属性`[[scope]]`保存父级变量对象，形成初始作用域链；
2. **函数激活时**：将当前函数的活动对象（AO）压入`[[scope]]`前端，形成完整的作用域链，即`Scope = [AO].concat([[scope]])`。

### 作用域链的查找规则
变量查找时，先从当前AO中查找，若不存在则沿作用域链向上查找父级VO，直至全局上下文的VO：
```javascript
var scope = "global scope";
function checkscope(){
    var scope2 = 'local scope';
    return scope2;
}
checkscope();
```
`checkscope`函数的作用域链为`[checkscopeAO, globalVO]`，查找`scope2`时直接从自身AO获取，无需追溯全局。

## .this：函数的执行上下文对象
`this`是执行上下文的核心属性，其指向**在函数调用时动态确定**，而非函数定义时，其底层逻辑可通过ECMAScript规范的`Reference`类型解析。

### Reference类型的核心作用
`Reference`是规范层面的抽象类型，用于描述变量/属性的绑定关系，包含三个核心组件：
- `base value`：属性所在的对象或环境记录；
- `referenced name`：属性名称；
- `strict reference`：严格模式标记。

### this指向的判定规则
根据规范，`this`的指向可通过以下步骤判定：
1. 计算函数调用左侧的`MemberExpression`（即`()`左侧的表达式），得到结果`ref`；
2. 若`ref`为`Reference`类型：
   - 若`ref`的`base value`为对象，则`this`指向`base value`；
   - 若`ref`的`base value`为环境记录，则`this`为`undefined`（非严格模式下转为全局对象）；
3. 若`ref`非`Reference`类型，则`this`为`undefined`（非严格模式下转为全局对象）。

### 经典案例解析
通过案例可直观理解`this`的指向逻辑：
```javascript
var value = 1;
var foo = {
  value: 2,
  bar: function () {
    return this.value;
  }
};

console.log(foo.bar()); // 2（ref为Reference，base为foo）
console.log((foo.bar)()); // 2（()不改变Reference类型）
console.log((foo.bar = foo.bar)()); // 1（赋值操作返回非Reference类型，this为全局）
console.log((false || foo.bar)()); // 1（逻辑运算返回非Reference类型）
console.log((foo.bar, foo.bar)()); // 1（逗号运算返回非Reference类型）
```

## 闭包：作用域的高级应用
闭包是JS的核心特性，其本质是**函数与可访问的自由变量的组合**，是作用域链机制的延伸。

### 闭包的定义与分类
- **理论闭包**：所有JS函数都是闭包，因为函数创建时会保存父级作用域，可访问自由变量；
- **实践闭包**：满足以下两个条件的函数才是工程意义上的闭包：
  1. 创建函数的上下文已销毁，函数仍能存在（如内部函数从父函数返回）；
  2. 函数内部引用了自由变量。

### 闭包的底层逻辑
闭包的实现依赖**作用域链的保留**，即使父函数执行完毕出栈，其变量对象仍会因子函数的引用而保存在内存中：
```javascript
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}

var foo = checkscope();
foo(); // local scope
```
`checkscope`执行完毕后，其AO本应被销毁，但因`f`的作用域链包含`checkscopeAO`，因此`checkscopeAO`被保留，`f`可正常读取`scope`。

### 经典面试题：闭包解决循环绑定问题
循环中直接绑定函数会导致变量共享，闭包可实现变量隔离：
```javascript
// 问题代码：所有函数输出3
var data = [];
for (var i = 0; i < 3; i++) {
  data[i] = function () {
    console.log(i);
  };
}
data[0](); // 3

// 闭包优化：输出0、1、2
var data = [];
for (var i = 0; i < 3; i++) {
  data[i] = (function (i) {
        return function(){
            console.log(i);
        }
  })(i);
}
data[0](); // 0
```
优化方案通过立即执行函数创建闭包，将每次循环的`i`值保存在匿名函数的AO中，实现变量独立绑定。
