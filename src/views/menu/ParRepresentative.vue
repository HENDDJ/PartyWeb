<template>
    <section>
        <CommonCRUD
            ref="table"
            :formColumns="formColumns"
            apiRoot="/identity/parRepresentative"
            :columns="columns"
            :addBtnVis=false
            :editBtnVis=false
            :lookBtnVis = false
            :delBtnVis=false
            :queryFormColumns="queryForm">
            <template slot="header-btn" slot-scope="slotProps">
                <el-button type="primary"  plain  class="self-btn self-add" @click="add()" >&nbsp;</el-button>
                <el-button type="warning"  plain  class="self-btn self-edit" @click="edit(slotProps.selected)" >&nbsp;</el-button>
                <el-button type="success" plain  class="self-btn self-look" @click="look(slotProps.selected)" >&nbsp;</el-button>
                <el-button type="danger" plain class="self-del self-btn" @click="del(slotProps.selected)" >&nbsp;</el-button>
            </template>
            <template slot="query" slot-scope="slotProps" v-if="userAuthority!=3">
                <el-form-item label="所属组织">
                    <el-cascader :props="propsOne"  placeholder="请选择组织" size="mini"
                             style="margin-right: -28px;" @change="selValue" clearable></el-cascader>
                </el-form-item>
            </template>
        </CommonCRUD>
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
            <el-form :inline="true" :model="form" :rules="rules"  ref="form" class="demo-form-inline" label-width="170px" >
                <el-form-item label="姓名" prop="partyMemberId">
                    <el-select v-model="form.partyMemberId" placeholder="请选择" filterable :disabled="disabled" @change="handleName()">
                        <el-option v-for="item in partyMemberList" :key="item.id" :label="item.name" :value="item.id" >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="性别">
                    <el-input v-model="form.sex" disabled></el-input>
                </el-form-item>
                <el-form-item label="出生日期">
                    <el-date-picker type="date" v-model="form.birth" disabled></el-date-picker>
                </el-form-item>
                <el-form-item label="入党时间">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.joinDate" disabled></el-date-picker>
                </el-form-item>
                <el-form-item label="所属组织">
                    <el-input v-model="form.districtName" disabled></el-input>
                </el-form-item>
                <el-form-item label="学历">
                    <el-input v-model="form.education" disabled></el-input>
                </el-form-item>
                <el-form-item label="特长或技能">
                    <el-input type="textarea"  class="common-textarea" :rows="2" v-model="form.talent" :disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item label="个人简历">
                    <el-input type="textarea" class="common-textarea" :rows="2" v-model="form.resume" :disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item label="主要表现">
                    <el-input type="textarea" class="common-textarea" :rows="2" v-model="form.performance" :disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item label="政审情况">
                    <el-input type="textarea" class="common-textarea" :rows="2" v-model="form.politicalTrial" :disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item label="奖惩情况">
                    <el-input type="textarea" class="common-textarea" :rows="2" v-model="form.rewardPunish" :disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item label="单位意见">
                    <el-input type="textarea" class="common-textarea" :rows="2" v-model="form.opinion" :disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" class="common-textarea" :rows="2" v-model="form.remark" :disabled="disabled"></el-input>
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
    export default {
        name: "ParRepresentative",
        data(){
            return {
                columns:[],
                formColumns:[],
                partyMemberList:[],
                dialogVisible:false,
                form:{
                    partyMemberId:'',
                    name:'',
                    sex:'',
                    birth:'',
                    joinDate:'',
                    education:'',
                    districtId:'',
                    districtName:'',
                    talent:'',
                    resume:'',
                    performance:'',
                    politicalTrial:'',
                    rewardPunish:'',
                    opinion:'',
                    remark:''
                },
                rules: {
                    partyMemberId: [
                        { required: true, message: '请选择人员', trigger: 'change' }
                    ],
                },
                submitLoading:false,
                title:'',
                queryForm:[
                    {
                        des: '姓名',
                        name: 'name',
                        type: 'string',
                        value: '',
                        visible: true,
                    },
                    {
                        des: '组织',
                        name: 'districtId',
                        type: 'string',
                        value: '',
                        visible: false,
                    },
                ],
                user:{},
                propsOne: {
                    lazy: true,
                    checkStrictly:true,
                    lazyLoad:(node, resolve)=>{
                        if(this.userAuthority ==1){
                            if(node.level==0){
                                let nodes = [];
                                this.$http('GET', `/identity/sysDistrict/01tree`, false).then((data) => {
                                    data.forEach(item=>{
                                        nodes.push({label:item.label,value:item.id,leaf:item.leaf})
                                    });
                                    resolve(nodes);
                                })
                            }else {
                                let nodes = [];
                                this.$http('GET', `/identity/sysDistrict/${node.value}tree`, false).then((data) => {
                                    data.forEach(item=>{
                                        nodes.push({label:item.label,value:item.id,leaf:item.leaf})
                                    });
                                    resolve(nodes);
                                })
                            }
                        }
                        if(this.userAuthority==2){
                            if(node.level==0){
                                let nodes = [];
                                this.$http('GET', `/identity/sysDistrict/${this.user.districtId}tree`, false).then((data) => {
                                    data.forEach(item=>{
                                        nodes.push({label:item.label,value:item.id,leaf:item.leaf})
                                    });
                                    resolve(nodes);
                                })
                            }
                        }
                    }
                },
                userAuthority:1
            }
        },
        methods: {
            handleName(){
                if(this.form.partyMemberId){
                    this.$http('GET',`identity/parMember/${this.form.partyMemberId}id`,false).then( data => {
                        this.form.name = data.name;
                        this.form.sex = data.sex;
                        this.form.birth = data.birth;
                        this.form.education = data.education;
                        this.form.districtId = data.districtId;
                        this.form.districtName = data.districtName;
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
                if (data.length !== 1) {
                    this.$message({
                        type: 'warning',
                        message: data.length > 1 ? '仅能选择一行记录' : '请选择一行记录'
                    });
                    return;
                }
                this.$confirm('确认删除？')
                    .then(_ => {
                        this.$http(`DELETE`, `identity/parRepresentative/${data[0].id}id`).then(_ => {
                            this.$refs.table.refreshTableData();
                        });
                    })
                    .catch(_ => {});
            },
            submit (form) {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.submitLoading = true;
                        //新增
                        if(form.id==null){
                            this.$http('POST',`identity/parRepresentative/`,form).then(() => {
                                this.submitLoading = false;
                                this.dialogVisible = false;
                                this.$refs.table.refreshTableData();
                            }).catch( ()=>{
                                this.submitLoading = true;
                            });
                        }
                        //编辑
                        if((form.id!=null)&&(this.disabled===false)){
                            this.$http('PUT', `identity/parRepresentative/${form.id}id`,form).then(() =>{
                                this.submitLoading = false;
                                this.dialogVisible = false;
                                this.$refs.table.refreshTableData();
                                this.initForm();
                            }).catch( ()=>{
                                this.submitLoading = true;
                            });
                        }else{//查看
                            this.submitLoading = false;
                            this.dialogVisible = false;
                            this.initForm();
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });


            },
            //关闭dialog
            handleClose (done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        this.$refs['form'].resetFields();
                        this.disabled = false;
                        this.dialogVisible = false;
                        this.initForm();
                        done();
                    })
                    .catch(_ => {});
            },
            initForm(){
                this.form={
                    partyMemberId:'',
                        name:'',
                        sex:'',
                        birth:'',
                        joinDate:'',
                        education:'',
                        districtId:'',
                        districtName:'',
                        talent:'',
                        resume:'',
                        performance:'',
                        politicalTrial:'',
                        rewardPunish:'',
                        opinion:'',
                        remark:''
                }
            },
            selValue(val){
                if(val.length>0){
                    this.queryForm[1].value = val[val.length-1];
                }else{
                    this.queryForm[1].value = this.user.districtId;
                }
            },
            handleAuthority(){
                this.queryForm[1].value = this.user.districtId;
                if(this.user.sysDistrict.districtLevel == 3){
                    this.userAuthority = 3;
                }else  if(this.user.sysDistrict.districtLevel == 2){
                    this.userAuthority = 2;
                }else{
                    this.userAuthority = 1;
                }
            },
            handleSelect(){
                this.$http('POST',`identity/parMember/list` ,{districtId:this.user.districtId},false).then(data => {
                    this.partyMemberList = data;
                });
            }
        },
        components: {
            CommonCRUD
        },
        created(){
            this.user = JSON.parse(sessionStorage.getItem('userInfo'));
            this.columns = this.$store.state.classInfo.properties;
            this.formColumns =this.$store.state.classInfo.properties;
            this.initForm();
            this.handleAuthority();
            this.handleSelect();
        }
    }
</script>

<style scoped>
    .common-textarea .el-textarea__inner {
        width: 585px !important;
    }
</style>
