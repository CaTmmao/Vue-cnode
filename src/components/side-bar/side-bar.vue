<!--侧边栏-->
<template>
    <aside class="sidebar">
        <div class="personal-information">
            <!-- 显示个人信息侧边栏 -->
            <div v-if="from !== 'topic'">
                <!--如果已经登录账号-->
                <div v-if="isLogin">
                    <div class="top">我的信息</div>
                    <div class="info">
                        <router-link :to="{name: 'User', params: {loginname: userInfo.loginname}}">
                            <img :src="userInfo.avatar_url" alt="头像"/>
                        </router-link>
                        <router-link :to="{name: 'User', params: {loginname: userInfo.loginname}}" class="nickname">
                            {{userInfo.loginname }}
                        </router-link>
                    </div>
                </div>

                <!--否则显示这个-->
                <div class="tourist-box" v-else>
                    <div class="cnode">CNode：Node.js专业中文社区</div>
                    <div class="tourist">
                        <span>当前是游客状态，您可以 </span>
                        <router-link to="/login">登录</router-link>
                    </div>
                </div>
            </div>

            <!--话题页面显示文章作者信息-->
            <div v-else>
                <div>
                    <div class="top">作者</div>
                    <div class="info">
                        <router-link :to="{name: 'User', params: {loginname: author.loginname}}">
                            <img :src="author.avatar_url" alt="头像"/>
                        </router-link>
                        <router-link :to="{name: 'User', params: {loginname: author.loginname}}">
                            <em class="nickname">{{ author.loginname }}</em>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </aside>
</template>

<script>
    //引入vux中的mapState方法
    import {mapState} from 'vuex'

    export default {
        //给该组件起的名字会显示在vue的devtool中
        name: 'side-bar',
        // 从父组件接收参数。在父组件中，如果要给子组件传入参数，就在子组件的自定义标签里传递。如<sideBar from='topic'></sideBar>
        props: {
            // 用来判断是从首页还是文章详情页页面中跳转过来的。
            from: {
                type: String,
                default: ''
            },
            author: {
                type: Object,
                default() {
                    return {
                        // 头像地址
                        avatar_url: '',
                        id: '',
                        //登录名
                        loginname: ''
                    }
                }
            }
        },
        //计算属性：当依赖的数据改变时，会重新计算后返回新的结果
        computed: {
            //为了及时接收到state的变化，我们应该把状态声明在computed计算属性中，但是当我们想要获取多个state(状态)时，
            //写多个computed计算属性会显得过于麻烦，使用mapState会更方便，mapState方法的作用是将传入的数组或对象转换成computed计算属性能够识别的代码，
            /* es6的对象展开运算符，将mapState函数里的对象/数组混入到外部对象（computed这个对象）中
            如
            function fn() {return {a: 1, b: 2}
            let test = {
            //利用对象展开运算符将return的对象混入到外部对象中
                ...fn()
            }
            console.log(test) //{a: 1, b: 2}
            */
            ...mapState([
                // this.isLogin映射为 store.state.isLogin
                'isLogin',
                'userInfo'
            ])
            /*
             上述代码最终变成下面这样
                computed: {
                通过this.isLogin可以获取到它return出来的值
                    isLogin() {
                        return this.$store.state.isLogin
                    },
                    userInfo() {
                        return this.$store.state.userInfo
                    }
                }
             */
        }
    }
</script>

<style scoped lang="scss">
    /*引入scss变量文件*/
    @import "@/assets/scss/variable.scss";
    .sidebar {
        float: right;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
        width: $sidebarWidth;

        .personal-information {
            background: #fff;
            border-radius: 5px;

            .top {
                padding: 10px;
                color: #495060;
                background: $boxTopColor;
            }

            .info {
                padding: 10px;

                img {
                    display: inline-block;
                    width: 50px;
                    height: 50px;
                    background: #f7f7f7;
                    //规定替换元素（如img）的内容如何填满父元素 具体效果 https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit
                    object-fit: cover;
                }

                .nickname {
                    color: #495060;
                    font-weight: 600;
                    margin-left: 15px;
                    cursor: pointer;

                    &:hover {
                        color: #42b983;
                    }
                }

                a {
                    display: inline-block;
                    vertical-align: middle;
                }
            }

            .publish-topic {
                padding: 0 0 10px 10px;

                a {
                    display: inline-block;
                    position: relative;
                    margin: 5px 0 0 0;
                    padding: 5px 10px;
                    background: #495060;
                    color: #fff;
                    border-radius: 5px;
                    font-weight: 500;

                    //发布话题 按钮的框
                    &:after {
                        content: "";
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: #000;
                        border-radius: 5px;
                        opacity: 0;
                        transition: opacity .1s linear;
                    }

                    &:hover:after {
                        opacity: .05;
                    }
                }
            }

            .tourist-box {
                padding: 10px;
            }

            .cnode {
                color: #000;
            }

            .tourist {
                margin-top: 15px;

                a {
                    color: #52c41a;
                }
            }
        }
    }
</style>