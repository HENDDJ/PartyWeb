<template>
    <section>
        <CommonCRUD
            ref="father" :columns="columns" api-root="identity/villageCadres" :formColumns="formColumns"
                :buttonVis="confirmBtnVis"    :queryFormColumns="queryForm" :objectSpanMethod="objectSpanMethod"
            :addBtnVis="addBtnVis" :editBtnVis="editBtnVis" :delBtnVis="delBtnVis" :editEvent="doEdit"
                    @getTableData="handleTableData" :sortColumns="sortColumns" :formAfterVis="formAfterVis" @handleClose="formAfterVis = false">
            <template slot="query" slot-scope="slotProps" v-if="userAuthority!=3">
                <el-form-item label="所属组织">
                    <el-cascader :props="propsOne"  placeholder="请选择组织" size="mini"
                                 style="margin-right: -28px;" @change="selValue" clearable></el-cascader>
                </el-form-item>
            </template>
            <template slot="Handle" slot-scope="scope">
                <el-tag v-if="scope.row.state==='0'"
                        close-transition type="danger"  effect="dark">待提交</el-tag>
                <el-tag v-if="scope.row.state==='1'"
                        close-transition  type="warning"  effect="dark">待镇党委审核</el-tag>
                <el-tag v-if="scope.row.state==='2'"
                        close-transition  type="primary"  effect="dark">待市委审核</el-tag>
                <el-tag v-if="scope.row.state==='3'"
                        close-transition  type="success"  effect="dark">市委审核通过</el-tag>
            </template>

            <template slot="header-btn" slot-scope="slotProps" >
                <el-button type="danger" plain @click="submit(slotProps.selected)"  class="self-btn self-submit" v-if="userAuthority==3"> 提交</el-button>
                <el-button type="primary" plain @click="verify(slotProps.selected)"   class="self-btn self-submit" v-if="userAuthority!=3"  >审核</el-button>
            </template>

            <template slot="form-after">
                <div v-if="currentRow.state == '2'">
                    <h4 style="margin-left: 50px;">镇级审核信息</h4>
                    <br>
                    <el-form ref="reviewInfo" :inline="true" :model="currentRow" class="demo-form-inline  common-textarea  " label-width="170px">
                        <el-form-item label="镇级审核人">
                            <el-input type="textarea" v-model="currentRow.auditor" :rows="2" disabled></el-input>
                        </el-form-item>
                        <br>

                        <el-form-item label="审核意见">
                            <el-input type="textarea" :rows="2" v-model="currentRow.auditAdvice" disabled></el-input>
                        </el-form-item>
                    </el-form>
                </div>

                <h4 style="margin-left: 50px;">审核信息</h4>
                <br>
                <el-form ref="reviewForm" :inline="true" :model="reviewForm" class="demo-form-inline  common-textarea  " label-width="170px">
                    <el-form-item label="审核人" prop="auditor" :rules="{required: true, message: '审核人不能为空', trigger: 'blur'}">
                        <el-input type="textarea" v-model="reviewForm.auditor" :rows="2"></el-input>
                    </el-form-item>
                    <br>

                    <el-form-item label="审核意见" prop="auditAdvice" :rules="{required: true, message: '审核意见不能为空', trigger: 'blur'}">
                        <el-input type="textarea" :rows="2" v-model="reviewForm.auditAdvice"></el-input>
                    </el-form-item>
                </el-form>
                <div  style="margin-right: 86px;">
                    <el-button type="danger" :loading="rejectLoading" @click="review('FAILED')" style="float: right">驳回</el-button>
                    <el-button type="primary" :loading="passLoading" @click="review('SUCCESS')" style="float: right;margin-right: 10px">通过</el-button>
                </div>
            </template>

        </CommonCRUD>
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    export default {
        name: "VillageSecretary",
        data(){
            return {
                columns:[],
                formColumns:[],
                districtList:[],
                queryForm:[
                    {
                        des: '姓名',
                        name: 'name',
                        type: 'string',
                        value: '',
                        visible: true,
                    },
                    {
                        name: 'post',
                        type: 'string',
                        value: '',
                        visible: false
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
                userAuthority:1,
                spanParentObject: new Map(),
                spanObject: new Map(),
                sortColumns: [
                    {
                        name: 'districtId',
                        type: 'asc'
                    }
                ],
                reviewForm: {
                    auditor: null,
                    auditAdvice: null
                },
                formAfterVis: false,
                currentRow: {},
                addBtnVis: true,
                editBtnVis: true,
                delBtnVis: true,
                doEdit: (row) => {
                    if (row.state !== '0') {
                        this.$message({
                            type: 'warning',
                            message: '已提交、待审核等状态不可修改'
                        });
                        return false;
                    }
                    return true;
                },
                confirmBtnVis: true,
                passLoading: false,
                rejectLoading: false,
            }
        },
        methods:{
            selValue(val){
                if(val.length>0){
                    this.queryForm[2].value = val[val.length-1];
                }else{
                    this.queryForm[2].value = this.user.districtId;
                }
            },
            handleTableData(data) {
                let parentDistrictIds = data.map(item => item.parentDistrictId);
                parentDistrictIds = new Set(parentDistrictIds);
                let order = 0;
                this.spanParentObject.clear();
                parentDistrictIds.forEach((item) => {
                    if (item === null) {
                        item = 'null'
                    }
                    data.forEach((subItem, subIndex) => {
                        if (String(subItem.parentDistrictId) == item) {
                            this.spanParentObject.set(item, {index: order, end: subIndex})
                        }
                    })
                    order ++;
                })

                let districtIds = data.map(item => item.districtId);
                districtIds = new Set(districtIds);
                order = 0;
                this.spanObject.clear()
                districtIds.forEach(item => {
                    if (item === null) {
                        item = 'null'
                    }
                    data.forEach((subItem, subIndex) => {
                        if (String(subItem.districtId) == item) {
                            this.spanObject.set(item, {index: order, end: subIndex})
                        }
                    })
                    order ++;
                })
            },
            objectSpanMethod({row, column, rowIndex, columnIndex}) {
                if (columnIndex === 1) {
                    if (this.spanParentObject.size === 0) {
                        return ;
                    }
                    let key;
                    if (row.parentDistrictId === null) {
                        key = 'null';
                    } else {
                        key = row.parentDistrictId;
                    }
                    let index = this.spanParentObject.get(key).index;
                    let end = this.spanParentObject.get(key).end;
                    let start = 0;
                    if (index !== 0) {
                        this.spanParentObject.forEach((v,key) => {
                            if (v.index === (index - 1)) {
                                start = v.end + 1;
                            }
                        })
                    }
                    if (rowIndex === start) {
                        return {
                            rowspan: end - start + 1,
                            colspan: 1
                        }
                    }
                    else if (start < rowIndex <= end) {
                        return {
                            rowspan: 0,
                            colspan: 0
                        }
                    } else {
                        return {
                            rowspan: 1,
                            colspan: 1
                        }
                    }
                } else if (columnIndex === 2) {
                    if (this.spanObject.size === 0) {
                        return ;
                    }
                    let key;
                    if (row.districtId === null) {
                        key = 'null';
                    } else {
                        key = row.districtId;
                    }
                    let index = this.spanObject.get(key).index;
                    let end = this.spanObject.get(key).end;
                    let start = 0;
                    if (index !== 0) {
                        this.spanObject.forEach((v,key) => {
                            if (v.index === (index - 1)) {
                                start = v.end + 1;
                            }
                        })
                    }
                    if (rowIndex === start) {
                        return {
                            rowspan: end - start + 1,
                            colspan: 1
                        }
                    }
                    else if (start < rowIndex <= end) {
                        return {
                            rowspan: 0,
                            colspan: 0
                        }
                    } else {
                        return {
                            rowspan: 1,
                            colspan: 1
                        }
                    }
                } else {
                    return {
                        rowspan: 1,
                        colspan: 1
                    }
                }
            },
            handelOrg(){
                this.queryForm[1].value = 'SECRETARY';
                this.queryForm[2].value = this.user.districtId;
                if(this.user.sysDistrict.districtLevel == 3){
                    this.userAuthority = 3;
                }else  if(this.user.sysDistrict.districtLevel == 2){
                    this.userAuthority = 2;
                }else{
                    this.userAuthority = 1;
                }
                //层级组织请求
                this.$http('GET',`identity/sysDistrict/${this.user.districtId}alltree`,false).then( data => {
                    this.districtList = data[0].children;
                    this.handleOrgLeaf(this.districtList);
                    this.formColumns.filter(item => item.name === 'districtId')[0].options = this.districtList;
                    if(this.userAuthority == 3){
                        let filterElement = this.formColumns.filter(item => item.name === 'districtId')[0];
                        filterElement.value = this.user.districtId;
                        filterElement.formShow = 'false';
                    }
                });
            },
            //处理村级组织children为空的情况
            handleOrgLeaf(districtList){
                districtList.forEach(item => {
                    if (item.children.length === 0) {
                        delete item.children;
                    } else {
                        this.handleOrgLeaf(item.children)
                    }
                })
            },
            submit(row) {
                if (row.length !== 1) {
                    this.$message({
                        type: 'warning',
                        message: row.length > 1 ? '仅能选择一行记录' : '请选择一行记录'
                    })
                    return;
                }else {
                    if(this.userAuthority==3&&row[0].state==0){
                        this.$confirm('确认提交？')
                            .then(_ => {
                                this.$http('PUT', 'identity/villageCadres/submit/' + row[0].id, false).then(content => {
                                    this.$refs.father.refreshTableData();
                                });
                            })
                            .catch(_ => {});
                    }else {
                        this.$message({
                            type: 'warning',
                            message: '该内容已经提交过了'
                        });
                    }
                }
            },
            verify(selected) {
                if (selected.length !== 1) {
                    this.$message({
                        type: 'warning',
                        message: selected.length > 1 ? '仅能选择一行记录' : '请选择一行记录'
                    });
                    return false;
                }else {
                     if((this.userAuthority==2&&selected[0].state==1)||(this.userAuthority==1&&selected[0].state==2)){
                         this.formAfterVis = true;
                         this.currentRow = selected[0];
                         this.confirmBtnVis = false;
                         this.$refs.father.look();
                     }else {
                         let message;
                         if(selected[0].state==0){
                             message='当前记录未提交,无法审核';
                         }else if(selected[0].state==1){
                             message='当前记录应该为镇审核';
                         }else if(selected[0].state==2){
                             message='当前记录应该为市审核';
                         }else {
                             message='当前记录已经审核通过';
                         }
                         this.$message({
                             type: 'warning',
                             message: message
                         });
                     }
                }
            },
            review(code) {
                this.$refs['reviewForm'].validate((valid) => {
                    if (valid) {
                        console.log(valid, 'dada')
                        if (code === 'SUCCESS') {
                            this.passLoading = true;
                        } else {
                            this.rejectLoading = true;
                        }
                        this.$http('PUT', `identity/villageCadres/verify/${this.currentRow.id}/${code}`, this.reviewForm,false).then(content => {
                            this.$message({
                                type: 'success',
                                message: code==='SUCCESS' ?'审核通过':'审核不通过'
                            });
                            this.formAfterVis=false;
                            this.$refs.father.dialogVisible = false;
                            this.$refs.father.refreshTableData();
                            this.passLoading = false;
                            this.rejectLoading = false;
                        }).catch(()=> {
                            this.$message({
                                type: 'error',
                                message: '网络错误'
                            });
                        });
                    }
                });
            },
            loadPost() {
                let param = {
                    districtId: this.user.districtId
                };
                this.$http('POST', `identity/cadrePosition/list`, param, false).then( content => {
                    let list = [];
                    content.forEach(item => {
                        list.push({value: item.id, label: item.name});
                    })
                    let filterElement = this.formColumns.filter(item => item.name === 'post')[0];
                    filterElement.options = list;
                })
            }


        },
        components: {
            CommonCRUD
        },
        created () {
            this.columns = []
            this.columns.length = 0;
            let temp = JSON.parse(JSON.stringify(this.$store.state.classInfo.properties));
            let temp1 = JSON.parse(JSON.stringify(this.$store.state.classInfo.properties));
            this.formColumns = temp1
            this.columns = temp
            this.user = JSON.parse(sessionStorage.getItem('userInfo'));
            this.columns.push({slot: true, name: 'state', des: '状态', slotName: 'Handle'});
            this.handelOrg();
            this.loadPost();
            if (this.user.roleCode !== 'COUNTRY_SIDE_ACTOR') {
                this.addBtnVis = false;
                this.editBtnVis = false;
                this.delBtnVis = false;
            }
        }
    }
</script>

<style scoped>
    .common-textarea .el-textarea__inner {
        width: 585px !important;
    }

    .r{
        position:absolute;
        right:5px;
        bottom:5px;
    }

    .self-btn {
        width: 56px !important;
        height: 28px !important;
        border-radius: 5px !important;
        transform: scale(1.1);
    }
    .self-submit {
        background-size: cover !important;
    }
</style>
