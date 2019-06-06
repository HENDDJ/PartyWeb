<template>
<div>
    <el-row :gutter="40">
        <el-col :span="14">
            <div style="border:1px solid black;width: 100%;height: 100%">
                <div class="left-act-list" >
                    任务列表
                    <transition name="translate" mode="out-in">
                        <div v-show="activityLoading">
                            <div class="list-item" v-for="(item, index) in tableData" :key="item.id">
                                <div class="status">
                                    <icon name="finished" scale="4.5"></icon>
                                </div>
                                <div class="title-type">
                                    <p class="title">{{item.title}}</p>
                                    <p class="type">{{item.type}}</p>
                                </div>
                                <div class="left-date">
                                    <p class="label">截止日期：<span class="value">{{item.month}}</span></p>
                                </div>
                                <div class="sepertor">
                                    <p style="border-right: 1px solid #888">&nbsp;</p>
                                </div>
                                <div class="left-time">
                                    <template v-if="calcLeftDays(item.month)">
                                        <icon name="miaobiao" scale="3.5"></icon>
                                        <p><span>{{calcLeftDays(item.month)}}</span>天</p>
                                    </template>
                                    <template v-else>&nbsp;</template>
                                </div>
                                <div class="processing">
                                    <el-progress style="width: 80%;text-align: center" :stroke-width="6" :percentage="50"></el-progress>
                                </div>
                                <div class="detail" @click="details(item)">
                                    <div style="border: 1px solid #444; width: 30px;height: 30px; border-radius: 30px">
                                        <icon name="more" scale="2" ></icon>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>
                <el-pagination style="text-align: right;margin-top: 10px;" background
                               :page-sizes="[5, 7, 10]"
                               :total="pageable.total" :current-page.sync="pageable.currentPage"
                               :page-size.sync="pageable.pageSize"
                               @current-change="currentChange" @size-change="sizeChange"
                               layout="total, sizes, prev, pager, next">
                </el-pagination>
            </div>
        </el-col>
        <el-col :span="10">
<div style="border:1px solid black;width: 100%;height: 100%">12</div>
        </el-col>
    </el-row>
</div>
</template>

<script>
    export default {
        name: "ParActivityReview",
        data(){
            return {
                tableData: [],
                pageable: {
                    total: 0,
                    currentPage: 1,
                    pageSize: 7
                },
                apiRoot: '/identity/parActivity',
                activityLoading: false
            }
        },
        methods:{
            calcLeftDays(date){
                //开始时间
                let stop = new Date(date);
                //结束时间
                let now = new Date();
                let distance = stop.getTime()-now.getTime();
                if (distance < 0) {
                    return false
                }
                //计算出相差天数
                return Math.floor(distance/(24*3600*1000))
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
            loadTableData(path) {
                path += `&sort=month,desc`;
                this.activityLoading = false;
                this.$http('POST', path, this.queryForm, false).then(
                    data => {
                        this.tableData = data.content;
                        this.pageable.total = data.totalElements;
                        this.loading = false;
                        this.activityLoading = true;
                    }
                ).catch(res => {
                    this.loading = false;
                });
            },
        }
    }
</script>


<style>
    .footer-position {
        margin-right: 86px;
    }

    .activity-management {
        /*width: 100%;*/
        /*height: 100%;*/
        /*background-color: #D6FFFE;*/
    }

    .el-checkbox.is-bordered.el-checkbox--mini {
        padding: 5px 15px 5px 10px !important;
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

    #vd .el-checkbox__inner {
        margin-left: -100px !important;
    }
</style>
<style type="scss">
    .left-act-list {
        width: 100%;
        background-color: rgb(250, 250, 250);
        padding: 5px 20px;
        line-height: 24px;
        min-height: 646px;
    }
    .list-item {
        background-color: white;
        text-align: left;
        margin: 10px 0;
        display: flex;
        padding: 14px 20px;
        transition: all .4s;
        /*box-shadow: 2px 2px 2px #444;*/
        box-shadow:0px 15px 35px rgb(50, 50, 93,0.1),0px 5px 15px rgb(0,0,0,0.07);
    }
    .title-type {
        flex: 1;
    }
    .title-type .title {
        font-size: 14px;
        font-weight: bold;
    }
    .title-type .type {
        font-size: 12px;
        color: #999999;
    }
    .left-date {
        flex: 1.2;
        display: flex;
        align-items:center;
        justify-content:center;
    }
    .left-date .label {
        font-size: 12px;
        color: #999999;
    }
    .left-date .value {
        font-size: 14px;
        font-weight: bold;
        text-align: right;
        color: #444;
    }
    .sepertor {
        flex: 0 0 6px;
        display: flex;
        align-items:center;
        justify-content:center;
    }
    .left-time {
        flex:  0.8;
        display: flex;
        align-items:center;
        font-size: 14px;
        justify-content:center;
    }
    .processing {
        flex: 1.4;
        display: flex;
        align-items:center;
        justify-content:center;
    }
    .detail {
        flex: 0 0 30px;
        display: flex;
        align-items:center;
        justify-content:center;
    }
    .detail svg {
        margin: 5px 0 0 4px;
    }
    .left-time svg {
        margin: 0 6px 0 6px;
    }
    .status {
        flex: 0 0 45px;
        justify-content: right;
        align-items: center;
    }
    .status svg {
        margin: 5px 0 0 0;
    }
    .list-item:hover {
        transform: translateY(-5px) scale3d(1.05,1.05,1.05);
        background-color: #2ae1ff38;
        cursor: pointer;
    }
</style>
<style>
    .translate-enter,.translate-leave-to{
        opacity: 0;
        transform: translateY(80px);
    }
    .translate-enter-active, .translate-leave-active{
        transition: all 0.5s ease;
    }
</style>

