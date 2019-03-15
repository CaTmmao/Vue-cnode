//vue-cli3自动识别该文件并进行配置 配置全部统一在该文件

var path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    chainWebpack: config => {
        //设置别名
        config.resolve.alias
        //@代表src文件夹 在node_modules/@vue/cli-service/lib/base.js中已经配置好@的别名
            .set('components', resolve('@/components'))
            .set('assets', resolve('@/assets'))
            .set('views', resolve('@/views'))
    }
}