[TOC]

#pc-sub文档说明
@[v1.2.5]

#开发规范

##文件夹规范
目前，主要定义了四个文件夹：**工作区（work）**、**开发文件夹（dev）**、**输出文件夹（ouput）**、**编辑文件夹（edit）**。

文件夹结构：

``work`` > (``dev`` + ``output`` + ``edit``)

```sh
 + work
    - dev
    - output
    - edit
```

###work目录

####定义
该目录为**工作区**，是可以自定义的，它的定义是：
>**工作区**是用户指定的文件夹，里面将会包含开发目录和输出目录的文件夹，``pc-sub``命令里面的``create``和``server``都是基于这个文件夹的。

####功能

- ``pc-sub``初始化项目将会在工作区进行。
- ``pc-sub``开启的本地开发服务器将以工作区为根目录。

具体会在**命令**介绍里面说明。

####栗子
```sh
 + ~/Desktop/
   - dev/
   - output/
```
如果把你的**桌面**(桌面文件夹)当做 **work** 工作区，那么桌面将会有一个 **dev** 开发目录和一个 **output** 输出目录。

###dev目录

####定义
顾名思义，就是开发过程中的文件夹。
>初始化项目的目标文件夹，文件夹包含了所有初始化项目的文件夹。

####功能
- 存放开发过程中的项目。

####栗子
```sh
 + ~/Desktop/dev
   - projectA/
   - projectB/
```
如果 **dev** 开发目录在**桌面**，那它里面将会存放有你的项目目录

###项目目录

####定义
就是你的项目啦，项目名是在初始化过程中就产生了的。
>项目文件夹，存放了项目源文件，和``fis-conf.js``配置文件。

####目录规范

```sh
 + projectA/
   - css
   - img
   - lib
   + page
	 - layout
	 _data.js
   + source
	 - edit
	 - api
	 - module
	 - psd
	 - widget
    fis-conf.js
```

- **css**  ：里面所有的css将会进行编译输出，支持`LESS`和`SASS`的编译。**（`！`SASS编译需要自行手动安装插件``fis-parser-sass2``）**
- **img** ：页面所引用的图片将会按照`fis`的设置进行图片合并，所有图片将进行压缩。
- **lib**  ：存放`js`文件，会自动进行`AMD规范`包裹，需配合`pcloader.js`进行`js`模块化。
- **page** : 存放`html`文件和`md`文件，`md`将会编译成`html`输出；支持`handlebars`模板，`_data.js`文件是写`handlebars`模板的数据的，`layout`文件夹用来存放`handlebars-layouts`.
- **source** :  存放一些源文件、组件和模块（目前没有进行组件化编译），`api`可以存放一些简单的接口，将会在本地服务器上输出。**source**里的全部文件都不会进行编译输出。

####fis-conf.js 说明
```js
var path = require("path")
var _dirName = path.resolve(__dirname)

var workDir = path.resolve(_dirName,"../../")
// 找出当前项目的 工作区（work目录）
// 使用相对路径是因为方便项目文件夹切换不同的工作区，例如切换电脑回家撸代码的情况。

// fis.set(name,key) 可以通过 fis.get(name) 进行调用

fis.set("project.ignore",["node_modules/**", "output/**", "fis-conf.js" , ".svn/**", ".git/**" ,"source/**","**/.svn"])
// 让FIS忽略某些目录的遍历，这里包含了默认的FIS配置，谨慎修改。

fis.set("namespace","20151105_test_66")
// 把项目名定为 namespace，在自动包裹 AMD 规范的时候，xx.js文件的id默认为 namespace:/lib/xx

fis.set("count","http://count5.pconline.com.cn/newcount/count.php?channel=3936")
// 在拉取模板六网专题模板的时候，会有六网对于的计数器代码，将会 set 在这里

fis.set("user",{
	username:"www1_name",
	password:"www1_password",
	designer:"designer_name",
	FEer:"your_name"
})
// username 和 password 是针对 www1 服务器上传的用户名和密码。
// designer 和 FEer 对于页面上 meta 的作者（目前并未自动进行对应）

fis.set("extendData",{designer:fis.get("user").designer,FEer:fis.get("user").FEer})
// 用于拓展 Hadlebars 的模板数据,在每个html里面都会被引用到。

fis.set("createTime","20151105")
//创建该项目的时间。（请慎修改，与默认 www1 服务器上传路径相关）

fis.set("_createTime","Thu Nov 05 2015 11:50:51 GMT+0800 (中国标准时间)")
//创建该项目的时间。new Date

fis.set("workDir",workDir)

fis.set("outputDir",path.resolve(workDir,"./output"))
// 编译输出的文件夹地址。（请慎修改，与输出相关）

fis.set("output",path.resolve(workDir,"./output","./20151105_test_66"))
// 当前项目的编译输出文件夹地址。（请慎修改，与输出相关）

fis.set("devDir",path.resolve(workDir,"./dev"))
// 开发文件夹地址。（请慎修改，与输出相关）

fis.set("dev",path.resolve(workDir,"./dev","./20151105_test_66"))
// 当前项目开发文件夹地址。（请慎修改，与输出相关）

fis.set("editDir",path.resolve(workDir,"./edit"))
// 编辑器文件夹地址。（请慎修改，与输出相关）

fis.set("edit",path.resolve(workDir,"./edit","./20151105_test_66"))
// 当前项目编辑器文件夹地址。（请慎修改，与输出相关）

fis.set("remoteServer","http://")
// node.js 服务器端接收地址，目前132测试机有个相关服务器可供测试

fis.set("site","pconline")
// 创建该项目的网站。（请慎修改，与默认 www1 服务器上传路径相关）

fis.set("city","gz")
// 创建该项目的地区。（请慎修改，与默认 www1 服务器上传路径相关）

fis.set("www1Url",false)
// 自定义www1上传路径，例如：/test/abc/123/,默认为规范路径

fis.get("uploadCharset","gbk")
// 所上传(所有上传操作)的文件编码，默认gbk

fis.set("ignoreHtml",false)
// 上传到www1时忽略Html文件? 默认不忽略

fis.set("ignoreImg",false)
// 上传到www1时忽略图片文件? 默认不忽略

fis.pcSub()
//执行封装好的配置
```
####编译说明
编译后， `/dev/project/img/*.{png,gif,jpg}` , `/dev/project/css/*.css`和`/dev/project/lib/*.js`都将放在`/output/project/static/`文件夹里。
`/dev/project/page/*.html`将会在`/output/project/`文件夹里

```
 /img/a.png => /static/a.png
 /css/a.css => /static/a.css
 /lib/a.js  => /static/a.js
 /page/a.html => /a.html
```

#命令介绍

##server

###参数
 - `-s [port]` 开启服务器，默认端口`8090`，服务器将用 `pm2` 进行管理。可以安装pm2进行更多管理和监控`npm i -g pm2`
 - `-x` 为关闭服务器，如果安装了 `pm2` ，也可以通过`pm2 kill`进行关闭进程（这里将关闭所有进程）
 - `-d` 在某些不能用 `-s`(pm2)打开服务器的情况，可以用該参数开启服务器并进入调试模式

**需要在工作区目录使用**
```sh
$ pc-sub server -s
$ pc-sub server -x

$ pc-sub server -d
```

###服务器功能
#### json输出
如果存在项目： **project**
在浏览器输入 http://127.0.0.1:8090/api/project/json/data.js
将会寻找项目文件夹里 `project/source/api/data.js` 文件，并将其`data`对象进行`json`输出。
 `data.js` : 
```js
exportes.data = {
	name : "ll",
	like : "dog"
}
```
输出 `json` ：
```json
{
	"name" : "ll",
	"like" : "dog"
}
```

#### jsonp输出
如果存在项目： **project**
在浏览器输入 http://127.0.0.1:8090/api/project/jsonp/data.js?callback=callbcak
将会寻找项目文件夹里 `project/source/api/data.js` 文件，并将其`data`对象进行`json`输出。
 `data.js` : 
```js
exportes.data = {
	name : "ll",
	like : "dog"
}
```
输出 `jsonp` ：
```json
callback({
	"name" : "ll",
	"like" : "dog"
})
```
#### 编译预览(output)
如果存在项目： **project**
在浏览器输入 http://127.0.0.1:8090/project
将会预览**output**里**project**文件夹的`index.html`

#### 开发预览(dev)
在浏览器输入 http://127.0.0.1:8090/dev/project/page/index.html
将会预览**dev**里**project**文件夹的`/page/index.html`

####代理接口
有时候需要代理线上接口，解决上线不跨越，开发跨域的问题。
接口地址：http://127.0.0.1:8090/proxy.json
接收参数：`url`和`cookie`
```js
//GET 请求无法代理 cookie 将在后面解决
//GET 请求除了 url 参数，其余的 data 参加都将随着代理链接一并传送
$.ajax({
  url:"http://127.0.0.1/proxy.json",
  type:"GET",
  dataType: 'json',
  data:{
    url:"my.pconline.com.cn/intf/getLogedUser.jsp",
    otherDataA: "dataA"
  },
  success: function(data){
    console.log(data)
  }
});

//POST 请求可以代理 cookie
//POST 请求除了 url 和 cookie 参数，其余的 data 参加都将随着代理链接一并传送
$.ajax({
  url:"http://127.0.0.1/proxy.json",
  type:"POST",
  dataType: 'json',
  data:{
    url:"my.pconline.com.cn/intf/getLogedUser.jsp"，
    cookie: document.cookie,
    otherDataA: "dataA"
  },
  success: function(data){
    console.log(data)
  }
});

```
##create

将会根据 `projectName` 在 `dev` 文件夹内初始化一个项目文件夹，起到脚手架的作用。

###参数
- `-o projectName` : 初始化一个 `pconline` 专题模板
- `-b projectName` : 初始化一个 `pcbaby`     专题模板
- `-a projectName` : 初始化一个 `pcauto` 专题模板
- `-l projectName` : 初始化一个 `pclady` 专题模板
- `-h projectName` : 初始化一个 `pchouse` 专题模板
- `-g projectName` : 初始化一个 `pcgame` 专题模板

------

- `-mo projectName` : 初始化一个 `pconline` 移动端专题模板
- `-mb projectName` : 初始化一个 `pcbaby`     移动端专题模板
- `-ma projectName` : 初始化一个 `pcauto` 移动端专题模板
- `-ml projectName` : 初始化一个 `pclady` 移动端专题模板
- `-mh projectName` : 初始化一个 `pchouse` 移动端专题模板
- `-mg projectName` : 初始化一个 `pcgame` 移动端专题模板

**需要在工作区目录使用**
```sh
$ pc-sub create -o test
```

##release
根`FIS3`的使用方法一样，具体可以查看`FIS3`[官方文档](https://github.com/fex-team/fis3/blob/master/doc/docs/api/command.md#release)。这里介绍几个封装好的参数。
在**项目文件夹**内（有fis-conf.js的文件夹）进行 `pc-sub release`。

**需要在项目文件夹使用**
###参数
#### 无参数
```sh
$ pc-sub release
```
或者
```sh
$ pc-sub release -wL
```
这样将进行正常编译：
编译后， `/dev/project/img/*.{png,gif,jpg}` , `/dev/project/css/*.css`和`/dev/project/lib/*.js`都将放在`/output/project/static/`文件夹里。
`/dev/project/page/*.html`将会在`/output/project/`文件夹里

```
 /img/a.png => /static/a.png
 /css/a.css => /static/a.css
 /lib/a.js  => /static/a.js
 /page/a.html => /a.html
```

#### www1

在配置好`fis-conf.js`后，就能够进行自动了

```js
fis.set("user",{
	username:"www1_name",
	password:"www1_password",
	designer:"designer_name",
	FEer:"your_name"
})
```

注意
```sh
$ pc-sub release www1
```
这样将会进行编译、压缩并自动上传至对应的 `www1` 服务器，上传路径默认为规范路径 `/gz20150909/test/`

#### www1-pack
```sh
$ pc-sub release www1-pack
```
这样将会进行编译、压缩、文件打包并自动上传至对应的 `www1` 服务器，上传路径默认为规范路径 `/gz20150909/test/`

打包会将`css` 里面 的`css文件` 打包成一个 `index.css`，`lib` 里面的 `js文件` 打包成一个 `lib.js`

#### www1test
```sh
$ pc-sub release www1test
```
这样将会进行编译、压缩并自动上传至对应的 `www1` 内部预览路径 ，上传路径默认为规范路径 `http://www1.pconline.com.cn/internal/gz20150909/test/`
