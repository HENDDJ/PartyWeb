<template>
	<div :class="titleClassName">
        <vs-navbar
            v-model="indexActive"
            :color="colorx"
            text-color="rgba(255,255,255,1)"
            active-text-color="#FCF42F"
            class="top_bar_content">
            <div slot="title">
                <div class="header-title"></div>
            </div>
            <el-tooltip effect="dark" content="可视化大屏" placement="bottom">
                <a href="http://sugar.baidubce.com/dashboard/b464603c86efa03bc0e7bfe227ddd7f6" class="data_vis" target="_blank">&nbsp;&nbsp;<icon name="data_vis" scale="1.7"></icon>&nbsp;&nbsp;</a>
            </el-tooltip>
            <vs-navbar-item index="1">
                <a href="#" @click="active=true"><i class="el-icon-user-solid"></i>&nbsp;&nbsp;{{user.name}}</a>
                <vs-sidebar position-right  parent="body" color="primary" class="sidebarx" spacer v-model="active">
                    <div class="header-sidebar" slot="header">
                        <vs-avatar  size="70px" :src="user.image"/>
                        <h4>{{user.name}}</h4>
                    </div>
                    <vs-sidebar-item index="1" icon="question_answer">
                        操作日志
                    </vs-sidebar-item>

                    <vs-sidebar-item index="2" icon="gavel">
                        密码重置
                    </vs-sidebar-item>
                    <vs-divider style="font-size: 14px;font-weight: 600;color: #1f74ff" color="primary" position="left">
                        账号信息
                    </vs-divider>
                    <div style="margin-left: -8px">
                        <p><icon name="loguser" scale="1.75" style="vertical-align: sub"></icon>&nbsp; &nbsp;{{user.userName}}</p>
                        <p><icon name="logorg" scale="1.75" style="vertical-align: sub"></icon>&nbsp; &nbsp;{{user.organizationName}}</p>
                        <p><icon name="logrole" scale="1.75" style="vertical-align: sub"></icon>&nbsp; &nbsp;{{user.roleName}}</p>
                        <p><icon name="logphone" scale="1.75" style="vertical-align: sub"></icon>&nbsp; &nbsp;{{user.phone}}</p>
                        <p><icon name="logtime" scale="1.75" style="vertical-align: sub"></icon>&nbsp; &nbsp;{{user.lastTime}}</p>
                    </div>
                    <vs-divider style="font-size: 14px;font-weight: 600;color: #1f74ff" color="primary" position="left">
                        组织介绍
                    </vs-divider>
                    <p>{{user.introduction}}</p><br/>

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
            <vs-navbar-item index="2">
                <el-badge :value="waitCheckNumber" class="item" :hidden="waitCheckNumber==0">
                    <a href="#" @click="handleMessageCenter()"><i class="el-icon-message-solid"></i>&nbsp;&nbsp;消息中心</a>
                </el-badge>
            </vs-navbar-item>
            <el-dialog v-if="waitCheckTips" title="消息中心" :visible.sync="waitCheckTips" width="45%" align="left" :append-to-body="true" :before-close="handleClose">
                <div style="margin-left: 20px">
                    <icon name="refresh" class="icoStyle" scale=" 2" @click.native="refreshList"></icon>
                    <vs-radio color="warning" v-model="isRead" vs-value="0" @change="handleMessageCenter(isRead)" style="margin-left: 20px" >未读</vs-radio>
                    <vs-radio color="success" v-model="isRead" vs-value="1" style="margin-left: 20px" @change="handleMessageCenter(isRead)">已读</vs-radio>
                </div>
                 <div  v-if="waitCheckList.length == 0" style="text-align: center">
                     <img style="margin: 0 auto" src="/static/img/nodata.png" width="300" height="300" />
                     <p style="text-align: center">&emsp;&emsp;&emsp;暂无数据</p>
                 </div>
                <vs-list v-for="item in waitCheckList" key="index">
                    <vs-list-item icon="email" :title="item.content" @click.native="handleCheck(item)" v-if="item.isRead===0">
                        <vs-item style="float: right; font-size: 12px;color:rgb(96, 98, 102);font-weight: bold">{{item.createdAt}}</vs-item>
                    </vs-list-item>

                    <vs-list-item icon="drafts" :title="item.content" @click.native="handleCheck(item)" v-if="item.isRead===1" style="color: #9b9b9b">
                        <vs-item style="float: right; font-size: 12px;color:#9b9b9b;font-weight: bold">{{item.createdAt}}</vs-item>
                    </vs-list-item>
                </vs-list>
                <el-pagination  v-if="waitCheckList.length != 0"style="text-align: right;margin-top: 20px;"
                               background
                               :total="pageable.total" :current-page.sync="pageable.currentPage" :page-size.sync="pageable.pageSize"
                               @current-change="currentChange" @size-change="sizeChange" layout="total, sizes, prev, pager, next">
                </el-pagination>
            </el-dialog>
            <vs-navbar-item index="3">
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
                waitCheckNumber:0,//待审核数量
                pageable:{
                    currentPage:1,
                    pageSize:10,
                    total:1
                },
                waitCheckTips:false,//消息中心弹框
                loading:false,
                waitCheckList:[],
                isRead:''
            }
        },
        computed: {
            titleClassName() {
                if (this.user.roleCode === 'COUNTRY_SIDE_ACTOR') {
                    return 'top_bar cun_bg';
                } else if (this.user.roleCode === 'TOWN_REVIEWER') {
                    return 'top_bar zhen_bg';
                } else if (this.user.roleCode === 'CITY_LEADER') {
                    return 'top_bar city_bg';
                } else {
                    return 'top_bar city_bg';
                }
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
            },
            currentChange(currentPage){
                this.pageable.currentPage = currentPage;
                this.handleMessageCenter();
            },
            sizeChange(size){
                this.pageable.pageSize = size;
                this.handleMessageCenter();
            },
            handleMessageNumber(){
                this.$http("POST",`identity/messageCenter/page`,{isRead:0,districtId:this.user.districtId},false).then(data=>{
                    this.waitCheckNumber = data.totalElements;
                });
            },
            handleMessageCenter(isRead){
                this.waitCheckTips = true;
                this.loading = true;
                this.$http("POST",`identity/messageCenter/page?page=${this.pageable.currentPage - 1}&size=${this.pageable.pageSize}&sort=createdAt,desc`,{isRead:isRead,districtId:this.user.districtId},false).then( data=>{
                    this.pageable.total= data.totalElements;
                    this.waitCheckList = data.content;
                    this.loading = false;
                });
            },
          /*  showTips(){
                this.waitCheckTips = true;
                this.loading = true;
                this.handleMessageCenter();
            },*/
            //关闭确认dialog
            handleClose () {
                this.waitCheckTips = false;
                this.isRead='';
              //  document.getElementsByClassName("icoStyle")[0].style
            },
            handleCheck(item){
                item.isRead = 1;
                this.$http("PUT",`identity/messageCenter/${item.id}id`,item,false).then( () => {
                    this.handleClose();
                    this.handleMessageNumber();
                    if(item.type==='party'||'distLearning'){
                        let path = "/activity/parActivityReview"
                        this.$router.push({path: path});
                    }
                    if(item.type==='information'){
                        let path = "/home/information";
                        this.$router.push({path: path});
                    }

                })
            },
            refreshList(){
                this.isRead='';
                this.handleMessageCenter(this.isRead);
            }
        },
        created(){
            this.initForm();
            let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
            this.user = userInfo;
            this. handleMessageNumber();
         //   this.user.organizationName = userInfo.districtName;
        }
    }
</script>

<style scoped>
    .cun_bg {
        background: url("/static/header/cun_bg.png") no-repeat;
    }
    .zhen_bg {
        background: url("/static/header/zhen_bg.png") no-repeat;
    }
    .city_bg {
        background: url("/static/header/city_bg.png") no-repeat;
    }

    .cun_bg .header-title {
        width: calc(911 * 100vw/1920 * 0.9);
        height: calc(52 * 100vw/1920 * 0.9);
        background: url("/static/header/cun.png") no-repeat;
        background-size: 100% 100%;
        position: relative;
        left: 25px;
    }
    .zhen_bg .header-title {
        width: calc(911 * 100vw/1920 * 0.9);
        height: calc(52 * 100vw/1920 * 0.9);
        background: url("/static/header/zhen.png") no-repeat;
        background-size: 100% 100%;
        position: relative;
        left: 25px;
    }
    .city_bg .header-title {
        width: calc(911 * 100vw/1920 * 0.9);
        height: calc(52 * 100vw/1920 * 0.9);
        background: url("/static/header/city.png") no-repeat;
        background-size: 100% 100%;
        position: relative;
        left: 25px;
    }
    .top_bar {
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
    .vs-list--item{
        cursor:pointer;
    }
    hr{
        background-color: #f0f0f0;
        border: none;
        height: 1px;
    }
    svg {
        margin: 0 5px;
    }
    .icoStyle {
        transition: all 0.3s ease-in-out;
        -webkit-transition: all 0.3s ease-in-out;
        -moz-transition: all 0.3s ease-in-out;
        -o-transition: all 0.3s ease-in-out;
    }
    .icoStyle:hover{
        cursor: pointer;
        transform: rotate(180deg);
        -webkit-transform: rotate(180deg);
        -moz-transform: rotate(180deg);
        -o-transform: rotate(180deg);
        -ms-transform: rotate(180deg);
    }
</style>
<style>
    .top_bar header {
        box-shadow: 0 4px 20px 0 rgba(0,0,0,0.25) inset, 0 0 20px 0 rgba(0,0,0,0.35)
    }
    .vs-sidebar.vs-sidebar-position-right {
        right: 2px !important;
    }
    .data_vis {
        position: relative;
        bottom: -2px;
        color: white;
        transition: all .2s;
    }
    .data_vis:hover {
        color: yellow;
        transform: scale(1.2);
    }
</style>
