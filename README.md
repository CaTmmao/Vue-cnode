>用vue完成的cnode社区
**[预览地址](https://catmmao.github.io/cnode/#/)**


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

## 完成页面
- [x] 主页
- [x] 话题详情页
- [x] 登录页面
- [x] 用户详细信息页面
- [x] 用户收藏话题页面
- [x] 用户未读消息页面
- [x] 新建主题页面

上面部分功能需要先登录才会显示在页面上，如回复，新建主题，收藏主题，查看未读消息。

登录请在登录页面的input框中输入自己的accesstoken

[如何获取自己的accesstoken](https://note.youdao.com/share/?id=6a2c41f0617d0ee82179f06206bd48bf&type=note#/)

## 本地运行
```
1. 克隆到本地
git clone git@github.com:CaTmmao/cnode.git

2. 进入项目文件
cd cnode

3. 安装依赖
npm install or yarn

如果遇到node-sass安装不成功的情况，请rm -rf node_modules后用下面命令安装node-sass:
npm install --unsafe-perm node-sass

4. 运行
npm run serve or yarn serve

```
