<!--主页-->
<!-- 当前页面共有三个子组件: 1.topic-list 话题列表组件 2.side-bar 侧边栏组件 3.page 由iview ui库提供的分页组件-->
<template>
    <section class="index-section">
        <div class="topics-container index-container">
            <nav class="nav">
                <!--跳转的路由都是同一个组件，但是查询参数不一样 vue会复用组件 想要监听路由参数的改变 在vue实例里的watch对象中监听'route'-->
                <router-link to="/" :class="{active: $route.query.tab === 'all' || !$route.query.tab}">全部</router-link>
                <router-link to="/?tab=good" :class="{active: $route.query.tab === 'good'}">精华</router-link>
                <router-link to="/?tab=share" :class="{active: $route.query.tab === 'share'}">分享</router-link>
                <router-link to="/?tab=ask" :class="{active: $route.query.tab === 'ask'}">问答</router-link>
                <router-link to="/?tab=job" :class="{active: $route.query.tab === 'job'}">招聘</router-link>
                <router-link to="/?tab=dev" :class="{active: $route.query.tab === 'dev'}">测试</router-link>
            </nav>
            <!--loading和主题列表不会同时显示,获取到主题列表数据之前显示loading-->
            <div class="topics-list">
                <!-- loading组件为全局注册 当loading状态为true时显示loading效果，mark是其中一个loading效果（三条横线）-->
                <Loading v-if="loading" :mark="loading"></Loading>
                <!-- topics属性传递给子组件topic-list，用来渲染主题列表-->
                <TopicList :topics="topics" v-else></TopicList>
            </div>
            <!--分页-->
            <div class="pagination-box">
                <!--page标签是iview UI 组件库的一个分页组件-->
                <!-- simple:分页样式类型(简洁版); total:数据总条数; current:当前页码(.sync修饰符:当子组件的page发生改变时,父组件也会更新本地的page值)
                @on-change:是一个事件,页码改变时触发该事件 -->
                <Page simple
                      :total="total"
                      :current.sync="page"
                      @on-change="pageChange">
                </Page>
            </div>
        </div>
        <!--右侧侧边栏组件-->
        <SideBar></SideBar>
    </section>
</template>

<script>
    //引入api配置文件
    import API_CONFIG from '@/api/index.js'

    export default {
        //给该组件起的名字会显示在vue的devtool中
        name: 'index',
        /* vue实例被创建（created声明周期）时， data对象里所有的属性会被添加到响应式系统里，
        (也就是说后续在data中额外添加的属性就不是响应式的，所以想让数据是响应式的，
        必须在vue实例created前就写在data中)
        当这些属性的值发生改变时，视图会产生'响应'，更新为新的值 */
        data() {
            return {
                total: 999, //话题总条数
                page: 1,    //第几页
                topics: [], //主题列表 需要传给 topic-list 子组件
                loading: false //loading状态默认为false
            }
        },
        /* 生命周期created是vue实例被创建后执行（但还没未被挂载到DOM上）：在这个状态中，vue实例中
        data里的属性都已经被添加进响应式系统*/
        created() {
            /* this.$route.query可以获取到当前路由的URL查询参数，它是一个对象，
            如路径 /foo?user=1，通过 this.$route.query.user 可以得到值是 1，
            如果当前路由没有查询参数，this.$route.query获取到的则是一个空对象 */
            //给data中的page赋值，首先看当前路由中的查询参数page，如果没有就赋值为1
            this.page = parseInt(this.$route.query.page || 1)

            //当该组件被创建的时候，获取主题列表数据
            this.fetchTopics()
        },
        methods: {
            //获取主题列表渲染页面
            fetchTopics() {
                //在获取到主题列表数据并成功渲染到页面上之前，先把loading状态设置为true，显示loading效果
                this.loading = true

                this.$axios.get(API_CONFIG.topics, {
                    //需要传给后台的参数
                    params: {
                        limit: 20, //每一页显示的话题数量
                        tab: this.$route.query.tab, //主题分类：如 招聘 问答 分享等
                        page: this.page //目前页数
                    }
                })
                    .then(res => {
                        // 成功后把loading状态设置回false
                        this.loading = false
                        //后台会把话题相关内容返回回来.赋值到topics,传递给子组件 topic-list 中
                        this.topics = res.data.data
                    })
            },
            //页码改变时 page参数是iview ui组件库中page标签的 onchange事件自动传入的
            pageChange(page) {
                /* 跳转路由有两种方式，router-link创建a标签来定义导航链接 / 用router的实例方法，通过编写
                 代码来实现（称为编程式导航），如下面this.$router.push用法
                 在vue实例里，可以通过$router访问路由实例。当我们想导航到不同的URL，使用$router.push方法，
                 这个方法会向history栈推入一个新的记录，所以当用户点击浏览器上的回退按钮后，他们可以回到上一个URL。
                 当我们用router-link时也是这样，所以点击router-link标签和我们调用$router.push是一样的 */
                this.$router.push({
                    //路由 name 是当前路由的 name
                    name: this.$route.name,
                    //查询参数
                    query: {
                        //当前路由URL的tab查询参数(?问号后面的就是查询参数)
                        tab: this.$route.query.tab,
                        page
                        //↑简写，当key和value相同时，如 page:page，可简写为 page
                    }
                })
                //↑路由的参数发生改变,↓由于下面watch了路由,里面的代码会被执行
            }
        },
        /* 如果路由不变，只是参数改变，比如从 /user/foo 跳转到 /user/bar，那么同一个组件会被复用，不销毁旧的实例去创建新的实例是一个效率很高的事情，
        但是这意味着生命周期钩子不会重新被调用。
        如果我们想对路由的参数变化做出响应的话，可以watch 这个$route对象 */
        watch: {
            //在组件复用的状态下，对路由参数的变化做出响应(比如当用户切换页码时，路由的查询参数page会发生改变;或者当用户点击其他分类时,tab参数会变化,都会执行这里面的代码)
            '$route'(to, from) {
                //如果要跳转去的页面不是首页，不进行后续操作
                if (to.name !== 'HomePage') return

                //当用户切换不同话题类型时,将 this.page 切换为1 跳转到第一页
                if (to.query.page === 1 || !to.query.page) this.page = 1

                /* 重新获取主题列表渲染页面 (created钩子函数里虽然也调用了这个方法，但是由于路由参数改变时vue会复用组件，
                 所有的生命周期钩子不会被重新调用，所以这里需要单独调用一下主题列表获取函数) */
                this.fetchTopics()
            }
        }
    }
</script>

<style scoped lang="scss">
    /*引入scss变量文件*/
    @import "@/assets/scss/variable.scss";
    .index-section {

        .index-container {
            background: #fff;
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        }

        .topics-container {

            .nav {
                padding: 10px 0;
                background: $boxTopColor;
                border-radius: 5px 5px 0 0;

                a {
                    padding: 2px 5px;
                    margin-left: 15px;
                    color: #333;

                    &:hover {
                        color: #5f7d6e;
                    }

                    &.active {
                        color: #5f7d6e;
                        font-weight: bold;
                    }
                }
            }
        }

        .topics-list {
            position: relative;
            border-radius: 0 0 5px 5px;
            overflow: hidden;
            min-height: 1000px;
        }

        .pagination-box {
            margin: 15px 0 20px 10px;

            input {
                min-width: 40px;
            }
        }
    }
</style>