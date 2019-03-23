<template>
    <ul class="unique-topics-list">
        <!--循环topics数组，有多少个item就有多少个li标签-->
        <!--id 为592f8ef01e7e75f60c1ad80d的这篇主题有问题，不让他显示出来-->
        <li v-for="item of topics" :key="item.id" v-if="item.id !== '592f8ef01e7e75f60c1ad80d'">
            <router-link class="img" :to="{name: 'User', params: {loginname: item.author.loginname}}">
                <img :src="item.author.avatar_url" alt="头像" :title="item.author.loginname">
            </router-link>
            <div class="count" v-if="item.reply_count !== undefined">
                <em>{{item.reply_count}}</em>
                <span>/</span>
                <em>{{item.visit_count}}</em>
            </div>
            <!--根据tag方法求出该item的分类（如：招聘，置顶，精华，测试），并根据不同的className设置不同的样式-->
            <span v-if="item.reply_count !== undefined" class="tag" :class="tag(item).className">{{tag(item).text}}</span>
            <router-link class="title" :to="{name: 'Topic', params: {id: item.id}}" :title="item.title">{{item.title}}
            </router-link>
            <div class="last-reply-time">
                <!-- | 是 filters，这里的fromNow过滤器将最后回复时间按照【x小时前】【×天前】这类格式显示-->
                <time title="最后回复的时间">{{item.last_reply_at | fromNow}}</time>
            </div>
        </li>
    </ul>
</template>

<script>
    export default {
        //给该组件起的名字会显示在vue的devtool中
        name: 'topic-list',
        props: {
            topics: {
                type: Array,
                default() {
                    return []
                },
                //必须传入topics
                required: true
            }
        },
        methods: {
            //话题的分类
            tag(item) {
                //如果该话题有top属性，说明是置顶话题
                if (item.top) {
                    //返回一个对象，对象里的text用来显示在页面中告知用户此话题的类型，className用来给不同类型的话题设置不同的样式
                    return {
                        text: '置顶',
                        className: 'top'
                    }
                }

                //如果该话题有good属性，说明是精华话题
                if (item.good) {
                    return {
                        text: '精华',
                        className: 'good'
                    }
                }

                //除了上述两种情况，其他的话题走这个判断
                switch (item.tab) {
                    //话题分类为 问答
                    case 'ask':
                        return {
                            text: '问答',
                            className: 'ask'
                        }
                    //话题分类为 分享
                    case 'share':
                        return {
                            text: '分享',
                            className: 'share'
                        }
                    //话题分类为 招聘
                    case 'job':
                        return {
                            text: '招聘',
                            className: 'job'
                        }
                    //话题分类为 测试
                    case 'dev':
                        return {
                            text: '测试',
                            className: 'dev'
                        }
                    //如果没有，默认分类为 其他
                    default:
                        return {
                            text: '其他'
                        }
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '@/assets/scss/variable.scss';
    .unique-topics-list {

        li {
            overflow: hidden;
            padding: 10px 15px;
            display: flex;
            align-items: center;

            &:not(:nth-last-child(1)) {
                border-bottom: 1px solid #f6f6f6;
            }

            &:hover {
                background: #eee;
            }
        }

        .img {
            display: inline-block;
            width: 50px;
            height: 50px;

            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }

        .count {
            text-align: center;
            width: 70px;
            margin: 0 15px;
            font-size: 15px;

            > em:first-child {
                color: purple;
            }

            > em:last-child,
            > span {
                color: grey;
            }
        }

        .tag {
            display: inline-block;
            line-height: 30px;
            font-size: 12px;
            color: #1890ff;
            background: #e6f7ff;
            border: 1px solid #91d5ff;
            padding: 0 10px;
            white-space: nowrap;
            border-radius: 4px;
            font-weight: 500;

            /*精华，置顶话题应用这个样式*/
            &.good,
            &.top {
                background: #f6ffed;
                color: #52c41a;
                border-color: #b7eb8f;
            }

            &.job {
                background-color: rgba(144,147,153,.1);
                border-color: rgba(144,147,153,.2);
                color: #909399;
            }

            &.share {
                color: #E6A23C;
                background-color: rgba(230,162,60,.1);
                border-color: rgba(230,162,60,.2);
            }

            &.ask {
                color: #67C23A;
                background-color: rgba(103,194,58,.1);
                border-color: rgba(103,194,58,.2);
            }
        }

        .title {
            margin-left: 20px;
            color: $themeColor;
            font-weight: 600;
            display: inline-block;
            width: 60%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            &:hover {
                color: #5f7d6e;
            }
        }

        .last-reply-time {
            margin-left: auto;

            time {
                word-break: keep-all;
                color: rgba(0, 0, 0, .65);
            }
        }
    }

</style>