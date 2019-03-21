<!--话题详情页-->
<template>
    <section class="topic index-section">
        <!--数据获取完成前显示loading效果-->
        <Loading v-if="loading"></Loading>
        <div v-else>
            <div class="topics-container">
                <div class="detail">
                    <div class="topic-top">
                        <div class="topic-title">
                            <h1>{{detail.title}}</h1>
                        </div>
                        <div class="topic-bottom">
                            <div class="topic-info">
                                <span>• 发布于 {{detail.create_at | fromNow}} • 作者 </span>
                                <router-link :to="`/user/${detail.author.loginname}`">{{detail.author.loginname}}
                                </router-link>
                                <span> • {{detail.visit_count}} 次浏览 • 最后一次回复是 {{detail.last_reply_at | fromNow}} • 来自 {{detail.tab | comeFrom}}</span>
                            </div>
                            <div class="collection" v-if="isLogin">
                                <button @click="collectionBtn">{{detail.is_collect ? '取消收藏' : '收藏'}}</button>
                            </div>
                        </div>
                    </div>
                    <!--话题内容 v-html是将detail.content作为html解析到div标签内(双大括号只能将内容解析成普通文字,所以这里需要用到v-html)-->
                    <div class="content markdown-body" v-html="detail.content"></div>
                </div>
                <!--回复区域-->
                <div class="reply" v-show="detail.reply_count > 0">
                    <div class="reply-count">{{detail.reply_count}} 个回复</div>
                    <ul>
                        <li v-for="(item, index) of detail.replies" :key="item.id">
                            <div class="avatar">
                                <router-link :to="`/user/${item.author.loginname}`">
                                    <img :src="item.author.avatar_url" alt="头像">
                                </router-link>
                            </div>
                            <div class="reply-right">
                                <div class="reply-author">
                                    <router-link :to="`/user/${item.author.loginname}`">{{item.author.loginname}}
                                    </router-link>
                                    <!--index默认从0开始,所以楼层最开始需要 + 1-->
                                    <span>{{index + 1}}楼 {{item.create_at | fromNow}}</span>
                                    <strong v-if="detail.author.loginname === detail.replies[index].author.loginname">
                                        作者
                                    </strong>
                                </div>
                            </div>
                            <div class="reply-content markdown-body" v-html="item.content"></div>
                        </li>
                    </ul>
                </div>
            </div>
            <SideBar :author="detail.author" from="topic"></SideBar>
        </div>
    </section>
</template>

<script>
    //引入api配置
    import API_CONFIG from '@/api/index.js'
    import {mapState} from 'vuex'

    export default {
        //给该组件起的名字会显示在vue的devtool中
        name: 'topic',
        /* vue实例被创建（created声明周期）时， data对象里所有的属性会被添加到响应式系统里，
        (也就是说后续在data中额外添加的属性就不是响应式的，所以想让数据是响应式的，
        必须在vue实例created前就写在data中)
        当这些属性的值发生改变时，视图会产生'响应'，更新为新的值 */
        data() {
            return {
                loading: true,
                detail: {
                    author: {
                        avatar_url: '',
                        loginname: ''
                    },
                    author_id: '',
                    content: '',
                    create_at: Date.now(),
                    id: '',
                    is_collect: false,
                    last_reply_at: Date.now(),
                    replies: [],
                    reply_count: 0,
                    tab: '',
                    title: '',
                    top: false,
                    visit_count: 0
                }
            }
        },
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
            ...mapState(['isLogin', 'userInfo'])
        },
        /*在渲染该组件的对应路由被确认前调用
        无法通过this获取到该组件的实例,因为该导航守卫执行的时候即将进入的这个组件还没有被创建  */
        beforeRouteEnter(to, from, next) {
            // 可以通过给next传递一个回调来接收这个实例,这个回调会在导航确认后(navigation confirmed)调用,这个组件的实例将会作为回调的参数传递进去
            next(vm => {
                // 当navigation confirmed时,vm是被传递进来的组件实例,调用该组件中的fetchTopic()方法
                vm.fetchTopic()
            })
        },
        methods: {
            //获取主题详情
            fetchTopic() {
                //成功获取数据前先显示loading效果
                this.loading = true
                this.$axios.get(`${API_CONFIG.topicDetail}${this.$route.params.id}`)
                    .then(res => {
                        //成功获取数据后取消显示loading效果
                        this.loading = false
                        this.detail = res.data.data
                    })
            },
            //收藏 / 取消收藏主题
            collectionBtn() {
                /*这个方法用于用户点击收藏/取消收藏按钮时的click事件(收藏&取消收藏是同一个按钮);根据话题的收藏状态动态生成api
                (如: 当前话题的收藏状态为已收藏,url =  `${API_CONFIG.cancelCollection}` ) */
                let url = this.detail.is_collect ? `${API_CONFIG.cancelCollection}` : `${API_CONFIG.collection}`

                this.$axios.post(url, {
                    topic_id: this.detail.id
                })
                    .then(res => {
                        /* 将话题的收藏状态取反
                        (如:原本该话题未收藏,this.detail.is_collect = false,用户点击收藏按钮,
                        成功向后台发送收藏请求后,this.detail.is_collect = true) */
                        this.detail.is_collect = !this.detail.is_collect
                    })
            },
        },
        filters: {
            //标签名
            tagName(detail) {
                if (detail.top) return '置顶'
                if (detail.good) return '精华'
            },
            //来自哪个分类
            comeFrom(tab) {
                switch (tab) {
                    case 'ask':
                        return '问答'
                    case 'job':
                        return '招聘'
                    case 'dev':
                        return '测试'
                    case 'share':
                        return '分享'
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    /*引入scss变量文件*/
    @import '@/assets/scss/variable.scss';

    .topic {
        .topics-container {

            .detail {
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
                position: relative;
                min-height: 300px;
                background: #fff;

                .topic-top {
                    padding: 15px 10px;
                    border-bottom: 1px solid #eee;
                }

                .topic-title {
                    overflow: hidden;

                    h1 {
                        float: left;
                        width: calc(100% - 50px);
                        margin: -4px 5px 0 10px;
                        font-weight: bold;
                        color: #000;
                        font-size: 22px;
                    }
                }

                .topic-bottom {
                    margin-top: 10px;

                    span,
                    a {
                        font-size: 12px;
                    }

                    a {
                        color: #5f7d6e;
                        font-weight: 600;

                        &:hover {
                            color: #42b983;
                        }
                    }
                }

                .collection {
                    text-align: right;

                    button {
                        position: relative;
                        padding: 5px 10px;
                        background: #495060;
                        color: #fff;
                        border: none;
                        font-weight: 500;
                        border-radius: 3px;

                        &:after {
                            content: '';
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            border-radius: 3px;
                            background: #000;
                            opacity: 0;
                        }

                        &:active:after {
                            opacity: .2;
                        }
                    }
                }

                .operation-edit {

                    i {
                        cursor: pointer;
                        font-size: 22px;
                    }
                }
            }

            .content {
                padding: 10px 20px;
            }

            .reply {
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
                margin-top: 15px;
                border-radius: 3px;

                li {
                    padding: 10px 10px 30px 10px;
                    overflow: hidden;
                    background: #fff;
                }

                .reply-count {
                    padding: 10px;
                    background: #f6f6f6;
                }

                .avatar {
                    float: left;

                    img {
                        width: 30px;
                        height: 30px;
                        background: #f7f7f7;
                        object-fit: cover;
                        border-radius: 3px;
                    }
                }

                .reply-author {
                    float: left;

                    a {
                        color: #5f7d6e;
                        font-weight: 600;
                        font-size: 12px;

                        &:hover {
                            color: #42b983;
                        }
                    }

                    span {
                        margin-left: 5px;
                        font-size: 12px;
                    }

                    strong {
                        margin-left: 5px;
                        font-size: 12px;
                        background: #42b983;
                        color: #fff;
                        padding: 1px;
                        border-radius: 1px;
                        font-weight: bold;
                    }
                }

                .reply-right {
                    float: left;
                    width: calc(100% - 40px);
                    overflow: hidden;
                    margin: 0 0 0 10px;
                }

                .operation {
                    float: right;

                    i {
                        cursor: pointer;
                        font-size: 16px;
                        vertical-align: middle;
                    }

                    em {
                        margin-left: 5px;
                    }

                    > div {
                        float: left;
                        margin-left: 7px;
                    }
                }

                .reply-content {
                    clear: left;
                    padding-left: 40px;
                }
            }

            // 新建评论
            .insert-reply {
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
                margin-top: 15px;
                background: #fff;

                &.hidden {
                    z-index: -1111;
                    position: fixed;
                    top: -1000px;
                    left: -1000px;
                    visibility: hidden;
                }

                .tip {
                    padding: 10px;
                    background: $boxTopColor;
                }

                .reply-btn {
                    padding: 0 0 10px 10px;

                    button {
                        position: relative;
                        color: #fff;
                        background: #495060;
                        border-radius: 3px;
                        padding: 5px 10px;
                        font-weight: 500;
                        border: none;

                        &:after {
                            content: '';
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            border-radius: 3px;
                            background: #000;
                            opacity: 0;
                        }

                        &:active:after {
                            opacity: .1;
                        }
                    }
                }
            }
        }
    }

</style>