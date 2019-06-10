<template>
    <section class="activity-management">
        <div style="width: 100%;margin: 0 auto">
            <el-row :gutter="60" type="flex" justify="center">
                <el-col :span="12" :xl="{span: 12}">
                    <div class="list-header">
                        任务列表
                        <el-select v-model="chooseType" placeholder="请选择" size="small" @change="select" style="margin-left: 10px">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="left-act-list" >
                            <transition name="translate" mode="out-in">
                                <div v-show="activityLoading">
                                    <div class="list-item" v-for="(item, index) in tableData" :key="item.id" @click="details(item)">
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
                                        <div class="detail">
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
                </el-col>
                <el-col :span="12" :xl="{span: 12}">
                    <div class="detail-header">
                        任务详情
                        <el-select v-model="chooseType" placeholder="请选择" size="small" @change="select" style="margin-left: 10px">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="right-detail">
                        <!--<el-button type="primary" @click="lookOrEdit" v-if="lookType">编辑</el-button>-->
                        <!--<el-button type="primary" @click="lookOrEdit" v-if="editType">查看</el-button>-->
                        <!--<el-button type="danger" @click="del(row)">删除</el-button>-->



                        <!--<el-form :model="detailForm" ref="detailForm">-->
                            <!--<el-form-item label="任务分类" prop="taskType">-->
                                <!--<template v-if="lookType">-->
                                    <!--<template v-if="detailForm.taskType === 'Party'">党建任务</template>-->
                                    <!--<template v-if="detailForm.taskType === 'DistLearning'">远教任务</template>-->
                                <!--</template>-->
                                <!--<template v-if="editType">-->
                                    <!--<el-radio-group size="medium" v-model="detailForm.taskType"-->
                                                    <!--style="margin-left: 10px;">-->
                                        <!--<el-radio label="Party">党建任务</el-radio>-->
                                        <!--<el-radio label="DistLearning">远教任务</el-radio>-->
                                    <!--</el-radio-group>-->
                                <!--</template>-->
                            <!--</el-form-item>-->
                            <!--<el-form-item label="计划名称" prop="title">-->
                                <!--<template v-if="lookType">{{this.detailForm.title}}</template>-->
                                <!--<template v-if="editType">-->
                                    <!--<el-input v-model="detailForm.title" :disabled=disabled></el-input>-->
                                <!--</template>-->
                            <!--</el-form-item>-->
                            <!--<el-form-item label="任务类型" prop="type">-->
                                <!--<template v-if="lookType">{{this.detailForm.type}}</template>-->
                                <!--<template v-if="editType">-->
                                    <!--<el-input v-model="detailForm.type" :disabled=disabled></el-input>-->
                                <!--</template>-->
                            <!--</el-form-item>-->

                            <!--<el-form-item label="工作要求" prop="context">-->
                                <!--<template v-if="lookType">{{this.detailForm.context}}</template>-->
                                <!--<template v-if="editType">-->
                                    <!--<el-input v-model="detailForm.context" :disabled=disabled></el-input>-->
                                <!--</template>-->
                            <!--</el-form-item>-->

                            <!--<el-form-item label="分值" prop="context">-->
                                <!--<template v-if="lookType">{{this.detailForm.score}}</template>-->
                                <!--<template v-if="editType">-->
                                    <!--<el-input-number v-model="detailForm.score" label="分值"-->
                                                     <!--style="width: 200px"></el-input-number>-->
                                <!--</template>-->
                            <!--</el-form-item>-->

                            <!--<el-form-item label="截止时间" prop="month">-->
                                <!--<template v-if="lookType">{{this.detailForm.month}}</template>-->
                                <!--<template v-if="editType">-->
                                    <!--<el-date-picker v-model="detailForm.month"-->
                                                    <!--v-if="editType"-->
                                                    <!--type="date"-->
                                                    <!--value-format="yyyy-MM-dd"-->
                                                    <!--placeholder="选择日期">-->
                                    <!--</el-date-picker>-->
                                <!--</template>-->
                            <!--</el-form-item>-->

                            <!--<el-form-item label="提醒时间" prop="alarmTime">-->
                                <!--<template v-if="lookType">{{this.detailForm.alarmTime}}</template>-->
                                <!--<template v-if="editType">-->
                                    <!--<el-date-picker v-model="detailForm.alarmTime"-->
                                                    <!--v-if="editType"-->
                                                    <!--type="date"-->
                                                    <!--value-format="yyyy-MM-ddT00:00:00"-->
                                                    <!--placeholder="选择日期">-->
                                    <!--</el-date-picker>-->
                                <!--</template>-->
                            <!--</el-form-item>-->
                            <!--<el-form-item label="上传文件">-->
                                <!--<CommonFileUpload :value="detailForm.fileUrls" @getValue="detailForm.fileUrls = $event"-->
                                                  <!--:diaabled="lookType"></CommonFileUpload>-->
                            <!--</el-form-item>-->
                            <!--<el-form-item label="上传视频" prop="video" v-if="detailForm.taskType === 'DistLearning'"-->
                                          <!--size="mini">-->
                                <!--<template v-if="lookType">-->
                                    <!--<vs-chip v-for="items in detailForm.video" :key="items.name">-->
                                        <!--<vs-avatar icon="send"/>-->
                                        <!--{{items.name}}-->
                                    <!--</vs-chip>-->
                                <!--</template>-->
                                <!--<template v-if="editType" id="vd">-->
                                    <!--<el-transfer-->
                                        <!--filterable-->
                                        <!--v-model="detailForm.video"-->
                                        <!--:titles="['可选视频', '已选视频']"-->
                                        <!--:props="{-->
                                      <!--key: 'value',-->
                                      <!--label: 'desc'-->
                                    <!--}"-->
                                        <!--:data="addVideoList">-->
                                    <!--</el-transfer>-->
                                <!--</template>-->
                            <!--</el-form-item>-->
                            <!--<el-form-item label="跟踪" v-if="lookType">-->
                                <!--<el-table-->
                                    <!--:data="trackTable"-->
                                    <!--stripe-->
                                    <!--style=""-->
                                    <!--v-loading="loading" border-->
                                    <!--:header-cell-style="{'background-color': '#fafafa','color': 'rgb(80, 80, 80)','border-bottom': '1px solid #dee2e6'}"-->
                                    <!--:default-sort="{}">-->
                                    <!--<el-table-column-->
                                        <!--prop="tn"-->
                                        <!--label="组织名称"-->
                                        <!--align="center"-->
                                        <!--width="150px"-->
                                        <!--:show-overflow-tooltip="true"-->
                                    <!--&gt;-->
                                    <!--</el-table-column>-->
                                    <!--<el-table-column-->
                                        <!--prop="passed"-->
                                        <!--label="完成个数"-->
                                        <!--align="center"-->
                                        <!--width="85px"-->
                                        <!--:show-overflow-tooltip="true"-->
                                    <!--&gt;-->
                                    <!--</el-table-column>-->
                                    <!--<el-table-column-->
                                        <!--prop="waitCheck"-->
                                        <!--label="待审核个数"-->
                                        <!--align="center"-->
                                        <!--width="85px"-->
                                        <!--:show-overflow-tooltip="true"-->
                                    <!--&gt;-->
                                    <!--</el-table-column>-->
                                    <!--<el-table-column-->
                                        <!--prop="fail"-->
                                        <!--label="未完成个数"-->
                                        <!--align="center"-->
                                        <!--width="85px"-->
                                        <!--:show-overflow-tooltip="true"-->
                                    <!--&gt;-->
                                    <!--</el-table-column>-->
                                    <!--<el-table-column-->
                                        <!--label="完成比例"-->
                                        <!--align="left"-->
                                        <!--width="120px"-->
                                        <!--:show-overflow-tooltip="true"-->
                                    <!--&gt;-->
                                        <!--<template slot-scope="scope">-->
                                            <!--<el-progress :percentage="percent(scope.row.finishRatio)"-->
                                                         <!--v-if="scope.row.finishRatio < 0.1"-->
                                                         <!--:stroke-width="5"></el-progress>-->
                                            <!--<el-progress :percentage="percent(scope.row.finishRatio)"-->
                                                         <!--v-else-if="scope.row.finishRatio < 1"-->
                                                         <!--:stroke-width="5"></el-progress>-->
                                            <!--<el-progress :percentage="percent(scope.row.finishRatio)" v-else-->
                                                         <!--status="success" :stroke-width="5"></el-progress>-->
                                        <!--</template>-->
                                    <!--</el-table-column>-->
                                    <!--&lt;!&ndash;<el-table-column&ndash;&gt;-->
                                    <!--&lt;!&ndash;label="工作进度"&ndash;&gt;-->
                                    <!--&lt;!&ndash;align="center"&ndash;&gt;-->
                                    <!--&lt;!&ndash;width="100px"&ndash;&gt;-->
                                    <!--&lt;!&ndash;:show-overflow-tooltip="true"&ndash;&gt;-->
                                    <!--&lt;!&ndash;&gt;&ndash;&gt;-->
                                    <!--&lt;!&ndash;<template slot-scope="scope">&ndash;&gt;-->
                                    <!--&lt;!&ndash;<a style="color:blue;" v-if="scope.row.status === '1'">待审核</a>&ndash;&gt;-->
                                    <!--&lt;!&ndash;<a style="color:greenyellow;" v-if="scope.row.status === '2'">已完成</a>&ndash;&gt;-->
                                    <!--&lt;!&ndash;<a style="color:red;" v-if="scope.row.status === '3'">审核未通过</a>&ndash;&gt;-->
                                    <!--&lt;!&ndash;</template>&ndash;&gt;-->
                                    <!--&lt;!&ndash;</el-table-column>&ndash;&gt;-->
                                    <!--<el-table-column-->
                                        <!--label="查看详细"-->
                                        <!--align="center"-->
                                        <!--width="120px"-->
                                        <!--:show-overflow-tooltip="true"-->
                                    <!--&gt;-->
                                        <!--<template slot-scope="scope">-->
                                            <!--<el-button @click="townDetailClick(scope.row)" type="text" size="small">查看-->
                                            <!--</el-button>-->
                                        <!--</template>-->
                                    <!--</el-table-column>-->
                                <!--</el-table>-->
                                <!--&lt;!&ndash;<el-pagination style="text-align: right;margin-top: 20px;" background&ndash;&gt;-->
                                <!--&lt;!&ndash;:total="pageableTrack.total" :current-page.sync="pageableTrack.currentPage"&ndash;&gt;-->
                                <!--&lt;!&ndash;:page-size.sync="pageableTrack.pageSize"&ndash;&gt;-->
                                <!--&lt;!&ndash;@current-change="currentChangeTrack" @size-change="sizeChangeTrack"&ndash;&gt;-->
                                <!--&lt;!&ndash;layout="total, sizes, prev, pager, next">&ndash;&gt;-->
                                <!--&lt;!&ndash;</el-pagination>&ndash;&gt;-->
                            <!--</el-form-item>-->

                        <!--</el-form>-->
                        <!--<el-button type="primary" :loading="submitLoading" @click="detailSubmit('detailForm')"-->
                                   <!--v-if="editType">确 定-->
                        <!--</el-button>-->
                    <el-row class="detail-row">
                        <el-col :span="5" :xl="{span: 4, offset: 2}">任务名称：</el-col>
                        <el-col :span="5">&nbsp;{{detailForm.title}}</el-col>
                        <el-col :span="4" :xl="{span: 4, offset: 2}">任务类型:</el-col>
                        <el-col :span="5">&nbsp;{{detailForm.type}}</el-col>
                    </el-row>
                    <el-row class="detail-row">
                        <el-col :span="5" :xl="{span: 4, offset: 2}">截止日期：</el-col>
                        <el-col :span="5">&nbsp;{{detailForm.month}}</el-col>
                        <el-col :span="4" :offset="1" :xl="{span: 4, offset: 2}">提醒时间:</el-col>
                        <el-col :span="5">&nbsp;{{detailForm.alarmTime || '暂无'}}</el-col>
                    </el-row>
                    <el-row class="detail-row">
                        <el-col :span="5" :xl="{span: 4, offset: 2}">任务分值：</el-col>
                        <el-col :span="4" style="color: red;font-weight: bold">&nbsp;{{detailForm.score || 0}}分</el-col>
                    </el-row>
                    <el-row class="detail-row">
                        <el-col :span="5"  :xl="{span: 4, offset: 2}">工作要求：</el-col>
                        <el-col :span="15">&nbsp;{{detailForm.context}}</el-col>
                    </el-row>
                    <el-row class="detail-row">
                        <el-col :span="5"  :xl="{span: 4, offset: 2}">附件清单：</el-col>
                        <el-col :span="15">
                            <CommonFileUpload :value="detailForm.fileUrls" @getValue="detailForm.fileUrls = $event" :disabled="lookType"></CommonFileUpload>
                        </el-col>
                    </el-row>




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
		  <el-radio-group size="medium" v-model="form.taskType" style="margin-left: 10px;"
						  @change="radioChoose">
			  <el-radio label="Party">党建任务</el-radio>
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
	  <CommonFileUpload :value="form.fileUrls"
						@getValue="form.fileUrls = $event"></CommonFileUpload>
  </el-form-item>
  <el-form-item label="上传视频" prop="video" v-if="addVideo">
	  <template>
		  <el-transfer
			  filterable
			  v-model="form.video"
			  :titles="['可选视频', '已选视频']"
			  :props="{
				key: 'value',
				label: 'desc'
			  }"
			  :data="addVideoList">
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

  <el-timeline>
	  <el-timeline-item
		  v-for="(activity, index) in activities"
		  :key="index"
		  :timestamp="activity.timestamp"
		  :placement="activity.placement">
		  <template>
			  <vs-images hover="scale">
				  <vs-image :key="index" :src="`https://picsum.photos/400/400?image=1${index}`"
							v-for="(image, index) in 7"/>
			  </vs-images>
		  </template>
	  </el-timeline-item>
  </el-timeline>
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
    </section>

</template>

<script>

    import LookUp from '@/lookup';
    import CommonFileUpload from '@/components/FileUpLoad';
    import {tansfer} from "../../lookup/transfer";

    export default {
        name: "ParActivityManage",
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
                addVideo: false,
                queryForm: {taskType: ''},
                queryFormTrack: {ActivityID: ''},
                //视频添加
                addVideoList: [],
                //视频修改
                editVideoForm: {},
                editVideoList: [],
                tableData: [],
                trackTable: [],
                townDetailTable: [],
                loading: false,
                pageable: {
                    total: 0,
                    currentPage: 1,
                    pageSize: 7
                },
                pageableTrack: {
                    total: 0,
                    currentPage: 1,
                    pageSize: 10
                },
                apiRoot: '/identity/parActivity',
                apiRootTrack: 'identity/parActivityPerform',
                checkboxGroup: 'Party',
                options: [],
                chooseType: '',
                form: {taskType: 'Party', score: 10},
                detailForm: {},
                detailFormNext: {},
                disabled: false,
                dialogVisible: false,
                title: '任务发布',
                //镇详情名
                townTitle: '',
                submitLoading: false,
                Url: '',
                fileType: true,
                //各镇详细信息显示
                townDetailVis: false,
                //镇ID（detail）
                townAcId: '',
                //各镇详细信息
                townDetailForm: {},
                townSubmitLoading: false,
                // remindVis: false,
                // remindForm: {},
                //行数据
                row: {},
                //查看模式
                lookType: true,
                //修改模式
                editType: false,
                //截止日期（month冲突）
                monVal: '',
                //时间线
                activities: [{
                    content: '支持使用图标',
                    timestamp: '2018-04-12 20:46',
                    size: 'large',
                    type: 'primary',
                    icon: 'el-icon-more',
                    placement: "top"
                }, {
                    content: '支持自定义颜色',
                    timestamp: '2018-04-03 20:46',
                    color: '#0bbd87',
                    placement: "top"
                }, {
                    content: '支持自定义尺寸',
                    timestamp: '2018-04-03 20:46',
                    size: 'large',
                    placement: "top"
                }, {
                    content: '默认样式的节点',
                    timestamp: '2018-04-03 20:46',
                    placement: "top"
                }],
                activityLoading: false
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
            //计算隔天
            datedifference(sDate1) {    //sDate1和sDate2是2006-12-18格式
                var dateSpan,
                    iDays;
                sDate1 = Date.parse(sDate1);
                var sDate2 = new Date().Format("yyyy-MM-dd");
                sDate2 = Date.parse(sDate2);
                dateSpan = sDate1 - sDate2;
                if(dateSpan >= 0){
                    iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
                    return iDays
                }else{
                    return -1
                }

            },
            //选择radio时触发
            radioChoose(val) {
                if (val == 'Party') {
                    this.addVideo = false
                } else {
                    this.addVideo = true
                    this.loadVideo();
                }

            },
            //加载视频数据
            loadVideo() {
                this.$http('GET', '/identity/distLearningActivityVideo/videoList', {}, false).then(
                    (data) => {
                        this.addVideoList = data.map(item => {
                            return {
                                desc: item.name,
                                value: '{"name":"' + item.name + '","lengthOfTime":"' + item.length + '","videoUrl":"' + item.playUrl + '","videoCover":"' + item.posterUrl + '"}'
                            }
                        })

                    }
                ).catch((res) => {
                    console.log(res)
                    this.$message({
                        type: 'warning',
                        message: '视频信息拉取失败'
                    })
                })
            },
            //关闭镇详情
            townDetailClose() {
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
            townDetailClick(val) {
                this.townTitle = val.tn
                let path = `${this.apiRootTrack}/${this.townAcId}&${val.tn}townDetailList`;
                this.loadTownTable(path, {});

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
            //跟踪数据
            loadTrackTable(path, query) {
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
            loadTownTable(path, query) {
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
                this.detailForm = JSON.parse(JSON.stringify(val))
                this.detailFormNext = JSON.parse(JSON.stringify(val))
                let fileStr = '';
                for (let i in val.urls) {
                    if (i == val.urls.length - 1) {
                        fileStr = fileStr + val.urls[i].url
                    } else {
                        fileStr = fileStr + val.urls[i].url + ','
                    }
                }

                this.detailForm.fileUrls = fileStr
                this.lookType = true
                this.editType = false
                let path = `${this.apiRootTrack}/${val.id}perList`;
                this.loadTrackTable(path, {});
                this.townAcId = val.id

            },
            //编辑查看
            lookOrEdit() {
                if (this.lookType == true && this.editType == false) {
                    this.lookType = false
                    this.editType = true
                    this.loadVideo();
                    var data = this.detailForm.video
                    this.detailForm.video = data.map(item => {
                        return '{"name":"' + item.name + '","lengthOfTime":"' + item.lengthOfTime + '","videoUrl":"' + item.videoUrl + '","videoCover":"' + item.videoCover + '"}'
                    })
                    console.log(this.detailForm, 2)
                } else {
                    console.log(this.detailFormNext)
                    this.detailForm = JSON.parse(JSON.stringify(this.detailFormNext))
                    console.log(this.detailForm)
                    this.lookType = true
                    this.editType = false
                }
            },
            //转换百分比
            percent(val) {
                var s = val * 100 + ""
                var ss = Math.round(s * 100) / 100
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
                this.form = {taskType: 'Party', score: 10}
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
                        var video = this.form.video
                        var videoList = []
                        video.forEach(item => {
                            videoList.push(JSON.parse(item))
                        })
                        this.form.video = videoList
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
                            console.log(res)
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
            detailSubmit(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.detailForm.districtID = JSON.parse(sessionStorage.getItem('userInfo')).sysDistrict.districtId
                        var beforeUrl = this.detailForm.fileUrls
                        if (this.detailForm.fileUrls) {
                            var ss = this.detailForm.fileUrls.toString().split(",")
                            this.detailForm.fileUrls = ss
                        }
                        var video = this.detailForm.video
                        var videoList = []
                        video.forEach(item => {
                            videoList.push(JSON.parse(item))
                        })
                        this.detailForm.video = videoList
                        console.log(this.detailForm.video)
                        this.$http('Post', '/identity/parActivity/', this.detailForm, false).then(
                            (data) => {
                                this.$message({
                                    type: 'success',
                                    message: '修改成功'
                                })
                                let path = `${this.apiRoot}/page?page=${this.pageable.currentPage - 1}&size=${this.pageable.pageSize}`;
                                this.loadTableData(path);

                                this.detailForm.fileUrls = beforeUrl
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
            },
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
        /*background-color: rgb(250, 250, 250);*/
        padding: 5px 20px;
        line-height: 24px;
        min-height: 668px;
    }
    .list-item {
        background-color: white;
        text-align: left;
        margin: 10px 0;
        display: flex;
        padding: 14px 20px;
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
        height: 100%;
        padding: 5px 20px;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        margin: 15px 0;
    }
    .detail-row {
        margin: 20px 0;
    }
    .detail-row .el-col:nth-child(2n) {
        text-align: left;
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

