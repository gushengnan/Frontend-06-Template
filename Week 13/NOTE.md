# Week 13 Note

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