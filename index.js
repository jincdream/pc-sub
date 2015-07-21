//vi pc-sub/index.js
var fis = module.exports =  require('fis3');

fis.require.prefixes.unshift('foo');
fis.cli.name = 'foo';
fis.cli.info = require('./package.json');
