<template>
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
                <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination style="text-align: right;margin-top: 20px;" background
                   :total="pageable.total" :current-page.sync="pageable.currentPage" :page-size.sync="pageable.pageSize"
                   @current-change="currentChange" @size-change="sizeChange" layout="total, sizes, prev, pager, next">
    </el-pagination>
    </div>
</template>

<script>


    import CommonCRUD from '@/components/CommonCRUD';
    export default {
        name: "ParActivity",
        components: {
            CommonCRUD
        },
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
                apiRoot:'/identity/parActivity'
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
        },
        created() {
            let path = `${this.apiRoot}/page?page=${this.pageable.currentPage - 1}&size=${this.pageable.pageSize}`;
            this.loadTableData(path);
        }
    }
</script>

<style scoped>

</style>
