<template>
    <section>
        <vs-tabs :color="colorx">
            <vs-tab @click="handleSelect()" label="志愿者信息">
                <div class="con-tab-ejemplo">
                    <CommonCRUD
                        ref="table"
                        :formColumns="volunteerFormColumns"
                        apiRoot="/identity/volunteer"
                        :columns="volunteerColumns"
                        :addBtnVis=false
                        :editBtnVis=false
                        :lookBtnVis = false
                        :delBtnVis=false>
                        <template slot="header-btn" slot-scope="slotProps">
                            <el-button type="primary"  plain  class="self-btn self-add" @click="add()" >&nbsp;</el-button>
                            <el-button type="warning"  plain  class="self-btn self-edit" @click="edit(slotProps.selected)" >&nbsp;</el-button>
                            <el-button type="success" plain  class="self-btn self-look" @click="look(slotProps.selected)" >&nbsp;</el-button>
                            <el-button type="danger" plain class="self-del self-btn" @click="del(slotProps.selected)" >&nbsp;</el-button>
                        </template>
                    </CommonCRUD>
                </div>
            </vs-tab>
            <vs-tab @click="handleSelect()" label="服务队伍信息">
                <div class="con-tab-ejemplo">
                    <CommonCRUD :columns="teamColumns" api-root="identity/volunteerGroup" :formColumns="teamFormColumns"></CommonCRUD>
                </div>
            </vs-tab>
        </vs-tabs>
        <!--新增、编辑、查看-->
        <el-dialog
            v-if="dialogVisible"
            :title="title"
            :visible.sync="dialogVisible"
            width="880px"
            align="left"
            :modal-append-to-body='false'
            :append-to-body="true"
            :before-close="handleClose">
            <el-form :inline="true" :model="form"  ref="form" class="demo-form-inline" label-width="170px" >
                <el-form-item label="姓名">
                    <el-select v-model="form.partyMemberId" placeholder="请选择" filterable :disabled="disabled" @change="handleName()">
                        <el-option v-for="item in partyMemberList" :key="item.id" :label="item.name" :value="item.id" >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="性别">
                    <el-input v-model="form.sex" disabled></el-input>
                </el-form-item>
                <el-form-item label="出生日期">
                    <el-date-picker type="date" v-model="form.birthday" disabled></el-date-picker>
                </el-form-item>
                <el-form-item label="入党时间">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.joinDate" disabled></el-date-picker>
                </el-form-item>
                <el-form-item label="服务目录">
                    <el-input v-model="form.category" :disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item label="服务志愿">
                    <el-input v-model="form.promise" :disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item label="其他服务目录">
                    <el-input v-model="form.otherCategory" :disabled="disabled"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer footer-position">
                <el-button type="primary" :loading="submitLoading" @click="submit(form)">确 定</el-button>
                <el-button @click="handleClose">取 消</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    import { tansfer } from "../../lookup/transfer";
    export default {
        name: "TeamVolunteer",
        data(){
            return {
                colorx:'success',
                volunteerColumns:[],//志愿者列表
                volunteerFormColumns:{},//志愿者
                dialogVisible:false,
                form:{
                    partyMemberId:'',
                    name:'',
                    sex:'',
                    birthday:'',
                    joinDate:'',
                    category:'',
                    promise:'',
                    otherCategory:'',
                },//志愿者表单
                submitLoading:false,
                title:'',
                //服务队伍列表
                teamColumns:[
                    {
                        name: 'code',
                        des: '编号'
                    },
                    {
                        name: 'name',
                        des: '名称'
                    },
                    {
                        name: 'partyBranchId',
                        des: '所属党组织'
                    },
                    {
                        name: 'unit',
                        des: '所属单位'
                    },
                    {
                        name: 'captialName',
                        des: '队长姓名'
                    },
                    {
                        name: 'contactOfficer',
                        des: '联络员'
                    },
                    {
                        name: 'phoneNumber',
                        des: '手机号码'
                    },
                ],
                //服务队伍表单
                teamFormColumns:[
                    {
                        name: 'code',
                        des: '编号',
                        type: 'string'
                    },
                    {
                        name: 'name',
                        des: '名称',
                        type: 'string'
                    },
                    {
                        name: 'partyBranchId',
                        des: '所属党组织',
                        type: 'string'
                       /* type: 'select',
                        options: 'branchList'*/
                    },
                    {
                        name: 'unit',
                        des: '所属单位',
                        type: 'string'
                    },
                    {
                        name: 'tenet',
                        des: '服务宗旨',
                        type: 'textarea'
                    },
                    {
                        name: 'officeNumber',
                        des: '办公电话',
                        type: 'string'
                    },
                    {
                        name: 'captialName',
                        des: '队长姓名',
                        type: 'string'
                    },
                    {
                        name: 'captialPosition',
                        des: '队长职务',
                        type: 'string'
                    },
                    {
                        name: 'captialContact',
                        des: '队长联系方式',
                        type: 'string'
                    },
                    {
                        name: 'contactOfficer',
                        des: '联络员',
                        type: 'string'
                    },
                    {
                        name: 'officerPosition',
                        des: '联络员职务',
                        type: 'string'
                    },
                    {
                        name: 'phoneNumber',
                        des: '手机号码',
                        type: 'string'
                    },
                    {
                        name: 'qqNumber',
                        des: 'qq号码',
                        type: 'string'
                    },
                    {
                        name: 'email',
                        des: '电子邮箱',
                        type: 'string'
                    },
                    {
                        name: 'basicSiution',
                        des: '基本情况',
                        type: 'rich-editor'
                    },
                ],
                partyMemberList:[],//党员
              /*  distictList:[],//所属组织
                villageCadreList:[],//干部人员列表*/

            }
        },
        methods:{
            handleName(){
                if(this.form.partyMemberId){
                    this.$http('GET',`identity/parMember/${this.form.partyMemberId}id`,false).then( data => {
                        this.form.name = data.name;
                        this.form.sex = data.sex;
                        this.form.birthday = data.birth;
                    })
                }
            },
            add(){
                this.title = "新增";
                this.dialogVisible = true;
                this.disabled = false;
            },
            edit(data){
                if (data.length !== 1) {
                    this.$message({
                        type: 'warning',
                        message: data.length > 1 ? '仅能选择一行记录' : '请选择一行记录'
                    });
                    return;
                }
                this.title = "编辑";
                this.dialogVisible = true;
                this.disabled = false;
                this.form = data[0];
            },
            look(data){
                if (data.length !== 1) {
                    this.$message({
                        type: 'warning',
                        message: data.length > 1 ? '仅能选择一行记录' : '请选择一行记录'
                    });
                    return;
                }
                this.title = "查看";
                this.dialogVisible = true;
                this.disabled = true;
                this.form = data[0];
            },
            del(data){
                console.log(data[0].id);
                if (data.length !== 1) {
                    this.$message({
                        type: 'warning',
                        message: data.length > 1 ? '仅能选择一行记录' : '请选择一行记录'
                    });
                    return;
                }
                this.$confirm('确认删除？')
                    .then(_ => {
                        this.$http(`DELETE`, `identity/volunteer/${data[0].id}id`).then(_ => {
                            this.$refs.table.refreshTableData();
                        });
                    })
                    .catch(_ => {});
            },
            submit (form) {
                this.submitLoading = true;
                //新增
                if(form.id==null){
                    this.$http('POST',`identity/volunteer/`,form).then(() => {
                        this.submitLoading = false;
                        this.dialogVisible = false;
                        this.$refs.table.refreshTableData();
                    });
                }
                //编辑
                if((form.id!=null)&&(this.disabled===false)){
                    form.state = "TO_BE_CONFIRMED";
                    this.$http('PUT', `identity/volunteer/${form.id}id`,form).then(() =>{
                        this.submitLoading = false;
                        this.dialogVisible = false;
                        this.$refs.table.refreshTableData();
                        this.form={};
                    });
                }else{//查看
                    this.submitLoading = false;
                    this.dialogVisible = false;
                    this.form={};
                }
            },
            //关闭dialog
            handleClose (done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        this.from = {};
                        this.$refs['form'].resetFields();
                        this.disabled = false;
                        this.dialogVisible = false;
                        this.form = {};
                        done();
                    })
                    .catch(_ => {});
            },
            handleSelect(){
                this.colorx = 'success';
                this.$http('POST',`identity/parMember/list` ,false).then(data => {
                    this.partyMemberList = data;
                });
            },
        },
        components: {
            CommonCRUD
        },
        created(){
            this.volunteerColumns = this.$store.state.classInfo.properties;
            this.volunteerFormColumns =this.$store.state.classInfo.properties;
            this.handleSelect();
            tansfer(this.volunteerColumns);
        }
    }
</script>

<style scoped>

</style>
