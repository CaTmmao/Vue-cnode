<!--App.vue文件是我们的主组件，所有页面都是在App.vue下进行切换的，也可以理解为所有的路由都是App.vue-->
<!--的子组件-->
<template>
  <div id="app">
    <!--回到顶部按钮-->
    <!--v-show 和 v-if 的区别在于，使用v-show的标签是一直在DOM树中，相当于css的display；而v-if是当为false时，DOM树中不会出现这个元素-->
    <div v-show="scrollToTop" @click="goTop" class="toTopButton">
      <!--icon是在阿里的iconfont中找的-->
      <svg class="icon">
        <use xlink:href="#icon-to-top"></use>
      </svg>
    </div>
    <div class="router-view">
      <Head></Head>
      <!--keep-alive，缓存组件实例而不是销毁他们。主要用于保留组件状态 / 阻止组件重新渲染; exclude代表里面写的组件除外-->
      <keep-alive exclude="User,Collections,Messages,Release">
        <!-- 路由出口 路由匹配到的组件将渲染在router-view这里 -->
        <router-view/>
      </keep-alive>
      <Foot></Foot>
    </div>
  </div>
</template>

<script>
  //引入foot组件
  import Foot from '@/components/foot/foot'
  //引入header组件
  import Head from '@/components/head/header'
  // zepto是比jq更轻量级的js框架，和jq使用方法一样，但是zepto不能和webpack搭配使用，所以用npm安装了webpack版本的zepto
  import $ from 'webpack-zepto'

  export default {
    name: 'App',
    components: {
      //注册foot组件后可以使用
      Foot,
      //注册head组件后可以使用
      Head
    },
    /* vue实例被创建（created声明周期）时， data对象里所有的属性会被添加到响应式系统里，
    (也就是说后续在data中额外添加的属性就不是响应式的，所以想让数据是响应式的，
    必须在vue实例created前就写在data中)
    当这些属性的值发生改变时，视图会产生'响应'，更新为新的值 */
    data() {
      return {
        scrollToTop: false //默认不显示回到顶部按钮，当页面向下滚动到一定举例后再显示
      }
    },
    created() {
      // 请求&响应拦截器
      this.axiosConfig()

      /* store已经在main.js中注册，因此所有组件中都可以通过this.$store获取到store实例的所有属性和方法
       dispatch方法用于触发actions里的函数 */
      //查看用户是否登录
      this.$store.dispatch('checkLogin')
    },
    mounted() {
      //查看是否需要显示回到顶部按钮
      this.ifShowScrollButton()
    },
    methods: {
      // '回到顶部'按钮click事件
      goTop() {
        //回到顶部
        window.scrollTo(0, 0)
      },
      //是否需要显示 回到顶部 按钮
      ifShowScrollButton() {
        //监听scroll事件
        $(window).on('scroll', () => {
          //当页面滚动达到100px
          if ($(window).scrollTop() > 100) {
            //显示回到顶部按钮
            this.scrollToTop = true
          } else {
            this.scrollToTop = false
          }
        })
      },
      //请求 & 响应拦截
      axiosConfig() {
        //请求拦截器 （发送请求之前运行该代码）把每个请求中重复的代码放在请求拦截器中可以减少代码量
        this.$axios.interceptors.request.use(request => {
          // 如果是post请求
          if (request.method === 'post') {
              // 所有的post请求都会统一添加一个accesstoken的data参数
            request.data = Object.assign({
              accesstoken: this.$store.state.accesstoken
            }, request.data)
          }

          // 如果是get请求
          // 所有的get请求都会添加一个accesstoken的data参数
          if (request.method === 'get') {
            request.params = Object.assign({
              accesstoken: this.$store.state.accesstoken
            }, request.params)
          }

          return request
        }, err => {
          //提示错误
          this.$toast(err)
          return Promise.reject(err)
        })
      }
    }
  }
</script>

<style lang="scss">
    //引入公用scss样式
    @import "@/assets/scss/common.scss";
    //引入响应式scss样式
    @import "@/assets/scss/media.scss";

    #app {
      font-family: -apple-system, "PingFang SC", "Hiragino Sans GB", Arial, "Microsoft YaHei", "Helvetica Neue", sans-serif;
      font-size: 14px;

      .toTopButton {
        position: fixed;
        bottom: 30px;
        right: 50px;
        z-index: 1000;

        svg {
          cursor: pointer;
          width: 50px;
          height: 50px;
        }
      }

      .router-view {
        display: flex;
        //三个子元素：head 主内容部分 foot 按照column排列
        flex-direction: column;

        //views文件夹里所有vue文件里的template里的根标签都是<section>，因此所有跳转到任意页面主内容部分的min-height 都是 100vh
        > section {
          min-height: 80vh;
        }
      }
    }
</style>
