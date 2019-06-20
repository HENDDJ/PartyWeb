<template>
    <section>
        <vs-tabs :color="colorx">
            <vs-tab @click="colorx='success'" label="使用排行">
                <div class="con-tab-ejemplo">
                    <CommonCRUD
                        :columns="columns"
                        api-root="identity/positionInformation"
                        :formColumns="formColumns"
                        :sortColumns="sortColumns"
                        ref="pagination"
                        :addBtnVis="false"
                        :editBtnVis="false"
                        :lookBtnVis="false"
                        :delBtnVis="false">
                    </CommonCRUD>
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
    import CommonCRUD from '@/components/CommonCRUD';
    import { tansfer } from "../../lookup/transfer";
    import LookUp from '@/lookup';
    export default {
        name: "PositionSituation",
        data(){
            return{
                columns:[],
                formColumns:{},
                //排序
                sortColumns:[
                    {
                        name:'hotDegree',
                        type:'desc'
                    }
                ],
                colorx:'success'
            }
        },
        methods: {
            //列表显示字段
            controlColumns(){
               //列表显示热度字段
                this.columns.filter( item => item.name=== "hotDegree")[0].notShow = false;
               //列表添加名次字段
                this.columns.filter( item => item.name=== "index")[0].notShow = false;
                this.columns.forEach(item => {
                    if(item.name === 'index') {
                        item.formatter = (row, cell,val,index) => {
                            let indexVal = (this.$refs.pagination.pageable.currentPage-1)*(this.$refs.pagination.pageable.pageSize)+index+1;
                            return '第'+indexVal+'名'
                        }
                    }
                });
            } ,
            handleSelectOptions() {
                let  items = [
                    ['type', 'PositionType'],
                ].forEach(item => {
                    this.formColumns.filter(sub => sub.name === item[0])[0].options = LookUp[item[1]]
                })
            },
            showCharts(){
                this.colorx = 'danger'
            }
        },
        components: {
            CommonCRUD
        },
        created(){
            this.columns = this.$store.state.classInfo.properties;
            this.formColumns =this.$store.state.classInfo.properties;
            this.handleSelectOptions();
            tansfer(this.columns);
            this.controlColumns();
        }
    }
</script>

<style scoped>

</style>
