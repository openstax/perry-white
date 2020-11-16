
const perfectionist = require('perfectionist');
const cssConverter = require('styleflux');
const fs = require('fs')

const filename = process.argv[2]


const css = fs.readFileSync(filename, 'UTF8');

const scss = cssConverter.cssToScss(css);

const cleanResult = perfectionist.process(scss, { indentSize: 4 });

fs.writeFileSync(filename, cleanResult.css)
