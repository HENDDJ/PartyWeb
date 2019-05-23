<template>

    <div>
        <div style="margin-left: 10px;float: left;margin-top:5px">

            <el-button  type="primary" plain @click="add" class="self-add self-btn"></el-button>
              <el-select v-model="chooseType" placeholder="请选择" size="small" @change="select" style="margin-left: 10px">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>

        </div>
        <!--<div >-->


        <!--</div>-->
        <div  style="margin-top: 50px">
    <el-table
        :data="tableData"
        stripe
        style="width: 90%;margin:auto;"
        v-loading="loading" border
        :header-cell-style="{'background-color': '#fafafa','color': 'rgb(80, 80, 80)','border-bottom': '1px solid #dee2e6'}"
        :default-sort = "{prop: 'month', order: 'descending'}">
        <el-table-column
            prop="title"
            label="计划名称"
            align="center"
            width="200px"
            :show-overflow-tooltip="true"
            >
        </el-table-column>
        <el-table-column
            prop="type"
            label="任务类型"
            align="center"
            width="150px"
            :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
            prop="context"
            label="工作要求"
            align="center"
            :show-overflow-tooltip="true"
            >
        </el-table-column>
        <el-table-column
            label="截止时间"
            prop="month"
            sortable
            align="center"
            width="250px"
            :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <el-button @click="remind(scope.row)" type="text" size="small">提醒</el-button>
                <el-button type="text" size="small">跟踪</el-button>
                <el-button type="text" size="small">编辑</el-button>
                <el-button type="text" size="small">附件</el-button>
                <el-button type="text" size="small">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination style="text-align: right;margin-top: 20px;" background
                   :total="pageable.total" :current-page.sync="pageable.currentPage" :page-size.sync="pageable.pageSize"
                   @current-change="currentChange" @size-change="sizeChange" layout="total, sizes, prev, pager, next">
    </el-pagination>
        </div>
        <el-dialog
            v-if="dialogVisible"
            :title="title"
            :visible.sync="dialogVisible"
            width="880px"
            align="left"
            :modal-append-to-body='false'
            :append-to-body="true"
            :before-close="handleClose">
            <el-form :inline="true" :model="form" ref="form" class="demo-form-inline" label-width="170px" >
                <el-form-item label="任务分类" prop="taskType" >
                    <el-radio-group size="medium" v-model="form.taskType" style="margin-left: 10px;">
                        <el-radio-button  label="Party" key="Party" >党建任务</el-radio-button>
                        <el-radio-button  label="DistLearning" key="DistLearning" >远教任务</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="计划名称" prop="title" >
                    <el-input v-model="form.title" :disabled=disabled></el-input>
                </el-form-item>
                <el-form-item label="任务类型" prop="type" >
                    <el-input v-model="form.type" :disabled=disabled></el-input>
                </el-form-item>
                <el-form-item label="工作要求" prop="context" >
                    <el-input v-model="form.context" :disabled=disabled></el-input>
                </el-form-item>
                <el-form-item label="分值" prop="score" >
                    <el-input v-model="form.score" :disabled=disabled></el-input>
                </el-form-item>
                <el-form-item label="截止时间" prop="month" >
                    <el-date-picker  v-model="form.month"
                                     type="date"
                                     value-format="yyyy-MM-dd"
                                     placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="上传文件" >
                    <CommonFileUpload :value="Url" @getValue="Url = $event"></CommonFileUpload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer  footer-position">
                <el-button type="primary" :loading="submitLoading" @click="submit('form')">确 定</el-button>
                <el-button @click="handleClose">取 消</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>

    import LookUp from '@/lookup';
    import CommonFileUpload from '@/components/FileUpLoad';
    import { tansfer } from "../../lookup/transfer";
    export default {
        name: "ParActivityRelease",
        data() {
            return {
                formColumns: [
                    {
                        name: "month",
                        type: 'string',
                        des: "属性名",
                    },{
                        name: "context",
                        type: 'string',
                        des: "数据类型",
                    },{
                        name: "title",
                        type: 'string',
                        des: "长度",
                    },
                ],
                queryForm: {taskType:''},
                tableData:[],
                loading: false,
                pageable: {
                    total: 0,
                    currentPage: 1,
                    pageSize: 10
                },
                apiRoot:'/identity/parActivity',
                checkboxGroup: 'Party',
                options: [],
                chooseType:'',
                form:{},
                disabled:false,
                dialogVisible:false,
                title:'任务发布',
                submitLoading:false,
                Url:''

            }
        },
        watch: {
            checkboxGroup: {
                handler: function (newVal, oldVal) {
                    console.log(newVal)
                }
            }
        },
        components:{
            CommonFileUpload
        },
        methods: {
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
            currentChange(value) {
                let path = `${this.apiRoot}/page?page=${value - 1}&size=${this.pageable.pageSize}`;
                this.loadTableData(path)
            },
            sizeChange(value) {
                let path = `${this.apiRoot}/page?page=0&size=${value}`;
                this.loadTableData(path)
            },
            // 获取表格数据
            loadTableData (path) {
                this.$http('POST', path, this.queryForm, false).then(
                    data => {
                        this.tableData = data.content;
                        this.pageable.total = data.totalElements;
                        this.loading = false;
                    }
                ).catch(res => {
                    this.loading = false;
                });
            },
            checkbox1(val) {
                    this.checkboxGroup = 'Party'
            } ,
            checkbox2(val) {
                this.checkboxGroup = 'DistLearning'
            } ,
            handleSelectOptions() {
                        this.options = LookUp [ 'Mission']
            },
            select(val){
                let path = `${this.apiRoot}/page?page=${this.pageable.currentPage - 1}&size=${this.pageable.pageSize}`;
                this.queryForm.taskType = val
                this.loadTableData(path);
            },
            remind(val){

            },
            add(){
                this.form.taskType = 'Party'
                this.dialogVisible = true
            },
            submit(form){
                this.$refs[form].validate((valid) => {
                        if (valid) {
                            this.submitLoading = false
                            this.$http('Post', '/identity/parActivity/',this.form, false).then(
                                (data)=>{
                                    var formTwo = new FormData()
                                    formTwo.append('activityID',data.id)
                                    formTwo.append('Url',this.Url)
                                    this.$http('Post', '/identity/parActivityReleaseFile/',formTwo, false).then(
                                        this.$message({
                                            type: 'success',
                                            message: '上传成功'
                                        })
                                    ).catch(res => {
                                        this.dialogVisible = true;
                                        this.$message({
                                            type: 'error',
                                            message: '上传文件失败'
                                        });
                                        return false;
                                    });
                                }
                            ).catch(res => {
                                this.dialogVisible = true;
                                this.$message({
                                    type: 'warning',
                                    message: '上传失败'
                                });
                                return false;
                            });
                        }else{

                        }})
            }
        },
        created() {
            this.handleSelectOptions();
            let path = `${this.apiRoot}/page?page=${this.pageable.currentPage - 1}&size=${this.pageable.pageSize}`;
            this.loadTableData(path);
        }
    }
</script>

<style>
    .footer-position {
        margin-right: 86px;
    }
    .el-checkbox.is-bordered.el-checkbox--mini {
        padding : 5px 15px 5px 10px !important;
        margin-left: 10px;
    }
    .el-pagination__sizes .el-input--mini .el-input__inner {
        width: 120px !important;
    }
    .el-pagination__sizes .el-select {
        width: 120px !important;
    }
    .self-btn {
        width: 56px !important;
        height: 28px !important;
        border-radius: 5px !important;
    }
    .self-add {
        background: url('../../../static/img/add.png') !important;
        background-size: cover !important;
    }
</style>
