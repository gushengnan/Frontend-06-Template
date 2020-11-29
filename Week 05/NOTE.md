# Week 5 Note

本周主要介绍了响应式对象的基本概念和简单实现；另外还涵盖了 `Range` API 在拖拽场景下的应用例子。

## 响应式对象

对象上的属性能够进行订阅，当被订阅属性发生变化时触发订阅该属性的所有回调。属于设计模式中的 `发布订阅模式`。

### 实现原理

- 利用 `ES6` 的 `Proxy` 对象对被监听对象的 `getter` & `setter` 方法进行自定义化。
- 维护对象 `属性` 与 `effects` 之间关联关系的对象，用于避免 `广播` 效应造成的不必要的 `effect` 执行消耗

```javascript
let callbacks = new Map();
let reactivities = new Map();
let usedReactivities = [];

function effect(callback) {
    // 清空上次添加 effect 时的依赖缓存
    usedReactivities = [];
    // 执行一次回调用于依赖收集
    callback();
    // 此时 usedReactivities 中会保存有此次绑定的 effect callback 的依赖，并且将依赖进行循环添加至
    for (let reactivity of usedReactivities) {
        if (!callbacks.has(reactivity[0])) {
            callbacks.set(reactivity[0], new Map());
        }
        if (!callbacks.get(reactivity[0]).has(reactivity[1])) {
            callbacks.get(reactivity[0]).set(reactivity[1], []);
        }
        callbacks.get(reactivity[0]).get(reactivity[1]).push(callback);
    }
}

function reactive(object) {
    // 如果响应式对象已创建，则不再重复创建响应式对象，而是直接返回先前创建的对象
    if (reactivities.has(object)) {
        return reactivities.get(object);
    }
    let proxy = new Proxy(object, {
        set(obj, prop, val) {
            // 对 object 上对应的属性进行赋值
            obj[prop] = val;
            // callbacks 这个 Map 对象中维护了所有 object 中的对象及其子属性对象与 effect 的对应关系
            // 在每次变更属性的时候依次执行“订阅”了这个属性的回调
            if (callbacks.get(obj)) {
                if (callbacks.get(obj).get(prop)) {
                    for (let callback of callbacks.get(obj).get(prop)) {
                        callback();
                    }
                }
            }
            return obj[prop]
        },
        get(obj, prop) {
            // 每次 get 时先将依赖暂存，用于依赖收集，在执行 effect 之前会被清除
            usedReactivities.push([obj, prop]);
            // 如果 obj[prop] 是个对象，则将 obj[prop] 作为参数传入 reactive 进行递归生成响应式对象
            if (typeof obj[prop] === 'object') {
                return reactive(obj[prop]);
            }
            return obj[prop];
        }
    });
    reactivities.set(object, proxy);
    return proxy;
}
```

 > 问题：这种依赖收集的处理的确很巧妙，但是也有相应的限制。如果说 effect 定义的函数中有类似操作 DOM 或者网络请求的副作用时，可能就会有一些难以发现的 Bug。不知道 `Vue` 是否对 `effect` 的使用有一些限制。对比 `React` Hooks API 的手动定义依赖用起来更放心一些，但是心智负担也比较重，需要自己去判断哪些是会变的，哪些是不变的。特别是函数引用的变化，还需要用 useCallback 去保持。

## range API

在加入课程学习以前，所有我用来操作 `DOM` 节点都是通过 `选择器` + `appendChild` 的组合来实现，但是针对一些比较复杂的挪动节点，或者替换子节点的时候就会不太方便。`range` API 可以让开发者更加灵活的创建、删除、移动和替换节点，在需要将一个组件拖拽进入另一个组件内部的场景特别适用，这个场景在当前比较火的低代码平台的可视化搭建上很常见。

`winter` 老师也在实现拖拽功能时候介绍了一个很实用的小技巧，就是被拖拽组件的 `mousemove` & `mouseup` 要添加到文档根节点上，可以避免在特定场景（拖动到文档边缘、拖动速度过快鼠标移出了被拖动节点）下的功能 `失效` 问题。

> 问题：在示例代码中计算最近节点的逻辑似乎会出现一些计算抖动的问题，可以用防抖触发来解决，毕竟计算量还是比较大的，`mousemove` 事件的触发频率很高。
