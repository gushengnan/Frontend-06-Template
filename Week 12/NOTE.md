# Week 12 Note

本周着重介绍了 CSS 盒模型、流以及 BFC 的概念
## Block

> BFC: Block formatting context

- Block Container: 里面有 BFC 的。能容纳正常流的盒，里面就有 BFC
- Block-level Box: 外面有 BFC
- Block Box = Block Container + Block-level Box: 里外都有 BFC

这些概念实际上是比较抽象的，如果只从概念上去理解可能比较困难。课上结合了一些 BFC 导致的问题来解释了 BFC 这个概念的存在以及如何用创建新 BFC 的方式来解决同一个 BFC 下盒之间布局的问题。也从 BFC 这个概念上解释了 `float` 的定义。

### Block Container

以下这些 CSS 的属性可以控制生成一个 Block Container，也就是内部包含一个 BFC 能够容纳正常流的盒。

- `display: block`
- `display: inline-block`
- tabel-cell
- flex-item
- grid cell
- table-caption

### Block Level Box

- Block Level
    - `display: block`
    - `display: flex`
    - `display: table`
    - `display: grid`
    - ...
- Inline Level
    - `display: inline-block`
    - `display: inline-flex`
    - `display: inline-table`
    - `display: inline-grid`
    - ...

> `display: run-in` 根据上一个元素的属性来获得自身的属性，可以是 inline 也可以是 block。

### 设立 BFC 的情况

以下这些属性可以创建一个新的 BFC，如果说默认在同一个BFC下出现了一些布局的问题，可以使用下面的属性创建一个新的 BFC 来解决其中一部分问题。

- floats
- absolutely positioned elements
- block containers (such as inline-blocks, table-cells, and table-captions) that are not block boxes:
    - flex items
    - grid cell
    - ...
- and block boxes with `overflow` other than visible

> 默认能容纳正常流的盒都能创建 BFC，只有一种情况例外：Block Box 里外都是 BFC，并且 `overflow: visible`。

### BFC 合并

- block box && overflow: visible
    - BFC 合并与 float
    - BFC 合并与边距折叠

## 动画

动画有两种属性可以控制，使用 transition 来定义简单的过渡动画，而 animation + @keyframe 的方式可以分段定义复杂动画。

### Animation

- animation-name            动画名称
- animation-duration        动画时长
- animation-timing-function 动画的时间取消
- animation-delay           动画开始时的延迟
- animation-iteration-count 动画的播放次数
- animation-direction       动画的方向

### Transition

- transition-property           要变换的属性
- transition-duration           变化的时长
- transition-timing-function    时间曲线
- transition-delay              延迟



## 绘制

绘制是一类与布局无关的控制属性，常用的如下：

- 几何图形
    - border
    - box-shadow
    - border-radius
- 文字
    - font
    - text-decoration
- 位图
    - background-image

## 总结

本周介绍的 BFC 的 margin collapse 现象在开发过程中很常见，以前我一直不知道导致这种行为的原因和其根本原理。而在经过本周的课程中我可以将我以前遇到的很多类似的问题归咎于 BFC 类的问题，而解决 BFC 类的问题的最通用的方法就是为问题元素创建一个不同的 BFC。

对于 HSV 和 HSL 这两个颜色函数，之前在开发中很少会用到，但是经过这周的学习，了解到它们是一种语义化的颜色抽象，对于主题的制作来说非常的实用，就可以完全不使用 CSS 预处理器的转换函数对 rgb 颜色进行转换了，而是直接使用 hsl hsv 这样的方式来定义颜色，缺点就是可能常用颜色的记忆需要重新来一遍了，在于一些主题色场景下还是很实用的，配合 css variable 可以很容易的实现主题切换。

本周对于 cubic bezier 曲线的部分也非常实用，我曾经写过 `ease` 类的函数，其本质就是一个插值曲线，能够将不同时间点对应的值进行计算，实现的动画效果比线性动画要好很多，而 cubic bezier 是一个更为通用的插值曲线，能够通过两个甚至多个控制点来实现更复杂的曲线（也包括 ease 曲线），例子中实现的抛物线程序也很有意思，值得自己尝试去实现。

