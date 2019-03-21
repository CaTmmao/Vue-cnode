// 没完成
import Vue from 'vue'
import Router from 'vue-router'

//通过调用全局方法Vue.use调用路由插件
Vue.use(Router)

//创建router实例，里面可以传入各种配置参数，如routes,mode等
const router = new Router({
  //设置为history模式
  mode: 'history',

  //   匹配的优先级按照路由的定义顺序
  routes: [
    {
      //主页
      name: 'HomePage',
      path: '/',
      component: () => import('@/views/index/index')
    },
    {
      //登录页面
      name: 'Login',
      path: '/login',
      component: () => import('@/views/login/login')
    },
    {
      //用户信息页面
      name: 'User',
      path: '/user/:loginname',
      component: () => import('@/views/user/user')
    },
    {
      //用户收藏页面
      name: 'Collections',
      path: '/user/:loginname/collections',
      component: () => import('@/views/collections/collections'),
      // 在组件中用this.$route会使组件和对应路由形成高度耦合，使组件只能在定的URL上使用。在路由上添加props把组件与路由解耦
      //   将loginname作为属性传递给collections组件
      props: route => ({loginname: route.params.loginname})
    },
    {
      //未读消息页面
      name: 'Messages',
      path: '/messages',
      component: () => import('@/views/messages/messages')
    },
    {
      //主题详情内容页面
      name: 'Topic',
      path: '/topic/:id',
      component: () => import('@/views/topic/topic')
    },
    {
      //404页面
      name: 'NotMatch',
      //匹配所有路径 通常用于客户端404错误，当无法匹配到上面的路径时，就会转到这个组件
      path: '*',
      component: () => import('@/views/404/404')
    }
  ]
})

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0)
  next()
})

export default router
