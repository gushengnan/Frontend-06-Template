let Generator = require('yeoman-generator');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        // this.option('babel');
    }

    // async method1() {
    //     const answers = await this.prompt([
    //         {
    //             type: 'input',
    //             name: 'name',
    //             message: 'Your project name',
    //             default: this.appname
    //         },
    //         {
    //             type: 'confirm',
    //             name: 'cool',
    //             message: 'Would you like to enable the Cool featur'
    //         }
    //     ]);
    //     this.log('app name: ', answers.name);
    //     this.log('cool feature: ', answers.cool);
    // }
    initPackage() {
        const pkgJson = {
            devDependencies: {
                eslint: '^3.15.0'
            },
            dependencies: {
                react: '^16.2.0'
            }
        };

        // Extend or create package.json file in destination path
        this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);

        this.npmInstall();
    }

    async step1() {
        this.fs.copyTpl(this.templatePath('t.html'), this.destinationPath('public/index.html'), { title: 'Templating with Yeoman' });
    }
}