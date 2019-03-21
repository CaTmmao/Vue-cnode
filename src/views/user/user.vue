<!--用户信息页面-->
<template>
    <section class="index-section">
        <!--数据获取完成前显示loading效果-->
        <Loading v-if="loading"></Loading>
        <div v-else>
            <div class="topics-container user">
                <div class="box">
                    <div class="box-title">
                        <router-link to="/">主页</router-link>
                        <em class="slashes"> / </em>
                        <span>个人主页</span>
                    </div>
                    <div class="user-info">
                        <div class="user">
                            <img :src="user.avatar_url" alt="头像">
                            <span>{{user.loginname}}</span>
                        </div>
                        <div>{{user.score}} 积分</div>
                        <div class="view-topics-collections">
                            <router-link :to="`/user/${user.loginname}/collections`">查看话题收藏</router-link>
                        </div>
                        <div class="create-at">注册时间 {{user.create_at | fromNow}}</div>
                    </div>
                </div>
                <div class="box">
                    <div class="box-title">最近创建的话题</div>
                    <div class="none" v-if="user.recent_topics.length === 0">暂无数据！</div>
                    <TopicList v-else :topics="user.recent_topics"></TopicList>
                </div>
                <div class="box">
                    <div class="box-title">最近参与的话题</div>
                    <div class="none" v-if="user.recent_replies.length === 0">暂无数据！</div>
                    <TopicList v-else :topics="user.recent_replies"></TopicList>
                </div>
            </div>
            <SideBar></SideBar>
        </div>
    </section>
</template>

<script>
    // 引入api配置文件
    import API_CONFIG from '@/api/index.js'

    export default {
        //给该组件起的名字会显示在vue的devtool中
        name: 'user',
        /* vue实例被创建（created声明周期）时， data对象里所有的属性会被添加到响应式系统里，
        (也就是说后续在data中额外添加的属性就不是响应式的，所以想让数据是响应式的，
        必须在vue实例created前就写在data中)
        当这些属性的值发生改变时，视图会产生'响应'，更新为新的值 */
        data() {
            return {
                loading: true,
                user: {
                    //之所以要在data中先创建好是因为vue在create阶段只会把data中存在的属性加入到响应式系统，虽然后续可以在user对象中通过Vue.set添加属性达到响应式，但是先写进去更方便
                    loginname: '',
                    avatar_url: '',
                    create_at: Date.now(),
                    score: 0,
                    recent_topics: [],
                    recent_replies: []
                }
            }
        },
        created() {
            //获取用户信息
            this.fetchUserDetail()
        },
        methods: {
            fetchUserDetail() {
                //在数据获取完毕前显示loading
                this.loading = true
                this.$axios.get(`${API_CONFIG.user}${this.$route.params.loginname}`)
                    .then(res => {
                        this.loading = false
                        this.user = res.data.data
                    })
            }
        },
        /* 如果路由不变，只是参数改变，比如从 /user/foo 跳转到 /user/bar，那么同一个组件会被复用，不销毁旧的实例去创建新的实例是一个效率很高的事情，
        但是这意味着生命周期钩子不会重新被调用。
        如果我们想对路由的参数变化做出响应的话，可以watch 这个$route对象 */
        watch: {
             //在组件复用的状态下，对路由参数的变化做出响应
            '$route'(to, from) {
                if (to.name !== this.$route.name) return
                this.fetchUserDetail()
            }
        }

    }
</script>

<style scoped lang="scss">
    /*引入scss变量文件*/
    @import '@/assets/scss/variable.scss';
    .index-section {
        position: relative;

        .user {

            .box {
                box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
                margin-bottom: 15px;
                background: #fff;
                border-radius: 3px;

                .box-title {
                    color: #495060;
                    font-weight: 600;
                    padding: 10px;
                    background: $boxTopColor;

                    a {
                        color: #5f7d6e;
                    }

                    .slashes {
                        color: #ccc;
                    }

                    span {
                        color: #495060;
                    }

                }

                .user-info {
                    padding: 15px 10px;

                    .user {
                        margin-bottom: 10px;

                        img {
                            width: 50px;
                            height: 50px;
                            background: #f6f6f6;
                            vertical-align: middle;
                        }

                        span {
                            margin-left: 10px;
                            vertical-align: middle;
                        }
                    }

                    .view-topics-collections {
                        margin-top: 5px;

                        a {
                            color: #333;
                        }
                    }

                    .create-at {
                        margin-top: 10px;
                        color: #666;
                    }
                }
            }

            .unique-topics-list .title {
                width: calc(100% - 100px) !important;
            }

            .none {
                padding: 10px;
            }
        }
    }
</style>