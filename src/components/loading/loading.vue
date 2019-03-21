<!--loading组件-->
<!--该组件内有两种loading效果，第一个mark-container是三条横线，第二个loading是旋转的-->
<template>
    <div>
        <!--如果父组件传入mark并且值为true 显示这个三条横线样式的 loading -->
        <div class="mark-container" v-if="mark">
            <div class="mark-line"></div>
            <div class="mark-line"></div>
            <div class="mark-line"></div>
        </div>

        <!--否则显示可以旋转的loading样式-->
        <div class="loading-container" v-else>
            <div class="loading"></div>
            <div class="loading-text">LOADING</div>
        </div>
    </div>
</template>

<script>
    export default {
        //给该组件起的名字会显示在vue的devtool中
        name: 'loading',
        //接收父组件向该组件传递来的数据
        props: {
            'mark': {
                //只接收布尔类型的参数
                type: Boolean,
                //值默认为false
                default: false
            }
        }
    }
</script>

<style scoped lang="scss">
    .mark-container {
        z-index: 10000;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #fff;

        .mark-line {
            margin: 15px 0 0 15px;
            background: #f7f7f7;
            height: 35px;
            width: 40%;

            &:nth-child(2),
            &:nth-child(3) {
                width: 30%;
            }
        }
    }

    @keyframes rotate-loading {
        0%  {transform: rotate(0deg);}
        100% {transform: rotate(360deg);}
    }

    @keyframes loading-text-opacity{
        0%  {opacity: 0}
        20% {opacity: 0}
        50% {opacity: 1}
        100%{opacity: 0}
    }

    .loading-container,
    .loading,
    .loading-text{
        height: 100px;
        width: 100px;
        border-radius: 100%;
    }

    .loading-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%)
    }

    .loading {
        border: 2px solid transparent;
        border-color: transparent #5f7d6e transparent #5f7d6e;
        animation: rotate-loading 1.5s linear 0s infinite normal;
        transform-origin: 50% 50%;
        transition: all 0.5s ease-in-out;
    }

    .loading-text {
        width: 100px;
        height: 100px;
        animation: loading-text-opacity 2s linear 0s infinite normal;
        color: #5f7d6e;
        font-size: 12px;
        font-weight: bold;
        opacity: 0;
        top: 0;
        left: 0;
        position: absolute;
        text-align: center;
        line-height: 100px;
    }
</style>