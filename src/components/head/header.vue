<!--头部-->
<template>
    <header class="header">
        <div class="header-container">

            <!--点击logo到首页-->
            <router-link to="/" class="logo-container">
                <img src="@/assets/images/cnodejs.svg" alt="logo">
            </router-link>

            <!--右侧导航栏-->
            <nav class="nav">
                <!--回到首页-->
                <router-link to="/" class="home" title="首页">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-home"></use>
                    </svg>
                </router-link>
            </nav>
        </div>
    </header>
</template>

<script>
    export default {
        name: 'Header'
    }
</script>

<style scoped lang="scss">
    //引用scss变量文件
    @import "@/assets/scss/variable.scss";

    .icon {
        width: 25px;
        height: 25px;
        font-weight: 600;
        fill: #ddd;
    }

    .header {
        padding: 7px;
        background: #444;

        .header-container {
            width: $width;
            display:flex;
            justify-content: space-between;
            align-items: center;
            margin: 0 auto;
        }

        .logo-container {
            display: inline-block;

            img {
                width: 120px;
            }
        }
    }
</style>