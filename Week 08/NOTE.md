# Week 8 Notes

本周主要介绍了有限状态机（Finite-state Machine 后统一使用 `FSM` 代替），以及 `FSM` 在 `Http` 协议场景下的请求头和请求体的解析操作。

## 有限状态机
> ### [Defination on wikipedia](https://en.wikipedia.org/wiki/Finite-state_machine): 
> A finite-state machine (FSM) or finite-state automaton (FSA, plural: automata), finite automaton, or simply a state machine, is a mathematical model of computation. It is an abstract machine that can be in exactly one of a finite number of states at any given time. The FSM can change from one state to another in response to some inputs; the change from one state to another is called a transition. An FSM is defined by a list of its states, its initial state, and the inputs that trigger each transition. Finite-state machines are of two types—deterministic finite-state machines and non-deterministic finite-state machines.A deterministic finite-state machine can be constructed equivalent to any non-deterministic one.

本课中主要涵盖的是 `DFA`(deterministic finite-state machines), 即在给定的 `输入` 和 `当前状态` 一定的情况下，下一个状态是确定的。

而 `NFA`(non-deterministic finite-state machines) 仅根据当前输入和状态是无法直接得到下一个状态的，还需要其他的信息。 (eg: 从前向后读取字符串来判断一个字符串是否以给定的字符串结尾，这种情况只有结尾状态达成后从后向前进行回溯判断，或者在每个状态处产生分支) 

高优先级表达式可涵盖 1,(1+2),(1*2),(1) 几种情况，将这几种情况涵盖在一个与 Additive & Multiplicative 同级的表达式可得到同样优先级的效果,只要能让每个 Expression 有能达到 <Number> 的路径应该就是有效的。

### 结合 KMP 算法动态生成 FSM

基于第四周的课程，我们已经知道 `KMP` 算法的关键就是基于 `pattern` 串来生成 `next` 表格用于记录失配后的回溯位置。我们可以用 `FSM` 来替代 `KMP` 中字符串匹配部分的代码。核心代码如下：

```javascript
  generateStateFuncs(pattern, kmpTable) {
    let { length } = pattern;
    let stateFuncs = new Array(length);

    for (let i = 0; i < length; i++) {
      stateFuncs[i] = char => {
        if (char === pattern[i]) {
          let next = i + 1;
          // 向后匹配，如果 next 索引越界，则状态调整为终结态
          return next === length ? this.stateEnd : stateFuncs[next];
        } else {
          // 向前回溯，根据 kmp nextTable 获取可以回溯的上一个状态，直至初始状态
          return i > 0 ? stateFuncs[kmpTable[i]](char) : stateFuncs[0];
        }
      }
    }

    return stateFuncs;
  }
```

假设我们的输入 `pattern` 为 `abcabx`，则 `next` 表格如下：

|pattern|a|b|c|a|b|x|
|-|-|-|-|-|-|-|
|next|-1|0|0|0|1|2|

如果用 `FSM` 模型去做匹配，如果用一个与 `pattern` 串长度相同的数组来表示所有的状态的话：

- 匹配成功时：状态改变为数组中的下一个位置的状态。
- 匹配失败时：状态改变为 `next` 表格中当前位置对应的回溯位置的状态。

这样我们就可以按照 `next` 数组的 `索引` 和 `回溯位置` 生成一系列的状态函数，并且这些状态函数中包含了匹配成功与匹配失败后的下一个状态，这样我们就完成了一个可以动态生成的基于 `KMP` 算法的 `FSM` 。

## Http 协议解析

简单来看，Http 协议请求/返回体包含：Status、Headers、Body 三个部分。

- Status 部分：主要包括协议类型版本、状态码、状态文字等信息，以 `\r\n` 结尾。
- Headers 部分：单行结构为 `[key]: [value]`，行结束符为 `\n`，整体部分以 `\r` 结尾。
- Body 部分：不同的 `Transfer-Encoding` 会有不同的请求体结构，比较常见的有 `chunked` 类型结构。

而针对 Http 协议的确定的 Status + Header 部分与不确定的 Body 部分，在实现 Parser 时我们将 BodyParser 单独抽象出不同的类型，并且根据 `Transfer-Encoding` 去使用不同的 `FSM` 来处理不同类型的 Body 结构，而相对确定的 Status + Header 部分我们只需要用一个确定的 `FSM` 即可。

实现使用了 if...else + 魔法值的方式来控制状态的改变，而不是先前的以改变状态的函数来作为状态。这样做其实对于代码的可读性而言会稍微差一点，并且在 if...else 每次都会从上到下进行多次判断，性能上不如直接定义成函数的解决方式。（使用 if...else 的性能最差情况出现在判断成功的条件出现在结构末尾的情况，而函数方式不会有这个问题，因为下一个状态已经确定了，下一次只需要进入这个状态内部的判断就可以了）。

## 总结

 `FSM` 这种程序设计模型特别适合解决复杂的并且有确定标准的问题，很多协议的解析利用的都是 `FSM` 来处理，正则表达式中的大部分功能也可以用 `DFA` 实现。`FSM` 的概念将复杂的问题拆分成了一个个分离的状态，状态之间的改变定义在每一个状态中，这种天然解耦的结构特别适合用来处理复杂标准的解析。

语言的解析也可以用 `FSM` 来处理，但大多数语言不能直接使用 `DFA` 来处理，因为在从前向后解析的过程中大部分时间我们没法通过当前状态和输入来决定下一个状态，而是可能会需要向后走更多步骤后再回溯到当前位置来进行判断，这也就属于 `NFA` 的范畴。

所以 `DFA` 属于 `FSM` 中最好实现的那一种，但是决定使用哪种 `FSM` 的解决方案还是需要经验来判断的。
