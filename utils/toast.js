//该文件用来做vue的toast插件 vue插件的制作方式https://juejin.im/post/58d9aae02f301e007e8ee278

//引入vue 挂在vue的原型链上使整个应用可以用到这个功能
import Vue from 'vue'

// zepto是比jq更轻量级的js框架，和jq使用方法一样，但是zepto不能和webpack搭配使用，所以用npm安装了webpack版本的zepto
import $ from 'webpack-zepto'

export default {
    //vue插件应该有一个install方法
    install() {
        let $toast
        let timer = null
        //在vue原型链上添加toast方法 参数是想显示的信息
        Vue.prototype.$toast = (msg) => {
            if ($toast === undefined) {
                // $toast是可用zepto内方法的div元素
                $toast = $('<div class="week-toast"></div>')
                // 把该元素添加到body元素中
                $('body').append($toast)
                // 该元素的html内容是用户自己传入的内容
                $toast.html(msg)
                //具体样式的设置在 src/assets/scss/common.scss
                $toast.addClass('toast-show')
                clearTimeout(timer)
                //2秒后移除该元素
                let timer = setTimeout(() => {
                    $toast.remove()
                    $toast = undefined
                }, 2000)
            }
        }
    }
}

