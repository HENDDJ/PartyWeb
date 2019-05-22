<template>
    <section>
        <el-table :data="loginNoteList" border align="center"
                  :header-cell-style="{'background-color': '#fafafa','color': 'rgb(80, 80, 80)','border-bottom': '1px solid #dee2e6'}">
            <el-table-column prop="name" label="用户名称" width="180"></el-table-column>
            <el-table-column prop="userName" label="登录账号" width="180"></el-table-column>
            <el-table-column prop="createTime" label="登录时间" width="180"></el-table-column>
            <el-table-column prop="region" label="登录平台" width="180"></el-table-column>
            <el-table-column prop="action" label="事件" width="180"></el-table-column>
        </el-table>
        <el-pagination style="text-align: left;margin-top: 20px;"
                       background
                       :total="pageable.total" :current-page.sync="pageable.currentPage" :page-size.sync="pageable.pageSize"
                       @current-change="currentChange" @size-change="sizeChange" layout="total, sizes, prev, pager, next">
        </el-pagination>
    </section>
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
                this.$http('POST',`/identity/sysLoginNote/page?page=${this.pageable.currentPage}&size=${this.pageable.pageSize}`,false).then(data => {
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

</style>
