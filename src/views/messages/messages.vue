<!--未读消息页面-->
<template>
    <section class="index-section">
        <div class="messages">
            <!--未读消息-->
            <div class="new-msg">
                <div class="top">
                    <router-link to="/">主页</router-link>
                    <em> / </em>
                    <span>新消息</span>
                </div>
                <Msg :readMessages="message.hasnot_read_messages" :loading="loading"/>
            </div>
            <!--已读消息-->
            <div class="past-times">
                <div class="top">已读消息</div>
                <Msg :readMessages="message.has_read_messages" :loading="loading"/>
            </div>
        </div>
        <Sidebar></Sidebar>
    </section>
</template>

<script>
    // 引入api配置文件
    import API_CONFIG from '@/api/index.js'
    import Msg from '@/components/msg/msg'

    export default {
        //给该组件起的名字会显示在vue的devtool中
        name: 'messages',
        /* vue实例被创建（created声明周期）时， data对象里所有的属性会被添加到响应式系统里，
        (也就是说后续在data中额外添加的属性就不是响应式的，所以想让数据是响应式的，
        必须在vue实例created前就写在data中)
        当这些属性的值发生改变时，视图会产生'响应'，更新为新的值 */
        data() {
            return {
                loading: true,
                // 消息列表
                message: {
                    // 已读消息
                    has_read_messages: [],
                    // 未读消息
                    hasnot_read_messages: []
                }
            }
        },
        components: {Msg},
        created() {
            //获取消息列表
            this.fetchMessages()
        },
        methods: {
            fetchMessages() {
                this.$axios.get(API_CONFIG.fetchMessages)
                    .then(res => {
                        this.loading = false
                        this.message = res.data.data
                        this.$axios.post(API_CONFIG.messageMarkAll) //标记全部为已读
                    })

            }
        }
    }
</script>

<style scoped lang="scss">
    /*引入scss变量文件*/
    @import '@/assets/scss/variable.scss';

    .index-section {
        display: flex;
        justify-content: center;
    .messages {
        width: $singleWidth;

        @media screen and(max-width: 992px) {
            & {
                width: 100%;
            }
        }

        .new-msg {
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        }

        .top {
            font-weight: 600;
            padding: 10px 10px;
            background: $boxTopColor;

            a {
                color: $themeColor;
            }

            em {
                color: #ccc;
            }

            span {
                color: #495060;
            }
        }

        .msg-list {
            position: relative;
            background: #fff;
            padding: 10px;

            .msg-loading {
                position: absolute;
                top: 10px;
                left: 10px;
                right: 10px;
                height: 20px;
                background: #f7f7f7;
            }

            li {
                padding: 10px 0;

                &:not(:nth-last-child(1)) {
                    border-bottom: 1px solid #f6f6f6;
                }

                > div {
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
        }

        .past-times {
            margin-top: 15px;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        }
    }
    }
</style>