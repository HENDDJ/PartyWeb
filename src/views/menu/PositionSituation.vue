<template>
    <section>
        <vs-tabs :color="colorx">
            <vs-tab @click="colorx='success'" label="使用排行">
                <div class="con-tab-ejemplo">
                    <el-table :data="positionList" border align="center"
                              :header-cell-style="{'background-color': '#fafafa','color': 'rgb(80, 80, 80)','border-bottom': '1px solid #dee2e6'}"
                              :row-class-name="tableRowClassName">
                        <el-table-column prop="index" label="名次" align="center"  >
                            <template slot-scope="scope">
                                <icon v-if="indexValue + scope.$index ===1" name="RankFirstIcon" scale="2"></icon>
                                <icon v-if="indexValue + scope.$index ===2" name="RankSecondIcon" scale="2"></icon>
                                <icon v-if="indexValue + scope.$index ===3" name="RankThirdIcon" scale="2"></icon>
                                <slot v-if="indexValue + scope.$index>3">{{indexValue + scope.$index}}</slot>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="名称" align="center"></el-table-column>
                        <el-table-column prop="type" label="阵地类型" align="center"  ></el-table-column>
                        <el-table-column prop="districtName" label="所属组织" align="center" ></el-table-column>
                        <el-table-column prop="area" label="占地面积" align="center" ></el-table-column>
                        <el-table-column prop="facilities" label="设施" align="center" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column prop="hotDegree" label="热度" align="center" ></el-table-column>

                    </el-table>
                    <el-pagination style="text-align: right;margin-top: 20px;"
                                   background
                                   :total="pageable.total" :current-page.sync="pageable.currentPage" :page-size.sync="pageable.pageSize"
                                   @current-change="currentChange" @size-change="sizeChange" layout="total, sizes, prev, pager, next">
                    </el-pagination>
                </div>
            </vs-tab>
            <vs-tab @click="showCharts()" label="数据统计">
                <div class="con-tab-ejemplo">
                </div>
            </vs-tab>
        </vs-tabs>

    </section>
</template>

<script>
    import LookUp from '@/lookup';
    export default {
        name: "PositionSituation",
        data(){
            return{
                positionList:[],
                pageable: {
                    total: 0,
                    currentPage: 1,
                    pageSize: 10
                },
                indexValue:1,
                colorx:'success'
            }
        },
        methods: {
            currentChange(currentPage){
                this.pageable.currentPage = currentPage;
                this.showPositionList();
                this.indexValue = (this.pageable.currentPage-1)* this.pageable.pageSize +1 ;
            },
            sizeChange(size){
                this.pageable.pageSize = size;
                this.showPositionList();
                this.indexValue = (this.pageable.currentPage-1)* this.pageable.pageSize +1 ;
            },
            showPositionList(){
                this.$http('POST',`identity/positionInformation/page?page=${this.pageable.currentPage-1}&size=${this.pageable.pageSize}&sort=hotDegree,desc`,false).then(data => {
                    this.positionList = data.content;
                    this.pageable.total= data.totalElements;
                    //表格显示中文
                    this.positionList.filter( item => {
                        if (LookUp['PositionType'].filter(subitem => subitem.value === item.type)[0]) {
                            item.type = LookUp['PositionType'].filter(subitem => subitem.value === item.type)[0].label;
                        }else{
                            return ''
                        }
                    })
                });

            },
            tableRowClassName({row,rowIndex}) {
                if(this.pageable.currentPage<2){
                    if (rowIndex < 3) {
                        return 'success-row';
                    }
                    return '';
                }

            },
            showCharts(){
                this.colorx = 'danger'
            },
        },
        created(){
            this.showPositionList();
        }
    }
</script>

<style>
    .el-table .success-row {
        background: #e8f5e7 !important;
    }
</style>

<style scoped>
    svg {
        margin: 0 5px;
    }

</style>
