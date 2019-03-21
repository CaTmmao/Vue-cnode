<!--当用户没有匹配到正确的路由时，会显示该页面-->
<template>
    <section class="not-match">
        <div>
            <img src="@/assets/images/not-match.gif" alt="未匹配"/>
            <div class="text">页面不见了，这是一个404页面！</div>
            <div class="toHome" title="点击跳回首页">
                <router-link to="/">首页</router-link>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        //给该组件起的名字会显示在vue的devtool中
        name: "404"
    }
</script>

<style scoped lang="scss">
    .not-match {
        padding-top: 30px;
        display: flex;
        justify-content: center;
        align-items: center;

        .text {
            margin: 0;
            padding: 10px 0;
            color: #333;
        }

        .toHome {
            margin-top: 15px;
            cursor: pointer;
            text-align: center;
            font-weight: bold;
            font-size: 20px;

            a {
                color: #ff7b95;
                transition: color .3s;

                &:hover {
                    color: #ffb2b1;
                }
            }
        }
    }

</style>