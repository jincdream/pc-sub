[TOC]

#pc-sub

#安装

## 1、Node.js 安装

下载`v0.12.7`版本并进行安装。
https://nodejs.org/en/download/

>目前`Node.js`最新版本为`v4.1`，因为某些插件并不支持该版本，所以需要安装旧版本。

如果之前安装过的版本比较低，需要卸载当前版本并进行新版本的安装。
>所有版本 https://nodejs.org/en/download/releases/

或者使用`nvm`(比较坑)
##2、Npm配置

- 设置代理服务器，如果不是``IP直连``，需要**设置代理**，或者使用代理软件
```sh
$ npm config set proxy http://192.168.11.254:8080
$ npm config set https-proxy http://192.168.11.254:8080
```
- 设置``npm``镜像仓库，源仓库在国外，安装包的时候网络可能会连不上，建议设置成[某宝镜像库](http://npm.taobao.org/)
```sh
$ npm config set registry https://registry.npm.taobao.org 
```

##3、安装pc-sub
```sh
$ npm install -g pc-sub@1.1.3
```

#开发规范

##文件夹规范
目前，主要定义了三个文件夹：**工作区（work）**、**开发文件夹（dev）**、**输出文件夹（ouput）**。

文件夹结构：

``work`` > (``dev`` + ``output``)

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
	 - api
	 - module
	 - psd
	 - widget
    fis-conf.js
```

- **css**  ：里面所有的css将会进行编译输出，支持`LESS`和`SASS`的编译。
- **img** ：页面所引用的图片将会按照`fis`的设置进行图片合并，所有图片将进行压缩。
- **lib**  ：存放`js`文件，会自动进行`CMD规范`包裹，需配合`pcloader.js`进行`js`模块化。
- **page** : 存放`html`文件和`md`文件，`md`将会编译成`html`输出；支持`handlebars`模板，`_data.js`文件是写`handlebars`模板的数据的，`layout`文件夹用来存放`handlebars-layouts`.
- **source** :  存放一些源文件、组件和模块（目前没有进行组件化编译），`api`可以存放一些简单的接口，将会在本地服务器上输出。**source**里的全部文件都不会进行编译输出。

####fis-conf.js 说明
```js
//fis.set(name,key) 可以通过 fis.get(name) 进行调用

fis.set("namespace","test1")
//把项目名定为 namespace，在自动包裹 CMD 规范的时候，xx.js文件的id将为 namespace:/lib/xx

fis.set("count","http://count5.pconline.com.cn/newcount/count.php?channel=3936")
//在拉取模板六网专题模板的时候，会有六网对于的计数器代码，将会 set 在这里

fis.set("user",{
	username:"www1 name",
	password:"www1 password",
	designer:"designer name",
	FEer:"your name"
})
//username 和 password 是针对 www1 服务器上传的用户名和密码。
//designer 和 FEer 对于页面上 meta 的作者（目前并未自动进行对应）

fis.set("createTime","20150901")
//创建该项目的时间。（请慎修改，与默认 www1 服务器上传路径相关）

fis.set("_createTime","Mon Sep 07 2015 14:23:46 GMT+0800 (CST)")
//创建该项目的时间。new Date

fis.set("outputDir","/Users/cenjinchao/pc/works/output/")
//编译输出的文件夹地址。（请慎修改，与输出相关）

fis.set("output","/Users/cenjinchao/pc/works/output/test1")
//编译输出的项目文件夹地址。（请慎修改，与输出相关）

fis.set("devDir","/Users/cenjinchao/pc/works/dev")
//开发文件夹地址。（请慎修改，与输出相关）

fis.set("dev","/Users/cenjinchao/pc/works/dev/test1")
//开发项目文件夹地址。（请慎修改，与输出相关）

fis.set("remoteServer","http://192.168.50.132:8999")
//node.js 服务器端接收地址，目前132测试机有个相关服务器可供测试

fis.set("site","pconline")
//创建该项目的网站。（请慎修改，与默认 www1 服务器上传路径相关）

fis.set("city","gz")
//创建该项目的地区。（请慎修改，与默认 www1 服务器上传路径相关）

fis.set("www1Url",false)
//自定义www1上传路径，例如：/test/abc/123/,默认为规范路径

fis.get("uploadCharset","gbk")
//所上传(所有上传操作)的文件编码，默认gbk

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
```sh
$ pc-sub server -s 8090
$ pc-sub server -x
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

- `-mo projectName` : 初始化一个移动端 `pconline` 专题模板
- `-mb projectName` : 初始化一个移动端 `pcbaby`   专题模板
- `-ma projectName` : 初始化一个移动端 `pcauto`   专题模板
- `-ml projectName` : 初始化一个移动端 `pclady`   专题模板
- `-mh projectName` : 初始化一个移动端 `pchouse`  专题模板
- `-mg projectName` : 初始化一个移动端 `pcgame`   专题模板

```sh
$ pc-sub create -o test
```

##release
根`FIS3`的使用方法一样，具体可以查看[`FIS3`官方文档](http://fis.baidu.com/fis3/docs/beginning/release.html#%E4%BE%8B%E5%AD%90)。这里介绍几个封装好的参数。
在**项目文件夹**内（有fis-conf.js的文件夹）进行 `pc-sub release`。

###参数
#### 无参数
```sh
$ pc-sub release
```
或者 (监听文件改动实时编译、浏览器自动刷新)
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
