//vi pc-sub/index.js
var fis = module.exports =  require('fis3');

fis.require.prefixes.unshift('pc-sub');
fis.cli.name = 'pc-sub';
fis.cli.info = require('./package.json');
function createRequireConfig(ret, conf, settings, opt){
  // console.log(ret.ids)
  var idsObj = ret.ids
  var fileId = []
  var alies = {}
  var deps = {}

  var map = ret.map
  var res = map.res
  var pkg = map.pkg
  var pack = {}

  var files = Object.keys(idsObj)
  console.log(pkg)

  files.forEach(function(file,i){
    var _file = file
    file = idsObj[file]
    resFile = res[_file]
    // console.log(file)
    var requires = file.requires
    if(file._likes.isJsLike){
      var fileId = _file.replace('.js','')
      alies[fileId] = resFile.pkg ? pkg[resFile.pkg].uri : file.url
      // file.id = file.filename
      // file.moduleId = file.filename
      if(requires.length <= 0)return deps[fileId] = void 0;
      deps[fileId] = []

      // requires = resFile.pkg ? requires.filter(function(req,i){
      //   if(!~pkg[resFile.pkg].has.indexOf(req))return req;
      // }) : requires
      // console.log(requires,'fffffffffffffffff')
      if(requires.length <= 0)return deps[fileId] = void 0;
      requires.forEach(function(req,i){
        // deps[fileId].push(idsObj[req].url)
        deps[fileId].push(req.replace('.js',''))
      })
    }
  })
  var config = JSON.stringify({
    alies: alies,
    deps: deps
  })
  files.forEach(function(file,i){
    var _file = file
    file = idsObj[file]
      // console.log(file._likes.isHtmlLike)
    if(file._likes.isHtmlLike){
      // console.log(file._content)
      var content = file._content
      file._content = content.replace('<!--REQUIRE_CONFIG-->',config)
    }
  })
}

fis.pcSub = function(){
  console.log(fis.get('output'),'--------------------------------------------------------------')
  fis
    // .media('dev')
    .match('**',{//这里封锁所有输出，只有配置了的才能进行输出
      deploy: [
        fis.plugin('local-deliver',{
          to: fis.get('outputDir')
        })
      ],
      release: false,
      useHash: false
    })
    .match('**/(*).md',{
      rExt:'.html',
      release: '${namespace}/page/$1',
      parser: fis.plugin('marked')
    })
    .match('/page/(*).html',{
      parser: fis.plugin('handlebars',{
        dataFile:'/_data.js',
        _data:fis.get('extendData') || {}
      }),
      useMap: true,
      release: '${namespace}/$1.html'
    })
    .match(/(?:css|img)[\/\/](.*?)\.(.*)/,{
      release: '${namespace}/static/$1.$2'
    })
    .match('*.less', {
      parser: fis.plugin('less'),
      rExt: '.css'
    })
    .match('*.{scss,sass}', {
      parser: fis.plugin('sass'),
      rExt: '.css'
    })
    .match('lib/(*).js',{
      isMod: true,
      useMap: true,
      release: '${namespace}/static/$1.js'
    })
    .hook('module', {
      mode: 'amd'
    })
    .match('::package', {
      postpackager:createRequireConfig
      //, postpackager:fis.plugin('loader',{allInOne:true})
    })

  // fis
    // .media('pack')
    .match('::package', {
      spriter:fis.plugin('csssprites')
      //, postpackager:fis.plugin('loader',{allInOne:true})
    })
    // .match('static')
    // .match('lib/*.js',{
    //   isMod: true,
    //   useMap: true,
    //   release: '${namespace}/static/lib.js',
    //   packTo: '${namespace}/lib/lib.js',
    //   optimizer: fis.plugin('uglify-js')
    // })
    // .match('*.{scss,sass,less,css}', {
    //   optimizer: fis.plugin('clean-css')
    // })
    // .match('css/*.{scss,sass,less,css}',{
    //   release: '${namespace}/static/index.css',
    //   packTo: '${namespace}/css/index.css'
    // })
    .match('*.png', {
      optimizer: fis.plugin('png-compressor'),
      useSpriter: true
    })
    // .match('lib/lib.js',{
    //   isMod: true,
    //   useMap: true,
    //   release: '${namespace}/static/lib.js'
    // })

    fis
      .media('upload')
      .match('*.{scss,sass,less,css}', {
        optimizer: fis.plugin('clean-css')
      })
      .match('css/*.{scss,sass,less,css}',{
        release: '${namespace}/static/index.css',
        packTo: '${namespace}/css/index.css'
      })
      .match('lib/*.js',{
        isMod: true,
        useMap: true,
        release: '${namespace}/static/lib.js',
        packTo: '${namespace}/lib/lib.js',
        optimizer: fis.plugin('uglify-js')
      })
      .match('lib/lib.js',{
        isMod: true,
        useMap: true,
        release: '${namespace}/static/lib.js'
      })
      .match('**',{
        charset: 'gbk',
        deploy: [
          fis.plugin('encoding'),
          fis.plugin('local-deliver',{
            to: fis.get('outputDir')
          }),
          fis.plugin('http-push', {
            receiver: fis.get('remoteServer')+'/receiver',
            to: '/node-server/www/' // 注意这个是指的是测试机器的路径，而非本地机器
          })
        ]
      })
}
