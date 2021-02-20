# Week 16 Note

## 系列课程总结

本系列课程主要构成：

- `JSX` 语法简介与 `createElment` 的实现
- `Carousel` 组件初步实现
- 提取 `Gesture` 手势事件函数，让组件可以兼容触摸屏设备
- 抽离 `Timeline + Animation` 动画组件，使用 `requestAnimationFrame` 代替 `css transition` 动画，实现播放，暂停，恢复
- 重构 `Carousel` 组件，将动画相关部分逻辑使用 `Timeline + Animation` 代替，而事件部分代码使用手势函数替换，轮播组件中只保留不同事件下 `translateX` 的计算逻辑，更 `pure`
- `framework` 中的 `Component & createElement` 扩展，支持 `children` & `render props`。

## JSX & createElement

详情请参考 [Week 14 Note](../Week%2014/NOTE.md)

## Carousel Ver.1 & Gesture & Animation

详情请参考 [Week 15 Note](../Week%2015/NOTE.md) 

### Timeline 补充

这是一个设计通过 `requestAnimationFrame` 来持续循环调用回调的类，可以通过 `start()`，`pause()`，`resume()` 来改变时间线的状态，`resume()` 通过记录暂停时间与恢复时间的差值来 `继续` 播放动画。还可以通过在向时间线 `add(new Animation(...args))` 向时间线中加入新的动画，并且可以通过传参来控制动画延迟。

动画本身的属性被抽象到了 `Animation` 类中，它只实现初始化参数的保存和属性的修改，其余基于时间线的控制全部提取到 `Timeline` 中，这也符合类的单一职责设计原则，不过这两个类需要搭配使用才可以，或者说任何实现了 `Animation` 接口的类才能搭配 `Timeline` 来使用。

## Refactor Carousel with Gesture & Animation

主要分为 2 个步骤：

- 将事件归一化为基于 `Gesture` 中的一系列事件，将触屏与非触屏的逻辑抽出到手势库中统一判断。其他计算逻辑暂时保持不变，测试通过后进入下一步。
- 在渲染组件后启动 Timeline，使用 setInterval 定时向 Timeline 中添加 Animation（previous，current，next） ，这三个 `Slide` 的偏移计算就是组件的核心逻辑了，其余逻辑都抽出到其他类中实现

其他
- 添加事件机制，能够在播放到每一张 Slide 的时候触发事件回调，更可以实现通过 API 的方式来命令式的控制组件来切换到指定的某一张去

## Support `children` & `render props`

这一部分基本就是基于先前的简易的 `framework`，实现能够与 `React` 对标的基本功能。从实现的过程中能够看出递归在实际框架开发中占的比重还是很大的，要实现 `jsx` -> `createElement` -> `DOM or Shadow DOM` 的转换不可避免的需要使用递归调用（本课程中的 List 渲染 Array 类型的 `children` 实现也是如此）。

## 总结

通过这三周的课程实践，能够让我对一个前端框架是如何实现的，并且在自己实现的简单前端框架的基础上进行组件的开发。虽然框架还是比较简单的，但是已经可以很好地阐释一些前端框架的实现原理，当然最复杂的 Shadow DOM 部分和脏检测并没有涉及。我个人能够总结出的一些理论点有：

- 先实现、后抽象（对一个全新的没有接触过的需求）
- 类的单一职能原则
- 基于 DOM 事件的二次封装事件，函数优于类（因为 DOM API 基于函数）
- TDD 驱动开发对重构后代码稳定性的保证（使用抽象后的函数和类对 Carousel 进行重构的步骤）
- 递归在 `jsx` 转换和 `children` 实现上的地位

对递归部分我想针对我个人的经验来扩展一点内容：递归在代码层面的缺点主要是 `理解和调试`，在执行层面是 `不可中断性`。

对于 `React` 的 `Stack Reconciler` 而言，直接利用递归来实现渲染和更新是没有问题的。但是未来的 `React` 选用了 `Fiber Reconciler` 来实现了可中断且可恢复（重新重渲染，丢弃先前渲染失败或被取消的结果）。它解决了调用栈过深导致的内存占用过高问题，并且能够以一种链表的形式将每次调用的上下级和平级关系进行关联，在每个 `Fiber Node` 上保留一份虚拟节点的副本，能够做到渲染中断后的回退，以及批量渲染成功以后的切换。这也是复杂数据结构带来的框架能力的提升。

就像课程一开始的地图寻路算法一样，其实数据结构能够一定程度上决定算法的效率，而如何去选择正确的数据结构来完成对应的需求就要看每个人的数据结构功底了，当然如果一直是做 CURD 类的后台应并且使用封装好的业务组件库不去做思考的话，是没有办法接触到这一类的知识体系的。课程也让我扩展了我自己的知识边界，让我有了更多的可深入探索的方向。
