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
                     :delBtnVis=false>
            <template slot="header-btn" >
                <el-button type="primary" plain @click="add()" class="self-add self-btn">&nbsp;</el-button>
                <el-button type="success" plain class="self-btn self-edit" @click="edit()">&nbsp;</el-button>
                <el-button type="success" plain class="self-btn self-look" @click="look()">&nbsp;</el-button>
                <el-button type="danger" plain @click="del()" class="self-del self-btn">&nbsp;</el-button>
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
            <el-form :inline="true" :model="form"  ref="form" class="demo-form-inline" label-width="170px">
                <el-form-item label="上级组织">
                    <el-select v-model="form.attachTo" :disabled="disabled">
                        <el-option
                            v-for="(value, key) in parentList"
                            :key="key"
                            :label="value"
                            :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="组织id">
                    <el-input v-model="form.districtId" :disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item label="组织名称">
                    <el-input v-model="form.districtName" :disabled="disabled"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="submitLoading" @click="submit(form)">确 认</el-button>
                <el-button @click="handleClose">取 消</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import { tansfer} from "../../lookup/transfer";
    import CommonCRUD from '@/components/CommonCRUD';
    export default {
        name: "SysDistrict",
        data() {
            return {
                columns:[],
                parentList:[],
                form:{},
                dialogVisible: false,
                loading: false,
                title:'',
                disabled: false,
                submitLoading: false,
                zhenList:[],
                sortQuery:[
                    {
                        name:'createdAt',
                        type:'desc'
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
                    }
                ]
            };
        },
        methods: {
            add(){
                this.title = "新增";
                this.dialogVisible = true;
                this.disabled = false;
                this.form={};
            },
            edit(){
                if(this.$refs.table.validateRows()){
                    this.title = "编辑";
                    this.dialogVisible = true;
                    this.disabled = false;
                    this.form = Object.assign({},this.$refs.table.selected[0]);
                }

            },
            look(){
                if(this.$refs.table.validateRows()){
                    this.title = "查看";
                    this.dialogVisible = true;
                    this.disabled = true;
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
                        });
                    })
                    .catch(_ => {});
            },
            submit (form) {
                this.submitLoading = true;
                //新增
                if(form.id==null){
                    //通过上级组织的长度给组织类型赋值（上级组织长度分为2、4）
                   let length = form.attachTo.length;
                   if(length === 2){
                       form.districtLevel = 2;
                   }
                    if(length === 4){
                        form.districtLevel = 3;
                    }
                    this.$http('POST',`/identity/sysDistrict/`,form).then(() => {
                        this.submitLoading = false;
                        this.dialogVisible = false;
                        this.$refs.table.refreshTableData();
                        this.form ={};
                    });
                }
                //编辑
                if((form.id!=null)&&(this.disabled===false)){
                    //通过上级组织的长度给组织类型赋值（上级组织长度分为2、4）
                    let length = form.attachTo.length;
                    if(length === 2){
                        form.districtLevel = 2;
                    }
                    if(length === 4){
                        form.districtLevel = 3;
                    }
                    this.$http('PUT', `identity/sysDistrict/${form.id}id`,form).then(() =>{
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
            //关闭确认dialog
            handleClose (done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        this.from = {};
                        this.$refs['form'].resetFields();
                        this.disabled = false;
                        this.dialogVisible = false;
                        done();
                    })
                    .catch(_ => {});
            },
            //form表单上级组织下拉项
            showParentList() {
                this.$http('POST',`identity/sysDistrict/listSome` ,false).then(data => {
                    this.parentList = data;
                })
            },
            //查询框下拉项
            showZhenList(){
                //镇级组织
                this.$http('POST',`identity/sysDistrict/list`,{districtLevel:2},false).then(data => {
                    data.forEach( item => {
                        this.zhenList.push( {value:item.districtId , label:item.districtName});
                    });
                    this.zhenList.push({value:'01',label:'句容市委'});
                    this.queryColumns[0].options = this.zhenList;
                })
            }

        },
        components: {
            CommonCRUD
        },
        created() {
            this.columns = this.$store.state.classInfo.properties;
            tansfer(this.columns);
            this.showParentList();
            this.showZhenList();
        }
    }
</script>

<style scoped>
</style>
