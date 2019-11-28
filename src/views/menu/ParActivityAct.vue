<template>
    <section class="activity-management">
        <div style="width: calc(100% - 10px);margin: 5px auto">
            <el-row type="flex">
                <div style="width: 2%"></div>
                <div style="width: 44.5%">
                    <div class="list-header">
                        <h1>执行列表</h1>
                    </div>
                    <div class="left-act-list" >
                        <transition name="translate" mode="out-in">
                            <div v-show="activityLoading">
                                <div class="list-item" v-for="(item, index) in tableData" :key="item.id" @click="details(item)" v-if="tableData.length!=0">
                                    <div class="status">
                                        <img v-show="item.taskType === 'Party'" style="position: relative;left: 5px;top:13px" src="/static/img/party-logo.png" alt="党建logo"/>
                                        <img v-show="item.taskType === 'DistLearning'" style="position: relative;left: 5px;top:13px" src="/static/img/learning-logo.png" alt="远教logo"/>
                                    </div>
                                    <div class="title-type">
                                        <p class="title">{{item.title}}</p>
                                        <p class="type">{{item.type}}</p>
                                    </div>
                                    <div class="left-date">
                                        <p class="label">执行组织：<span class="value">{{item.districtName}}</span></p>
                                    </div>
                                    <div class="left-date">
                                        <p class="label">截止日期：<span class="value">{{item.month}}</span></p>
                                    </div>
                                    <div class="sepertor">
                                        <p style="border-right: 1px solid #888">&nbsp;</p>
                                    </div>
                                    <div class="left-time">
                                        <template v-if="calcLeftDays(item.month)">
                                            <icon name="miaobiao" scale="3"></icon>
                                            <p><span>{{calcLeftDays(item.month)}}</span>天</p>
                                        </template>
                                        <template v-else>
                                            <el-tag type="warning" effect="dark"  name="已截止">已截止</el-tag>
                                        </template>
                                    </div>
                                </div>
                                <div v-if="tableData.length===0">暂无待执行任务</div>
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
                <div style="width: 3%"></div>
                <div style="width: 48.5%">
                    <div class="detail-header">
                        <h1>任务详情</h1>
                    </div>
                    <transition name="el-zoom-in-center" mode="out-in">
                        <div v-show="activityDetailLoading" class="right-detail" v-if="tableData.length!=0">
                            <el-row class="detail-row">
                                <el-col :span="4">任务名称：</el-col>
                                <el-col :span="8" style="color: #25252582">{{activityDetail.title}}&nbsp;</el-col>
                                <el-col :span="4">任务类型:</el-col>
                                <el-col :span="6" style="color: #25252582">{{activityDetail.type}}&nbsp;</el-col>
                            </el-row>
                            <el-row class="detail-row">
                                <el-col :span="4">截止日期：</el-col>
                                <el-col :span="8" style="color: #25252582">{{activityDetail.month}}&nbsp;</el-col>
                                <el-col :span="4">提醒时间:</el-col>
                                <el-col :span="6" style="color: #25252582">{{activityDetail.alarmTime || '暂无'}}&nbsp;</el-col>
                            </el-row>
                            <el-row class="detail-row">
                                <el-col :span="4">任务分值：</el-col>
                                <el-col :span="6" style="color: red;font-weight: bold">{{activityDetail.score || 0}}分&nbsp;</el-col>
                            </el-row>
                            <el-row class="detail-row">
                                <el-col :span="4">附件清单：</el-col>
                                <el-col :span="15">
                                    <CommonFileUpload :value="activityDetail.fileUrls" @getValue="activityDetail.fileUrls = $event" :disabled="true"></CommonFileUpload>
                                </el-col>
                            </el-row>
                            <el-row class="detail-row">
                                <el-col :span="4">工作要求：</el-col>
                                <el-col :span="16" style="color: #25252582">{{activityDetail.context}}&nbsp;</el-col>
                            </el-row>
                            <el-row class="detail-row"  v-if="activityDetail.objectType.indexOf('2')===0">
                                <el-col :span="4">反馈要求：</el-col>
                                <el-col :span="16" style="color: #25252582">{{activityDetail.templateItem}}&nbsp;</el-col>
                            </el-row>
                            <el-row class="detail-row" v-for="item in feedBackItemList" :key="item.id"  v-if="activityDetail.objectType.indexOf('2')===0">
                                <el-col :span="4">{{item.name}}：</el-col>
                                <el-col :span="16" style="color: #25252582" v-if="item.type === 'String' ">
                                    <el-input  v-model="item.value" @change="updateFile(item,item.value)">{{item.value}}</el-input>
                                </el-col>
                                <el-col :span="16" style="color: #25252582" v-if="item.type === 'File' ">
                                    <CommonFileUpload :value="item.value" @getValue="($event) => {updateFile(item, $event)}"></CommonFileUpload>
                                </el-col>
                                <el-col :span="16" style="color: #25252582" v-if="item.type === 'Image' ">
                                    <CommonImageUpload :value="item.value"   @getValue="($event) => {updateFile(item, $event)}"></CommonImageUpload>
                                </el-col>
                            </el-row>
                            <PictureShot :picData="picQuery" v-if="activityDetail.objectType==='1'"></PictureShot>
                            <el-row v-if="activityDetail.objectType.indexOf('2')===0">
                                <el-col :span="22" style="text-align: right">
                                    <el-button type="primary" @click="submit">提交</el-button>
                                </el-col>
                            </el-row>
                        </div >
                        <div v-if="tableData.length===0">暂无待执行任务</div>
                    </transition>
                </div>
                <div style="width: 2%"></div>
            </el-row>
        </div>
    </section>
</template>

<script>
    import CommonFileUpload from '@/components/FileUpLoad';
    import CommonImageUpload from '@/components/UpLoad';
    import PictureShot from '@/components/PictureShot';

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
                apiRoot: '/identity/parActivityObject',
                activityLoading: false,
                activityDetailLoading:false,
                queryForm:{},
                activityDetail: {title:''},
                user:{},
                feedBackItemList:[],
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
                let districtId = this.user.sysDistrict.districtId;
                this.queryForm.organizationId = districtId;
                this.queryForm.status = '0';
                path += `&sort=createdAt,desc`;
                this.activityLoading = false;
                this.$http('POST', path, this.queryForm, false).then(
                    data => {
                        this.tableData = data.content;
                        this.pageable.total = data.totalElements;
                        this.loading = false;
                        this.activityLoading = true;
                        if(this.tableData[0]){
                            this.details(this.tableData[0])
                        }
                    }
                ).catch(res => {
                    this.loading = false;
                });
            },
            details(item){
                this.activityDetailLoading = false;
                this.activityDetail = item;
                if(item.objectType.indexOf('2')===0){
                    this.showFeedBackItem(item.id);
                }
                setTimeout(()=>{
                    this.activityDetailLoading = true;
                },200);
            },
            submit(){
                this.$http("Post",`/identity/parActivityObject/officeExecute/${this.activityDetail.id}id`,false).then((data)=>{
                    this.$message({
                        type: 'success',
                        message: '提交成功'
                    });
                    let path = `${this.apiRoot}/page?page=${this.pageable.currentPage - 1}&size=${this.pageable.pageSize}`;
                    this.loadTableData(path);
                }).catch(_=>{
                    this.$message({
                        type: 'warning',
                        message: '提交失败，请重新提交！'
                    })
                })
            },
            //显示反馈内容
            showFeedBackItem(objectId){
                this.$http('POST',`/identity/feedbackItemValue/list`,{objectId:objectId},false).then((data)=>{
                    this.feedBackItemList = data;
                });
            },
            updateFile(item, value){
                item.value = value;
                this.$http('PUT',`/identity/feedbackItemValue/${item.id}id`,item,false).then({
                })
            }
        },
        components:{
            CommonFileUpload,
            CommonImageUpload,
            PictureShot
        },
        computed:{
            picQuery() {
                return {
                    districtId: this.activityDetail.districtId,
                    activityId: this.activityDetail.activityId
                }
            },
        },
        created() {
            this.user = JSON.parse(sessionStorage.getItem('userInfo'));
            let path = `${this.apiRoot}/page?page=${this.pageable.currentPage - 1}&size=${this.pageable.pageSize}`;
            this.loadTableData(path);
        },
        filters:{
            dateFormat(val){
                return val.split("T")[0]+" "+val.split("T")[1]
            }
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

    #vd .el-checkbox__inner {
        margin-left: -100px !important;
    }
</style>
<style type="scss">
    .left-act-list {
        width: 100%;
        line-height: 24px;
        min-height: 655px !important;
    }
    .list-item {
        background-color: white;
        text-align: left;
        margin-bottom: 25px;
        display: flex;
        padding: 10px 20px;
        transition: all .4s;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        /*box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);*/
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
    .right-detail {
        font-size: 16px;
        width: 100%;
        height: 710px;
        padding: 5px 20px;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        overflow-y: scroll;
        background: white;
    }
    .right-detail::-webkit-scrollbar {
        width: 0;
    }
    .detail-row {
        margin: 20px 0;
    }
    .detail-row .el-col:nth-child(2n) {
        text-align: left;
    }
    .list-header {
        display: flex;
        height: 45px;
    }
    .detail-header {
        height: 45px;
        display: flex;
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
    .right-detail .el-button.is-circle {
        padding: 2px;
    }
    .detail-row .el-input--mini .el-input__inner {
        width: 185px !important;
    }
    @media screen and (max-width: 1430px) {
        .right-detail {
            font-size: 14px;
        }
    }
    .el-timeline .el-loading-mask {
        height: 300px;
    }

    /*.activity-management .el-textarea__inner {*/
    /*width: auto !important;*/
    /*}*/
</style>
