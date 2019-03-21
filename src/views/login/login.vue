<template>
    <section class="login">
        <div class="box">
            <div class="input last">
               <!-- v-model指令可以在input元素上创建双向绑定,v-model会忽略表单元素的value,checked特性的初始值,
                会将vue实例的数据作为数据来源,所以应该把数据在vue实例的data对象中声明初始值.
                .trim修饰符自动去掉用户输入内容的首尾空格 -->
                <input
                        type="text"
                        maxlength="50"
                        v-model.trim="accessToken"
                        placeholder="Access Token"/>
            </div>
            <div class="get-access-token">
                <a href="http://note.youdao.com/noteshare?id=6a2c41f0617d0ee82179f06206bd48bf" target="_blank">如何获取Access Token？</a>
            </div>
            <div class="submit" @click="login">Sign in</div>
        </div>
    </section>
</template>

<script>
    //引入api配置文件
    import API_CONFIG from '@/api/index.js'

    export default {
        //给该组件起的名字会显示在vue的devtool中
        name: 'login',
        /* vue实例被创建（created声明周期）时， data对象里所有的属性会被添加到响应式系统里，
        (也就是说后续在data中额外添加的属性就不是响应式的，所以想让数据是响应式的，
        必须在vue实例created前就写在data中)
        当这些属性的值发生改变时，视图会产生'响应'，更新为新的值 */
        data() {
            return {
                accessToken: ''
            }
        },
        methods: {
            //登录
            login() {
                //如果没输入任何内容，弹出一个弹出框提示用户
                if (!this.accessToken) return this.$toast('请输入您的Access Token!')

                this.$axios.post(API_CONFIG.login, {
                    accesstoken: this.accessToken
                })
                    .then(res => {
                        if (res.data.success) {
                            //更新登录状态
                            this.$store.dispatch('login', {
                                accessToken: this.accessToken,
                                userInfo: res.data
                            })
                            this.$toast('登录成功')
                            //回退到上一个路由
                            this.$router.go(-1)
                        }
                    })
                    .catch(err => {
                        this.$toast('您输入的Access Token不存在!')
                    })
            }
        }

    }
</script>

<style scoped lang="scss">
    .login {

        .box {
            width: 300px;
            margin: 80px auto;
            padding: 70px 20px;
            background: #444;
            border-radius: 3px;
        }

        .get-access-token {
            margin-top: 10px;

            a {
                color: #fff;
            }
        }

        .input {
            height: 45px;

            input {
                width: 100%;
                height: 100%;
                padding: 0 0 0 8px;
                font-size: 16px;
            }
        }

        .last input {
            border-radius: 0 0 5px 5px;
        }

        .submit {
            position: relative;
            margin-top: 15px;
            padding: 10px 0;
            background: #0f9c55;
            color: #fff;
            text-align: center;
            border-radius: 5px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: background .3s;

            &:hover {
                background: #58cf94;
            }

            &:after {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: #000;
                border-radius: 5px;
                opacity: 0;
            }

            &:active:after {
                opacity: .2;
            }
        }
    }

</style>