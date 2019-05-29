<template>

    <div>
        <div style="margin-left: 10px;margin-top:5px">

            <el-button type="primary" plain @click="add" class="self-add self-btn"></el-button>
            <el-select v-model="chooseType" placeholder="请选择" size="small" @change="select" style="margin-left: 10px">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>

        </div>

        <div style="margin-top: 50px">
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-table
                        :data="tableData"
                        stripe
                        style=""
                        v-loading="loading" border
                        :header-cell-style="{'background-color': '#fafafa','color': 'rgb(80, 80, 80)','border-bottom': '1px solid #dee2e6'}"
                        :default-sort="{prop: 'month', order: 'descending'}">
                        <el-table-column
                            prop="title"
                            label="计划名称"
                            align="center"
                            width="200px"
                            :show-overflow-tooltip="true"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="type"
                            label="任务类型"
                            align="center"
                            width="150px"
                            :show-overflow-tooltip="true">
                        </el-table-column>
                        <!--<el-table-column-->
                        <!--prop="context"-->
                        <!--label="工作要求"-->
                        <!--align="center"-->
                        <!--:show-overflow-tooltip="true"-->
                        <!--&gt;-->
                        <!--</el-table-column>-->
                        <el-table-column
                            label="截止时间"
                            prop="month"
                            sortable
                            align="center"
                            width="120px"
                            :show-overflow-tooltip="true">
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button @click="details(scope.row)" type="text" size="small">详情</el-button>
                                <!--<el-button @click="remind(scope.row)" type="text" size="small">提醒</el-button>-->
                                <!--<el-button @click="follow(scope.row)" type="text" size="small">跟踪</el-button>-->
                                <!--<el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>-->
                                <!--<el-button @click="enclosure(scope.row)" type="text" size="small">附件</el-button>-->
                                <!--<el-button @click="del(scope.row)" type="text" size="small">删除</el-button>-->
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination style="text-align: right;margin-top: 20px;" background
                                   :total="pageable.total" :current-page.sync="pageable.currentPage"
                                   :page-size.sync="pageable.pageSize"
                                   @current-change="currentChange" @size-change="sizeChange"
                                   layout="total, sizes, prev, pager, next">
                    </el-pagination>
                </el-col>
                <el-col :span="12">
                    <div style="border:1px solid #F00;">
                        <el-button type="primary" @click="lookOrEdit"v-if="lookType">编辑</el-button>
                        <el-button type="primary" @click="lookOrEdit"v-if="editType">查看</el-button>
                        <el-button type="danger" @click="del(row)">删除</el-button>
                        <el-form :model="datailForm" ref="datailForm" >
                            <el-form-item label="任务分类" prop="taskType">
                                <template v-if="lookType"><template v-if="datailForm.taskType === 'Party'">党建任务</template>
                                    <template v-if="this.datailForm.taskType === 'DistLearning'">远教任务</template></template>
                                <template v-if="editType">
                                    <el-radio-group size="medium" v-model="datailForm.taskType" style="margin-left: 10px;">
                                        <el-radio label="Party">党建任务</el-radio>
                                        <el-radio label="DistLearning">远教任务</el-radio>
                                    </el-radio-group>
                                </template>
                            </el-form-item>
                            <el-form-item label="计划名称" prop="title">
                                <template v-if="lookType">{{this.datailForm.title}}</template>
                                <template v-if="editType">
                                    <el-input v-model="datailForm.title" :disabled=disabled></el-input>
                                </template>
                            </el-form-item>
                            <el-form-item label="任务类型" prop="type">
                                <template v-if="lookType">{{this.datailForm.type}}</template>
                                <template v-if="editType">
                                    <el-input v-model="datailForm.type" :disabled=disabled></el-input>
                                </template>
                            </el-form-item>

                            <el-form-item label="工作要求" prop="context">
                                <template v-if="lookType">{{this.datailForm.context}}</template>
                                <template v-if="editType">
                                    <el-input v-model="datailForm.context" :disabled=disabled></el-input>
                                </template>
                            </el-form-item>

                            <el-form-item label="分值" prop="context">
                                <template v-if="lookType">{{this.datailForm.score}}</template>
                                <template v-if="editType">
                                    <el-input-number v-model="datailForm.score" label="分值" style="width: 200px"></el-input-number>
                                </template>
                            </el-form-item>

                            <el-form-item label="截止时间" prop="month">
                                <template v-if="lookType">{{this.datailForm.month}}</template>
                                <template v-if="editType">
                                    <el-date-picker v-model="datailForm.month"
                                                    v-if="editType"
                                                    type="date"
                                                    value-format="yyyy-MM-dd"
                                                    placeholder="选择日期">
                                    </el-date-picker>
                                </template>
                            </el-form-item>

                            <el-form-item label="提醒时间" prop="alarmTime">
                                <template v-if="lookType">{{this.datailForm.alarmTime}}</template>
                                <template v-if="editType">
                                    <el-date-picker v-model="datailForm.alarmTime"
                                                    v-if="editType"
                                                    type="date"
                                                    value-format="yyyy-MM-ddT00:00:00"
                                                    placeholder="选择日期">
                                    </el-date-picker>
                                </template>
                            </el-form-item>
                            <el-form-item label="上传文件">
                                <CommonFileUpload :value="datailForm.fileUrls" @getValue="datailForm.fileUrls = $event" :diaabled="lookType"></CommonFileUpload>
                            </el-form-item>
                            <el-form-item label="跟踪" v-if="lookType">
                                <el-table
                                    :data="trackTable"
                                    stripe
                                    style=""
                                    v-loading="loading" border
                                    :header-cell-style="{'background-color': '#fafafa','color': 'rgb(80, 80, 80)','border-bottom': '1px solid #dee2e6'}"
                                    :default-sort="{}">
                                    <el-table-column
                                        prop="tn"
                                        label="组织名称"
                                        align="center"
                                        width="150px"
                                        :show-overflow-tooltip="true"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        prop="passed"
                                        label="完成个数"
                                        align="center"
                                        width="85px"
                                        :show-overflow-tooltip="true"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        prop="waitCheck"
                                        label="待审核个数"
                                        align="center"
                                        width="85px"
                                        :show-overflow-tooltip="true"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        prop="fail"
                                        label="未完成个数"
                                        align="center"
                                        width="85px"
                                        :show-overflow-tooltip="true"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        label="完成比例"
                                        align="left"
                                        width="120px"
                                        :show-overflow-tooltip="true"
                                    >
                                        <template slot-scope="scope">
                                            <el-progress :percentage="percent(scope.row.finishRatio)" v-if="scope.row.finishRatio < 0.1"  :stroke-width="5"></el-progress>
                                            <el-progress :percentage="percent(scope.row.finishRatio)" v-else-if="scope.row.finishRatio < 1"  :stroke-width="5"></el-progress>
                                            <el-progress :percentage="percent(scope.row.finishRatio)" v-else status="success"  :stroke-width="5"></el-progress>
                                        </template>
                                    </el-table-column>
                                    <!--<el-table-column-->
                                        <!--label="工作进度"-->
                                        <!--align="center"-->
                                        <!--width="100px"-->
                                        <!--:show-overflow-tooltip="true"-->
                                    <!--&gt;-->
                                        <!--<template slot-scope="scope">-->
                                            <!--<a style="color:blue;" v-if="scope.row.status === '1'">待审核</a>-->
                                            <!--<a style="color:greenyellow;" v-if="scope.row.status === '2'">已完成</a>-->
                                            <!--<a style="color:red;" v-if="scope.row.status === '3'">审核未通过</a>-->
                                        <!--</template>-->
                                    <!--</el-table-column>-->
                                    <el-table-column
                                        label="查看详细"
                                        align="center"
                                        width="120px"
                                        :show-overflow-tooltip="true"
                                    >
                                        <template slot-scope="scope">
                                            <el-button @click="townDetailClick(scope.row)" type="text" size="small">查看</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <!--<el-pagination style="text-align: right;margin-top: 20px;" background-->
                                               <!--:total="pageableTrack.total" :current-page.sync="pageableTrack.currentPage"-->
                                               <!--:page-size.sync="pageableTrack.pageSize"-->
                                               <!--@current-change="currentChangeTrack" @size-change="sizeChangeTrack"-->
                                               <!--layout="total, sizes, prev, pager, next">-->
                                <!--</el-pagination>-->
                            </el-form-item>
                        </el-form>
                        <el-button type="primary" :loading="submitLoading" @click="detailSubmit('datailForm')" v-if="editType">确 定</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>
        <template lang="html">
            <div class="centerx">
        <el-dialog
            v-if="dialogVisible"
            :title="title"
            :visible.sync="dialogVisible"
            width="880px"
            align="left"
            :modal-append-to-body='false'
            :append-to-body="true"
            :before-close="handleClose">
            <el-form :inline="true" :model="form" ref="form" class="demo-form-inline" label-width="170px">
                <template v-if="fileType">
                    <el-form-item label="任务分类" prop="taskType">
                        <el-radio-group size="medium" v-model="form.taskType" style="margin-left: 10px;" @change="radioChoose">
                            <el-radio label="Party" >党建任务</el-radio>
                            <el-radio label="DistLearning">远教任务</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="计划名称" prop="title">
                        <el-input v-model="form.title" :disabled=disabled></el-input>
                    </el-form-item>
                    <el-form-item label="任务类型" prop="type">
                        <el-input v-model="form.type" :disabled=disabled></el-input>
                    </el-form-item>
                    <el-form-item label="工作要求" prop="context">
                        <el-input v-model="form.context" :disabled=disabled></el-input>
                    </el-form-item>
                    <el-form-item label="分值" prop="score">
                        <el-input-number v-model="form.score" label="分值" style="width: 200px"></el-input-number>
                    </el-form-item>
                    <el-form-item label="截止时间" prop="monVal">
                        <el-date-picker
                            v-model="monVal"
                            type="date"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                </template>
                <el-form-item label="上传文件" prop="fileUrls">
                    <CommonFileUpload :value="form.fileUrls" @getValue="form.fileUrls = $event"></CommonFileUpload>
                </el-form-item>
            </el-form>
            <el-form v-if="addVideo" :inline="true" :model="addVideoForm" ref="addVideoForm" class="demo-form-inline" label-width="170px">
                <el-form-item label="上传视频" prop="value4">
                    <template>
                        <el-transfer
                            v-model="value4"
                            :titles="['可选视频', '已选视频']"
                            :props="{
                                      key: 'value',
                                      label: 'desc'
                                    }"
                            :data="data3">
                        </el-transfer>
                    </template>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer  footer-position">
                <el-button type="primary" :loading="submitLoading" @click="submit('form')">确 定</el-button>
                <el-button @click="handleClose">取 消</el-button>
            </div>
        </el-dialog>
            </div>
        </template>
        <el-dialog
            v-if="townDetailVis"
            :title="townTitle + '完成情况详情'"
            :visible.sync="townDetailVis"
            width="920px"
            align="left"
            :modal-append-to-body='false'
            :append-to-body="true"
            :before-close="townDetailClose">
            <el-row :gutter="10">
                <el-col :span="12">
            <el-table
                :data="townDetailTable"
                stripe
                style="width:450px"
                v-loading="loading" border
                :header-cell-style="{'background-color': '#fafafa','color': 'rgb(80, 80, 80)','border-bottom': '1px solid #dee2e6'}"
                :default-sort="{}">
                <el-table-column
                    prop="cn"
                    label="下属组织"
                    align="center"
                    width="125px"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    label="状态"
                    align="center"
                    width="120px"
                    :show-overflow-tooltip="true"
                >
                    <template slot-scope="scope">
                    <a style="color:blue;" v-if="scope.row.sa === '1'">待审核</a>
                    <a style="color:greenyellow;" v-else-if="scope.row.sa === '2'">已完成</a>
                    <a style="color:red;" v-else>未完成</a>
                    </template>
                </el-table-column>
                <el-table-column
                    label="记录查看"
                    align="center"
                    width="205px"
                    :show-overflow-tooltip="true"
                >
                    <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-picture-outline" @click="">电视截图</el-button>
                    <el-button type="text" icon="el-icon-mobile-phone" @click="">手机截图</el-button>
                    </template>
                </el-table-column>
            </el-table>
                </el-col>
                    <el-col :span="10">
            <div style="border:1px solid #F00;">
                    <el-steps direction="vertical" >
                        <el-step title="时间" status="process">

                            <template slot="description" >
                            <vs-images hover="scale">
                                <vs-image :key="index" :src="`https://picsum.photos/400/400?image=2${index}`" v-for="(image, index) in 9" />
                                <vs-image :key="index" :src="`https://picsum.photos/400/400?image=1${index}`" v-for="(image, index) in 7" />
                            </vs-images>
                            </template>
                        </el-step>
                        <el-step title="时间" status="process"></el-step>
                        <el-step title="时间" status="process"></el-step>
                        <el-step title="时间" status="process"></el-step>
                    </el-steps>
            </div>
                    </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer  footer-position">
                <el-button @click="townDetailClose">关 闭</el-button>
            </div>
        </el-dialog>
        <!--<el-dialog v-if="remindVis"-->
                   <!--title="提醒"-->
                   <!--:visible.sync="remindVis"-->
                   <!--width="880px"-->
                   <!--align="left"-->
                   <!--:modal-append-to-body='false'-->
                   <!--:append-to-body="true"-->
                   <!--:before-close="remindHandleClose">-->
            <!--<el-form :inline="true" :model="remindForm" ref="remindForm" class="demo-form-inline" label-width="170px">-->
                <!--<el-form-item label="提醒时间" prop="alarmTime">-->
                    <!--<el-date-picker v-model="remindForm.alarmTime"-->
                                    <!--type="date"-->
                                    <!--value-format="yyyy-MM-ddT00:00:00"-->
                                    <!--placeholder="选择日期">-->
                    <!--</el-date-picker>-->
                <!--</el-form-item>-->
            <!--</el-form>-->
            <!--<div slot="footer" class="dialog-footer  footer-position">-->
                <!--<el-button type="primary" :loading="submitLoading" @click="submitAlarm('remindForm')">确 定</el-button>-->
                <!--<el-button @click="remindHandleClose">取 消</el-button>-->
            <!--</div>-->
        <!--</el-dialog>-->
    </div>

</template>

<script>

    import LookUp from '@/lookup';
    import CommonFileUpload from '@/components/FileUpLoad';
    import {tansfer} from "../../lookup/transfer";

    export default {
        name: "ParActivityRelease",
        data() {
            return {
                formColumns: [
                    {
                        name: "month",
                        type: 'string',
                        des: "属性名",
                    }, {
                        name: "context",
                        type: 'string',
                        des: "数据类型",
                    }, {
                        name: "title",
                        type: 'string',
                        des: "长度",
                    },
                ],
                addVideo:false,
                queryForm: {taskType: ''},
                queryFormTrack:{ActivityID: ''},
                //视频添加
                addVideoForm:{},
                tableData: [],
                trackTable:[],
                townDetailTable:[],
                loading: false,
                pageable: {
                    total: 0,
                    currentPage: 1,
                    pageSize: 10
                },
                pageableTrack:{
                    total: 0,
                    currentPage: 1,
                    pageSize: 10
                },
                apiRoot: '/identity/parActivity',
                apiRootTrack: 'identity/parActivityPerform',
                checkboxGroup: 'Party',
                options: [],
                chooseType: '',
                form: {taskType: 'Party',score:10},
                datailForm:{},
                disabled: false,
                dialogVisible: false,
                title: '任务发布',
                //镇详情名
                townTitle:'',
                submitLoading: false,
                Url: '',
                fileType: true,
                //各镇详细信息显示
                townDetailVis:false,
                //镇ID（detail）
                townAcId:'',
                //各镇详细信息
                townDetailForm:{},
                townSubmitLoading:false,
                // remindVis: false,
                // remindForm: {},
                //行数据
                row: {},
                //查看模式
                lookType: true,
                //修改模式
                editType: false,
                //截止日期（month冲突）
                monVal:''
            }
        },
        watch: {
            checkboxGroup: {
                handler: function (newVal, oldVal) {
                    console.log(newVal)
                }
            }
        },
        components: {
            CommonFileUpload
        },
        methods: {
            // remindHandleClose(done) {
            //     this.$confirm('确认关闭？')
            //         .then(_ => {
            //             this.remindForm = {};
            //             this.$refs['remindForm'].resetFields();
            //             this.remindVis = false;
            //             done();
            //         })
            //         .catch(_ => {
            //         });
            // },
            radioChoose(val){
                if(val == 'Party'){
                    this.addVideo = false
                }else {
                    this.addVideo = true
                }

            },

            //关闭镇详情
            townDetailClose(){
                this.$confirm('确认关闭？')
                    .then(_ => {
                        this.townDetailForm = {};
                        this.townDetailVis = false;
                        done();
                    })
                    .catch(_ => {
                    });
            },
            //镇详情
            townDetailClick(val){
                this.townTitle = val.tn
                let path = `${this.apiRootTrack}/${this.townAcId}&${val.tn}townDetailList`;
                this.loadTownTable(path,{});

                this.townDetailVis = true
            },
            handleClose() {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        this.form = {taskType: 'Party'};
                        this.$refs['form'].resetFields();
                        this.disabled = false;
                        this.dialogVisible = false;
                        done();
                    })
                    .catch(_ => {
                    });
            },
            currentChange(value) {
                let path = `${this.apiRoot}/page?page=${value - 1}&size=${this.pageable.pageSize}`;
                this.loadTableData(path)
            },
            sizeChange(value) {
                let path = `${this.apiRoot}/page?page=0&size=${value}`;
                this.loadTableData(path)
            },
            // currentChangeTrack(value) {
            //     let path = `${this.apiRootTrack}/page?page=${value - 1}&size=${this.pageableTrack.pageSize}`;
            //     this.loadTrackTable(path,this.queryFormTrack)
            // },
            // sizeChangeTrack(value) {
            //     let path = `$${this.apiRootTrack}/page?page=0&size=${value}`;
            //     this.loadTrackTable(path,this.queryFormTrack)
            // },
            // 获取表格数据
            loadTableData(path) {
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
            //跟踪数据
            loadTrackTable(path,query){
                this.$http('POST', path, query, false).then(
                    data => {
                        this.trackTable = data;
                        this.pageableTrack.total = data.totalElements;
                    }
                ).catch(res => {
                    console.log(res)
                    this.$message({
                        type: 'warning',
                        message: '跟踪信息拉取失败'
                    })
                });
            },
            //镇详情数据
            loadTownTable(path,query){
                this.$http('POST', path, query, false).then(
                    data => {
                        this.townDetailTable = data;
                    }
                ).catch(res => {
                    console.log(res)
                    this.$message({
                        type: 'warning',
                        message: '信息拉取失败'
                    })
                });
            },
            handleSelectOptions() {
                this.options = LookUp ['Mission']
            },
            //任务类型选择
            select(val) {
                let path = `${this.apiRoot}/page?page=${this.pageable.currentPage - 1}&size=${this.pageable.pageSize}`;
                this.queryForm.taskType = val
                this.loadTableData(path);
            },
            //详情
            details(val) {
                this.row = val
                this.datailForm = val
                var fileStr = ''
                for (var i in val.urls) {
                    if (i == val.urls.length - 1) {
                        fileStr = fileStr + val.urls[i].url
                    } else {
                        fileStr = fileStr + val.urls[i].url + ','
                    }
                }

                this.datailForm.fileUrls = fileStr
                this.lookType = true
                this.editType = false
                let path = `${this.apiRootTrack}/${val.id}perList`;
                this.loadTrackTable(path,{});
                this.townAcId = val.id

            },
            //编辑查看
            lookOrEdit(){
                if(this.lookType == true && this.editType == false){
                    this.lookType = false
                    this.editType = true
                }else{
                    this.lookType = true
                    this.editType = false
                }
            },
            //转换百分比
            percent(val){
                var s = val*100 + ""
                var ss = Math.round(s*100)/100
                return ss
            },
            //提醒确认
            // submitAlarm(form) {
            //     this.$refs[form].validate((valid) => {
            //         if (valid) {
            //             this.submitLoading = false
            //             this.$http("Put", this.apiRoot + `/${this.remindForm.id}idAlarm`, this.remindForm, false).then((data) => {
            //                 this.$message({
            //                     type: 'success',
            //                     message: '提醒设定成功'
            //                 })
            //                 this.$refs[form].resetFields();
            //                 this.remindForm = {}
            //                 this.remindVis = false
            //             }).catch(
            //                 () => {
            //                     this.submitLoading = true
            //                     this.$message({
            //                         type: 'error',
            //                         message: '提醒设定失败'
            //                     })
            //                 }
            //             )
            //         } else {
            //         }
            //     })
            // },
            edit(val) {
                this.dialogVisible = true
                this.form = val
                var fileStr = ''
                for (var i in val.urls) {
                    if (i == val.urls.length - 1) {
                        fileStr = fileStr + val.urls[i].url
                    } else {
                        fileStr = fileStr + val.urls[i].url + ','
                    }
                }
               // console.log(fileStr, 1)
                this.form.fileUrls = fileStr
            },
            enclosure(val) {
                this.dialogVisible = true
                this.form = val
                var fileStr = ''
                for (var i in val.urls) {
                    if (i == val.urls.length - 1) {
                        fileStr = fileStr + val.urls[i].url
                    } else {
                        fileStr = fileStr + val.urls[i].url + ','
                    }
                }
                this.form.fileUrls = fileStr
                this.fileType = false
            },
            del(val) {
                this.$confirm('确认删除？')
                    .then(_ => {
                        console.log(val)
                        this.$http('Delete', `${this.apiRoot}/${val.id}ids`).then(_ => {
                            let path = `${this.apiRoot}/page?page=${this.pageable.currentPage - 1}&size=${this.pageable.pageSize}`;
                            this.queryForm.taskType = val.taskType
                            this.loadTableData(path);
                        });
                    })
                    .catch(_ => {
                    });
            },
            add() {
                this.dialogVisible = true
                var type = this.queryForm.taskType
                this.form = {taskType:'Party', score : 10}
                this.$nextTick(() => {
                    this.$refs['form'].resetFields();
                })

            },
            submit(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.submitLoading = false
                        this.form.districtID = JSON.parse(sessionStorage.getItem('userInfo')).sysDistrict.districtId
                        this.form.status = '1'
                        this.form.month = this.monVal
                        this.form.releaseTime = new Date().Format("yyyy-MM-ddTHH:mm:ss");
                        if (this.form.fileUrls) {
                            var ss = this.form.fileUrls.toString().split(",")
                            this.form.fileUrls = ss
                        }
                        console.log(this.form)
                        this.$http('Post', '/identity/parActivity/', this.form, false).then(
                            (data) => {
                                this.$message({
                                    type: 'success',
                                    message: '上传成功'
                                })
                                this.$refs[form].resetFields();
                                let path = `${this.apiRoot}/page?page=${this.pageable.currentPage - 1}&size=${this.pageable.pageSize}`;
                                this.queryForm.taskType = this.form.taskType
                                let type = this.form.taskType
                                this.loadTableData(path);
                                this.form = {taskType: type}
                                this.dialogVisible = false

                            }).catch(res => {
                            this.dialogVisible = true;
                            this.$message({
                                type: 'error',
                                message: '上传文件失败'
                            });
                            return false;
                        });
                    } else {

                    }
                })
            },
            detailSubmit(form){
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.datailForm.districtID = JSON.parse(sessionStorage.getItem('userInfo')).sysDistrict.districtId
                        var beforeUrl = this.datailForm.fileUrls
                        if (this.datailForm.fileUrls) {
                            var ss = this.datailForm.fileUrls.toString().split(",")
                            this.datailForm.fileUrls = ss
                        }
                        this.$http('Post', '/identity/parActivity/', this.datailForm, false).then(
                            (data) => {
                                this.$message({
                                    type: 'success',
                                    message: '修改成功'
                                })
                                let path = `${this.apiRoot}/page?page=${this.pageable.currentPage - 1}&size=${this.pageable.pageSize}`;
                                this.loadTableData(path);

                                this.datailForm.fileUrls = beforeUrl
                                this.lookType = true
                                this.editType = false
                            }).catch(res => {
                            this.$message({
                                type: 'error',
                                message: '修改失败'
                            });
                            return false;
                        });
                    } else {

                    }
                })
            }
        },
        created() {
            this.handleSelectOptions();
            let path = `${this.apiRoot}/page?page=${this.pageable.currentPage - 1}&size=${this.pageable.pageSize}`;
            this.loadTableData(path);
        }
    }
</script>

<style>
    .footer-position {
        margin-right: 86px;
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
</style>
