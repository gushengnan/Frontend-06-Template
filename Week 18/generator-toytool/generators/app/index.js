let Generator = require('yeoman-generator');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        // this.option('babel');
    }

    async initPackage() {
        const answer = await this.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Your project name',
                default: this.appname
            }
        ]);

        const pkgJson = {
            name: answer.name,
            version: "1.0.0",
            description: "",
            main: "index.js",
            scripts: {
                build: 'webpack',
                test: 'mocha --require @babel/register',
                coverage: 'nyc mocha --require @babel/register'
            },
            keywords: [],
            author: "",
            license: "ISC",
            devDependencies: {
            },
            dependencies: {
            }
        };


        // Extend or create package.json file in destination path
        this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);

        await this.yarnInstall(['vue'], { 'save-dev': false });
        await this.yarnInstall([
            '@babel/core',
            '@babel/preset-env',
            '@babel/register',
            '@istanbuljs/nyc-config-babel',
            'babel-plugin-istanbul',
            'babel-loader',
            'css-loader',
            'copy-webpack-plugin',
            'html-webpack-plugin',
            'mocha',
            'nyc',
            'webpack',
            'webpack-cli',
            'vue-loader',
            'vue-template-compiler',
            'vue-style-loader',
        ], { 'save-dev': true });

        this.fs.copyTpl(this.templatePath('index.html'), this.destinationPath('src/index.html'), { title: answer.name });
        this.fs.copyTpl(this.templatePath('HelloWorld.vue'), this.destinationPath('src/HelloWorld.vue'), {});
        this.fs.copyTpl(this.templatePath('main.js'), this.destinationPath('src/main.js'), {});
        this.fs.copyTpl(this.templatePath('webpack.config.js'), this.destinationPath('webpack.config.js'), {});
        this.fs.copyTpl(this.templatePath('.nycrc'), this.destinationPath('.nycrc'), {});
        this.fs.copyTpl(this.templatePath('.babelrc.json'), this.destinationPath('.babelrc.json'), {});
        this.fs.copyTpl(this.templatePath('sample-test.js'), this.destinationPath('test/sample-test.js'), {});
    }
}