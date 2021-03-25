# Week 20 Note

## Daily Build

编译时验证

无论软件架构基本都是在编译时发现问题，但是发现不了运行时问题。在前端出现联调时如果服务端不遵守接口约定会导致 Daily Build 环境上的系统出错，但是问题出在服务端，需要在运行时才能够发现（如果服务端没有针对接口约定的单元测试）。

## Build Verification Test （BVT）

运行时基本验证

### C/S 架构客户端开发

开发周期长，有足够时间编写 e2e 测试用例，一般由测试人员编写。

### B/S 架构客户端开发

利用无头浏览器做一些轻量级的 e2e 测试。
## 前端的情况

编译时间短，分钟级。


## Headless Chrome

> Windows WSL Alias 指向
> ```shell
> # Window 下路径也类似
> alias chrome="/mnt/c/Program\ Files\ \(x86\)/Google/Chrome/Applicationchrome.exe"
> ```

但是日志输出有问题，还是建议直接在 Windows 下进行



