<!--消息列表组件 被添加在message页面中的【新消息】和【已读消息】部分-->
<template>
    <div class="msg-list">
        <!--获取到未读消息数据前显示loading效果 默认为true-->
        <div class="msg-loading" v-show="loading"></div>

        <!--下面两个标签两个只显示其中一个 -->
        <!--无内容时显示-->
        <div v-show="readMessages.length === 0">暂无消息</div>
        <!--有内容时显示-->
        <ul v-show="readMessages.length > 0">
            <li v-for="(item, index) of readMessages" :key="item.id">
                <div v-if="item.type === 'reply'">
                    <router-link :to="`/user/${item.author.loginname}`">{{item.author.loginname}}</router-link>
                    <span> 回复了你的话题</span>
                    <router-link :to="`/topic/${item.topic.id}`">{{item.topic.title}}</router-link>
                </div>
                <div v-else-if="item.type === 'at'">
                    <router-link :to="`/user/${item.author.loginname}`">{{item.author.loginname}}</router-link>
                    <span> 在话题</span>
                    <router-link :to="`/topic/${item.topic.id}`">{{item.topic.title}}</router-link>
                    <span> 中@了你</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        //给该组件起的名字会显示在vue的devtool中
        name: 'msg',
        props: {
            loading: {
                type: Boolean,
                default: true
            },
            readMessages: {
                type: Array,
                default() {
                    return []
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '@/assets/scss/variable.scss';
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

            a {
                color: $themeColor;
            }

            span {
                margin: 0 4px;
            }
        }
    }
</style>