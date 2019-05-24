<template>
    <div class="common-crud">
        <div class="handler-btn">
            <el-button type="primary" plain @click="add()" class="self-btn">新增</el-button>
        </div>
        <el-table :data="cameraList" v-loading="loading" border align="center" stripe
                  :header-cell-style="{'background-color': '#fafafa','color': 'rgb(80, 80, 80)','border-bottom': '1px solid #dee2e6'}">
            <el-table-column prop="name" label="地名" align="center" ></el-table-column>
            <el-table-column prop="ip" label="IP通道地址" align="center" :show-overflow-tooltip="true" ></el-table-column>
            <el-table-column prop="number" label="机顶盒序列号" align="center"  ></el-table-column>
            <el-table-column prop="remark" label="备注" align="center" ></el-table-column>
            <el-table-column  label="操作" align="center" width="200">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
                    <el-button  type="text" size="small" @click="look(scope.row)">查看</el-button>
                    <el-button  type="text" size="small" @click="del(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="text-align: right;margin-top: 20px;"
                       background
                       :total="pageable.total" :current-page.sync="pageable.currentPage" :page-size.sync="pageable.pageSize"
                       @current-change="currentChange" @size-change="sizeChange" layout="total, sizes, prev, pager, next">
        </el-pagination>
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
                <el-form-item label="村">
                    <el-input v-model="form.name" :disabled="disabled"></el-input>
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
    </div>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    export default {
        name: "ParCamera",
        data() {
            return {
                cameraList:[],
                pageable: {
                    total: 0,
                    currentPage: 1,
                    pageSize: 10
                },
                form:{},
                dialogVisible: false,
                loading: false,
                title:'',
                disabled: false,
                submitLoading: false,
            };
        },
        methods: {
            currentChange(currentPage){
                this.pageable.currentPage = currentPage;
                this.showCameraList();
            },
            sizeChange(size){
                this.pageable.pageSize = size;
                this.showCameraList();
            },
            showCameraList(){
                this.loading = true;
                this.$http('POST',`/identity/parCamera/page?page=${this.pageable.currentPage-1}&size=${this.pageable.pageSize}`,false).then(data => {
                    this.cameraList = data.content;
                    this.pageable.total= data.totalElements;
                    this.loading = false;
                });
            },
            add(){
                this.title = "新增";
                this.dialogVisible = true;
                this.disabled = false;
            },
            edit(row){
                console.log(row);
                this.title = "编辑";
                this.dialogVisible = true;
                this.disabled = false;
                this.form = row;
            },
            look(row){
                this.title = "查看";
                this.dialogVisible = true;
                this.disabled = true;
                this.form = row;
            },
            del(row){
                console.log(row);
                this.$confirm('确认删除？')
                    .then(_ => {
                        this.$http(`DELETE`, `identity/parCamera/${row.id}id`).then(_ => {
                            this.showCameraList();
                        });
                    })
                    .catch(_ => {});
            },
            submit (form) {
                this.submitLoading = true;
                //上报
                if(form.id==null){
                    this.$http('POST',`identity/parCamera/`,form).then(() => {
                        this.submitLoading = false;
                        this.dialogVisible = false;
                       this.showCameraList();
                        this.form ={};
                    });
                }
                //编辑
                if((form.id!=null)&&(this.disabled===false)){
                    this.$http('PUT', `identity/parCamera/${form.id}id`,form).then(() =>{
                        this.submitLoading = false;
                        this.dialogVisible = false;
                        this.showCameraList();
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
        },
        mounted() {
            this.showCameraList();
        }
    }
</script>

<style scoped>
    .common-crud {
        width: 95%;
        margin: 1% 2.5%;
        padding: 2%;
        background-color: rgba(255, 255, 255, .9);
        border-radius: 2px;
        box-shadow: #e0e0e0 1px 1px 3px;
    }
    .el-pagination__sizes .el-input--mini .el-input__inner {
        width: 120px !important;
    }
    .el-pagination__sizes .el-select {
        width: 120px !important;
    }
    .handler-btn {
        float: left;
        margin-bottom: 12px;
    }
    .self-btn {
        width: 56px !important;
        height: 28px !important;
        border-radius: 5px !important;
    }
    .footer-position {
        margin-right: 84px;
    }
</style>
