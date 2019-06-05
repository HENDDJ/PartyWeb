<template>
    <div class="common-crud">
        <div class="handler-btn">
            <el-button type="success" plain @click="$router.go(-1)" class="self-btn">返回</el-button>
        </div>
        <el-table :data="loginNoteList" border align="center" stripe
                  :header-cell-style="{'background-color': '#fafafa','color': 'rgb(80, 80, 80)','border-bottom': '1px solid #dee2e6'}">
            <el-table-column prop="name" label="用户名称" align="center"  ></el-table-column>
            <el-table-column prop="userName" label="登录账号" align="center"></el-table-column>
            <el-table-column prop="createTime" label="登录时间" align="center"  ></el-table-column>
            <el-table-column prop="region" label="登录平台" align="center" ></el-table-column>
            <el-table-column prop="action" label="事件" align="center" ></el-table-column>
        </el-table>
        <el-pagination style="text-align: right;margin-top: 20px;"
                       background
                       :total="pageable.total" :current-page.sync="pageable.currentPage" :page-size.sync="pageable.pageSize"
                       @current-change="currentChange" @size-change="sizeChange" layout="total, sizes, prev, pager, next">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        name: "SysLoginNote",
        data() {
            return {
                loginNoteList:[],
                pageable: {
                    total: 0,
                    currentPage: 1,
                    pageSize: 10
                },
            };
        },
        methods: {
            currentChange(currentPage){
                this.pageable.currentPage = currentPage;
                this.showLoginNoteList();
            },
            sizeChange(size){
                this.pageable.pageSize = size;
                this.showLoginNoteList();
            },
            showLoginNoteList(){
                this.$http('POST',`identity/sysLoginNote/page?page=${this.pageable.currentPage}&size=${this.pageable.pageSize}&sort=createTime,desc`,false).then(data => {
                    this.loginNoteList = data.content;
                    this.pageable.total= data.totalElements;
                });
            }
        },
        mounted() {
            this.showLoginNoteList();
        }
    }
</script>

<style scoped>
    .common-crud {
        width: 95%;
        padding: 2%;
        background-color: rgba(255, 255, 255, .9);
        border-radius: 2px;
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
</style>
