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
                <div class="three_level">
                    <template v-if="user.roleCode === 'CITY_LEADER'">市级平台</template>
                    <template v-else-if="user.roleCode === 'TOWN_REVIEWER'">镇级平台</template>
                    <template v-else-if="user.roleCode === 'COUNTRY_SIDE_ACTOR'">村级平台</template>
                </div>
            </div>
            <el-tooltip effect="dark" content="搜索" placement="bottom">
                <div class="data_vis" @click="toggleSearch">
                    <icon name="search" scale="2.3" v-show="searchIcon"></icon>
                </div>
            </el-tooltip>
            <div v-show="!searchIcon">
                <el-input
                    placeholder="请输入关键词,回车搜索"
                    :autofocus="true"
                    ref="searchInput"
                    @blur.lazy="toggleSearch"
                    prefix-icon="el-icon-search"
                    @keyup.enter.native="searchAll"
                    v-model="queryParam">
                </el-input>
            </div>
            <el-tooltip effect="dark" content="可视化大屏" placement="bottom">
                <a href="#/cloudRoot" class="data_vis" target="_blank">&nbsp;&nbsp;&nbsp;<icon name="data_vis" scale="1.85"></icon>&nbsp;&nbsp;</a>
            </el-tooltip>
            <vs-navbar-item index="1" class="navOne">
                <a href="#" @click="active=true"><i class="el-icon-user-solid"></i>&nbsp;&nbsp;{{user.name}}</a>
                <vs-sidebar position-right  parent="body" color="primary" class="sidebarx" spacer v-model="active">
                    <div class="header-sidebar" slot="header">
                        <vs-avatar  size="70px" :src="user.image"/>
                        <h4>{{user.name}}</h4>
                    </div>
                    <vs-sidebar-item index="1" icon="question_answer" v-if="this.user.roleCode=='DEVELOPER'||this.user.roleCode=='CITY_LEADER'" @click="openLogDia()">
                        操作日志
                    </vs-sidebar-item>
                    <vs-sidebar-item index="2" icon="gavel" @click="openResetDia()">密码重置
                    </vs-sidebar-item>
                    <vs-sidebar-item icon="edit" type="flat" @click="pswDia=true;active=false">修改密码</vs-sidebar-item>
                    <vs-divider style="font-size: 14px;font-weight: 600;color: #1f74ff" color="primary" position="left">
                        账号信息
                    </vs-divider>
                    <div style="margin-left: -8px">
                        <p><icon name="loguser" scale="1.75" style="vertical-align: sub"></icon>&nbsp; &nbsp;{{user.userName}}</p>
                        <p><icon name="logorg" scale="1.75" style="vertical-align: sub"></icon>&nbsp; &nbsp;{{user.organizationName}}</p>
                        <p><icon name="logrole" scale="1.75" style="vertical-align: sub"></icon>&nbsp; &nbsp;{{user.roleName}}</p>
                        <p><icon name="logphone" scale="1.75" style="vertical-align: sub"></icon>&nbsp; &nbsp;{{user.phone}}</p>
                        <p><icon name="logtime" scale="1.75" style="vertical-align: sub"></icon>&nbsp; &nbsp;{{new Date(user.lastTime).Format("yyyy-MM-dd HH:mm:ss")}}</p>
                    </div>
                    <vs-divider style="font-size: 14px;font-weight: 600;color: #1f74ff" color="primary" position="left">
                        组织介绍
                    </vs-divider>
                    <p>{{user.introduction}}</p><br/>

                    <div class="footer-sidebar" slot="footer">
                        <vs-button icon="reply" color="danger" type="flat" @click="logOut">切换账号</vs-button>
                    </div>
                </vs-sidebar>
                <el-dialog title="操作日志" :visible.sync="logDia" append-to-body :before-close="closeLogDia">
                    <CommonCRUD ref="table"  :columns="logColumns" api-root="/identity/sysLog"  :queryFormColumns="logQueryColumns" :sortColumns="logSortColumns" :addBtnVis=false :editBtnVis=false :lookBtnVis = false :delBtnVis=false></CommonCRUD>
                </el-dialog>
                <el-dialog title="修改密码" :visible.sync="pswDia" width="25%"  append-to-body :before-close="closeDia">
                    <div style="width: 200%" :class="{'oneStep':modifyLeft,'twoStep':modifyRight}">
                    <div style="width: 48%;display: inline-block;vertical-align: top; padding-top: 10px;">
                        <el-form label-width="100px">
                            <el-form-item label="原密码" >
                                <el-input v-model="originalPassword" type="password"></el-input>
                            </el-form-item>
                        </el-form>
                        <div  style="margin-left: 61%;margin-top: 30px">
                            <el-button @click="closeDia">取 消</el-button>
                            <el-button type="primary" :loading="submitLoad" @click="editNext">下一步</el-button>
                        </div>
                    </div>
                    <div style="width: 48%;display: inline-block">
                        <el-form ref="form" :model="form" label-width="100px">
                            <el-form-item label="新密码" >
                                <el-input v-model="form.password" type="password"></el-input>
                            </el-form-item>
                            <el-form-item label="确认密码" type="password">
                                <el-input v-model="form.checkPsw" type="password"></el-input>
                            </el-form-item>
                        </el-form>
                        <div   style="margin-left: 61%;margin-top: 20px">
                            <el-button @click="closeDia">取 消</el-button>
                            <el-button type="primary" :loading="submitLoad" @click="editPsw(form)">确 定</el-button>
                        </div>
                    </div>
                    </div>
                </el-dialog>
                <el-dialog title="重置密码提示" :visible.sync="resetDia" width="25%"  height="100px" append-to-body :before-close="closeResetDia">
                    <div style="width: 200%" :class="{'oneStep':isLeft,'twoStep':isRight}">
                    <div style="width: 48%;display: inline-block">
                    <div class="el-message-box__content">
                        <div class="el-message-box__status el-icon-warning"></div>
                        <div class="el-message-box__message"><span style="font-size: 16px">此操作将重置密码, 是否继续?</span></div>
                    </div>
                    <div   style="margin-left: 61%;margin-top: 20px">
                        <el-button @click="closeResetDia">取 消</el-button>
                        <el-button type="primary" :loading="submitLoad" @click="isLeft=false;isRight=true">下一步</el-button>
                    </div>
                    </div>
                    <div style="width: 48%;display: inline-block">
                        <el-form label-width="100px">
                            <el-form-item label="原密码" >
                                <el-input v-model="originalPassword" type="password"></el-input>
                            </el-form-item>
                        </el-form>
                        <div   style="margin-left: 61%;margin-top: 20px">
                        <el-button @click="closeResetDia">取 消</el-button>
                        <el-button type="primary" :loading="submitLoad" @click="resetPassword()">确 定</el-button>
                        </div>
                    </div>
                    </div>
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
                <vs-list v-for="item in waitCheckList" :key="item.id">
                    <vs-list-item icon="email" :title="item.content" @click.native="handleCheck(item)" v-if="item.isRead===0" class="temp">
                        <vs-list-item style="float: right; font-size: 12px;color:rgb(96, 98, 102);font-weight: bold">{{new Date(item.createdAt).Format("yyyy-MM-dd HH:mm")}}</vs-list-item>
                    </vs-list-item>

                    <vs-list-item icon="drafts" :title="item.content" @click.native="handleCheck(item)" v-if="item.isRead===1" style="color: #9b9b9b" class="temp">
                        <vs-list-item style="float: right; font-size: 12px;color:#9b9b9b;font-weight: bold">{{new Date(item.createdAt).Format("yyyy-MM-dd HH:mm")}}</vs-list-item>
                    </vs-list-item>
                </vs-list>
                <el-pagination  v-if="waitCheckList.length != 0"style="text-align: right;margin-top: 50px;margin-bottom: 30px"
                               background
                               :total="pageable.total" :current-page.sync="pageable.currentPage" :page-size.sync="pageable.pageSize"
                               @current-change="currentChange" @size-change="sizeChange" layout="total, sizes, prev, pager, next">
                </el-pagination>
            </el-dialog>
            <vs-navbar-item index="3">
                <a @click="logOut"><icon name="exit" scale="2" style="vertical-align: sub"></icon>&nbsp;&nbsp;退出</a>
            </vs-navbar-item>
        </vs-navbar>
    </div>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    import md5 from '@/utils/md5';
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
                resetDia:false,//重置密码弹框
                submitLoad:false,
                waitCheckNumber:0,//待处理数量
                pageable:{
                    currentPage:1,
                    pageSize:10,
                    total:1
                },
                waitCheckTips:false,//消息中心弹框
                loading:false,
                waitCheckList:[],
                queryParam: '',
                searchIcon: true,
                isRead:'',
                logDia:false,
                logSortColumns:[
                    {
                        name:'createdAt',
                        type:'desc'
                    }
                ],
                logColumns:[
                    {
                        name: 'modifiedAt',
                        des: '操作时间',
                        formatter: (row, column, value) => {
                            return new Date(value).Format("yyyy-MM-dd HH:mm:ss");
                        }
                    },
                    {
                        name: 'msg',
                        des: '操作内容'
                    },
                    {
                        name: 'actor',
                        des: '操作人'
                    },
                ],
                logQueryColumns:[
                    {
                        des: '操作人',
                        name: 'actor',
                        type: 'string',
                        value: '',
                        visible: true,
                    },
                ],
                originalPassword:'',
                //重置密码滚动
                isLeft:true,
                isRight:false,
                //修改密码滚动
                modifyLeft:true,
                modifyRight:false
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
            toggleSearch() {
                this.searchIcon = !this.searchIcon;
                this.$nextTick(() => {
                    if (!this.searchIcon) {
                        this.queryParam = '';
                        this.$refs.searchInput.focus();
                    }
                })
            },
            //密码重置
            resetPassword(){
                this.isLeft=false;
                this.isRight=true
                let userName = sessionStorage.getItem("user")
                if(this.originalPassword == ''){
                    this.$message({
                        message:'原密码输入错误',
                        type:'warning'
                    })
                    return
                }
                this.$http('POST', `/identity/sysUser/list`, {userName:userName,password:md5.hex_md5(this.originalPassword)}).then(data01=>{
                    if(data01.length == 0){
                        this.$message({
                            message:'原密码输入错误',
                            type:'warning'
                        })
                        return null;
                    }
                    this.$http('GET',`identity/sysUser/${this.user.id}id`,false).then( data => {
                        let resetUser = data;
                        resetUser.password =null;
                        this.$http('PUT',`identity/sysUser/${this.user.id}id`,resetUser,false).then( () => {
                            this.active = false;
                            this.$message({
                                message: '密码重置成功，请重新登录',
                                type: 'success'
                            });
                            setTimeout(this.logOut,3000);
                        })
                    })
                }).catch((err)=>{
                    this.$message({
                        message:'网络错误',
                        type:'warning'
                    })
                })

            },
            //修改密码验证
            editNext(){
                let userName = sessionStorage.getItem("user")
                if(this.originalPassword == ''){
                    this.$message({
                        message:'原密码输入错误',
                        type:'warning'
                    })
                    return
                }
                this.$http('POST', `/identity/sysUser/list`, {userName:userName,password:md5.hex_md5(this.originalPassword)}).then(data01=>{
                        if(data01.length == 0){
                            this.$message({
                                message:'原密码输入错误',
                                type:'warning'
                            })
                            return null;
                        }
                        this.modifyLeft=false;
                        this.modifyRight=true
                })
            },
            //修改密码
            editPsw(form){
                if(form.password&&(form.checkPsw)){
                    if(form.checkPsw===form.password){
                        this.$http('GET',`identity/sysUser/${this.user.id}id`,false).then( data => {
                            this.submitLoad = true;
                            let userForm = data;
                            userForm.password = form.password;
                            this.$http('PUT',`identity/sysUser/${this.user.id}id`,userForm,false).then( () => {
                                this.pswDia = false;
                                this.initForm();
                                this.submitLoad = false;
                                this.active = false;
                                this.$message({
                                    message: '密码修改成功，请重新登录',
                                    type: 'success'
                                });
                                setTimeout(this.logOut,3000);
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
            //打开操作日志列表
            openLogDia(){
                this.logDia = true;
                this.active = false;
                this.$nextTick( ()=>{
                    this.$refs.table.refreshTableData();
                });
            },
            //关闭操作日志dia
            closeLogDia(){
                this.logDia=false;
                this.active = true;
                this.$refs.table.pageable.currentPage=1;
                this.$refs.table.pageable.pageSize = 10;
            },
            closeDia() {
                this.modifyLeft = true
                this.modifyRight = false
                this.pswDia = false;
                this.active = true;
                this.originalPassword = ''
                this.initForm();
            },
            openResetDia(){
                this.resetDia = true;
                this.active = false;
            },
            closeResetDia(){
                this.resetDia = false;
                this.active = true;
                this.isLeft=false;
                this.isRight=true
                this.originalPassword = ''
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
            handleNotify(){
                this.$http("POST",`identity/messageCenter/page`,{isRead:0,districtId:this.user.districtId},false).then(data=>{
                    if(data.totalElements > this.waitCheckNumber){
                        const h = this.$createElement;
                        this.$notify.info({
                            title:'新消息提示',
                            message: h('i', { style: 'color: teal'}, '有新消息要处理啦！'),
                            duration:30000,
                            position: 'bottom-right'
                        });
                    }
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
            },
            searchAll() {
                this.$router.push({path: '/search/',query: {keyword: this.queryParam}})
            },

        },
        components: {
            CommonCRUD
        },
        mounted() {
            this.timer = setInterval(this.handleNotify, 60000);
        },
        beforeDestroy() {
            clearInterval(this.timer);
        },
        created(){
            this.initForm();
            let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
            this.user = userInfo;
            this.handleMessageNumber();
            console.log(this.active,"123213");
            console.log(this.resetVisible,"444555")
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

    .top_bar .header-title {
        width: calc(950 * 100vw/1920 * 0.85);
        height: calc(90 * 100vw/1920 * 0.85);
        min-width: 683px;
        min-height: 39px;
        background: url("/static/header/title.png") no-repeat;
        background-size: 100% 100%;
        position: relative;
        left: 25px;
        display: inline-block;
        vertical-align: bottom;
    }
    .top_bar {
        background-size: 100% 100%;
        width: calc(1920 * 100vw/1920);
        overflow: hidden;
    }
    .top_bar_content {
        height: calc(70 * 100vw/1920);
        min-height: 50px;
        font-size: 16px !important;
    }
    .three_level {
        display: inline-block;
        height: calc(90 * 100vw/1920 * 0.75);
        padding-left: 15px;
        font-size: 26px;
        line-height: 80px;
        color: #f4e55b;
        vertical-align: bottom;
        background-image:-webkit-linear-gradient(bottom, #fdca34,yellow);
        -webkit-background-clip:text;
        -webkit-text-fill-color:transparent;
        font-weight: bold;
        font-family: '楷体' !important;
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
        color: white !important;
        transition: all .2s;
    }
    .data_vis:hover {
        color: yellow !important;
        transform: scale(1.2);
        cursor: pointer;
    }
    .el-notification{
        margin-bottom: 60px !important;
    }
    .temp .vs-list--item{
        border: none;
    }
    .vs-navbar--item a {
        font-size: 1rem !important;
    }
    .vs-con-items i {
        font-size: 19px !important;
    }
    .oneStep{
        transition: 0.8s;
        margin-left: 0px;
    }
    .twoStep{
        transition: 0.8s;
        margin-left: -99%;
    }
     .el-dialog__body{
        overflow: hidden;
    }
</style>
