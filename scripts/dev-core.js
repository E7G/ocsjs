const { series } = require('gulp');
const { execOut } = require('./utils');

exports.default = series(() => execOut('npx vite build -w --emptyOutDir false', { cwd: '../packages/scripts' }));
