# Week 2 Notes

本周课程内容主要围绕解析一段四则运算的字符串（暂时不包含括号），并生成 `Abstract Syntax Tree (AST)` 对象展开。

## 涉及知识点
- Lexical Analysis（词法分析，对应 `tokenize` 函数）
- Semantic Analysis（语法分析，对应用于解析各种 `Expression` 的函数）

### 词法分析 (Lexical Analysis)
将代码字符串按照语言标准转化为以 `Token` 为最小单位的序列，为语法分析做准备。在本课中能够解析的 `Token` 为 `["Number", "WhiteSpace", "LineTerminator", "*", "/", "+", "-"]`，生成顺序是从左至右直到 `EOF` 为止。

### 语法分析 (Semantic Analysis)
按照一定的语法标准将 `Tokenize` 后包含的 `Token List` 按照从左至右的顺序进行语法分析，并生成 `AST` 对象，其标准如下：
#### 标准版乘法和加法表达式（Standard ECMA-262）
- 乘法： [MultiplicativeExpression](http://www.ecma-international.org/ecma-262/11.0/index.html#prod-MultiplicativeExpression)
- 加法： [AdditiveExpression](http://www.ecma-international.org/ecma-262/11.0/index.html#prod-AdditiveExpression)

#### 课程中简化版的加法和乘法表达式标准
- 乘法
```shell
<MultiplicativeExpression>::=
  <Number>
  |<MultiplicativeExpression><*><Number>
  |<MultiplicativeExpression></><Number>
```

- 加法
```shell
<AdditiveExpression>::=
  <MultiplicativeExpression>
  |<AdditiveExpression><+><MultiplicativeExpression>
  |<AdditiveExpression><-><MultiplicativeExpression>

// ***  or expanded as  ***
<AdditiveExpression>::=
  <Number>
  |<MultiplicativeExpression><*><Number>
  |<MultiplicativeExpression></><Number>
  |<AdditiveExpression><+><MultiplicativeExpression>
  |<AdditiveExpression><-><MultiplicativeExpression>
```

### LL(k) Parser
> In computer science, an LL parser (Left-to-right, Leftmost derivation) is a top-down parser for a subset of context-free languages. It parses the input from Left to right, performing Leftmost derivation of the sentence.

这里引用 wikipedia 上针对 LL 算法的解释，这里的 k 主要指的是向前最多看多少个 `token`。那么本课的四则运算的 k 应该是多少呢？我觉得是 1。

## 总结
编译原理在现在的前端中成为了原来越重要的组成部分，无论是TS/ES6/ES5等的转换，亦或是代码混淆压缩技术，更甚至是跨平台小程序编译框架的实现，无不依赖编译原理来实现这些复杂的能力。其实 `babel` 已经提供了很强大的 `api` 来供开发者开发不同的 `loader` & `plugin` 来实现一些超过当前 ES 标准所能够做到的一些事情。比较常用的是 `babel-import-plugin` 能够让开发者不需要在开发过程中显式引入样式文件而在编译时自动添加组件关联样式文件的 `import`，这也是利用了生成的 `AST` 中对 ImportStatement 做扫描和符合规则替换的一种实现。这类社区工具大大降低了开发者针对编译时进行定制的能力，但是如果需要编写这类插件还是需要对编译原理有一定的基础的，因为制定过于宽松的替换规则容易导致一些难以发现的 `bug`, 在编译时的修改的 `debug` 难度也跟高。

## 题外话
在刚开始接触编程的时候我是很避讳去学习正则表达式的，一个是这个表达式太抽象了，有很多规则需要去死记硬背，二是在现代语言已经提供了很多能够完成简单正则匹配替换能力的现成 `api` 的情况下我不太需要去单独学习正则表达式。但是这都在我接触到编译原理并且理解到编译原理在前端技术中的重要性的时候，才真正开始理解为什么会有正则表达式这门技术。

它不仅能够以很简短的表达式规则来表示很复杂的匹配模式，也能够大大的减少 `if/else`、`switch` 等条件语句在复杂匹配需求情况下的嵌套，提升代码的可读性，特别是在像类似语法分析和词法分析这种场景下就特别的好用。随着前端技术生态的不断完善，出现的类似 `babel` 这样的代码转换工具无不都是基于正则表达式来完成的词法分析部分的工作。