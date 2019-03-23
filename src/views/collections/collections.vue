<!--收藏页面-->
<template>
    <section class="index-section">
        <!--数据获取完成前显示loading效果-->
        <Loading v-if="loading"></Loading>
        <div v-else class="container">
            <div class="collections">
                <div class="collections-title">
                    <router-link to="/">主页</router-link>
                    <em> / </em>
                    <span>{{loginname}} 收藏的话题</span>
                </div>
                <TopicList :topics="userCollections" v-if="userCollections.length !== 0"></TopicList>
                <div v-else class="none">暂无收藏！</div>
            </div>
        </div>
    </section>
</template>

<script>
    // 引入api配置文件
    import API_CONFIG from '@/api/index.js'

    export default {
        //给该组件起的名字会显示在vue的devtool中
        name: 'collections',
        //接收父组件传递进来的数据
        props: ['loginname'],
        /* vue实例被创建（created声明周期）时， data对象里所有的属性会被添加到响应式系统里，
        (也就是说后续在data中额外添加的属性就不是响应式的，所以想让数据是响应式的，
        必须在vue实例created前就写在data中)
        当这些属性的值发生改变时，视图会产生'响应'，更新为新的值 */
        data() {
            return {
                loading: true,
                userCollections: []
            }
        },
        created() {
            this.fetchCollections()
        },
        methods: {
            fetchCollections() {
                this.$axios.get(`${API_CONFIG.userCollections}${this.loginname}`)
                    .then(res => {
                        this.loading = false
                        this.userCollections = res.data.data
                    })
            }
        },
        /* 如果路由不变，只是参数改变，比如从 /user/foo 跳转到 /user/bar，那么同一个组件会被复用，不销毁旧的实例去创建新的实例是一个效率很高的事情，
        但是这意味着生命周期钩子不会重新被调用。
        如果我们想对路由的参数变化做出响应的话，可以watch 这个$route对象 */
        watch: {
             //在组件复用的状态下，对路由参数的变化做出响应
            '$route'(to, from) {
                // 如果是转到其他路由就不进行后续操作
                if (to.name !== this.$route.name) return
                this.fetchCollections()
            }
        }
    }
</script>

<style scoped lang="scss">
    /*引入scss变量文件*/
    @import '@/assets/scss/variable.scss';

    .container {
        width: inherit;
        display: flex;
        justify-content: center;
    }
    .collections {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        position: relative;
        background: #fff;
        width: $singleWidth;

        .collections-loading {
            position: absolute;
            top: 80px;
            left: calc(50% - 30px);
        }

        .collections-title {
            padding: 10px;
            background: $boxTopColor;

            a {
                font-weight: 600;
                color: $themeColor;
            }

            span {
                color: #495060;
                font-weight: 600;
            }
        }

        .none {
            padding: 10px;
        }
    }
</style>