import Vue from 'vue'
import Vuex from 'vuex'
//引入api配置文件
import API_CONFIG from '@/api/index.js'
import axios from 'axios'
//通过调用全局方法Vue.use()使用vuex插件
Vue.use(Vuex)

//new一个vuex的store实例，并把它export出去
export default new Vuex.Store({
  state: {
    //用户登录时需要提供的token 先默认去localStorage中查找是否存储进去了，存储了就设为默认值，没有就为空
    accesstoken: window.localStorage.access_token || '',
    //用户是否登录的状态 默认为false
    isLogin: false,
    //用户信息
    userInfo: {
      loginname: '', //用户名
      id: '',        //用户id
      avatar_url: '' //用户头像
    },
    messageCount: 0  //未读消息数量
  },

   /*更改vuex的store中的状态(state)的唯一方法是commit mutations（commit是一个函数，mutations里存放修改状态的方法，当需要触发他们的时候，就用commit方法），
   vuex中的mutation类似于event，每个mutation都有一个事件名和一个处理函数（如下面的logout是事件名），处理函数就是我们实际进行状态更改的地方，并且他会接收
   state作为第一个参数
    注意： mutations里的函数必须是同步的 */
  mutations: {
    //退出登录 state为第一个参数,state也就是在上面写的state内容
    logout(state) {
      /*当用户退出登录，由于我在写accesstoken时默认会先从浏览器的localStorage中获取是否有存储，存储了就赋值上去，
      因此需要把浏览器中的备份删除；清空vuex state 中accesstoken的值；vuex state isLogin是否登录的状态设置为false */

      //从localStorage中删除掉 accesstoken 的数据 (localStorage的保存期限为永远，除非用户自己删除掉数据)
      window.localStorage.removeItem('access_token')

      //把state中accesstoken的数据清空
      state.accesstoken = ''

      //用户登录的状态改为false
      state.isLogin = false
    },
    //更新登录状态 接收两个参数，第一个参数默认为state，第二个参数data分为两种情况，1:对象，包括token和userInfo两个属性; 2:userInfo
    updateLoginState(state, data) {
      //如果accesstoken存在 说明传入的参数属于情况1
      if (data.accessToken) {
        //把token存入浏览器的localStorage和vuex state中
        window.localStorage.access_token = state.accesstoken = data.accessToken
        //用户信息传入state中
        state.userInfo = data.userInfo
      } else {
        //这是传入的data只有userInfo的情况
        state.userInfo = data
      }

      //登录状态设置为true
      state.isLogin = true
    },

    //更新未读消息的数量 接收两个参数，state为第一个参数，第二个参数count是最新未读消息数量
    updateMessageCount(state, count) {
      //将state中的消息数量更新
      state.messageCount = count
    }
  },
    /* mutations只用来注册事件（负责写修改状态的同步代码，不能处理任何异步代码），代表这些函数并没有被调用
    如果需要调用mutations里的函数，则要用到commit方法，如 commit('add') 触发mutations里的add函数
    actions专门负责commit mutations，同时actions能包含任何异步操作*/
    //actions里面的方法接收一个参数叫context，这个对象和store实例有相同的方法和属性（但他不是store实例本身）
  actions: {
    //登录
    /* 第一个参数可直接写成context，也可以用es6的解构赋值从context对象中获取到自己想要的属性/方法
    如下面的{dispatch, commit, state}就是从context对象中获取了dispatch,commit方法以及state属性，如果是
     直接写context参数，那么在函数体内使用dispatch时需要写成 context.dispatch */
    login({dispatch, commit, state}, data) {
      //更新登录状态 触发mutations中的updateLoginState方法,并传入参数data
      commit('updateLoginState', data)
      //获取未读消息数量 mutations里的方法需要通过commit触发，actions里的函数通过dispatch触发
      dispatch('fetchMessageCount')
    },

    //检查是否登录
    checkLogin({dispatch, state}) {
      //如果accesstoken存在
      if (state.accesstoken) {
        /* 用axios发送登录请求 这里没有传入accesstoken data就可以请求成功是因为在App.vue中加入了请求拦截器，
        在每个post请求之前都会统一添加一个accesstoken data，这样做的好处是可以减少重复代码*/
        axios.post(API_CONFIG.login)
            .then(res => {
              //成功后触发action里的login方法，并传入返回的data
              dispatch('login', res.data)
            })
      }
    },

    //获取未读消息数量  从context对象中解构出commit方法
    fetchMessageCount({commit}) {
        //发送获取未读消息数量的请求
      axios.get(API_CONFIG.messageCount)
          .then(res => {
            //成功后用commit触发mutations里的更新未读消息数量方法
            commit('updateMessageCount', res.data.data)
          })
    }
  }
})
