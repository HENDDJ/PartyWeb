<template>
    <div class="login-container">
        <div class="login-title"></div>
        <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
            <div class="title-container">
                <h3 class="title">登 录</h3>
            </div>
            <el-form-item prop="userName">
                <span class="svg-container svg-container_login">
                  <icon name="user" scale="2.5"></icon>
                </span>
                <el-input name="code" size="small" type="text" v-model="loginForm.userName" autoComplete="on" placeholder="code"></el-input>
            </el-form-item>

            <el-form-item prop="password">
                <span class="svg-container">
                  <icon name="password" scale="2"/>
                </span>
                <el-input name="password" size="small" :type="passwordType" @keyup.enter.prevent="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="password"></el-input>
                <span class="show-pwd" @click="showPwd">
                    <icon name="eye" scale="2"/>
                </span>
            </el-form-item>
            <vs-button ref="loadableButton"  id="button-with-loading" class="vs-con-loading__container"  style="width:100%;margin:15px 0;border-radius: 50px" type="gradient" vslor="primary" @click.native.prevent="handleLogin">{{btnText}}</vs-button>
        </el-form>

    </div>
</template>

<script>
import regex from '@/utils/regex';
import DynamicRoutes from '@/utils/dynamic-routes';
import cache from "../../utils/cache";

export default {
    name: 'login',
    data () {
        return {
            src:"https://www.baidu.com",
            loginForm: {
                userName: '',
                password: ''
            },
            loginRules: {
                userName: [
                    { required: true, trigger: 'blur', message: '请输入用户名' },
                ],
                password: [
                    { required: true, trigger: 'blur', message: '请输入密码' },
                ]
            },
            passwordType: 'password',
            loading: false,
            showDialog: false,
            btnText: '登' + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + '录'
        };
    },
    methods: {
        showPwd () {
            this.passwordType = this.passwordType === 'password' ? '' : 'password';
        },
        handleLogin () {
            this.btnText = '';
            this.$vs.loading({container: '#button-with-loading',color: 'white', background: 'transparent', scale: 0.45});
            this.$http('POST', `/identity/sysUser/login`, this.loginForm).then(data => {
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('user', this.loginForm.userName);
                sessionStorage.setItem('userInfo',JSON.stringify(data.user));
                return 'success';
            }).then(() => {
                this.$http('GET', `/identity/roleMenu/menu`, false).then(data => {
                    sessionStorage.setItem("menu",JSON.stringify(data));
                    this.$store.commit("getMenu",data);
                    DynamicRoutes.transfer(data);
                    this.$router.addRoutes(data);
                    this.$router.push({path: 'MainView'});
                    this.loading = false;
                });
            }).catch(e => {
                setTimeout(() => {
                    this.$vs.loading.close('#button-with-loading > .con-vs-loading');
                    this.$nextTick(() => {
                        this.btnText = '登' + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + '录';
                        this.$message({
                            type: 'error',
                            message: e
                        });
                    });
                }, 1000);
            });
        }
    },
    created () {
        // window.addEventListener('hashchange', this.afterQRScan)
    },
    destroyed () {
        // window.removeEventListener('hashchange', this.afterQRScan)
    }
};
</script>

<style rel="stylesheet/scss" lang="scss">
    $bg: #2d3a4b;
    $light_gray: #889aa4;

    /* reset element-ui css */
    .login-container {
        .login-title{
            background: url("/static/img/inactive/title.png") center no-repeat;
            background-size: 100% 100%;
            width: calc(1318 * 100vw/1920);
            height: calc(84 * 100vw/1920);
            margin: 3% auto;
        }
        .el-input {
            display: inline-block;
            width: 85%;
            input {
                background: transparent;
                border: 0;
                -webkit-appearance: none;
                border-radius: 0;
                padding: 12px 5px 20px 15px;
                color: $light_gray;
                &:-webkit-autofill {
                    background-color: transparent;
                    -webkit-text-fill-color: #000 !important;
                }
            }
        }
        .el-form-item {
            border-bottom: 1px solid rgba(0, 0, 0, 0.2);
            background: rgba(255, 255, 255, 0.1);
            color: #454545;
            margin: 25px 0;
            transition: all .2s linear;
        }
        .el-form-item:focus-within {
            border-bottom: 1px solid #008afb;
            box-shadow: 0 8px 25px -8px #aaa;
        }
    }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
    $bg: #2d3a4b;
    $dark_gray: #2d3a4b;
    $light_gray: #889aa4;

    .login-container {
        position: fixed;
        height: 100%;
        width: 100%;
        //<!--background-color: $bg;-->
        background-image: url("/static/img/inactive/bg.jpg");
        background-size: cover;
        .login-form {
            position: absolute;
            left: 0;
            right: 0;
            width: 380px;
            height: 330px;
            padding: 35px 35px 15px 35px;
            margin: 5% auto;
            background-color: rgba(255,255,255,.9);
            box-shadow: 1px 1px 1px gray;
            border-radius: 5px;
        }
        .tips {
            font-size: 14px;
            color: darkgray;
            margin-bottom: 10px;
            span {
                &:first-of-type {
                    margin-right: 16px;
                }
            }
        }
        .svg-container {
            color: $dark_gray;
            vertical-align: middle;
            width: 30px;
            height: 30px;
            display: inline-block;
            &_login {
                font-size: 20px;
            }
        }
        .title-container {
            position: relative;
            .title {
                font-size: 24px;
                color: $light_gray;
                margin: 0 auto 30px auto;
                text-align: left;
                font-weight: 300;
            }
            .set-language {
                color: #fff;
                position: absolute;
                top: 5px;
                right: 0px;
            }
        }
        .show-pwd {
            position: absolute;
            right: 10px;
            top: 7px;
            font-size: 16px;
            color: $dark_gray;
            cursor: pointer;
            user-select: none;
        }
        .thirdparty-button {
            position: absolute;
            right: 35px;
            bottom: 28px;
        }
    }
    svg {
        -webkit-margin-before: 4px;
    }
</style>
