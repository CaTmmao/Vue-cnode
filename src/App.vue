<!--App.vue文件是我们的主组件，所有页面都是在App.vue下进行切换的，也可以理解为所有的路由都是App.vue-->
<!--的子组件-->
<template>
  <div id="app">
    <!--回到顶部按钮-->
    <div @click="goTop" class="toTopButton">
      <svg class="icon">
        <use xlink:href="#icon-to-top"></use>
      </svg>
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
