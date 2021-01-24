# Week 13 Note

本周对浏览器的 API 进行了分类整理，总体可以分为三大类：DOM相关、CSSOM、其他 API（由各种标准组织提出的 API，比较杂）。

## DOM API

### 导航类操作

|  Node 导航   | Element 导航 （忽略文本节点）  |
|  ----  | ----  |
| parentNode  | parentElement *重复API，与 parent Node 返回一致* |
| childNodes  | children |
| firstChild  | firstElementChild |
| lastChild  | lastElementChild |
| nextSibling  | nextElementSibling |
| previousSibling  | previousElementSibling |

### 修改操作

- appendChild
- insertBefore
- removeChild
- replaceChild

> `insertAfter` 的功能可以通过 `appendChild` + `insertBefore` + `导航 API` 结合实现，为了最小化 API 设计原则，所以没有这个 API。

### 高级操作

- compareDocumentPosition: 用于比较两个节点中关系的函数
- contains: 检查一个节点是否包含另一个节点的函数
- isEqualNode: 检查两个节点是否完全相同（DOM结构上）
- isSameNode: 检查两个节点是否是同一个节点，类似于 javascript 中的 `===` 操作符，一般直接用 javascript 全等实现
- cloneNode: 复制一个节点，如果传入参数 `true`，则会连同子元素做深拷贝

### Event

值得注意的是，如果 `触发事件的节点` 既注册了冒泡事件处理函数又注册了捕获事件处理函数，则该节点注册的事件处理函数按照注册顺序执行，因为当前节点处于 `target phase`。而其外部的节点注册函数依然符合先捕获后冒泡的顺序执行。

> <strong>Note:</strong> For event listeners attached to the event target, the event is in the target phase, rather than the capturing and bubbling phases. Events in the target phase will trigger all listeners on an element in the order they were registered, regardless of the useCapture parameter. ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener))

### Range

一种更为抽象的浏览器 DOM 操作 API，操作粒度更细，可以对 DOM 节点做批量剪切和粘贴的操作。

> 在 VSCode 插件开发中有关于 DOM 操作基本都是依靠 VSCode 暴露出的 Range API 来进行的，比如可以进行多行选择等。

## CSSOM

### Rule

#### 非 `at-rule`

- CSSStyleRule
    - selectorText String
    - style K-V 结构

> 伪元素样式的修改；批量修改；
#### `at-rule`

- CSSCharsetRule
- CSSImportRule
- CSSMediaRule
- CSSFontFaceRule
- CSSPageRule
- CSSNamespaceRule
- CSSKeyframesRule
- CSSKeyframeRule
- CSSSupportsRule


### getComputedStyle

- window.getComputedStyle(elt, pseudoElt)
    - elt 想要获取的元素
    - pseudoElt 可选，伪元素

### CSSOM View

### Window

- window.innerWidth, window.innerHeight
- window.outerWidth, window.outerHeight
- window.devicePixelRatio
- window.screen
    - window.screen.width
    - window.screen.height 
    - window.screen.availWidth
    - window.screen.availHeight 

### Window API

- window.open("about:blank", "_blank", "width=100,height=100,left=100,right=100")
- moveTo(x, y)
- moveBy(x, y)
- resizeTo(x, y)
- resizeBy(x, y)

### scroll

- scrollTop
- scrollLeft
- scrollWidth
- scrollHeight
- scroll(x, y) or scrollTo
- scrollBy(x, y)
- scrollIntoView()

<!-- Window 对象上的 -->
- Window
    - scrollX
    - scrollY
    - scroll(x, y) or scrollTo
    - scrollBy(x, y)


### Layout

- getClientRects()
- getBoundingClientRects()

## 标准化组织

- khronos
    - WebGL
- ECMA
    - ECMAScript
- WHATWG
    - HTML
- W3C
    - web audio
    - CG/WG

## 总结

本周的 API 标准涵盖范围还是很大的，在学习后我了解到可以使用 `getComputedStyle` 来获取节点动画的中间态样式、伪元素的样式（浏览器开发工具的 CSS 继承展现功能应该只是这个 API 的可视化实现），使用 `CSSStyleRule` 提供的接口可以对伪元素样式进行动态的修改（DevTool 的样式调试工具也应该是用了这个 API 实现）等小技巧。

关于事件的部分我也去查阅了相关的文档，发现一旦有一个节点同时绑定了捕获阶段和冒泡阶段的事件后，一旦该节点是触发事件的 target，则这个节点上的事件不会按照先捕获再冒泡的顺序触发，而是按照绑定的先后顺序，因为这个节点已经进入了 target phase。以前在看书的时候接触过这方面的知识，但是当时没有自己动手写实例去对这种现象进行深究，这周刚好趁这个机会来了解一下这个奇怪行为的依据，也算是解决了困扰我很长时间的一个疑惑。

在 API 的作业中以引导的方式让我们去标准网站上去提取 API 的过程中也让我对一些冷门的甚至从来不知道其存在的 API 有了一定的了解，扩展了知识面。也对前面课程的 JS 标准对象提取部分的代码进行了复用，JS API 在浏览器整个范围内看真的只占了很少的部分（按数量）。

Range API 还是非常值得深入学习的，它能够很大程度上提高 DOM 操作的效率，虽然 API 设计稍微有点抽象而且 extractContent() 时的节点自动补全还需要一段时间去适应。但是从 VSCode 的插件开发中的 DOM 相关操作只提供了 Range API 来看，制作复杂 DOM 操作需求的浏览器应用时这个接口应该是最优选择，而传统的 DOM API 应该只适合低频对执行效率不敏感的应用。

