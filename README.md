>用vue完成的仿cnode社区
**[预览地址](https://catmmao.github.io/vue-cnode/#/)**


## 技术栈
```
vue
vue-cli3
vue-router
vuex
scss
ES6
```
[API提供地址](https://cnodejs.org/api)
## 完成功能
- [x] 登录账号
- [x] 退出账号
- [x] 收藏主题
- [x] 取消收藏主题
- [x] 获取未读消息数量
- [x] 获取已读和未读消息
- [x] 标记全部消息已读
- [x] 发布话题（该API已被[cnode社区下线](https://cnodejs.org/api)（见该链接中的update内容），相关代码保留，但该功能暂时无法使用）
- [x] 回复（该API已被[cnode社区下线](https://cnodejs.org/api)（见该链接中的update内容），相关代码保留，但该功能暂时无法使用）
- [x] 点赞（该API已被[cnode社区下线](https://cnodejs.org/api)（见该链接中的update内容），相关代码保留，但该功能暂时无法使用）
- [x] 取消点赞（该API已被[cnode社区下线](https://cnodejs.org/api)（见该链接中的update内容），相关代码保留，但该功能暂时无法使用）


## 完成页面
- [x] 主页
- [x] 话题详情页
- [x] 登录页面
- [x] 用户详细信息页面
- [x] 用户收藏话题页面
- [x] 用户未读消息页面
- [x] 新建主题页面

上面部分功能需要先登录才会显示在页面上，如回复，新建主题，收藏主题，查看未读消息等。

登录请在登录页面的input框中输入自己的accesstoken

[如何获取自己的accesstoken](https://note.youdao.com/share/?id=6a2c41f0617d0ee82179f06206bd48bf&type=note#/)

## 本地运行
```
1. 克隆到本地
git clone git@github.com:CaTmmao/vue-cnode.git

2. 进入项目文件
cd vue-cnode

3. 安装依赖
npm install or yarn install

如果遇到node-sass安装不成功的情况，请rm -rf node_modules后用下面命令安装node-sass:
npm install --unsafe-perm node-sass

4. 本地运行
npm run serve or yarn serve

5. 打包代码
npm run build 
```

## 如何部署到github pages
1. 在项目根目录创建**vue.config.js**文件
 ```javascript
 //添加以下代码
 module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
    //你的项目在github上的项目名，如我的项目在github上项目名叫vue-cnode
        ? '/vue-cnode/'     
        : '/'
}
```

2. 创建新分支 分支取名为gh-pages
```
  git branch gh-pages
```

3. 将根目录中.gitignore中将dist删掉，避免dist目录无法上传（也可以跳过这步，之后git add dist的时候用命令行参数 -r 强制执行）

4. npm run build 打包文件得到 dist文件

5. 上传dist文件到github远程分支 gh-pages上
```
  git add dist && git commit -m 'upload dist'
  git subtree push --prefix dist origin gh-pages
```

6. 打开github上你的项目仓库，点击上方的**settings**选项→**GitHub Pages**→**Source**下方选择**gh-pages branch**
