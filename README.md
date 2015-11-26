#pc-sub 教程
@[v1.2.7]

[TOC]
#安装

## 1、Node.js 安装

下载`v4.0.0+`版本并进行安装(安装到默认位置即可)。
>在`v5.0+`中暂时不支持雪碧图的合并。

https://nodejs.org/en/download/

如果之前安装过的版本比较高，需要卸载当前版本并进行新版本的安装。
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

`mac`安装需要`sudo`.

```sh
$ npm install -g pc-sub@1.2.7
```
or
```sh
$ npm i -g pc-sub@1.2.7
```
若要查看详细的安装信息:
```sh
$ npm i -gd pc-sub@1.2.7
```

#快速开始

1. 创建`work`**工作区** --- 新建文件夹 `work`
2. 进入**工作区**
3. 开启本地预览服务器，端口`8090`
4. 在**工作区**创建一个项目`zta`
5. 在**项目文件夹**进行编译（将自动打开浏览器 http://127.0.0.1:8090），开启实时刷新
6. 开始编写代码

bash:
```bash
$ mkdir work
$ cd work
$ pc-sub server -s
$ pc-sub create -o zta
$ cd dev/zta
$ pc-sub release -L
```

#页面实时刷新
在 `pc-sub release -L`的时候，就开启了监听项目文件改动后浏览器实时刷新了。它会给编译后的`*.html`文件添加一段代码。
```
<script type="text/javascript" charset="utf-8" src="http://192.168.50.33:8132/livereload.js"></script>
```
所以，在进行了 `-L`编译的时候，不能进行对编译后的文件打包上传，要执行一次`pc-sub release -c`编译，去掉`livereload.js`。

实时刷新是通过`websocket`实现的，所有大部分手机和低版本浏览器是不支持的。

#Less/Sass 编译
在项目的 `css` 文件夹中，所有的`.less`文件`.sass`文件都将会进行编译。

新建一个`index.less`文件。
```less
//index.lexx
body{
  background: #00f;
  div{
  color:#f3f;
  }
}
```
将自动进行编译，编译后：
```css
body{
  background: #00f;
}
body div{
  color: #f3f;
}
```

在`page/index.html`引入**相对路径**(`../css/index.less`)即可，编译后会自动替换编译后的**相对路径**。

Sass 的编译亦如此。
> Less 教程推荐 http://less.bootcss.com/
> Sass 教程推荐 http://www.w3cplus.com/sassguide/

#使用Handlebars模板
在项目的`page`文件夹中，默认会有个与**Handlebars**模板相对应的`_data.js`数据文件，所有`.html`文件会自动进行结合`_data.js`数据文件的模板编译：


`_data.js` 是一个可执行的`js`文件，也就是说，他会在与模板进行结合之前将会运行求值。
```js
//_data.js
var i = 1
var time = 'today-' + i 
module.exports.data = {
  //your page data..
  items:[{
    price: 1,
    name: 's'
  },{
    price: 10,
    name: 'x'
  },{
    price: 12,
    name: 'g'
  }],
  project:'proA',
  time : time
}
```

编译前（`zta/page/index.html`）：
```html
<h1>{{project}}</h1>
<p>{{time}}</p>
<ul>
<!-- 循环 _data.js 里面的数组属性 items -->
  {{#items}}
    <li>{{name}} , price : {{price}}</li>
  {{/items}}
</ul>
```

编译后（`zta/index.html`）：
```html
<h1>proA</h1>
<p>today-1</p>
<ul>
<!-- 循环 _data.js 里面的数组属性 items -->
    <li>s , price : 1</li>
    <li>x , price : 10</li>
    <li>g , price : 12</li>
</ul>
```

#雪碧图合并
> - 暂不支持Node.js v5.0.0+
> - 不支持分别合成多张雪碧图

使用方法跟官方的一致。默认已经在`pc-sub`启动，无需手动配置。
[FIS3官方文档-雪碧图合并](https://github.com/fex-team/fis3/blob/master/doc/docs/beginning/release.md#CssSprite%E5%9B%BE%E7%89%87%E5%90%88%E5%B9%B6)

```css
/*默认情况下，对打包 css 文件启动图片合并功能。*/
li.list-1::before {
  background-image: url('./img/list-1.png?__sprite');
}

li.list-2::before {
  background-image: url('./img/list-2.png?__sprite');
}
```

#script模板
在`*.html`里面如要使用`script`模板，需要给出指定的`type="text/template"`，否则里面的路径将无法编译。
```html
<script type="text/template">
  <div>
    <img src="../img/a.png">
  </div>
</script>
```

#编辑填充工具
进入http://127.0.0.1:8090/edit/zta/index.html#index
就可以对`page/index.html`文件进行填充内容了。

`/edit/`的url对应在了`work`工作区里面的`/edit/`文件夹。
目前该文件夹下面，分别为每个项目的编辑器代码。目前各个项目的编辑器代码都是一样的。

通过上面的链接就可以打开编辑器了。
`#index`的哈希值对应着`page/index.html`，如果你要选择`page/indexB.html`的文件进行填充，那可以访问http://127.0.0.1:8090/edit/zta/index.html#indexB。默认为`page/index.html`。

| Url      |     Hash |   Page|
| :-------- | --------:| :------: |
| http://127.0.0.1:8090/edit/zta/index.html#index    |   #index |  page/index.html|
| http://127.0.0.1:8090/edit/zta/index.html#indexB   |   #indexB|  page/indexB.html|

##预设占位符
预设占位符是用来指定这个地方是可以给编辑器填充的。但编辑器进行了一次保存之后，所有的预设占位符将在`page/index.html`中被替换成一个`Handlebars`变量。

- `@img:100x100`:图片链接占位符，冒号后面的参数为图片尺寸，尺寸可以自定义。
- `@title:10`:标题占位符，冒号后面的参数为字符串长度。
- `@text:10`:文本占位符，冒号后面的参数为字符串长度，文本会在随机位置添加标点符号。
- `@url:ttt`:链接占位符，冒号后面的参数为url参数，如`@url:ttt` => `http://www.pconline.com.cn?mock=ttt`
- `#html`: 代码占位符，用于填充`html`代码片段。


使用：
`page/index.html`
```html
<h1>{{@title:5}}</h1>
<p>
  {{@text:20}}
  <a href="{{@url:x}}">
    <img src="{{@img:100x200}}" width="100" height="200">
  </a>
  {{#html}}{{/html}}
</p>
```
编译后：
```html
<h1>太平洋电脑</h1>
<p>
  太平洋电脑网太平洋电脑网太平洋。脑网太平
    <a href="http://www.pconline.com.cn?mock=x">
    <img src="http://dummyimage.com/100x200/70ec31/FFF" width="100" height="200">
    </a>
    
</p>
```
编辑页面。
![Alt text](./{BF4295A9-A845-4695-AA4D-9D6E8335F5CE}.png)
1. 顶部工具栏`select`用来选择`page`文件夹里面的`html`文件。
2. **保存**按钮将进行内容保存，**`！注意：点击保存后，会对我们的开发源文件/dev/page/xxx.html进行修改，因此，强烈建议在编辑确认了页面效果之后，再由编辑进行文字填充。`**
3. 未保存之前，右边的预览会实时更新左边所改变的内容。但只有点了保存后，内容才会填入编译后的文件。