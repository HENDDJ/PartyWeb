<template>
    <section>
        <el-table :data="cameraList" border align="center"
                  :header-cell-style="{'background-color': '#fafafa','color': 'rgb(80, 80, 80)','border-bottom': '1px solid #dee2e6'}">
            <el-table-column prop="name" label="地名" width="180"></el-table-column>
            <el-table-column prop="IP" label="IP通道地址" width="180"></el-table-column>
            <el-table-column prop="number" label="机顶盒序列号" width="180"></el-table-column>
            <el-table-column prop="remark" label="备注" width="180"></el-table-column>
            <el-table-column  label="操作" width="180"></el-table-column>
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
        name: "ParCamera",
        data() {
            return {
                cameraList:[],
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
                this.showCameraList();
            },
            sizeChange(size){
                this.pageable.pageSize = size;
                this.showCameraList();
            },
            showCameraList(){
                this.$http('POST',`/identity/parCamera/page?page=${this.pageable.currentPage}&size=${this.pageable.pageSize}`,false).then(data => {
                    this.cameraList = data.content;
                    this.pageable.total= data.totalElements;
                });
            }
        },
        mounted() {
            this.showCameraList();
        }
    }
</script>

<style scoped>

</style>
