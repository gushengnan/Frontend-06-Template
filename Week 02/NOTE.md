# Week 2 Notes

## 课程内容

制作一个 100x100 的地图，并且附带地图编辑功能，选择地图任意2点，计算两点之间最佳路径。

### 主要步骤

- 第一步  
    生成一维 `DOM` 结构和数组对象来保存地图每个坐标点的状态，使用 `JSON.stringify` 和 `LocalStorage` 作为持久化地图的解决方案。
    > 个人理解使用一维数组而不是二维数组是为了在后续的步骤中降低不必要的算法复杂度
- 第二步  
    初步创建广度优先搜索算法，并在距离相近的点之间进行函数的测试，使用 `console.log` 打印遍历结果，但是结果展示并不能很好的测试算法是否按照我们的想法去搜索了。
- 第三步  
    使用异步逻辑控制 `async/await` 搭配 `Promise` 化的 `setTimeout` 来实现搜索点的着色，人为放慢搜索速度并可视化展现，便于后续算法的优化和 `debug`。
- 第四步  
    前面的步骤虽然可以计算两点是否可达，但是不能计算出最后满足达到条件的路径，那么就需要有一种方式能够记住达到点的来源，并且反推到起始点，那么这条路径就是算法计算出的结果路径。使用 `table` 变量来记录所有已遍历点的上一个点位，并且在广度优先遍历到结尾点时使用 `table` 中的记录一直反推至起始点位，这条路径就是计算的结果路径。
- 第五步  
    改造 `queue` 数据结构，使得它不是将所有的相邻点都以同样的权重进行下一步的搜索，而是根据一定的规则给予不同的优先级。之前使用的 `Array` 实现的 `queue` 不能满足这样的要求，那么就要求我们实现一个自定义的数据结构（或者是类）来实现我们想要的自定义优先级的功能。`Sorted` 类就是这样一个满足要求的类，它具有 `give()` 和 `take()` 的方法，对应之前数组中的 `push` 和数组取值方法，但是能够以比较优化的方式实现每次take都是数组当前最小值的目的，并且可以自定义排序规则。
- 第六步  
    使用平面直角坐标系的两点距离算法当做 `Sorted` 的 `compare` 并实例化 `queue`，在使用上面的算法进行搜索时，避免了很多不必要的点的搜索，大大提升了算法效率。

### 问题
- 以上步骤完成的练习并不是地图路径搜索的最优解，至少在复杂的迷宫场景下，路径并不一定是最短的。
- 算法中使用的 `8` 个相邻子节点的广度优先算法，会忽略一些斜方向没有厚度的 `墙`，如下图：
```shell
      ❎   或   ❎
    ❎            ❎
```

### 扩展思考（TODO）
- 二叉堆数据结构代替 `Sorted` 数据结构能带来哪些方面的提升，提升能有多大？
- 有没有一种修改能够让斜方向没有厚度的墙不被忽略，而不是只搜索上下左右四个方向来避免这个问题。
- 如何给定一个权重函数，能够让路径始终最优？

## 总结
本周课程基于上周已有的基础进行了扩展，基于一个更复杂的例子将异步流程控制和广度优先搜索算法结合了起来。
