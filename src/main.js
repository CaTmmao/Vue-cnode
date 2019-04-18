//main.js是我们的入口文件，主要作用是初始化vue实例并使用需要的插件
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import iView from 'iview'

//引入公用scss样式
import "@/assets/scss/common.scss";
//引入响应式scss样式
import "@/assets/scss/media.scss";

//引入toast插件
import toast from '../utils/toast'
//通过全局方法Vue.use使插件可用
Vue.use(toast)

//引入组件
import SideBar from '@/components/side-bar/side-bar'
import TopicList from '@/components/topic-list/topic-list'
import Loading from '@/components/loading/loading'
//全局注册组件，整个应用都可以使用
Vue.component('SideBar', SideBar)
Vue.component('TopicList', TopicList)
Vue.component('Loading', Loading)

Vue.config.productionTip = false
Vue.use(iView)

//把axios方法挂到vue实例中
Vue.prototype.$axios = axios

//全局注册过滤器 用来格式化时间
Vue.filter('fromNow', str => {
  if (!str) return ''
  var date = new Date(str)
  var time = new Date().getTime() - date.getTime() //现在的时间-传入的时间 = 相差的时间（单位 = 毫秒）
  if (time < 0) {
    return ''
  } else if ((time / 1000 < 30)) {
    return '刚刚'
  } else if (time / 1000 < 60) {
    return parseInt((time / 1000)) + '秒前'
  } else if ((time / 60000) < 60) {
    return parseInt((time / 60000)) + '分钟前'
  } else if ((time / 3600000) < 24) {
    return parseInt(time / 3600000) + '小时前'
  } else if ((time / 86400000) < 31) {
    return parseInt(time / 86400000) + '天前'
  } else if ((time / 2592000000) < 12) {
    return parseInt(time / 2592000000) + '个月前'
  } else {
    return parseInt(time / 31536000000) + '年前'
  }
})

new Vue({
    //通过router配置参数注入路由，从而让整个应用都有路由功能
  router,
    //把store的实例注入到所有的子组件中，子组件可以通过this.$store访问到
  store,
  render: h => h(App)
  // ...App ↑render函数渲染APP的另一种写法
}).$mount('#app')
