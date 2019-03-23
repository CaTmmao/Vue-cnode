<!--侧边栏-->
<template>
    <aside class="sidebar">
        <div class="personal-information">
                <!--如果已经登录账号-->
                <div v-if="isLogin">
                    <div class="top">信息</div>
                    <div class="info">
                        <div>
                            <router-link :to="{name: 'User', params: {loginname: user.loginname}}">
                                <img :src="user.avatar_url" alt="头像"/>
                            </router-link>
                            <router-link :to="{name: 'User', params: {loginname: user.loginname}}" class="nickname">
                                {{user.loginname }}
                            </router-link>
                        </div>
                        <span>积分： {{user.score}}</span>
                        <div class="github">
                            Github：
                            <a title="点击跳转到github" :href="`https://github.com/${user.githubUsername}`" target="_blank">
                                {{user.githubUsername}}
                            </a>
                        </div>
                        <span>注册时间： {{user.create_at | fromNow}}</span>
                    </div>
                </div>

                <!--否则显示这个-->
                <div class="tourist-box" v-else>
                    <p class="cnode">CNode：Node.js专业中文社区</p>
                    <div class="tourist">
                        <span>当前是游客状态，您可以 </span>
                        <router-link to="/login">登录</router-link>
                    </div>
                </div>
            </div>
    </aside>
</template>

<script>
    //引入pi配置
    import API_CONFIG from '@/api/index.js'
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
            loginname: {
                type: String
            },
            home: {
                type: String
            }
        },
        data() {
            return {
                user: {
                    // 头像地址
                    avatar_url: '',
                    id: '',
                    //登录名
                    loginname: '',
                    //github name
                    githubUsername: '',
                    //积分
                    score: '',
                    //注册时间
                    created_at: ''
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
                'isLogin'
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
        },
        mounted() {
            this.getUserInfo()
            console.log(this.user);
        },
        methods: {
            //获取用户详细信息渲染到侧边栏
            getUserInfo() {
                /*获取用户详细信息（积分，github姓名，头像地址等）：获取方式为向后台发送get请求，参数只需要loginname
                在大部分页面中的侧边栏通过props来接收父组件传递进来的loginname用来发送请求并渲染到该组件中;
                由于首页的侧边栏显示的信息是个人信息，首页无法通过props从父组件接收loginname参数，
                虽然vuex state的userInfo中有loginname参数，但是当页面刷新后vuex数据将清空，因此不能用这个方法获取loginname，
                最终决定先向后台发送login请求首先获取loginname参数(只需用存储在localStorage中的accesstoken作为参数)，再用
                这个参数来获取用户详细信息,因此首页的侧边栏需要先向后台发送请求获取loginname，而其他页面中使用的侧边栏组件通过
                props从父组件接收loginname参数。 */

                //如果是首页,说明loginname无法通过props获取
                if (this.home === 'true') {
                    //先从后台获取loginname
                    this.$axios.post(API_CONFIG.login)
                        .then(res => {
                            this.$axios.get(`${API_CONFIG.user}${res.data.loginname}`)
                                .then(res => {
                                    //获取到用户的详细信息
                                    this.user = res.data.data
                                })
                        })
                } else {
                    //其他页面通过props从父组件接收loginname参数
                    this.$axios.get(`${API_CONFIG.user}${this.loginname}`)
                        .then(res => {
                            //获取到用户的详细信息
                            this.user = res.data.data
                        })
                }

            }
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
                font-weight: 600;
                padding: 10px;
                color: #495060;
                background: $boxTopColor;
            }

            .info {
                padding: 10px;
                display: flex;
                flex-direction: column;

                .github {
                    display: flex;
                }

                img {
                    display: inline-block;
                    width: 50px;
                    height: 50px;
                    background: #f7f7f7;
                    //规定替换元素（如img）的内容如何填满父元素 具体效果 https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit
                    object-fit: cover;
                }

                .nickname {
                    color: $themeColor;
                    font-weight: 600;
                    margin-left: 15px;
                    cursor: pointer;
                }

                a {
                    display: inline-block;
                    color: $themeColor;
                    font-weight: 600;
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
                    color: $themeColor;
                    font-weight: 600;
                }
            }
        }
    }
</style>