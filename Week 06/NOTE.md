# Week 7 Notes

本周的结构目录如下：

- JS 语言通识
  - 泛用语言分类方法
  - 产生式
  - 现代语言分类
  - 编程语言的性质
  - 命令式编程语言设计方式
- JS 类型系统
  - Number
  - String
  - 其他
- JS 对象
  - 对象基础
  - 常用对象

从计算机语言理论讲起，通过泛用语言分类、产生式等介绍了关于语言定义的基础知识和历史。而后通过现代语言分类、编程语言的性质以及命令式编程语言的设计方式更进一步的介绍了一门语言在语言设计上的构成：Atom -> Expression -> Statement -> Structure -> Program。

而后从 JS 的类型系统开始，对 JS 内置类型做了简单的阐释，并且以浮点数为例介绍了 IEEE 754 标准下的双精度浮点数在计算机中的存储和表达，从原理上理清了 `Number` 类型的最大可表达范围和一些由精度问题引起的计算结果误差的原因，主要原因就是二进制与十进制转换过程中的精度损失。

最后简单介绍了 JS 中的对象，原型系统，内置对象的通用属性，并在作业中探索了所有不符合通用内置对象标准的特殊内置对象有哪些。

下面就针对课程作业，有针对性的谈一下个人的学习理解

## 括号表达式

高优先级表达式可涵盖 1,(1+2),(1*2),(1) 几种情况，将这几种情况涵盖在一个与 Additive & Multiplicative 同级的表达式可得到同样优先级的效果,只要能让每个 Expression 有能达到 <Number> 的路径应该就是有效的。

```shell
<PriorityExpression>::=
  |<Number>
  |"("<AdditiveExpression>")"

<AdditiveExpression>::=
  <MultiplicativeExpression>
  |<AdditiveExpression>"+"<MultiplicativeExpression>
  |<AdditiveExpression>"-"<MultiplicativeExpression>

<MultiplicativeExpression>::=
  <PriorityExpression>
  |<MultiplicativeExpression>"*"<PriorityExpression>
  |<MultiplicativeExpression>"/"<PriorityExpression>

```

> Babel 中把所有二元运算符的表达式全部解析为 BinaryExpression，为了简化处理，通过 Operator 来判断表达式具体类型。

## 计算机语言的分类
### 按语言等级分

- 机器语言

二进制的表达，现在基本不会直接使用。

- 汇编语言

用一些容易理解和记忆的字母，单词来代替一个特定的指令

- 高级语言

涵盖当前基本绝大多数计算机语言

### 按语言的执行方式

- 编译型语言

程序代码在执行前经过编译过程，将源代码转换为机器语言，运行时不需要依赖运行环境进行翻译，可直接执行。

主要有：C、C++、Pascal、Delphi、Golang 等

- 解释型语言

程序代码不直接翻译成机器语言，而是先翻译成中间代码，再由解释器 (Interpreter) 对中间代码进行解释运行。大部分脚本语言都是解释型语言。

主要有：JavaScript、Python、Erlang、PHP、Perl、Ruby 等。

- 混合型语言

半编译型语言，将语言编译成语言对应的运行时虚拟机（Runtime Vitural Machine）的中间码，中间码与机器码之间在运行时进行解释，既有编译过程又有解释过程。

主要有：Java、C#等。

> 随着计算机语言发展的不断成熟，越来越多的高级语言具有解释型语言和编译型语言共有的特性。语言的执行方式的边界越来越模糊。

### 类型系统

- 动态类型语言

编译时不做类型检查（或者没有编译过程），执行时有动态类型检查、类型推断、隐式转换等

Python、JavaScript、PHP

- 静态类型语言

编译时类型检查，编译后类型确定。

Java、C#

> 静态类型语言常见于复杂业务的服务端软件中，这类软件要求稳定性比较高，静态类型能在编译阶段发现类型导致的问题，对开发者约束性较强。而动态语言编写灵活，大部分不需要编译，直接在运行环境中解释执行，常见于脚本语言。


## 面向对象编程的类的抽象设计：狗咬人

### Version 1

从狗的视角出发，狗只是做了一个 `咬` 的动作，但是其实改变的是 `人` 的状态，它并不用关心被咬的是人还是其他的什么东西，所以以下的设计是不合格的，这样设计类的话会导致狗需要在 `bite` 方法里硬编码很多种被 `咬` 对象的特殊处理，不具有通用性。

```javascript
class Dog {
  constructor(name) {
    this.name = `[DOG] ${name}`;
  }

  bite(target) {
    console.log(`[${target.type}] ${target.name} got bite by ${this.name}`);
  }
}

class Human {
  constructor(name) {
    this.name = name;
    this.type = "HUMAN";
  }
}

let dog = new Dog('puppy')
let human = new Human('john')

dog.bite(human);
```

### Version 2

将 `咬` 这个狗身上发起的动作换一个角度看，就是 `人` 受到了伤害（状态改变）。那么我们把关注点放在 `人` 的状态改变上，创建一个 `hurtBy` 的动作来表示被 `XX` 伤害，这样虽然比先前更进一步，但是还是不够好。因为 `hurtBy` 这个动作命名上来看并没有改变 `人` 状态的意思，并且在 `hurtBy` 中依然强依赖传入的 `source` 这个来源的类型，需要对很多不同的类型做兼容性处理，扩展能力有限。

```javascript
class Dog {
  constructor(name) {
    this.name = name;
    this.type = 'DOG';
  }
}

class Human {
  constructor(name) {
    this.name = name;
    this.type = "HUMAN";
  }

  hurtBy(source){
    if(source.type === 'DOG'){
      console.log(`[${source.type}] ${source.name} just bited [${this.type}] ${this.name}!`)
    }else{
      console.log(`[${this.type}] ${this.name} is hurted by [${source.type}] ${source.name}`)
    }
  }
}

let dog = new Dog('puppy')
let human = new Human('john')

human.hurtBy(dog);

```

### Version 3

我们将 `版本2` 中的代码稍作调整，将 `人` 上的动作换成 `hurt` 这个具有主观状态改变意义的方法名，并且将 `hurt` 的 `damage` 进一步抽象成为一个具有 `source` 和 `type` 属性的自定义类型，将我们的 `Person` & `Dog` 类变得更加纯粹，只需要关注本身即可。类似 `damage` 这样的自定义数据类型来做统一接口的抽象。

> 其实这样的思想在我看来，简单可以理解为：尽量对类进行 `Pure` 的处理，只需要关注本身状态的改变，而不去关心 `其他的外部因素`，将这些 `外部因素` 进一步 `Pure` 化，如此反复。这样我们的自定义类就变得非常容易维护和测试，而这些 `外部因素` 我们可以以严格的接口定义或者其他的复杂判断的方式进行约束，将不 `纯` 的代码控制在很小的范围内。在函数式编程的概念中，也有类似的概念，就是 `纯函数`，输入一定则输出一定，非常容易测试。但是实际业务开发中不可避免的会使用到很多 `不纯` 的函数来快速的解决我们的业务问题，这也是一个取舍。

```javascript
class Dog {
  constructor(name) {
    this.name = name;
    this.type = 'DOG';
  }
}

class Human {
  constructor(name) {
    this.name = name;
    this.type = "HUMAN";
  }

  hurt(damage){
    console.log(`[${this.type}]${this.name} just got [${damage.type}] from [${damage.source.type}]${damage.source.name}.`)
  }
}

let dog = new Dog('puppy')
let human = new Human('john')

human.hurt({source: dog, type: 'BITE'});
```

## JavaScript 中的特殊内置对象

- Array：Array 的 length 属性根据最大的下标自动发生变化。  
  注意，Array 的 length 属性也是可以手动修改的，会造成实际数组元素个数与 length 属性不匹配的情况。。

- Object.prototype：作为所有正常对象的默认原型，不能再给它设置原型了。  
  这个对象上也没有[[proto]]属性

- String：为了支持下标运算，String 的正整数属性访问会去字符串里查找。  
  有点类似内置了一个装箱拆箱的过程，只不过这个过程是内置的，在js层面看不到

- Arguments：arguments 的非负整数型下标属性跟对应的变量联动。  
  是一种特殊类型的类数组对象，但是没有数组对象上的方法，可以通过对象展开符转换为数组类型后操作，或是使用call apply等方式调用数组上的方法。

- 模块的 namespace 对象：特殊的地方非常多，跟一般对象完全不一样，尽量只用于 import 吧。

- 类型数组和数组缓冲区：跟内存块相关联，下标运算比较特殊。

- bind 后的 function：跟原来的函数相关联。  
  bind后的方法不能够再次bind，内部this永远指向第一次bind时的对象。

> 参考资料：  
  - [【重学前端】JavaScript对象：你知道全部的对象分类吗？](https://time.geekbang.org/column/article/80011)
  - [ECMA262 Immutable Prototype Exotic Objects](https://tc39.es/ecma262/#sec-immutable-prototype-exotic-objects)

## 总结

本周的课程给我的第一映像就是内容量比较大，涵盖范围非常广。特别是在计算机语言基础部分，如果展开的话可以作为一门课程来看待。`winter` 老师还是比较有针对性的对产生式进行了详细的讲解，对于前端开发人员来说，在接触到 `babel` 编译层面的工作内容以后，再回头来看这些知识我觉得是相当有必要的，结合 `babel` 的源码结构来看就更容易具象化这些理论知识。作为一个非 `计算机` 专业毕业的人来说，补齐这块短板还是很有用的。

其次对 OOP 编程范式的类的设计也举了一个很有意思的例子，简单说就是当有两个类，他们互相之间会有影响的时候，这时候我们类的设计边界在哪里？如何去尽量贴近范式的方式去解决这个问题，我也在相应的章节中提出了自己的理解，这也让我重新思考了范式推荐的方法会对我们编写的代码造成怎样的影响，而并不是仅仅遵守范式这个程度而已。

最后，在一些需要 `搜索` 类型的作业现在回头看来还是收获很大的，其实这些知识在标准中都有，而且描述的非常详细，只是在平时都不会主动去看，而是偏向于直接去类似 `CSDN` 上去搜 N 手知识和不准确的理解，这样其实是有害的。因为当水平不断提高以后，可能基础上理解的细微偏差会造成对技术问题表象的错误判断。在学习本周课程的过程中，我个人在前端知识领域里的知识深度又提高了。

