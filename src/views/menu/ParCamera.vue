<template>
    <section>
        <CommonCRUD  ref="table"
                     :columns="columns"
                     :formColumns="formColumns"
                     apiRoot="/identity/parCamera"
                     :sortColumns="sortQuery"
                     :queryFormColumns="queryColumns"
                     :addBtnVis=false
                     :editBtnVis=false
                     :lookBtnVis = false
                     :delBtnVis=false>
            <template slot="header-btn">
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
            width="60%"
            align="left"
            :modal-append-to-body='false'
            :append-to-body="true"
            :before-close="handleClose">
            <el-form :inline="true" :model="form"  ref="form" class="demo-form-inline" label-width="100px">
                <el-form-item label="组织">
                    <el-select v-model="form.name"  filterable :disabled="disabled" @change="handleId()">
                        <el-option v-for="opItem in districtList" :value="opItem.label" :label="opItem.label" :key="opItem.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="IP通道地址">
                    <el-input v-model="form.ip" :disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item label="机顶盒序列号">
                    <el-input v-model="form.number" :disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="form.remark" :disabled="disabled"></el-input>
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
    import CommonCRUD from '@/components/CommonCRUD';
    export default {
        name: "ParCamera",
        data() {
            return {
                columns:[],
                formColumns:{},
                districtList:[],
                form:{},
                dialogVisible: false,
                loading: false,
                title:'',
                disabled: false,
                submitLoading: false,
                sortQuery:[
                    {
                        name:'createdAt',
                        type:'desc'
                    }
                ],
                queryColumns:[
                    {
                        des: '地名',
                        name: 'name',
                        type: 'string',
                        visible: true,
                    },
                    {
                        des: '序列号',
                        name: 'number',
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
                    this.form = Object.assign({},this.$refs.table.selected[0]);
                }
            },
            del(){
                if (!this.$refs.table.validateRows()) {
                    return;
                }
                this.$confirm('确认删除？')
                    .then(_ => {
                        this.$http(`DELETE`, `identity/parCamera/${this.$refs.table.selected[0].id}id`).then(_ => {
                            this.$refs.table.refreshTableData();
                        });
                    })
                    .catch(_ => {});
            },
            submit (form) {
                this.submitLoading = true;
                //新增
                if(form.id==null){
                    this.$http('POST',`identity/parCamera/`,form).then(() => {
                        this.submitLoading = false;
                        this.dialogVisible = false;
                        this.$refs.table.refreshTableData();
                        this.form ={};
                    });
                }
                //编辑
                if((form.id!=null)&&(this.disabled===false)){
                    this.$http('PUT', `identity/parCamera/${form.id}id`,form).then(() =>{
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
            handleSelect(){
                this.$http("POST",`identity/sysDistrict/list`,false).then( data => {
                    data.forEach( item => {
                        this.districtList.push({label:item.districtName,value:item.id});
                    })
                })
            },
            handleId(){
                this.districtList.filter(item => {
                    if(item.label ===this.form.name){
                        this.form.organizationId = item.value;
                    }
                })
            },
        },
        components: {
            CommonCRUD
        },
        created() {
            this.columns = this.$store.state.classInfo.properties;
            this.formColumns = this.$store.state.classInfo.properties;
            this.handleSelect();
        }
    }
</script>

<style scoped>
</style>
