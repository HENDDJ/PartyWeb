<template>
<div>
    <el-row>
        <el-col>
            <el-card class="box-card">
                <div style="float:left;margin:auto  20px;">
                    <div style="float:left;">
                        <h3 style="display: inline;top:10px">
                            积分排名
                        </h3>
                    </div>
                    <div style="float:left;margin-left: 50px;">
                        <div class="inner-container">
                            <p class="text" v-for="(text, index) in arr" :key="index">{{text}}<br></p>
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
        <p style="float:left;margin-left: 10px">年份：</p>
        <vs-select
            class="selectExample"
            style="position: absolute;margin-left: 60px"
            label=""
            v-model="year"
            width="120px"
            @change="con"
        >
            <vs-select-item :key="index" :value="item.value" :text="item.text" v-for="item,index in options"/>
        </vs-select>
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
                  :default-sort = "{prop: 'exam', order: 'descending'}"
                  >
            <el-table-column
                label="序号"
                width="150"
                type="index"
                :index="indexMethod">
            </el-table-column>
            <el-table-column
                prop="cun"
                label="村名"
                align="center"
              >
            </el-table-column>
            <el-table-column
                prop="exam"
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

    <el-dialog
        v-if="dialogVisible"
        :title="title"
        :visible.sync="dialogVisible"
        width="780px"
        align="left"
        :modal-append-to-body='false'
        :append-to-body="true"
        :before-close="handleClose">
        <el-form :inline="true" :model="form"  ref="form" class="demo-form-inline" label-width="150px" >
            <el-form-item  key="organizationName" label="组织名称" prop="organizationName">
                <el-input v-model="organizationName" :disabled=disable></el-input>
            </el-form-item>
            <el-form-item  key="score" label="分数" prop="score">
                <vs-input-number size="medium" min="-10" v-model="form.score"></vs-input-number>
            </el-form-item>
            <el-form-item  key="remark" label="备注" prop="remark" >
                <el-input v-model="form.remark" type="textarea"></el-input>
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
    export default {
        name: "ExaminationAudit",
        data() {
            return {
                arr: [
                ],
                pageable: {
                    total: 0,
                    currentPage: 1,
                    pageSize: 10
                },
                tableData:[],
                apiRoot:"identity/exaExamine/",
                loading:false,
                order:"desc",
                dialogVisible:false,
                submitLoading:false,
                title:'审核',
                form:{score:10},
                score:10,
                //原始分数
                scoreFirst:0,
                disable:true,
                year:'2019',
                //年份选择
                options:[],
                organizationName: ''
            }
        },
        methods:{
            loadTable(path){
                this.loading = true
                this.$http("Post",path,{},false).then((data)=>{
                    this.loading = false
                    this.tableData = data;
                    this.pageable.total = data[0].total;
                }).catch(_=>{
                    this.$message({
                        type: 'warning',
                        message: '信息提取失败，请检查网络'
                    })
                })
            },
            currentChange(value) {
                let path=`identity/exaScore/scoreCunPercentAll?page=${value - 1}&size=${this.pageable.pageSize}&sort=${this.order}&year=${this.year}`
                this.pageable.currentPage = value
                this.loadTable(path)
            },
            sizeChange(value) {
                let path=`identity/exaScore/scoreCunPercentAll?page=0&size=${value}&sort=${this.order}&year=${this.year}`
                this.pageable.currentPage = 1
                this.pageable.pageSize = value
                this.loadTable(path)
            },
            sortChange(value){
                let path=''
                if(value.order == 'descending'){
                    path = `identity/exaScore/scoreCunPercentAll?page=0&size=${this.pageable.pageSize}&sort=desc&year=${this.year}`
                    this.order = 'desc'
                }else{
                    path = `identity/exaScore/scoreCunPercentAll?page=0&size=${this.pageable.pageSize}&sort=asc&year=${this.year}`
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
                        return list2-1456;
                    }else if(this.pageable.pageSize == 15){
                        return list2-1456-810;
                    }
                    else{
                        return list2-1456-810-810;
                    }

                }

            },
            submit(form){
                this.$refs[form].validate((valid) => {
                    this.form.createTime = new Date().Format('yyyy-MM-dd')
                    this.$http('Post','identity/exaExamine/',this.form,false).then((data)=>{
                        this.$message({
                            type: 'success',
                            message: '修改成功'
                        })
                        this.showMesg();
                        let  path = `identity/exaScore/scoreCunPercentAll?page=${this.pageable.currentPage - 1}&size=${this.pageable.pageSize}&sort=desc&year=${this.year}`
                        this.loadTable(path);
                        this.dialogVisible = false
                    }).catch(()=>{
                        this.$message({
                            type: 'warning',
                            message: '修改失败，请检查网络'
                        })
                    })
                })
            },
            check(value){
                this.organizationName = value.cun
                this.form.organizationId = value.districtId
                this.form.authorId = JSON.parse(sessionStorage.getItem('userInfo')).sysDistrict.districtId
                this.scoreFirst= value.score
                this.dialogVisible = true
            },
            handleClose(){
                this.dialogVisible = false
            },
            showMesg(){
                this.$http('Post','identity/exaExamine/page?page=0&size=5&sort=createTime,desc',{},false).then((data)=>{
                    data.content.forEach((item,index)=>{
                        let remark=''
                        if(item.remark){
                            remark = item.remark
                        }else {
                            remark = '无'
                        }
                        let time = item.createTime.substring(0,10)
                        this.arr.push(index+1+'、'+item.organizationName+'于 '+time+' 被句容市委修改了积分，备注：'+remark)
                    })
                })
            },
            yearOptions(){
                let nowYear = new Date().Format('yyyy')
                this.year = nowYear
                let interval = Number(nowYear) - 2017
                for (let i = 0; i <= interval; i++) {
                    this.options.push({text: i + 2017, value: i + 2017})
                }
            },
            con(val){
                this.year = val
                let  path = `identity/exaScore/scoreCunPercentAll?page=${this.pageable.currentPage - 1}&size=${this.pageable.pageSize}&sort=desc&year=${this.year}`
                this.loadTable(path)
            }
        },
        created() {
           let  path = `identity/exaScore/scoreCunPercentAll?page=${this.pageable.currentPage - 1}&size=${this.pageable.pageSize}&sort=desc&year=${this.year}`
            this.loadTable(path)
            this.showMesg();
           this.yearOptions();
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
        position: relative;
        text-align:left;
        color: black;
        height: 50px
    }
    .footer-position {
        margin-right: 86px;
    }

</style>
