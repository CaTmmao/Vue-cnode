<!--话题详情页
注意: 点赞 & 回复 & 发帖 接口均被cnode社区下线,原因为[太多人为了测试客户端乱发帖]-->
<template>
    <section class="topic index-section">
        <!--数据获取完成前显示loading效果-->
        <div>
            <div class="topics-container">
                <Loading v-if="loading"></Loading>
                <div class="detail" v-if="!loading">
                    <div class="topic-top">
                        <div class="topic-title">
                            <h1>{{detail.title}}</h1>
                        </div>
                        <div class="topic-bottom">
                            <div class="topic-info">
                                <span> 发布于 {{detail.create_at | fromNow}} • 作者 </span>
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
                <div class="reply" v-show="detail.reply_count > 0 && !loading">
                    <div class="reply-count">{{detail.reply_count}} 个回复</div>
                    <ul>
                        <li class="reply-item" v-for="(item, index) of detail.replies" :key="item.id">
                            <div class="avatar">
                                <router-link :to="`/user/${item.author.loginname}`">
                                    <img :src="item.author.avatar_url" alt="头像">
                                </router-link>
                            </div>
                            <div class="reply-right">
                                <div class="reply-author">
                                    <!--index默认从0开始,所以楼层最开始需要 + 1-->
                                    <span>{{index + 1}}楼</span>
                                    <router-link :to="`/user/${item.author.loginname}`">{{item.author.loginname}}</router-link>
                                    <span>{{item.create_at | fromNow}}</span>
                                    <strong v-if="detail.author.loginname === detail.replies[index].author.loginname">作者</strong>
                                </div>
                                <div class="reply-content markdown-body" v-html="item.content"></div>
                            </div>
                            <div class="operation">
                                <div class="thumb">
                                    <img @click="likeBtn(detail.id, detail.author, index)"
                                         :src="require('@/assets/images/thumbs-up.svg')" alt="点赞" title="点赞人数">
                                    <em>{{item.ups.length}}</em>
                                </div>
                                <div @click="replyOthers(item.author.loginname)">
                                    <Icon title="回复此楼层" type="reply"/>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <!--新建评论-->
                <div class="insert-reply">
                    <div class="tip">添加回复</div>
                    <div class="reply-btn">
                        <textarea id="markdown-editor"></textarea>
                        <button type="button" @click="insertReply">{{sentReply}}</button>
                    </div>
                </div>
            </div>
            <SideBar v-if="!loading" :loginname="detail.author.loginname" from="topic"></SideBar>
        </div>
    </section>
</template>

<script>
    // 引入markdown编辑器
    import SimpleMDE from 'simplemde'
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
                //回复框下的确认回复按钮默认文字是[回复],当输入好回复内容,点击了确认回复的按钮后,在数据发送完毕之前,按钮的文字变成[发送中]
                sentReply: '回复',
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
                },
                simplemde: null
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
            //初始化markdown编辑器
            initMarkdownEditor() {
                this.simplemde = new SimpleMDE({
                    // 绑定该元素,样式为simplemde的markdown编辑器样式
                    element: document.getElementById("markdown-editor"),
                    // 不开启拼写检查
                    spellChecker: false
                });
            },
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
                        //由于返回的res中无法获取到后台的is_collect数据，所以这里取反来设置当前data中的is_collect达到响应式视图更新
                        this.detail.is_collect = !this.detail.is_collect
                    })
            },
            insertReply() {
                if (!this.isLogin) {
                    this.$toast('请先登录')
                } else {
                    this.$toast('回复API已被cnode社区下线，暂时无法回复!')
                }
            },
            likeBtn() {
                if (!this.isLogin) {
                    this.$toast('请先登录')
                } else {
                    this.$toast('点赞API已被cnode社区下线，暂时无法点赞')
                }
            },
            //插入评论 (当用户点击确认回复按钮时,click事件触发该方法)
            /*insertReply() {
                            if (!this.isLogin) {
                            this.$toast('请先登录')
                            }

                            //如果按钮的内容是发送中,说明用户刚刚输入的回复内容还没发送完成,因此不能再次点击按钮重复发送到后台
                            if (this.sentReply === '发送中...') return

                            //获取用户在回复框中输入的内容
                            let content = this.simplemde.value()
                            //没有内容则不进行后续操作,弹出弹出框提醒用户
                            if (!content) return this.$toast('回复内容不能为空')

                            //回复按钮中的文字切换成发送中,告知用户此时正在发送请耐心等待
                            this.sentReply = '发送中...'

                            this.$axios.post(`${API_CONFIG.replies}${this.detail.id}/replies`, {
                                content: `${content}`
                            })
                                .then(res => {
                                    //回复框中的内容重置为空
                                    this.simplemde.value('')
                                    //发送完毕后把回复按钮的文字重置为回复
                                    this.sentReply = '回复'
                                    //更新内容(这样就可以显示出自己回复的内容)
                                    this.fetchTopic()
                                })
                                .catch(err => {
                                    console.log(err)
                                    this.sentReply = '回复'
                                })
                        },*/
            // 点赞 / 取消点赞
/*            likeBtn(id, author, index) {
                if (!this.isLogin) {
                    this.$toast('请先登录')
                } else {
                    //点赞前先进行基本判断:是否登录,是否是在赞自己
                    try {
                        //如果没登陆,提醒用户登录
                        if (!this.isLogin) throw new Error('请先登录!')
                        if (author.loginname === this.userInfo.loginname) throw new Error('不能赞自己')
                    } catch (e) {
                        this.$toast(e.message)
                    }

                    this.$axios.post(`${API_CONFIG.like}${id}/ups`)
                        .then(res => {
                            //取消赞
                            if (res.data.action === 'down') {
                                //在回复中找到当前楼层(index),并把它的状态改成未点赞
                                this.detail.replies[index].is_uped = false
                                //从赞的数组中pop出一个,达到从页面上看赞的数量减少一个的效果
                                this.detail.replies[index].ups.pop()
                            } else {
                                //点赞状态为已点赞
                                this.detail.replies[index].is_uped = true
                                //将当前登录用户的id push 到点赞用户列表里
                                this.detail.replies[index].ups.push(this.userInfo.id)
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
            },*/
            // 回复其他人 参数是想要回复的那人的名字
            replyOthers(loginname) {
                //offsetTop 获取回复框元素到父元素的距离
                let top = document.querySelector('.insert-reply').offsetTop
                //滚动到回复框
                window.scrollTo(0, top)
                //把需要回复的人的名字用@的形式先添加入回复框
                this.simplemde.value(`@${loginname}`)
            }
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
        },
        mounted() {
            this.$nextTick(() => {
                //初始化simplemde的markdown编辑器
                console.log(document.getElementById('markdown-editor'));
                this.initMarkdownEditor()
            })
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
                    padding: 15px 20px;
                    border-bottom: 1px solid #eee;
                }

                .topic-title {
                    overflow: hidden;

                    h1 {
                        float: left;
                        width: calc(100% - 50px);
                        margin: -4px 5px 0 0;
                        font-weight: bold;
                        color: #000;
                        font-size: 22px;
                    }
                }

                .topic-bottom {
                    margin-top: 10px;

                    a {
                        color: $themeColor;
                        font-weight: 600;

                        &:hover {
                            color: $themeColor;
                        }
                    }
                }

                .collection {
                    text-align: right;

                    button {
                        position: relative;
                        padding: 5px 10px;
                        background: $themeColor;
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
                    padding: 10px;
                    overflow: hidden;
                    background: #fff;
                    display: flex;
                    margin: 5px 10px;
                    border-bottom: 1px solid #ebedf0;
                }

                .reply-count {
                    padding: 10px;
                    color: rgba(0, 0, 0, 0.85);
                    font-weight: 600;
                    border-top: 1px solid #ebedf0;
                    border-bottom: 1px solid #ebedf0;
                }

                .avatar {
                    margin-right: 5px;

                    img {
                        width: 50px;
                        height: 50px;
                        background: #f7f7f7;
                        object-fit: cover;
                        border-radius: 3px;
                    }
                }

                .reply-author {
                    float: left;

                    a {
                        margin: 0 5px;
                        color: #5f7d6e;
                        font-weight: 600;

                        &:hover {
                            color: $themeColor;
                        }
                    }

                    strong {
                        margin-left: 5px;
                        background: $themeColor;
                        color: #fff;
                        border-radius: 1px;
                        padding: 1px;
                        font-size: 13px;
                        font-weight: bold;
                    }
                }

                .reply-right {
                    float: left;
                    width: calc(100% - 40px);
                    margin: 0 0 0 10px;
                }

                .operation {
                    float: right;
                    display: inline-flex;
                    align-items: flex-start;

                    > div {
                        display: flex;
                        align-items: center;
                        margin-left: 7px;
                    }

                    .thumb {
                        display: flex;
                        align-items: center;
                        font-size: 15px;

                        img {
                            width: 12px;
                            height: 15px;
                            transform: rotate(-15deg);
                            margin-right: 3px;
                            cursor: pointer;
                        }
                    }

                    i {
                        margin-left: 10px;
                        font-size: 20px;
                        cursor: pointer;
                    }
                }

                .reply-content {
                    clear: left;
                    font-size: 14px;
                    padding-top: 10px;
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
                    font-weight: 600;
                    padding: 10px;
                    background: $boxTopColor;
                }

                .reply-btn {
                    padding: 0 10px 10px 10px;

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