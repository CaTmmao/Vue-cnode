<!--话题发布页面-->
<template>
    <section class="release index-section">
        <div class="topics-container release-left">
            <div class="top">
                <span>发布话题</span>
            </div>
            <div class="select-tab">
                <span>选择板块：</span>
                <!--Select是iview ui库的选择框组件 v-model将选中的值与data 中的tab属性进行双向绑定-->
                <Select v-model="tab" class="select">
                    <Option value="dev">客户端测试</Option>
                    <Option value="share">分享</Option>
                    <Option value="ask">问答</Option>
                    <Option value="job">招聘</Option>
                </Select>
            </div>
            <div class="title">
                <!--iview中的input组件 v-model将内容与data中的title进行双向绑定-->
                <Input v-model="title" placeholder="标题字数 10字以上"/>
            </div>
            <div class="editor">
                <textarea id="markdown-editor"></textarea>
                <div class="release-btn">
                    <button @click="releaseTopic">发布</button>
                </div>
            </div>
        </div>
        <div class="release-sidebar">
            <div class="block-box">
                <div class="title-top">Markdown 语法参考</div>
                <div class="inner">
                    <p>### 单行的标题</p>
                    <p>**粗体**</p>
                    <p>`console.log('行内代码')`</p>
                    <p>```js\n code \n``` 标记代码块</p>
                    <p>[内容](链接)</p>
                    <p>![文字说明](图片链接)</p>
                    <p>
                        <a href="https://segmentfault.com/markdown" target="_blank">Markdown 文档</a>
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import API_CONFIG from '@/api/index.js'
    // 引入markdown编辑器
    import SimpleMDE from 'simplemde'

    export default {
        name: 'release',
        data() {
            return {
                tab: 'dev', //分类默认为客户端测试
                title: '' //话题的标题默认为空
            }
        },
        mounted() {
            // 初始化markdown编辑器
            this.initMarkdownEditor()
        },
        methods: {
            //初始化markdown编辑器
            initMarkdownEditor() {
                this.simplemde = new SimpleMDE({
                    // 编辑器绑定到这个元素上
                    element: document.getElementById("markdown-editor"),
                    // 是否开启拼写检查
                    spellChecker: false
                });
            },
            releaseTopic() {
                this.$toast('发布话题接口已被cnode社区下线，目前无法发布话题')
            }
            // 发布话题
            // releaseTopic() {
            //     // 确认发布话题前检查内容是否符合标准
            //     try {
            //         // 如果标题字数10字以下,抛出字数不足的错误
            //         if (this.title.length < 10) throw new Error('标题字数10字以上')
            //
            //         //获取到markdown中的内容
            //         var content = this.simplemde.value()
            //         //如果编辑器内未输入任何内容,抛出内容为空的错误
            //         if (!content) throw new Error('内容不能为空!')
            //     } catch (e) {
            //         //参数e.message就是try中 throw new Error中的内容 用toast插件弹出一个弹出框提示用户
            //         this.$toast(e.message)
            //     }
            //
            //     this.$axios.post(API_CONFIG.newTopics, {
            //         title: this.title,
            //         tab: this.tab,
            //         content
            //     })
            //         .then(res => {
            //             this.$toast('发布成功')
            //             //获取到话题的id,并跳转到该话题页面
            //             this.$router.push(`topic/${res.data.topic_id}`)
            //         })
            // }
        }
    }
</script>

<style scoped lang="scss">
    @import '@/assets/scss/variable.scss';

    .release {

        .release-left {
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            background: #fff;
        }

        .top {
            padding: 10px;
            background: $boxTopColor;

            a {
                color: #5f7d6e;
                font-weight: 600;
            }

            em {
                color: #ccc;
            }

            span {
                color: #495060;
                font-weight: 600;
            }
        }

        .select-tab {
            padding: 10px;

            .select {
                width: 200px;
            }
        }

        .title {
            margin: 0 10px 10px 10px;
        }

        .release-btn {
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

        // 侧边栏
        .release-sidebar {
            width: $sidebarWidth;
            float: right;

            .block-box {
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                background: #fff;
                margin-bottom: 15px;
                border-radius: 3px;
            }

            .title-top {
                color: #495060;
                padding: 10px;
                background: $boxTopColor;
            }

            .inner {
                padding: 15px 10px;

                p {
                    line-height: 26px;
                }

                a {
                    color: #778087;
                }
            }
        }
    }
</style>