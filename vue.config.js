//vue-cli3自动识别该文件并进行配置 配置全部统一在该文件

module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/vue-cnode/'
        : '/'
}