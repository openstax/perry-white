/*eslint-env node*/

const fs = require('fs-extra');
const cp = require('child_process');

const exec = (cmd) => {
    console.log(cmd)
    cp.execSync(cmd)
}

exec('npm run build:clean');

['ui/fonts','fonts'].forEach(path => {
    fs.copySync(`scss/${path}`, `dist/${path}`)
})

exec('npm run build:css')
exec('npm run build:tsc')
exec('npm run build:bundle')
