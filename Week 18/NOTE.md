# Week 18 Note

> 合并包含 Week 17 Note。

Week 17 - 18 这两周的课程主要介绍了如何根据模板生成一个具有简单功能的项目框架。框架包括：目录结构、代码打包配置、单元测试框架集成、测试覆盖率工具集成等。并且在最后使用 `Npm Script` 将这些框架模板中具有的能力进行暴露，让使用者能够不需要知道脚手架中各种依赖之间如何配合使用，而是使用简单的命令即可拥有这些能力。

## 项目模板生成

课程中使用了 [Yeoman](https://yeoman.io/) 及其配套的 cli 工具 `yo` 搭配来满足生成项目框架所需要用到的诸如：命令行交互、文件拷贝、依赖安装等需求。并且 Yeoman Generator 的写法能够将一个生成过程按照步骤拆分，同时支持同步和异步的任务，编写十分方便。而对于一个 Web 项目而言，还需要有针对性的对项目打包和代码转换进行相应的配置，并且将配置文件一并添加到项目脚手架的模板中。可能有些项目模板的打包配置可以从生成教授架的步骤进行选择，但是本课程中并没有根据命令行传入选项进行相应调整的内容。

### 打包配置

本课程中使用了 [Webpack](http://webpack.github.io/) 作为项目打包的工具，当然也可以选择 `Rollup`，`Snowpack` 之类的新兴工具。

Webpack 基本上是目前（截至2021年3月）使用最为广泛的 Web 项目打包工具，围绕它的很多社区建设也相当的完善，它本身的软件架构设计能够很轻松地以插件形式对它的打包能力进行扩展（得益于围绕 Tapable 中各种钩子事件的架构设计）。当然 `Webpack` 前面几个大版本很让人诟病的一点是复杂的配置，对于一般的前端开发而言很不友好。当然在后续版本 `4 & 5` 中引入了大量的默认配置以后，相对入门友好了一点。

Webpack 在实际项目中的使用还是需要借助很多社区的 Loader 和 Plugin 才能够满足需求。其中最重要的就是 `babel` 生态的一系列 `npm package`。

### 代码转换

Babel 在前端代码转换工具中的地位，就相当于 Webpack 在前端项目打包工具中的地位。正如 Babel 的官网简介中写到的 `Babel is a JavaScript compiler. Use next generation JavaScript, today.`，它让我们能够使用到最新的 JavaScript 语法，而不用等到标准落地的那一刻。

由于 ECMAScript 标准制定和不同时期浏览器实现的历史原因，可能很多当前未被正式纳入标准的实用语法是无法直接在浏览器中正常运行的，当前较新的浏览器只会实现标准中的内容，而标准以外的 `proposal、stage0-3` 的语法必须通过 `Babel` 转义才可以使用。

当然诸如 `JSX`，`Vue Template Syntax`，`Angular Template Syntax` 等一些框架自创的语法也可以使用特定的 `Babel Plugin` 转换到标准 ECMAScript 输出。一般由框架的维护者提供相应的插件及工具集进行转换。

而更低版本的代码转换则由 Babel 的插件来完成，它们有：

- [@babel/polyfill](https://babeljs.io/docs/en/babel-polyfill) (deprecated)

> 🚨 As of Babel 7.4.0, this package has been deprecated in favor of directly including core-js/stable (to polyfill ECMAScript features) and regenerator-runtime/runtime (needed to use transpiled generator functions):

```javascript
    import "core-js/stable";
    import "regenerator-runtime/runtime";
```

- [@babel/plugin-transform-runtime](https://babeljs.io/docs/en/babel-plugin-transform-runtime)

>A plugin that enables the re-use of Babel's injected helper code to save on codesize.

这两种兼容转换的具体使用方式参见官方文档，需要根据实际需求挑选最适合的解决方案。

### 单元测试

课程中选择 [Mocha](https://mochajs.org/) 作为单元测试框架，只要按照测试框架要求的结构组织我们的测试代码和测试目录，并配合使用 `assert` 断言库对函数结果进行校验，当校验通过时当条单元测试视为通过，如果不通过则会在控制台输出错误原因和堆栈信息。

但是由于在当前的 Node LTS（12） 环境中默认是没有 `ES6 import` 语法支持的，为了保持语法的一致性，我们需要引入 `@babel/register` 库，在执行测试前对代码进行转换。我们所需要做的修改如下：

- 安装 `@babel/register` & `@babel/preset-env` 为 devDependency
- 添加 `.babelrc` 配置文件并添加 `"presets":["@babel/preset-env"]`
- Npm Script 使用 `mocha --require @babel/register`

这样我们就可以在具体的 `test` 目录中的测试代码中使用全量的 ES6 语法了。

### 覆盖率

如果说单元测试是衡量单个测试有效性的一种指标，那么单元测试的代码覆盖率则是测试广度的衡量指标。

课程中我们选用 `istanbul` 对代码进行覆盖率的考察。但是由于在单元测试中我们使用了 babel 对原始代码进行了转换，可能会导致覆盖率代码的行对应关系和覆盖范围计算产生偏差，所以这时候我们需要对覆盖率测试的命令进行修改，并且使用两个插件将 `mocha` 和 `nyc` 中传递的代码进行原始代码的关联，具体操作为：

- 添加 `.nycrc`

    ```json
    {
        "extends": "@istanbuljs/nyc-config-babel"
    }
    ```

- `.babelrc` 中添加

    ```json
    {
        "plugins": ["istanbul"]
    }

- Npm Script 使用 `nyc mocha --require @babel/register`

### Npm Script 集成

最后我们将编译、测试、覆盖率等复杂的命令和相关依赖沉淀到脚手架的模板中，在生成项目脚手架时拷贝到项目目录，那么一个开箱即用的并且具有编译、测试、覆盖率等功能的框架就一键搭建好了。

这么做的好处是使用者不需要了解到具体这些命令背后的执行逻辑和命令参数，而是只需要一行 npm script 就可以搞定。

## 总结

使用 yeoman 可以一定程度上简化项目脚手架生成的过程，主要在模板文件渲染后生成、命令行交互、依赖安装等方面做了便于使用的封装。在 `create-react-app` 中就是使用 yeoman 进行了脚手架的生成。但是不可忽视的是，制作脚手架最关键的步骤其实是创建后的脚手架中的各种 `npm script`，而这些命令背后则是需要依靠脚手架的作者针对不同业务需求的理解进行的抽象。课程中只简单介绍了 yeoman 作为创建脚手架的工具用途，而真正的脚手架核心并不在于此。我们也可以使用 `yargs` 库对 yeoman 的 prompt 能力进行替换。灵活的理解脚手架的意义和核心，我想，才是课程的最终目的。

Week 17 - 18，站在 `cli` 工具的角度向我们介绍了将所有开发过程中的工具链进行链接的思路，创作出一个真正实用的脚手架还是需要我们在实际工作和需求中的沉淀。
