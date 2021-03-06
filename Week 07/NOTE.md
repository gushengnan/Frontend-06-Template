# Week 7 Note

## 本周课程大纲

- JS 表达式
    - 运算符和表达式
    - 类型转换
- JS 语句
    - 运行时相关概念
    - 简单语句和复合语句
    - 声明
- 结构化
    - 宏任务与微任务
    - JS 函数调用

## 分项总结

本周的内容涵盖范围比较广，根据我个人的理解谈一谈每一个大类部分理解和实用意义。

### JS 表达式

一般在开发过程中我会使用比较严格的 `eslint` 规则来尽量的避免隐式转换的发生，但是很多时候在做诸如 `接口对接` 和 `数值计算` 的过程中又不可避免的会使用到隐式转换，在经验不足的情况下很可能出现类型问题导致的错误发生，这也是 `JavaScript` 的一个痛点，动态类型推导 + 隐式类型转换带来的好处是编码时很方便，但是一旦遇到需要严格限制变量类型的情况下，就不得不依赖一些三方库中的 `isXXX` 工具函数来实现安全类型的判断，然而这些三方库中的判断条件也仅仅只能覆盖常见的场景，如果是需要依靠自己手写判断逻辑的话，不可避免的会加入复杂的 `if else` + `正则表达式` 的组合，也就增加了代码的复杂度。当然使用 `TypeScript` 可以很大程度上降低开发时对不确定类型的 `焦虑` 感。

> 就像是第二节练习题中的字符串与数值之间的转换操作，如果只针对无符号的整数进行转换的话其实逻辑还是相对简单的。不过一旦需要考虑到各种异常输入的情况，那么可能处理这些输入类型判断的代码可能比转换代码本身还要长。还有就是小数在非 10 进制中的表达，其实其他进制是没有所谓小数点的概念的，而更多的是靠存储结构来实现了浮点数，我也看了几个优秀答案，对于小数点的处理基本就是忽略，或者是沿用十进制的表达，其实这是不准确的。

### JS 语句

这部分给我收获最大的就是 `winter` 老师在更高的理论层面上解释了 `变量提升` 这个概念在 `JS` 运行时代码解析层面上的表现，我原来对变量提升的概念理解基本是停留在穷举所有可能出现的情况和它的表现，但实际上在更抽象的理论层面上来看，这是 `Variable Declaration` 的一种特殊行为处理，虽然早就被 `JavaScript 语言精粹` 一书归类为 `语言糟粕` 了，但是能够更深入的理解这种表现所基于的理论，对我个人而言还是很有提升的。

### 结构化

这部分中我觉得宏任务和微任务还有时间循环相关的知识还是有点少了，因为在高级前端岗位的面试过程中，这项知识掌握的深度还是比较影响面试官对面试者的评价的。宏任务、微任务、执行栈、定时器、事件循环这几个概念之间非常细节的关系和一些边界情况还是比较值得去深挖的。拿我个人经历来说，这方面的知识都是靠碎片化补充的，还是需要有个系统的梳理。

关于 `Realm` 作业，起初我以为是已经实现的标准，靠新建一个 `Realm` 对象实例然后遍历所有自身属性的方式就可以拿到所有实例对象了，后来在微信群里看到讨论后并且在查阅了标准后发现它并不是一个暴露给用户的对象，那么就需要我们去标准中一一列举出来后拼接成图标库树结构所能展现的结构。如果 `Realm` 成为了标准的一部分，那么依靠 `iframe` 来模拟沙盒的微前端隔离解决方案可能会迎来革命性的提升。