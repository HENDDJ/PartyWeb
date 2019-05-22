<template>

    <div>
        <div style="margin-left: 10px;float: left">


              <el-select v-model="chooseType" placeholder="请选择" size="small" @change="select">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>

        </div>
        <div >
            <el-radio-group size="medium" v-model="checkboxGroup" style="margin-left: 10px;">
                <el-radio-button  label="Party" key="Party" >党建任务</el-radio-button>
                <el-radio-button  label="DistLearning" key="DistLearning" >远教任务</el-radio-button>
            </el-radio-group>

        </div>
        <div>
    <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="loading" border
        :header-cell-style="{'background-color': '#fafafa','color': 'rgb(80, 80, 80)','border-bottom': '1px solid #dee2e6'}"
        :default-sort = "{prop: 'month', order: 'descending'}">
        <el-table-column
            prop="title"
            label="计划名称"
            align="center"
            >
        </el-table-column>
        <el-table-column
            prop="type"
            label="任务类型"
            align="center">
        </el-table-column>
        <el-table-column
            prop="context"
            label="工作要求"
            align="center"
            >
        </el-table-column>
        <el-table-column
            label="截止时间"
            prop="month"
            sortable
            align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">提醒</el-button>
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
    </div>
</template>

<script>

    import LookUp from '@/lookup';
    import { tansfer } from "../../lookup/transfer";
    export default {
        name: "ParActivity",
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
                queryForm: {},
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
                chooseType:''
            }
        },
        watch: {
            checkboxGroup: {
                handler: function (newVal, oldVal) {
                    console.log(newVal)
                }
            }
        },
        methods: {
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
                console.log(val)
            }
        },
        created() {
            this.handleSelectOptions();
            let path = `${this.apiRoot}/page?page=${this.pageable.currentPage - 1}&size=${this.pageable.pageSize}`;
            this.loadTableData(path);
        }
    }
</script>

<style scoped>

</style>
