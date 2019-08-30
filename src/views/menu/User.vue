<template>
    <div>
    <CommonCRUD ref="table" :columns="columns" apiRoot="/identity/sysUser" :formColumns="formColumns"  :queryFormColumns="queryColumns" :sortColumns="sortColumns">
        <template slot="header-btn" slot-scope="slotProps">
            <el-button class="slot-btn" type="primary" v-if="resetPsw" plain  @click="showDia(slotProps.selected)" >重置密码</el-button>
        </template>
    </CommonCRUD>
        <el-dialog title="重置密码提示" :visible.sync="resetDia" width="25%"  height="100px" append-to-body :before-close="closeResetDia">
            <div style="width: 200%" :class="{'oneStep':isLeft,'twoStep':isRight}">
                <div style="width: 48%;display: inline-block">
                    <div class="el-message-box__content">
                        <div class="el-message-box__status el-icon-warning"></div>
                        <div class="el-message-box__message"><span style="font-size: 16px">此操作将重置密码, 是否继续?</span></div>
                    </div>
                    <div   style="margin-left: 61%;margin-top: 20px">
                        <el-button @click="closeResetDia">取 消</el-button>
                        <el-button type="primary" @click="isLeft=false;isRight=true">下一步</el-button>
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
    </div>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    import UserStrcutre from '../data/UserStrcutre';
    import md5 from '@/utils/md5';
    export default {
        name: "User",
        data() {
            return {
                columns: UserStrcutre.columns,
                formColumns: UserStrcutre.columns,
                resetPsw:true,//重置密码按钮
                queryColumns:[
                    {
                        des: '用户名',
                        name: 'name',
                        type: 'string',
                        value: '',
                        visible: true,
                    },
                    {
                        des: '所属组织',
                        name: 'districtId',
                        type: 'select',
                        visible: false,
                        options: '',
                    },
                ],
                sortColumns: [
                    {
                        name: 'createdAt',
                        type: 'desc'
                    }
                ],
                isLeft:true,
                isRight:false,
                chooseData:{},
                resetDia:false,
                originalPassword:"",
                imageApi:[
                    {
                        label:'http://122.97.218.162:18087',
                        value:'http://122.97.218.162:18087',
                    },
                    {
                        label:'http://122.97.218.162:18088',
                        value:'http://122.97.218.162:18088',
                    },
                    {
                        label:'http://122.97.218.162:18089',
                        value:'http://122.97.218.162:18089',
                    },
                ]
            }

        },
        methods: {
            changeCol() {
                this.columns.forEach(item=>{
                    if(item.name == 'enable'){
                        item.formatter = (row, cell,val,index)=>{
                            if(val == '1'){
                                return '是'
                            }else{
                                return '否'
                            }
                        }
                    }
                });
                this.$http('Post','identity/role/list',false).then((data)=>{
                    this.formColumns.filter(item=>item.name === 'roleID')[0].options =data.map(item=>{return {label:item.name,value:item.id}})
                });
                this.$http('Post','identity/sysDistrict/list',false).then((data)=>{
                    this.formColumns.filter(item=>item.name === 'districtId')[0].options =data.map(item=>{return {label:item.districtName,value:item.districtId}})
                    //查询下拉框（districtId）
                    this.queryColumns[1].options =data.map(item=>{return {label:item.districtName,value:item.districtId}})
                });
                //权限控制(districtId),句容市委显示组织查询条件
                if(JSON.parse(sessionStorage.getItem("userInfo")).sysDistrict.districtId=="01"){
                    this.queryColumns[1].value="";
                    this.queryColumns[1].visible = true;
                }else{
                    this.queryColumns[1].value = JSON.parse(sessionStorage.getItem("userInfo")).sysDistrict.districtId;
                }
                this.formColumns.filter(item => item.name === 'uploadIP')[0].options = this.imageApi;

            },
                showDia(data){
                if (data.length !== 1) {
                    this.$message({
                        type: 'warning',
                        message: data.length > 1 ? '仅能选择一行记录' : '请选择一行记录'
                    });
                    return;
                }
                if(data[0].id === JSON.parse(sessionStorage.getItem("userInfo")).id){
                    this.$message({
                        type: 'warning',
                        message: '不能重置当前用户密码'
                    });
                    return;
                }
                this.chooseData = data[0]
                    this.resetDia = true

            },
            closeResetDia(){
                this.isLeft=true;
                this.isRight=false;
                this.resetDia = false
            },
            resetPassword(){
                let userName = sessionStorage.getItem("user")
                if(this.originalPassword == ''){
                    this.$message({
                        message:'原密码输入错误',
                        type:'warning'
                    });
                    return
                }
                this.$http('POST', `/identity/sysUser/list`, {userName:userName,password:md5.hex_md5(this.originalPassword)}).then(data01=> {
                    if (data01.length == 0) {
                        this.$message({
                            message: '原密码输入错误',
                            type: 'warning'
                        });
                        return null;
                    }
                    this.chooseData.password = null;
                    this.$http('PUT', `identity/sysUser/${this.chooseData.id}id`, this.chooseData, false).then(() => {
                        this.$message({
                            message: '密码重置成功',
                            type: 'success'
                        });
                        this.resetDia = false;
                        this.isLeft=true;
                        this.isRight=false;
                        this.$refs.table.refreshTableData();
                    })
                })
            }
        },
        created(){
            this.changeCol();
            this.columns.forEach(item => {
                if (item.name == "lastTime") {
                    item.formatter=(row, column, value) => {
                        return value ? new Date(value).Format("yyyy-MM-dd HH:mm:ss"):'还未登录';
                    }
                }
            });
        },
        components: {
            CommonCRUD
        }
    }
</script>

<style>
    .oneStep{
        transition: 0.8s;
        margin-left: 0px;
    }
    .twoStep{
        transition: 0.8s;
        margin-left: -99%;
    }
</style>
