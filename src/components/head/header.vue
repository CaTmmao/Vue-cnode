<!--头部-->
<template>
    <header class="header">
        <div class="header-container">
            <!--点击logo到首页; 使用 router-link 组件来导航; 通过传入 `to` 属性转到对应的path; <router-link> 默认会被渲染成一个 `<a>` 标签 -->
            <router-link to="/" class="logo-container">
                <img src="@/assets/images/cnodejs.svg" alt="logo">
            </router-link>

            <!--右侧导航栏-->
            <nav class="nav">
                <!--回到首页-->
                <router-link to="/" class="home" title="首页">
                    <svg class="icon">
                        <use xlink:href="#icon-home"></use>
                    </svg>
                </router-link>
                <!--个人信息页面  转到user路由时，将loginname参数传递进去，在user页面中通过this.$route.params接收该参数-->
                <router-link :to="`/user/${userInfo.loginname}`" v-if="isLogin" title="个人信息">
                    <svg class="icon">
                        <use xlink:href="#icon-self"></use>
                    </svg>
                </router-link>
                <!--未读消息页面-->
                <router-link to="/messages" v-if="isLogin" :class="{'unread-msg': messageCount > 0}" title="消息">
                    <svg class="icon">
                        <use xlink:href="#icon-msg"></use>
                    </svg>
                </router-link>
                <!--退出登录状态-->
                <!--a标签的href那样写作用是不做任何反应（如点击a标签应该跳转到某个页面的行为）-->
                <a href="javascript:;" v-if="isLogin" @click="logout" title="退出">
                    <svg class="icon">
                        <use xlink:href="#icon-logout"></use>
                    </svg>
                </a>
                <!--登录按钮-->
                <router-link to="/login" v-else title="登录">
                    <svg class="icon">
                        <use xlink:href="#icon-login"></use>
                    </svg>
                </router-link>
            </nav>
        </div>
    </header>
</template>

<script>
    //引入mapState辅助函数获取store实例中的状态
    import {mapState} from 'vuex'

    export default {
        //给该组件起的名字会显示在vue的devtool中
        name: 'Header',
        //计算属性：当依赖的数据改变时，会重新计算后返回新的结果
        computed: {
            /*为了及时接收到state的变化，我们应该把状态声明在computed计算属性中，但是当我们想要获取多个state(状态)时，
            写多个computed计算属性会显得过于麻烦，使用mapState会更方便，mapState方法的作用是将传入的数组或对象转换成computed计算属性能够识别的代码*/
            /* es6的对象展开运算符，将mapState函数里的对象/数组混入到外部对象（computed这个对象）中
            如
            function fn() {return {a: 1, b: 2}
            let test = {
            //利用对象展开运算符将return的对象混入到外部对象中
                ...fn()
            }
            console.log(test) //{a: 1, b: 2}
            */
            ...mapState(['isLogin', 'messageCount', 'userInfo'])
        },
        methods: {
            // 退出登录
            logout() {
                //用commit触发vuex mutations中的方法，这里是退出事件(由于已经在main.js中全局注入store，因此整个应用中可以通过this.$store获取到)
                this.$store.commit('logout')
                //使用自定义的vue toast插件弹出一个弹出框提醒用户（插件代码实现查看utils/toast.js）
                this.$toast('已登出')
                //路由方法（该写法为编程式导航），和router-link效果一样，跳转到新的路由，并且把记录推入history栈
                this.$router.push('/login')
            }
        }
    }
</script>

<style scoped lang="scss">
    //引用scss变量文件
    @import "@/assets/scss/variable.scss";

    .icon {
        width: 25px;
        height: 25px;
        font-weight: 600;
        fill: #ddd;
    }

    .header {
        padding: 7px;
        background: #444;

        .header-container {
            /*头部，底部，页面中间内容宽度固定，达到纵向对齐*/
            width: $width;
            display:flex;
            justify-content: space-between;
            align-items: center;
            margin: 0 auto;
        }

        .logo-container {
            display: inline-block;

            img {
                width: 120px;
            }
        }

        .nav {

            a {
                width: 25px;
                position: relative;
                height: 25px;
                margin: 0 20px;
            }

            .unread-msg {

                &:after {
                    content: '';
                    position: absolute;
                    top: -3px;
                    right: -9px;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: #f50;
                }
            }
        }
    }
</style>