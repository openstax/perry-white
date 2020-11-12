/*eslint-env node*/

const fs = require('fs-extra');
const sass = require("sass");
const cp = require('child_process');

const exec = (cmd) => {
    console.log(cmd)
    cp.execSync(cmd)
}

exec('npm run build:clean');

['ui/mathquill-editor/font', 'ui/fonts','fonts'].forEach(path => {
    fs.copySync(`src/${path}`, `dist/${path}`)
})

exec('npm run build:css')
exec('npm run build:tsc')
exec('npm run build:bundle')
