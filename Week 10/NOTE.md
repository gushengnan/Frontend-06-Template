# Week 10 Note

> 回顾浏览器工作流程
```shell
+---+
|URL|
+---+
  |
  +---+ HTTP
  v
+----+
|HTML|
+----+
  |
  +---+ Parse
  v
+---+
|DOM|
+---+
  |
  +---+ CSS Computing
  v
+------------+
|DOM with CSS|
+------------+
  |
  +---+ Layout
  v
+-----------------+
|DOM with Position|
+-----------------+
  |
  +---+ Render
  v
+------+
|Bitmap|
+------+

```

本周的内容主要涵盖了由 `DOM with CSS` 通过 `Layout` 计算产生 `DOM with Position` （View Port 平面坐标系）然后生成位图的过程。本周课程的 `Layout` 阶段只针对单独 `flex` 方式的布局进行了计算的实现（因为常用且规则明确）。

## Flex 布局

> [MDN Glossary: Flex](https://developer.mozilla.org/en-US/docs/Glossary/Flex): `flex` is a new value added to the CSS `display` property. Along with `inline-flex` it causes the element that it applies to in order to become a flex container, and the element's children to each become a flex item. The items then participate in flex layout, and all of the properties defined in the CSS Flexible Box Layout Module may be applied.  
> The `flex` property is a shorthand for the flexbox properties `flex-grow`, `flex-shrink` and `flex-basis`.

在使用时在父元素节点上显式的生命 `display: flex` 属性，那么该元素就会被认为是一个弹性布局容器 (flex container)，它的所有 `直接子节点`（只有直接子节点） 也就是 `flex item`。

`flex` 布局中比较核心的概念之一是轴，所有 `flex` 容器都有 2 个轴，分别为 `主轴 (Main Axis)` 和 `交叉轴 (Cross Axis)`，这也是其布局的基础。默认情况下主轴为从左至右方向，交叉轴为自上而下方向，元素按照这个规则进行排序。那么以往需要使用float来进行的布局使用 `flex` 布局就相当简单。并且 flex 布局本身提供了相当多的属性配置能够让我们很容易的实现横向撑满，垂直居中等常见场景。

在布局容器节点中，我们可以通过定义以下一些属性来调整容器中子元素的通用行为：

- `flex-direction`：确定主轴的方向
    - `row`: 从左到右依次排列
    - `row-reverse`：从右到左依次排列
    - `column`：从上到下依次排列
    - `column-reverse`：从下到上依次排列
- `flex-wrap`: 当内部元素主轴方向宽度超出容器宽度时的行为
    - `nowrap`：超出宽度的部分 overflow，不自动换行
    - `wrap`：自动换行，换行部分按照主轴方向排列
    - `wrap-reverse`：自动换行，换行部分按照主轴的反方向排列
- `justify-content`：主轴上的对齐方式，可选属性为 `flex-start | flex-end | center | space-between | space-around`
- `align-items`：子元素在交叉轴上的对齐方式，可选属性为 `flex-start | flex-end | center | baseline | stretch`
- `align-content`：多根轴线（wrap 的情况）的对齐方式。如果项目只有一根轴线，该属性不起作用，可选属性为 `flex-start | flex-end | center | space-between | space-around | stretch`

子节点中可以控制行为的属性：

- `flex`：`flex-grow`, `flex-shrink` 和 `flex-basis` 的简写，默认为 `0 1 auto`
- `flex-grow`：放大比例，默认为0，即当父容器存在剩余空间，也不放大
- `flex-shrink`：缩小比例，默认为1，即当父容器空间不足，该项目将缩小
- `flex-basis`：在分配多余空间之前，子元素占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小。
- `order`：元素在主轴上的排序顺序，数字越小越靠前
- `align-self`：用于覆盖容器上的 `align-items` 属性，做出一些差异化的处理。

总体来说 `flex` 布局的规则还是比较明确且清晰的，一些特殊组合的情况就不在这里一一列举了。

## 浏览器中 Layout 的实现

首先我们了解了 `flex` 布局的标准以后，就可以开始着手将我们的布局计算代码加入到 `toy-browser` 中去了，那么我们的 `flex` 计算逻辑添加到 `endTag` 这个状态。

我们的 `layout` 中首先需要确定主轴和交叉轴的方向，因为他们会影响我们相对于屏幕空间元素宽度和高度的计算，可以避免在后续写很多冗余的 if...else 方法来单独处理轴空间对应到屏幕空间坐标的单位关系。

之后我们进行子元素在主轴和交叉轴上具体 `高` 和 `宽` 的计算，将前一部分列出的情况进行分别的处理（不是全部标准，只涵盖了标准的部分内容），将每一个元素的高度宽度和位置标出，并且附加到我们生成的 `dom` 树中去，这样我们就获得了 `DOM with Position & CSS` 的一颗树。

最后，我们利用一个简单的 NodeJS 绘图库将我们计算后的树生成图片，来模拟浏览器生成 `Bitmap` 的过程，这一步我们也将生成图片布局和元素大小与浏览器渲染结果进行比对，来验证我们的算法是否正确。

## 总结

在这周和上一周的课程中我们完成了 `toy-browser` 的所有代码，并且在本周完成了 dom 树的位置信息计算和位图生成。

完成作业的过程中，由于需要自己实现一套简单的 `flex` 标准，那么就需要对很多边界情况和不同的组合做处理，在这个过程中也是对自己标准理解是否全面的一次验证，整体计算流程不算复杂，但是需要考虑到的情况比较多，如果没有很清晰的条理很容易会漏写一些特殊情况，对于编写复杂功能的能力提升还是很明显的。

站在更高的角度来看这个问题，其实浏览器对于 HTML 的渲染就是一个从文本到位图的转换过程，这个过程中能够不断的接收重绘指令（来自用户或者来自代码），让使用者感觉这是一个动态的可交互的软件。如果站在这个层面来看，所有的 UI 开发都是在做从逻辑描述到 UI 重绘的这么一个过程。
