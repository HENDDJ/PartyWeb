<template>
	<div class="top_bar">
        <vs-navbar
            v-model="indexActive"
            :color="colorx"
            text-color="rgba(255,255,255,1)"
            active-text-color="#FCF42F"
            class="top_bar_content">
            <div slot="title">
                <vs-navbar-title>

                </vs-navbar-title>
            </div>

            <vs-navbar-item index="0" >
                <a href="#" @click="active=true"><i class="el-icon-user-solid"></i>&nbsp;&nbsp;{{user.name}}</a>
                <vs-sidebar position-right  parent="body" default-index="1"  color="primary" class="sidebarx" spacer v-model="active">
                    <div class="header-sidebar" slot="header">
                        <vs-avatar  size="70px" :src="user.image"/>
                        <h4>{{user.name}}</h4>
                    </div>
                    <span style="font-size: 16px;color: #91bbe9">&nbsp; &nbsp;<vs-icon icon="question_answer" color="#91bbe9"></vs-icon><b>&nbsp;&nbsp;组织介绍</b></span>
                 <!--   <vs-sidebar-item  icon="question_answer"><b>组织介绍</b></vs-sidebar-item>-->
                    <p>{{user.introduction}}</p><br/>
                    <span style="font-size: 16px;color: #91bbe9">&nbsp; &nbsp;<vs-icon icon="person" color="#91bbe9"></vs-icon><b>&nbsp;&nbsp;账号信息</b></span>

                <!--    <vs-divider icon="person" position="left"></vs-divider>-->
                        <div>
                            <p class="">登录名：{{user.userName}}</p>
                            <p>所在组织：{{user.organizationName}}</p>
                            <p>当前角色：{{user.roleName}}</p>
                            <p>联系方式：{{user.phone}}</p>
                            <p>最近登录时间：{{user.lastTime}}</p>
                        </div>
                    <div class="footer-sidebar" slot="footer">
                        <vs-button icon="edit" color="warning" type="flat" @click="pswDia=true;active=false">修改密码</vs-button>
                        <vs-button icon="reply" color="danger" type="flat" @click="logOut">切换账号</vs-button>
                    </div>
                </vs-sidebar>
                <el-dialog title="修改密码" :visible.sync="pswDia" width="30%" append-to-body :before-close="closeDia">
                    <el-form ref="form" :model="form" label-width="100px">
                        <el-form-item label="新密码" >
                            <el-input v-model="form.password" type="password"></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" type="password">
                            <el-input v-model="form.checkPsw" type="password"></el-input>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="closeDia">取 消</el-button>
                        <el-button type="primary" :loading="submitLoad" @click="editPsw(form)">确 定</el-button>
                    </span>
                </el-dialog>
            </vs-navbar-item>
            <vs-navbar-item index="1">
                <el-badge :value="2" class="item">
                    <a href="#"><i class="el-icon-message-solid"></i>&nbsp;&nbsp;消息中心</a>
                </el-badge>
            </vs-navbar-item>
            <vs-navbar-item index="2">
                <a href="/#/login"><icon name="exit" scale="1.75" style="vertical-align: sub"></icon>&nbsp;&nbsp;退出</a>
            </vs-navbar-item>
        </vs-navbar>
    </div>
</template>

<script>
    export default {
        name: "TopBar",
        data() {
            return {
                colorx:'',
                indexActive: '',
                active: false,
                user: {},
                form:{
                    password:'',
                    checkPsw:'',
                },
                pswDia:false,//修改密码弹框
                submitLoad:false,
            }
        },
        methods: {
            editPsw(form){
                if(form.password&&(form.checkPsw)){
                    if(form.checkPsw===form.password){
                        this.$http('GET',`identity/sysUser/${this.user.id}id`,false).then( data => {
                            this.submitLoad = true;
                            let userForm = data;
                            userForm.password = form.password;
                            this.$http('PUT',`identity/sysUser/${this.user.id}id`,userForm).then( () => {
                                this.logOut();
                                this.$message({
                                    message: '密码修改成功，请重新登录',
                                    type: 'success'
                                });
                                this.pswDia = false;
                                this.initForm();
                                this.submitLoad = false;
                            })
                        })
                    }else{
                        this.$message({
                            message: '密码不一致，请重新输入',
                            type: 'warning'
                        });
                        this.initForm();
                        this.submitLoad = false;
                    }
                }else{
                    this.$message({
                        message: '请补全信息',
                        type: 'warning'
                    });
                }
            },
            closeDia(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        this.pswDia = false;
                        this.active = true;
                        this.initForm();
                        done();
                    })
                    .catch(_ => {});
            },
            initForm(){
                this.form={
                    password:'',
                    checkPsw:'',
                }
            },
            // 退出登录
            logOut() {
                sessionStorage.removeItem('menu');
                sessionStorage.removeItem('token');
                sessionStorage.removeItem("userInfo");
                sessionStorage.removeItem("user");
                location.reload();
            }
        },
        created(){
            this.initForm();
            let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
            this.user = userInfo;
            this.user.organizationName = userInfo.districtName;
        }
    }
</script>

<style scoped>
    .top_bar {
        background: url("/static/img/top_bg.png") no-repeat;
        background-size: 100% 100%;
        width: calc(1920 * 100vw/1920);
        height: calc(60 * 100vw/1920);
    }
    .top_bar_content {
        height: calc(60 * 100vw/1920);
        font-size: 16px !important;
    }
    .vs-navbar{
        z-index: 99 !important;
    }

    .header-sidebar{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 100%;
    }
    h4{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
    }
    p{
        font-size: 12px;
        text-indent: 2em;
        line-height: 30px;
    }
    .footer-sidebar{
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%
    }
    a svg {
        margin: 0 !important;
    }

</style>
