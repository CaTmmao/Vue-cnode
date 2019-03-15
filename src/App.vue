<!--App.vue文件是我们的主组件，所有页面都是在App.vue下进行切换的，也可以理解为所有的路由都是App.vue-->
<!--的子组件-->
<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
      <Foot></Foot>
  </div>
</template>

<script>
  //引入foot组件
  import Foot from 'components/foot/foot.vue'

  export default {
    name: 'App',
    components: {
        //局部注册foot组件后可以使用
        Foot
    }
  }
</script>

<style lang="scss">
    //引入公用scss样式
  @import "assets/scss/common";
</style>
