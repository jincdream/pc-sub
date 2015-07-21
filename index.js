//vi pc-sub/index.js
var fis = module.exports =  require('fis3');

fis.require.prefixes.unshift('pc-sub');
fis.cli.name = 'pc-sub';
fis.cli.info = require('./package.json');
