<template>
<div>
    <el-row>
        <el-col>
            <el-card class="box-card">
                <div style="float:left;margin:auto  20px;">
                    <div style="float:left;">
                        <h3 style="display: inline;">
                            积分排名
                        </h3>
                    </div>
                    <div style="float:left;margin:auto  50px;">
                        <div class="inner-container">
                            <p class="text" v-for="(text, index) in arr" :key="index">{{text}}</p>
                        </div>
                    </div>
                </div>
            </el-card>



        </el-col>
    </el-row>
    <el-row>
        &nbsp;
    </el-row>
    <el-row>
        <el-table :data="tableData" v-loading="loading" border
                  ref="tableData"
                  style="width: 100%"
                  @sort-change="sortChange"
                  :header-cell-style="{'background-color': '#fafafa','color': 'rgb(80, 80, 80)','border-bottom': '1px solid #dee2e6'}"
                  stripe
                  :default-sort = "{prop: 'score', order: 'descending'}"
                  >
            <el-table-column
                label="序号"
                width="150"
                type="index"
                :index="indexMethod">
            </el-table-column>
            <el-table-column
                prop="organizationName"
                label="村名"
                align="center"
              >
            </el-table-column>
            <el-table-column
                prop="score"
                label="积分"
                sortable="custom"
                align="center">
            </el-table-column>
            <el-table-column
            label="操作"
            align="center">
                <template slot-scope="scope">
                    <el-button
                        @click.native.prevent="check(scope.row)"
                        type="text"
                        size="small">
                        审核
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-row>
    <el-row>
        <el-pagination style="text-align: right;margin-top: 10px;" background
                       :page-sizes="[10, 15, 20]"
                       :total="pageable.total" :current-page.sync="pageable.currentPage"
                       :page-size.sync="pageable.pageSize"
                       @current-change="currentChange" @size-change="sizeChange"
                       layout="total, sizes, prev, pager, next">
        </el-pagination>
    </el-row>

</div>
</template>

<script>
    export default {
        name: "ExaminationAudit",
        data() {
            return {
                arr: [
                    '1 不是被郭德纲发现的，也不是一开始就收为徒弟。',
                    '2 现在雅阁这个状态像极了新A4L上市那段日子。',
                    '3 低配太寒碜，各种需要加装，中配定价过高，又没啥特色',
                    '4 然后各种机油门、经销商造反什么的幺蛾子。',
                    '5 看五月销量，建议参考A4，打8折吧。',

                ],
                pageable: {
                    total: 0,
                    currentPage: 1,
                    pageSize: 10
                },
                tableData:[],
                apiRoot:"identity/exaExamine/",
                loading:false,
                order:"des"
            }
        },
        methods:{
            loadTable(path){
                this.loading = true
                this.$http("Post",path,{},false).then((data)=>{
                    this.loading = false
                    this.tableData = data.content;
                    this.pageable.total = data.totalElements;
                }).catch(_=>{
                    this.$message({
                        type: 'warning',
                        message: '信息提取失败，请检查网络'
                    })
                })
            },
            currentChange(value) {
                let path = `${this.apiRoot}/page?page=${value - 1}&size=${this.pageable.pageSize}&sort=score,${this.order}`;
                this.pageable.currentPage = value
                this.loadTable(path)
            },
            sizeChange(value) {
                let path = `${this.apiRoot}/page?page=0&size=${value}&sort=score,${this.order}`;
                this.pageable.currentPage = 1
                this.pageable.pageSize = value
                this.loadTable(path)
            },
            sortChange(value){
                let path=''
                if(value.order == 'descending'){
                    path = `${this.apiRoot}page?page=0&size=${this.pageable.pageSize}&sort=score,desc`
                    this.order = 'desc'
                }else{
                    path = `${this.apiRoot}page?page=0&size=${this.pageable.pageSize}&sort=score,asc`
                    this.order = 'asc'
                }
                this.loadTable(path)

            },
            indexMethod(index) {  //设置序列号
                if(this.order == 'desc'){
                    let list = index+(this.pageable.currentPage - 1) * (this.pageable.pageSize) + 1
                    return list
                }else{
                    let list2 = (this.pageable.total-this.pageable.currentPage) * (this.pageable.pageSize) - 1 - index
                    if(this.pageable.pageSize == 10){
                        return list2-1447;
                    }else if(this.pageable.pageSize == 15){
                        return list2-1447-805;
                    }
                    else{
                        return list2-1447-805-805;
                    }

                }

            },
            check(value){

            }
        },
        created() {
            let path = `${this.apiRoot}page?page=${this.pageable.currentPage - 1}&size=${this.pageable.pageSize}&sort=score,asc`
            this.loadTable(path)
        }
    }
</script>

<style scoped>
    .box-card{color:#b94a48;
    height: 50px}
    .inner-container {
        animation: myMove 10s linear infinite;
        animation-fill-mode: forwards;
    }
    /*文字无缝滚动*/
    @keyframes myMove {
        0% {
            transform: translateY(0);
        }


        100% {
            transform: translateY(-250px);
        }
    }
    .text{
        color: black;
        height: 50px
    }
</style>
