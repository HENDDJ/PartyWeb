<template>
    <section>
        <CommonCRUD  ref="table"
                     :columns="columns"
                     apiRoot="identity/sysDistrict"
                     :sortColumns="sortQuery"
                     :queryFormColumns="queryColumns"
                     :addBtnVis=false
                     :editBtnVis=false
                     :lookBtnVis = false
                     :delBtnVis=false
                     :objectSpanMethod="objectSpanMethod"
                     @getTableData="handleTableData">
            <template slot="header-btn" >
                <el-button type="primary" plain @click="add()" class="self-add self-btn">&nbsp;</el-button>
                <el-button type="success" plain class="self-btn self-edit" @click="edit()">&nbsp;</el-button>
                <el-button type="success" plain class="self-btn self-look" @click="look()">&nbsp;</el-button>
                <el-button type="danger" plain @click="del()" v-if="false" class="self-del self-btn">&nbsp;</el-button>
            </template>
        </CommonCRUD>

        <el-dialog
            v-if="dialogVisible"
            :title="title"
            :visible.sync="dialogVisible"
            width="880px"
            align="left"
            :modal-append-to-body='false'
            :append-to-body="true"
            :before-close="handleClose">
            <el-form :inline="true" :model="form"  :rules="rules" ref="form" class="demo-form-inline" label-width="170px">
                <el-form-item label="组织类别"  prop="districtType">
                    <el-select v-model="form.districtType" :disabled="formDisabled">
                        <el-option v-for="opItem in districtTypeList" :value="opItem.value" :label="opItem.label" :key="opItem.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上级组织"  prop="attachTo">
                    <el-select v-model="form.attachTo" :disabled="formDisabled">
                        <el-option
                            v-for="option in zhenList"
                            :key="option.value"
                            :label="option.label"
                            :value="option.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="组织名称" prop="districtName">
                    <el-input v-model="form.districtName" :disabled="disabled"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer footer-position">
                <el-button type="primary" :loading="submitLoading" @click="submit(form)">确 认</el-button>
                <el-button @click="handleClose">取 消</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import { tansfer} from "../../lookup/transfer";
    import CommonCRUD from '@/components/CommonCRUD';
    import LookUp from '@/lookup';
    export default {
        name: "SysDistrict",
        data() {
            return {
                columns:[],
           /*     parentList:[],*/
                form:{},
                dialogVisible: false,
                loading: false,
                title:'',
                disabled: false,
                formDisabled:false,
                submitLoading: false,
                zhenList:[],
                districtTypeList:[],
                user: {},
                rules: {
                    districtType: [
                        { required: true, message: '请选择类别', trigger: 'change' }
                    ],
                    attachTo: [
                        { required: true, message: '请选择上级组织', trigger: 'change' }
                    ],
                    districtName: [
                        { required: true, message: '请输入组织名称', trigger: 'blur'}
                    ],
                },
                sortQuery:[
                    {
                        name:'attachTo',
                        type:'asc'
                    }

                ],
                queryColumns:[
                    {
                        des: '所属组织',
                        name: 'attachTo',
                        type: 'select',
                        visible: true,
                        options: ''
                    },
                    {
                        des: '名称',
                        name: 'districtName',
                        type: 'string',
                        visible: true,
                    },
                    {
                        des: '组织',
                        name: 'districtId',
                        type: 'string',
                        visible: false,
                    }
                ],
                spanObject: new Map()
            };
        },
        methods: {
            add(){
                this.title = "新增";
                this.dialogVisible = true;
                this.disabled = false;
                this.formDisabled = false;
                this.form={};
            },
            edit(){
                if(this.$refs.table.validateRows()){
                    this.title = "编辑";
                    this.dialogVisible = true;
                    this.disabled = false;
                    this.formDisabled = true;
                    this.form = Object.assign({},this.$refs.table.selected[0]);
                }

            },
            look(){
                if(this.$refs.table.validateRows()){
                    this.title = "查看";
                    this.dialogVisible = true;
                    this.disabled = true;
                    this.formDisabled = true;
                    this.form =  Object.assign({},this.$refs.table.selected[0]);
                }
            },
            del(){
                if(!this.$refs.table.validateRows()){
                    return
                }
                this.$confirm('确认删除？')
                    .then(_ => {
                        console.log(this.$refs.table.selected[0].id);
                        this.$http("DELETE", `identity/sysDistrict/${this.$refs.table.selected[0].id}id`).then(_ => {
                            this.$refs.table.refreshTableData();
                            this.showZhenList();
                        });
                    })
                    .catch(_ => {});
            },
            submit (form) {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.submitLoading = true;
                        //新增
                        if (form.id == null) {
                            this.$http('POST', `/identity/sysDistrict/`, form).then(() => {
                                this.submitLoading = false;
                                this.dialogVisible = false;
                                this.$refs.table.refreshTableData();
                                this.form = {};
                                this.showZhenList();
                            }).catch(() =>{
                                this.submitLoading = false;
                            });
                        }
                        //编辑
                        if ((form.id != null) && (this.disabled === false)) {
                            this.$http('PUT', `identity/sysDistrict/${form.id}id`, form).then(() => {
                                this.submitLoading = false;
                                this.dialogVisible = false;
                                this.$refs.table.refreshTableData();
                                this.form = {};
                                this.showZhenList();
                            }).catch(() =>{
                                this.submitLoading = false;
                            });
                        } else {//查看
                            this.submitLoading = false;
                            this.dialogVisible = false;
                            this.form = {};
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //关闭确认dialog
            handleClose (done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        this.from = {};
                        this.$refs['form'].resetFields();
                        this.disabled = false;
                        this.formDisabled = false;
                        this.dialogVisible = false;
                        done();
                    })
                    .catch(_ => {});
            },
         /*   //form表单上级组织下拉项
            showParentList() {
               /!* this.$http('POST',`identity/sysDistrict/listSome` ,false).then(data => {
                    this.parentList = data;
                });
                this.districtTypeList =  LookUp['DistrictType'];
                this.queryColumns[0].options = this.parentList;*!/
            },*/
            //查询框下拉项
            showZhenList(user){
                if(user.sysDistrict.districtLevel==1){
                    //镇级组织
                    this.zhenList = [];
                    this.$http('POST',`identity/sysDistrict/list`,{districtLevel:2},false).then(data => {
                        data.forEach( item => {
                            this.zhenList.push( {value:item.districtId , label:item.districtName});
                        });
                        this.zhenList.push({value:'01',label:'句容市委'});
                        this.queryColumns[0].options = this.zhenList;
                        this.districtTypeList =  LookUp['DistrictType'];
                    })
                }else{
                    this.queryColumns[0].visible = false;
                }

            },
            handleTableData(data) {
                let attachTos = data.map(item => item.attachTo);
                attachTos = new Set(attachTos);
                let order = 0;
                this.spanObject.clear();
                attachTos.forEach((item) => {
                    if (item === null) {
                        item = 'null'
                    }
                    data.forEach((subItem, subIndex) => {
                        if (String(subItem.attachTo) == item) {
                            this.spanObject.set(item, {index: order, end: subIndex})
                        }
                    })
                    order ++
                })
            },
            objectSpanMethod({row, column, rowIndex, columnIndex}) {
                if (this.spanObject.size === 0) {
                    return ;
                }
                let key;
                if (row.attachTo === null) {
                    key = 'null';
                } else {
                    key = row.attachTo;
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
                if (columnIndex === 1) {
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
            }

        },
        components: {
            CommonCRUD
        },
        created() {
            this.columns = this.$store.state.classInfo.properties;
            tansfer(this.columns);
            this.user=JSON.parse(sessionStorage.getItem('userInfo'));
          /*  this.showParentList();*/
            this.showZhenList(this.user);
            this.queryColumns[2].value = this.user.districtId;
        }
    }
</script>

<style scoped>
</style>
