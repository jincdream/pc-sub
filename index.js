//vi pc-sub/index.js
var fis = module.exports =  require('fis3');

fis.require.prefixes.unshift('pc-sub');
fis.cli.name = 'pc-sub';
fis.cli.info = require('./package.json');

var __COMBO__
/*
 * 输出模块依赖配置表
 *
 *
 *
 */
function createRequireConfig(ret, conf, settings, opt, combo){
  // console.log(ret.ids)
  var idNeadNacePace = fis.get('idNeadNamespace')
  var baseUrl        = fis.get('configBaseUrl')
  var idsObj         = ret.ids
  var fileId         = []
  var modulePath     = {}
  var deps           = {}
  combo = combo || __COMBO__
  combo = combo === 'combo' ? true : void 0

  var map   = ret.map
  var res   = map.res
  var pkg   = map.pkg
  var pack  = {}
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
      idNeadNacePace && (fileId = fileId.split(':')[1])
      modulePath[fileId] = resFile.pkg ? pkg[resFile.pkg].uri.replace(baseUrl,'') : file.url.replace(baseUrl,'')
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
        deps[fileId].push(idNeadNacePace ? req.replace('.js','').split(':')[1] : req.replace('.js',''))
      })
    }
  })
  var oConfig = {
    baseUrl  : baseUrl,
    path     : modulePath,
    deps     : deps,
    combo    : combo,
    comboUrl : '/??'
  }
  var config = JSON.stringify(oConfig)
  files.forEach(function(file,i){
    var _file = file
    file = idsObj[file]
      // console.log(file._likes.isHtmlLike)
    if(file._likes.isHtmlLike){
      // console.log(file._content)
      var content = file._content
      file._content = content.replace('<!--REQUIRE_CONFIG-->',config)
                            //  .replace(/\<\!\-\-REQUIRE_COMMON\:(.*?)\-\-\>/,)
    }
  })
}
function createRequireConfigCombo(){
  var arg = []
  for (var i = 0; i < arguments.length; i++) {
    arg[i] = arguments[i]
  }
  arg.push('combo')
  createRequireConfig.apply(fis,arg)
}
fis.pcSub = function(){
  console.log('-------------------------- ',fis.get('output'),' --------------------------')
  /*
   * 默认输出不进行压缩
   * 默认输出：
   *  输出文件夹（项目名）
   *   -static（所有静态资源文件）
   *   -所有 html 文件
   */

  var receiverS = fis.get('receiverServer') || '/node-server/www/'
  __COMBO__     = fis.get('useCombo')
  fis
    // .media('dev')
    .match('**',{//这里封锁所有输出，只有配置了的才能进行输出
      deploy: [
        fis.plugin('local-deliver',{
          to: fis.get('output')
        })
      ],
      release: false,
      useHash: false
    })
    .match('**/(*).md',{
      rExt:'.html',
      release: '/page/$1',
      parser: fis.plugin('marked')
    })
    .match(/\/page\/.*?\_layout\.html/,{
      parser: fis.plugin('handlebars',{
        dataFile:'/_data.js',
        _data:fis.get('extendData') || {}
      })
    })
    .match('/page/(*).html',{
      parser: fis.plugin('handlebars',{
        dataFile:'/_data.js',
        _data:fis.get('extendData') || {}
      }),
      useMap: true,
      release: '/$1.html'
    })
    .match(/\/page\/layout\/.*?\.html/,{
      useMap: !1,
      release: !1
    })
    .match(/(?:css|img)[\/\/](.*?)\.(.*)/,{
      release: '/static/$1.$2'
    })
    .match('*.less', {
      parser: fis.plugin('less'),
      rExt: '.css'
    })
    .match('*.{scss,sass}', {
      parser: fis.plugin('sass2'),
      rExt: '.css'
    })
    .match('lib/(*).js',{
      isMod: true,
      useMap: true,
      release: '/static/$1.js'
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
    //   release: '/static/lib.js',
    //   packTo: '/lib/lib.js',
    //   optimizer: fis.plugin('uglify-js')
    // })
    // .match('*.{scss,sass,less,css}', {
    //   optimizer: fis.plugin('clean-css')
    // })
    // .match('css/*.{scss,sass,less,css}',{
    //   release: '/static/index.css',
    //   packTo: '/css/index.css'
    // })
    .match('*.png', {
      optimizer: fis.plugin('png-compressor'),
      useSpriter: true
    })

    /*
     * 打包输出，上传到 node sever 接收端：
     *   所有 css/*.css 打包压缩成一个 index.css，
     *   所有 lib/*.js  打包压缩成一个 lib.js
     */
    fis
      .media('upload-pack')
      .match('*.{scss,sass,less,css}', {
        optimizer: fis.plugin('clean-css')
      })
      .match('css/*.{scss,sass,less,css}',{
        release: '/static/index.css',
        packTo: '/css/index.css'
      })
      .match('lib/*.js',{
        isMod: true,
        useMap: true,
        release: '/static/lib.js',
        packTo: '/lib/lib.js',
        optimizer: fis.plugin('uglify-js')
      })
      .match('lib/lib.js',{
        isMod: true,
        useMap: true,
        release: '/static/lib.js'
      })
      .match('**',{
        charset: fis.get('uploadCharset'),
        deploy: [
          fis.plugin('encoding'),
          fis.plugin('local-deliver',{
            to: fis.get('output')
          }),
          fis.plugin('http-push', {
            receiver: fis.get('remoteServer')+'/receiver',
            to: receiverS // 注意这个是指的是测试机器的路径，而非本地机器
          })
        ]
      })

    /*
     * 不打包输出，上传到 node sever 接收端：
     *   压缩所有 css/*.css ，
     *   压缩所有 lib/*.js
     */
    fis
      .media('upload')
      
      .match('*.{scss,sass,less,css}', {
        optimizer: fis.plugin('clean-css')
      })
      .match('lib/*.js',{
        optimizer: fis.plugin('uglify-js')
      })
      .match('**',{
        charset: fis.get('uploadCharset'),
        deploy: [
          fis.plugin('encoding'),
          fis.plugin('local-deliver',{
            to: fis.get('output')
          }),
          fis.plugin('http-push', {
            receiver: fis.get('remoteServer')+'/receiver',
            to: receiverS // 注意这个是指的是测试机器的路径，而非本地机器
          })
        ]
      })

     /*
      * 压缩输出，上传到WWW1服务器
      *
      *
      */
      var createPath = function(test){
        var testUrl  = test ? '/internal/' :'/'
        var getUrl = fis.get('www1Url')
        if(getUrl) return  getUrl;
        return testUrl +　fis.get("city") + fis.get("createTime") +  '/' + fis.get("namespace") + '/'
      }
      fis
        .media('www1')
        .match('(*).zip',{
          release: '/$1.zip'
        })
        .match('::package', {
          postpackager:createRequireConfig
          //, postpackager:fis.plugin('loader',{allInOne:true})
        })
        .match('*.{scss,sass,less,css}', {
          optimizer: fis.plugin('clean-css')
        })
        .match('lib/*.js',{
          optimizer: fis.plugin('uglify-js')
        })
        .match('**',{
          charset: fis.get('uploadCharset'),
          deploy: [
            fis.plugin('encoding'),
            fis.plugin('local-deliver',{
              to: fis.get('output')
            }),
            fis.plugin('zip', {
              filename: 'www1.zip'
            }),
            fis.plugin('www1',{
              site: fis.get('site'),
              path: createPath(),
              user: fis.get('user')
            })
          ]
        })

      fis
        .media('www1test')
        .match('(*).zip',{
          release: '/$1.zip'
        })
        .match('::package', {
          postpackager:createRequireConfig
          //, postpackager:fis.plugin('loader',{allInOne:true})
        })
        .match('*.{scss,sass,less,css}', {
          optimizer: fis.plugin('clean-css')
        })
        .match('lib/*.js',{
          optimizer: fis.plugin('uglify-js')
        })
        .match('**',{
          charset: fis.get('uploadCharset'),
          deploy: [
            fis.plugin('encoding'),
            fis.plugin('local-deliver',{
              to: fis.get('output')
            }),
            fis.plugin('zip', {
              filename: 'www1.zip'
            }),
            fis.plugin('www1',{
              site: 'pconline',
              path: createPath(!0),
              user: fis.get('user')
            })
          ]
        })
      fis
        .media('www1-pack')
        .match('*.{scss,sass,less,css}', {
          optimizer: fis.plugin('clean-css')
        })
        .match('css/*.{scss,sass,less,css}',{
          release: '/static/index.css',
          packTo: '/css/index.css'
        })
        .match('lib/*.js',{
          isMod: true,
          useMap: true,
          release: '/static/lib.js',
          packTo: '/lib/lib.js',
          optimizer: fis.plugin('uglify-js')
        })
        .match('lib/lib.js',{
          isMod: true,
          useMap: true,
          release: '/static/lib.js'
        })
        .match('(*).zip',{
          release: '/$1.zip'
        })
        .match('::package', {
          postpackager:createRequireConfig
          //, postpackager:fis.plugin('loader',{allInOne:true})
        })
        .match('**',{
          charset: fis.get('uploadCharset'),
          deploy: [
            fis.plugin('encoding'),
            fis.plugin('local-deliver',{
              to: fis.get('output')
            }),
            fis.plugin('zip', {
              filename: 'www1.zip'
            }),
            fis.plugin('www1',{
              site: fis.get('site'),
              path: createPath(),
              user: fis.get('user')
            })
          ]
        })
}
