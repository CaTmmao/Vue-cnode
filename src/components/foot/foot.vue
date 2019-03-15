<template>
    <!--v-pre作用：这个组件的script标签里没有任何指令，我们在编译的时候可以跳过他，加快编译速度-->
    <footer class="footer" v-pre>
        <div class="footer-container">
            <div class="source-code">
                <a href="https://github.com/CaTmmao/cnode" target="_blank">源码地址</a>
            </div>
            <div class="api">
                <ul>
                    <li class="cnode">
                        <span>CNode社区提供API</span>
                        <a href="https://cnodejs.org" target="_blank">
                            <img
                                    src="https://cnodejs.org/public/images/cnodejs.svg"
                                    alt="cnode"
                            />
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </footer>
</template>

<script>
    export default {
        name: "foot"
    }
</script>

<style scoped lang="scss">
    /*引入scss变量文件*/
    @import "assets/scss/variable.scss";

    .footer {
        padding: 25px 10px 35px 10px;
        background: #333;

        .footer-container {
            width: $width;
            margin: 0 auto;

            .source-code {
                margin-bottom: 20px;

                a {
                    color: #ddd;
                    font-weight: bold;
                }
            }

            .api {
                li {
                    display: flex;
                    align-items: center;

                    span {
                        margin-right: 5px;
                        color: #666;
                    }

                    a img {
                        width: 100px;
                    }
                }
            }
        }
    }
</style>
