<template>
    <div id="login" class="login-container">
        <el-switch v-model="versionSwitch" active-text="老版" inactive-text="新版" active-value=false  inactive-value=true active-color="#ff4949"  inactive-color="#13ce66" class="switchPosition" @change="handleValue()"></el-switch>
        <div class="filter-display" v-if="versionSwitch==='true'">
        <div class="login-title"></div>
        <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" >
            <el-form-item prop="userName">
                <el-input style="line-height: 60px;font-size: 16px;"   name="code" size="medium " type="text" v-model="loginForm.userName" autoComplete="on" placeholder="请输入用户名">
                   <icon name="user1" scale="2.5" slot="prepend" style="position: absolute;top: 4px;left: 15px;"></icon>
                    <!--<span solt="perpend" class="svg-container svg-container_login">
                      <icon name="user" scale="2.5"></icon>
                    </span>-->
                </el-input>
                <hr/>
            </el-form-item>
            <el-form-item prop="password">
                <el-input style="line-height: 45px;font-size: 16px;"  name="password" size="medium " :type="passwordType" @keyup.enter.prevent="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="请输入密码">
                    <icon name="password1" scale="2.5" slot="prepend" style="position: absolute;top: 4px;left: 15px;"></icon>
                </el-input>
                <span class="show-pwd" @click="showPwd">
                    <icon name="eye" scale="2"/>
                </span>
                <hr/>
            </el-form-item>
            <vs-button ref="loadableButton"  id="button-with-loading" class="vs-con-loading__container login-btn" type="gradient" vslor="primary" @click.native.prevent="handleLogin" @keyup.enter.prevent="handleLogin">{{btnText}}</vs-button>
        </el-form>
        </div>
        <div class="filter-display1" v-if="versionSwitch==='false'">
            <el-form  class="login-form1" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm">
                <div class="login-form2">
                    <el-form-item label="用户名" >
                        <el-input name="code" size="medium " type="text" v-model="loginForm.userName" autoComplete="on" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item label=" 密 码 ">
                        <el-input  name="password" size="medium " :type="passwordType" @keyup.enter.prevent="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="请输入密码"></el-input>
                    </el-form-item>
                </div>
                <vs-button ref="loadableButton"  id="button-with-loading" class="vs-con-loading__container login-btn1" type="gradient" vslor="primary" @click.native.prevent="handleLogin" @keyup.enter.prevent="handleLogin">{{btnText}}</vs-button>
            </el-form>
        </div>
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
            versionSwitch:true,
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
                    this.$router.push({path: 'Dashboard'});
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
        },
        handleValue(){
            console.log(this.versionSwitch)
        }
    },
    created () {
        // window.addEventListener('hashchange', this.afterQRScan)
    },
    mounted() {
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
        svg {
            margin: 0 !important;
            position: relative;
            top: 3px;
        }
        .el-form-item__error {
            top: 110%;
            right: 0;
            text-align: left;
            left: 70px;
            font-size: 10px;
        }
        .login-title{
            background: url("/static/img/login/title1.png") center no-repeat;
            background-size: 100% 100%;
            width: calc(784 * 100vw/1920);
            height: calc(190 * 100vw/1920);
            position: relative;
            margin: calc(125 * 100vw/1920) auto 0 auto;
            z-index: 11;
        }
        .switchPosition{
            width: 150px;
            height: 30px;
            position: fixed;
            right: 100px;
            top: 50px;
            z-index: 12;
        }
        .login-form  .el-input {
            display: inline-block;
            input {
                background: transparent;
                border: 0;
                -webkit-appearance: none;
                border-radius: 0;
                padding: 15px 5px 15px 70px;
                color: $light_gray;
                &:-webkit-autofill {
                    background-color: transparent;
                    -webkit-text-fill-color: #000 !important;
                }
            }
        }
        .login-form  .el-form-item {
            border-bottom: 1px solid rgba(0, 0, 0, 0.2);
            background: transparent;
            color: #5894c8;
            margin: calc(35 * 100vw/1920) 0;
            transition: all .2s linear;
        }
        .login-form  .el-form-item:focus-within {
            border-bottom: 1px solid #008afb;
          /*  box-shadow: 0 8px 25px -8px #aaa;*/
        }
        .login-form hr{
            background-color: #4a91d6;
            height:2px;
            border:none;
        }
        .login-form .el-input__inner {
            &::placeholder {
                color: #89b7f3;
            }
        }
        .login-form .el-input-group__append, .el-input-group__prepend{
            background-color: transparent;
            border: none;
            color:#94c2f4;
        }
        .login-form2 .el-form-item__label {
            /* text-align: right; */
            /* vertical-align: middle; */
            /* float: left; */
            width: 60px;
            font-size: 16px;
            font-weight: bold;
            color: #606266;
            line-height: 40px;
            padding: 0 12px 0 0;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            margin-left: calc(20 * 100vw / 1920) !important;
            margin-top: calc(10 * 100vh/1080) !important;
            display: inline-block !important;
        }
        .login-form2 .el-form-item__content{
            display: inline-block !important;
            margin-top: calc(10 * 100vh/1080) !important;
            margin-right: calc(10 * 100vw/1920) !important;
        }
        .loginform2 .el-input{
            width: calc(200*100vw/1920) !important;
        }
    }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
    $bg: #2d3a4b;
    $dark_gray: #2d3a4b;
    $light_gray: #6c7f89;

    .login-container {
        position: fixed;
        height: 100%;
        width: 100%;
        .login-form {
            position: absolute;
            line-height: calc(60 * 100vh/1080);
            left: calc(785 * 100vw/1920);
            top: calc(400 * 100vh/1080);
            width:  calc(350 * 100vw/1920);
            min-width: 280px;
            /*padding: 35px 35px 15px 35px;*/
            z-index: 22;
       /*     transform: scale(1.2);*/
            background-color: transparent;
           /* border-radius: 5px;
            box-shadow: 0 4px 14px 0 rgba(0,0,0,.5)*/
        }
        .login-form1 {
            position: absolute;
            line-height: calc(60 * 100vh/1080);
            left: calc(50vw - 237px);
            top: calc(400 * 100vh/1080);
            width:  474px;
            height: 270px;
            min-width: 200px;
            /*padding: 35px 35px 15px 35px;*/
            z-index: 22;
            /*     transform: scale(1.2);*/
            background:url("../../../static/img/login/bgk.png");
            /* border-radius: 5px;
             box-shadow: 0 4px 14px 0 rgba(0,0,0,.5)*/
        }
        .login-form2{
            margin-left:150px;
            margin-top: 50px;
            width:295px;
            height: 150px;
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
                font-size: 22px;
                color: $light_gray;
                margin: 0 auto 30px auto;
                text-align: left;
                font-weight: 500;
                letter-spacing: 2px;
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
    .filter-display {
         position: fixed;
         width: 100%;
         height: 100%;
         /*filter: blur(4px);*/
         /*background-size: 100% 100%;*/
         z-index: 1;
         background: url("/static/img/login/bg1.png") no-repeat 0 -60px ;
         background-size: cover;
     }
    .filter-display1 {
        position: fixed;
        width: 100%;
        height: 100%;
        /*filter: blur(4px);*/
        /*background-size: 100% 100%;*/
        z-index: 1;
        background: url("/static/img/login/bg2.png") no-repeat 0 -60px ;
        background-size: cover;
    }
    .login-btn {
      /*  background: url("/static/img/login/loginbtn1.png");*/
        background-size: cover;
        width:100%;
        margin: 15px 0 calc(60 * 100vh/1080) 0;
        border-radius: 10px;
        background-color: #94def7;
        font-size: 18px;
        color: #b4d6ff;
    }
     .login-btn1 {
        /*  background: url("/static/img/login/loginbtn1.png");*/
        background-size: cover;
        width:100px !important;
        height:40px ;
        margin-bottom: 20px;
        background-color: #e75f5a;
        font-size: 14px;
        color: white;
    }
</style>
