<template>
    <section class="activity-management">
        <div style="width: calc(100% - 10px);margin: 5px auto">
            <el-row type="flex">
                <div style="width: 2%"></div>
                <div style="width: 44.5%">
                    <div class="list-header">
                        <h1>{{ taskTitle }}</h1>
                        <!--<el-select v-model="chooseType" placeholder="请选择" size="small" @change="select" style="margin-left: 10px">-->
                            <!--<el-option-->
                                <!--v-for="item in options"-->
                                <!--:key="item.value"-->
                                <!--:label="item.label"-->
                                <!--:value="item.value">-->
                            <!--</el-option>-->
                        <!--</el-select>-->
                        <el-radio-group v-model="radioName" @change="loadByObjectType" v-if="this.user.districtId==='01'">
                            <el-radio-button label="农村"></el-radio-button>
                            <el-radio-button label="机关"></el-radio-button>
                        </el-radio-group>
                        <div style="flex: 1;text-align: right">
                            <vs-button style="float: right" color="primary" type="flat" icon="assignment" @click="loadByStatus('PLAN')">计划中</vs-button>
                            <vs-button style="float: right" color="success" type="flat" icon="alarm" @click="loadByStatus('ACTIVE')">进行中</vs-button>
                        </div>
                    </div>
                    <div class="left-act-list" >
                            <transition name="translate" mode="out-in">
                                <div v-show="activityLoading">
                                    <div class="list-item" v-for="(item, index) in tableData" :key="item.id" @click="details(item)">
                                        <div class="status">
                                            <img v-show="item.taskType === 'Party'" style="position: relative;left: 5px;top:13px" src="/static/img/party-logo.png" alt="党建logo"/>
                                            <img v-show="item.taskType === 'DistLearning'" style="position: relative;left: 5px;top:13px" src="/static/img/learning-logo.png" alt="远教logo"/>
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
                                            <template v-if="roleCode === 'COUNTRY_SIDE_ACTOR'">
                                                <el-tag v-if="item.status === '2'" type="success" effect="dark"  name="已完成">已完成</el-tag>
                                                <el-tag v-else-if="item.status === '1'" type="warning" effect="dark"  name="待审核">待审核</el-tag>
                                                <template v-else>
                                                    <template v-if="calcLeftDays(item.month)">
                                                        <icon name="miaobiao" scale="3"></icon>
                                                        <p><span>{{calcLeftDays(item.month)}}</span>天</p>
                                                    </template>
                                                    <template v-else>
                                                        <el-tag type="danger" effect="dark"  name="未完成">未完成</el-tag>
                                                    </template>
                                                </template>
                                            </template>
                                            <template v-else>
                                                <template v-if="calcLeftDays(item.month) >= 0">
                                                    <icon name="miaobiao" scale="3"></icon>
                                                    <p><span>{{calcLeftDays(item.month)}}</span>天</p>
                                                </template>
                                                <template v-else>
                                                    <el-tag type="success" effect="dark"  name="已完成">已完成</el-tag>
                                                </template>
                                            </template>
                                        </div>
                                        <div class="processing">
                                            <template v-if="roleCode === 'COUNTRY_SIDE_ACTOR'">
                                                <el-progress :type="progressType" :width="50" :percentage="((item.status || 0)/2) * 100" :stroke-width="5"></el-progress>
                                            </template>
                                            <template v-else>
                                                <el-progress :type="progressType" :width="50" v-if="(item[TownCodeKey[sysDistrict.districtId]] || 0) < 0.3" :percentage="Math.round((item[TownCodeKey[sysDistrict.districtId]] || 0) * 1000)/10" color="#951200" :stroke-width="5"></el-progress>
                                                <el-progress :type="progressType" :width="50" v-else-if="(item[TownCodeKey[sysDistrict.districtId]] || 0) < 0.7" :percentage="Math.round((item[TownCodeKey[sysDistrict.districtId]] || 0) * 1000)/10" color="#e6a23c" :stroke-width="5"></el-progress>
                                                <el-progress :type="progressType" :width="50" v-else-if="(item[TownCodeKey[sysDistrict.districtId]] || 0) < 1" :percentage="Math.round((item[TownCodeKey[sysDistrict.districtId]] || 0) * 1000)/10" color="#0c89c2" :stroke-width="5"></el-progress>
                                                <el-progress :type="progressType" :width="50" v-else-if="(item[TownCodeKey[sysDistrict.districtId]] || 0) === 1" :percentage="Math.round((item[TownCodeKey[sysDistrict.districtId]] || 0) * 1000)/10" color="#67c23a" :stroke-width="5"></el-progress>
                                                <span v-else>ERROR</span>
                                            </template>
                                        </div>
                                        <!--<div class="detail">-->
                                            <!--<div style="border: 1px solid #444; width: 30px;height: 30px; border-radius: 30px">-->
                                                <!--<icon name="more" scale="2" ></icon>-->
                                            <!--</div>-->
                                        <!--</div>-->
                                    </div>
                                </div>
                            </transition>
                            <el-pagination style="text-align: right;" background
                                           :page-count="3"
                                           :page-sizes="[5, 7, 10]"
                                           :total="pageable.total" :current-page.sync="pageable.currentPage"
                                           :page-size.sync="pageable.pageSize"
                                           @current-change="currentChange" @size-change="sizeChange"
                                           layout="total, sizes, prev, pager, next">
                            </el-pagination>
                        </div>
                </div>
                <div style="width: 3%"></div>
                <div style="width: 48.5%">
                    <div class="detail-header">
                        <h1>任务详情</h1>
                    </div>
                    <transition name="el-zoom-in-center" mode="out-in">
                        <div class="right-detail" v-if="detailLoading">
                            <el-row style="margin: 10px 0 -20px 0" v-show="roleCode === 'CITY_LEADER'">
                                <el-button style="float: right;color: #F56C6C" type="text" icon="el-icon-delete" @click="del(row)">删除</el-button>
                                <el-button :disabled="!editType" style="float: right;margin-right: 10px;"  type="text" icon="el-icon-receiving" :loading="submitLoading" @click="detailSubmit('detailForm')">保存</el-button>
                                <el-button style="float: right;margin-right: 3px" type="text" icon="el-icon-edit" @click="lookOrEdit">编辑</el-button>
                            </el-row>
                            <el-row class="detail-row">
                                <el-col :span="4">任务名称：</el-col>
                                <el-col :span="8" style="color: #25252582">
                                    <template v-if="lookType">&nbsp;{{detailForm.title}}</template>
                                    <template v-if="editType">
                                        <el-input v-model="detailForm.title" :disabled="disabled"></el-input>
                                    </template>
                                </el-col>
                                <el-col :span="4">任务类型：</el-col>
                                <el-col :span="6" style="color: #25252582">&nbsp;{{detailForm.type}}</el-col>
                                <el-col :span="2"></el-col>
                            </el-row>
                            <el-row class="detail-row">
                                <el-col :span="4">截止日期：</el-col>
                                <el-col :span="8" style="color: #25252582">
                                    <template v-if="lookType">&nbsp;{{new Date(detailForm.month).toLocaleDateString()}}</template>
                                    <template v-if="editType">
                                        <el-date-picker v-model="detailForm.month"
                                                        v-if="editType"
                                                        type="date"
                                                        value-format="yyyy-MM-dd"
                                                        placeholder="选择日期">
                                        </el-date-picker>
                                    </template>
                                </el-col>
                                <el-col :span="4">提醒时间：</el-col>
                                <el-col :span="6" style="color: #25252582">
                                    <template v-if="lookType">&nbsp;{{detailForm.alarmTime ? new Date(detailForm.alarmTime).toLocaleDateString() : '暂无'}}</template>
                                    <template v-if="editType">
                                        <el-date-picker v-model="detailForm.alarmTime"
                                        v-if="editType"
                                        type="date"
                                        value-format="yyyy-MM-ddT00:00:00"
                                        placeholder="选择日期">
                                        </el-date-picker>
                                    </template></el-col>
                            </el-row>
                            <el-row class="detail-row">
                                <el-col :span="4">任务分值：</el-col>
                                <el-col :span="8" style="color: red;font-weight: bold">
                                    <template v-if="lookType">&nbsp;{{detailForm.score || 0}}分</template>
                                    <template v-if="editType">
                                        <vs-input-number size="medium" v-model="detailForm.score"></vs-input-number>
                                    </template>
                                </el-col>
                                <el-col :span="4">
                                    当前进度：
                                </el-col>
                                <el-col :span="6">
                                    <template v-if="roleCode === 'COUNTRY_SIDE_ACTOR'">
                                        <p v-if="detailForm.status === '1'" style="color: #e6a23c">
                                            待审核
                                        </p>
                                        <p v-else-if="detailForm.status === '2'" style="color: #67c23a">
                                            已完成
                                        </p>
                                        <p v-else style="color: red">
                                            未完成
                                        </p>
                                    </template>
                                    <div v-else style="margin-top: 3px">
                                        <el-progress v-if="(detailForm[TownCodeKey[sysDistrict.districtId]] || 0) < 0.3" :percentage="Math.round((detailForm[TownCodeKey[sysDistrict.districtId]] || 0) * 1000)/10" color="#951200" :stroke-width="5"></el-progress>
                                        <el-progress v-else-if="(detailForm[TownCodeKey[sysDistrict.districtId]] || 0) < 0.7" :percentage="Math.round((detailForm[TownCodeKey[sysDistrict.districtId]] || 0) * 1000)/10" color="#e6a23c" :stroke-width="5"></el-progress>
                                        <el-progress v-else-if="(detailForm[TownCodeKey[sysDistrict.districtId]] || 0) < 1" :percentage="Math.round((detailForm[TownCodeKey[sysDistrict.districtId]] || 0) * 1000)/10" color="#0c89c2" :stroke-width="5"></el-progress>
                                        <el-progress v-else-if="(detailForm[TownCodeKey[sysDistrict.districtId]] || 0) === 1" :percentage="Math.round((detailForm[TownCodeKey[sysDistrict.districtId]] || 0) * 1000)/10" color="#67c23a" :stroke-width="5"></el-progress>
                                        <span v-else>ERROR</span>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row class="detail-row">
                                <el-col :span="4" >工作要求：</el-col>
                                <el-col :span="16" style="color: #25252582">
                                    <template v-if="lookType">&nbsp;{{detailForm.context}}</template>
                                    <template v-if="editType">
                                        <el-input v-model="detailForm.context" type="textarea" :disabled=disabled></el-input>
                                    </template>
                                </el-col>
                            </el-row>
                            <el-row class="detail-row">
                                <el-col :span="4">附件清单：</el-col>
                                <el-col :span="15">
                                    <CommonFileUpload :value="detailForm.fileUrls" @getValue="detailForm.fileUrls = $event" :disabled="lookType"></CommonFileUpload>
                                </el-col>
                            </el-row>
                            <el-row class="detail-row" v-if="detailForm.taskType === 'DistLearning'">
                                <el-col :span="4" >视频列表：</el-col>
                                <el-col :span="18">
                                    <template v-if="lookType">
                                        <vs-chip v-for="items in detailForm.video" :key="items.name" @click.native="showVideo(items)">
                                            <vs-avatar icon="videocam"></vs-avatar>
                                            {{JSON.parse(items).name}}
                                        </vs-chip>
                                    </template>
                                    <template v-if="editType" id="vd">
                                        <el-transfer filterable
                                            v-model="detailForm.video"
                                            :titles="['可选视频', '已选视频']"
                                            :props="{key: 'value',label: 'desc'}"
                                            :data="addVideoList">
                                        </el-transfer>
                                    </template>
                                </el-col>
                            </el-row>
                            <el-row class="detail-row"  v-if="detailForm.objectType.indexOf('2')===0">
                                <el-col :span="4">反馈要求：</el-col>
                                <el-col :span="16" style="color: #25252582">{{detailForm.templateItem}}&nbsp;</el-col>
                            </el-row>
                            <PictureShot :picData="picQuery" v-if="(roleCode === 'COUNTRY_SIDE_ACTOR')&&(detailForm.objectType==='1')"  ></PictureShot>
                            <FeedBackFile :fileData="fileQuery" v-if="(roleCode === 'COUNTRY_SIDE_ACTOR')&&(detailForm.objectType.indexOf('2')===0)"></FeedBackFile>
                            <el-row class="detail-row">
                                <el-col v-if="roleCode !== 'COUNTRY_SIDE_ACTOR'" :span="4" >进度跟踪：</el-col>
                                <el-col v-if="roleCode === 'CITY_LEADER'" :span="18">
                                    <el-table
                                        :data="trackTable"
                                        stripe
                                        highlight-current-row
                                        v-loading="loading" border
                                        :header-cell-style="{'font-size': '14px', 'background-color': '#fafafa','color': 'rgb(80, 80, 80)','border-bottom': '1px solid #dee2e6', 'padding': '1px 0'}"
                                        :default-sort="{prop: 'finishRatio', order: 'descending'}"
                                        show-summary
                                        :summary-method="calcSummary"
                                        @row-dblclick="townDetailClick">
                                        <el-table-column
                                            prop="tn"
                                            label="组织名称"
                                            align="center"
                                            sortable
                                            min-width="110px"
                                            :show-overflow-tooltip="true"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                            prop="passed"
                                            label="已完成"
                                            align="center"
                                            sortable
                                            width="90px"
                                            :show-overflow-tooltip="true">
                                            <template slot-scope="scope">
                                                <el-badge :value="scope.row.passed" class="item" type="success">
                                                </el-badge>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            prop="waitCheck"
                                            label="待审核"
                                            align="center"
                                            sortable
                                            width="90px"
                                            :show-overflow-tooltip="true">
                                            <template slot-scope="scope">
                                                <el-badge :value="scope.row.waitCheck" class="item" type="warning">
                                                </el-badge>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            prop="fail"
                                            label="未完成"
                                            align="center"
                                            sortable
                                            width="90px"
                                            :show-overflow-tooltip="true">
                                            <template slot-scope="scope">
                                                <el-badge :value="scope.row.fail" class="item" type="danger">
                                                </el-badge>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            label="完成进度"
                                            align="left"
                                            header-align="center"
                                            sortable
                                            min-width="120px"
                                            prop="finishRatio">
                                            <template slot-scope="scope">
                                                <el-progress v-if="scope.row.finishRatio < 0.3" :percentage="Math.round(scope.row.finishRatio * 1000)/10" color="#951200" :stroke-width="5"></el-progress>
                                                <el-progress v-else-if="scope.row.finishRatio < 0.7" :percentage="Math.round(scope.row.finishRatio * 1000)/10" color="#e6a23c" :stroke-width="5"></el-progress>
                                                <el-progress v-else-if="scope.row.finishRatio < 1" :percentage="Math.round(scope.row.finishRatio * 1000)/10" color="#0c89c2" :stroke-width="5"></el-progress>
                                                <el-progress v-else-if="scope.row.finishRatio = 1" :percentage="Math.round(scope.row.finishRatio * 1000)/10" color="#67c23a" :stroke-width="5"></el-progress>
                                                <span v-else>ERROR</span>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-col>
                                <el-col v-else-if="roleCode === 'TOWN_REVIEWER'" :span="18">
                                    <el-table
                                        :data="townDetailTable"
                                        stripe border
                                        v-loading="townDetailLoading"
                                        :header-cell-style="{'font-size': '14px', 'background-color': '#fafafa','color': 'rgb(80, 80, 80)','border-bottom': '1px solid #dee2e6', 'padding': '1px 0'}">
                                        <el-table-column
                                            prop="districtName"
                                            label="组织名称"
                                            align="center">
                                        </el-table-column>
                                        <el-table-column
                                            prop="modifiedAt"
                                            label="更新时间"
                                            align="center"
                                            :formatter="dateFormatter">
                                        </el-table-column>
                                        <el-table-column
                                            label="状态"
                                            align="center">
                                            <template slot-scope="scope">
                                                <p v-if="scope.row.status === '1'" style="color: #e6a23c">
                                                    待审核
                                                </p>
                                                <p v-else-if="scope.row.status === '2'" style="color: #67c23a">
                                                    已完成
                                                </p>
                                                <p v-else style="color: red">
                                                    未完成
                                                </p>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            label="截图"
                                            align="center"
                                            :show-overflow-tooltip="true" v-if="detailForm.objectType==='1'">
                                            <template slot-scope="scope">
                                                <el-tooltip class="item" effect="dark" content="电视截图" placement="top" :hide-after="1000" :enterable="false">
                                                    <el-button type="text" icon="el-icon-monitor" @click="getTV(scope.row)"></el-button>
                                                </el-tooltip>
                                                <el-tooltip class="item" effect="dark" content="手机截图" placement="top" :hide-after="1000" :enterable="false">
                                                    <el-button type="text" icon="el-icon-mobile" @click="getPhone(scope.row)"></el-button>
                                                </el-tooltip>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            label="文件"
                                            align="center"
                                            :show-overflow-tooltip="true" v-if="detailForm.objectType.indexOf('2')===0">
                                            <template slot-scope="scope">
                                                <el-link type="primary" :underline="false" @click="getFeedBack(scope.row)">详情</el-link>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-col>
                                <!--<p v-else>暂无权限！</p>-->
                            </el-row>
                        </div>
                    </transition>
                </div>
                <div style="width: 2%"></div>
            </el-row>
        </div>
        <template lang="html">
            <el-dialog
                v-if="townDetailVis"
                :title="townTitle + '完成详情'"
                :visible.sync="townDetailVis"
                width="880px"
                align="left"
                :append-to-body="true"
                :before-close="townDetailClose">
                <el-row :gutter="10" type="flex" justify="center">
                    <el-col :span="8" v-if="roleCode === 'CITY_LEADER'">
                        <el-table
                            :data="townDetailTable"
                            stripe
                            v-loading="townDetailLoading"
                            :header-cell-style="{'background-color': '#fafafa','color': 'rgb(80, 80, 80)','border-bottom': '1px solid #dee2e6'}">
                            <el-table-column
                                prop="districtName"
                                label="组织名称"
                                align="center"
                                width="105">
                            </el-table-column>
                            <el-table-column
                                label="状态"
                                align="center">
                                <template slot-scope="scope">
                                    <el-tag v-if="scope.row.status === '1'" type="warning"
                                            effect="dark">
                                        待审核
                                    </el-tag>
                                    <el-tag v-else-if="scope.row.status === '2'" type="success"
                                        effect="dark">
                                        已完成
                                    </el-tag>
                                    <el-tag v-else type="danger" effect="dark">
                                        未完成
                                    </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="截图"
                                align="center"
                                :show-overflow-tooltip="true" v-if="detailForm.objectType==='1'">
                                <template slot-scope="scope">
                                    <el-tooltip class="item" effect="dark" content="电视截图" placement="top" :hide-after="1000" :enterable="false">
                                        <el-button type="text" icon="el-icon-monitor" @click="getTV(scope.row)"></el-button>
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" content="手机截图" placement="top" :hide-after="1000" :enterable="false">
                                        <el-button type="text" icon="el-icon-mobile" @click="getPhone(scope.row)"></el-button>
                                    </el-tooltip>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="文件"
                                align="center"
                                :show-overflow-tooltip="true" v-if="detailForm.objectType.indexOf('2')===0">
                                <template slot-scope="scope">
                                    <el-link type="primary" :underline="false" @click="getFeedBack(scope.row)">详情</el-link>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                    <el-col :span="16">
                        <h3 style="text-align: center;line-height: 1.1">{{picTitle}}</h3>
                        <div style="width: 100%" v-if="phoneOrTv">
                        <h4 style="text-align: left;line-height: 2;display: inline-block" v-if="timeLines[0] || timeLines[1] ">会议时间：<a style="font-weight: 100;color: #73767c">{{timeLines[1]|dateServer}} — {{timeLines[0]|dateServer}}</a></h4>
                        <h4 style="text-align: right;line-height: 2;display: inline-block;margin-left: 12%" v-if="timeLines[0] && timeLines[1] ">时长：<a style="font-weight: 100;color: #73767c">{{timeLength}}</a></h4>
                        </div>
                        <viewer :images="PicFull" v-if="detailForm.objectType==='1'">
                            <el-timeline
                                v-loading="picLoading"
                                element-loading-text="图片加载中"
                                element-loading-spinner="el-icon-loading">
                                <el-timeline-item
                                    v-for="(activity, index) in Pic"
                                    :key="index"
                                    color="#1989fa"
                                    :timestamp="activity.timestamp|dateServer"
                                    placement="top">
                                    <img :src="PicFull[index]"
                                        :key="index"
                                        style="width: 520px">
                                </el-timeline-item>
                            </el-timeline>
                        </viewer>
                        <div v-if="PicFull.length === 0 && !picLoading && (detailForm.objectType==='1')" style="text-align: center">
                            <img style="margin: 0 auto" src="/static/img/nodata.png" width="300" height="300" />
                            <p style="text-align: center">&emsp;&emsp;&emsp;暂无图片</p>
                        </div>
                        <ShowFeedBack :fileData="showFileQuery" v-if="detailForm.objectType.indexOf('2')===0&& feedFile"></ShowFeedBack>
                    </el-col>
                </el-row>
            </el-dialog>
        </template>
    </section>
</template>

<script>

    import LookUp from '@/lookup';
    import CommonFileUpload from '@/components/FileUpLoad';
    import PictureShot from '@/components/PictureShot';
    import FeedBackFile from '@/components/FeedBackFile';
    import ShowFeedBack from '@/components/ShowFeedBack';

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
                queryForm: {taskType: '', currentStatus: 'ACTIVE',objectType:''},
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
                apiRootObject: '/identity/parActivityObject',
                checkboxGroup: 'Party',
                options: [],
                chooseType: '',
                form: {taskType: 'Party', score: 10},
                detailForm: {},
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
                // 镇详细表Loading
                townDetailLoading: false,
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
                activityLoading: false,
                detailLoading: false,
                user:JSON.parse(sessionStorage.getItem('userInfo')),
                sysDistrict: JSON.parse(sessionStorage.getItem('userInfo')).sysDistrict,
                roleCode: JSON.parse(sessionStorage.getItem('userInfo')).roleCode,
                TownCodeKey: {
                    '01' : 'totalPercent',
                    '0101': 'xiaShuPercent',
                    '0102': 'houBaiPercent',
                    '0103': 'guoZhuangPercent',
                    '0104': 'baiTuPercent',
                    '0105': 'maoShanPercent',
                    '0106': 'bianChengPercent',
                    '0107': 'baoHuaPercent',
                    '0108': 'tianWangPercent',
                    '0109': 'huaYangPercent',
                    '0111': 'kaiFaPercent',
                    '0112': 'maoShanFengJingPercent'
                },
                PicFull: [],
                Pic: [],
                picLoading: false,
                picTitle: '',
                progressType: 'line',
                //图片时间
                timeLines:[],
                //手机截图或电视截图，判断时间是否显示
                phoneOrTv:true,
                feedFile:true,//用于显示机关详情时，无法动态触发组件内的方法
                feedBackObject:{},
                //句容市委区分农村任务和机关任务
                radioName:'农村',
            }
        },
        watch: {
            checkboxGroup: {
                handler: function (newVal, oldVal) {
                    console.log(newVal)
                }
            }
        },
        computed: {
            taskTitle() {
                return this.queryForm.currentStatus == 'ACTIVE' ? '正在进行' : '计划进行'
            },
            picQuery() {
                return {
                    districtId: this.sysDistrict.id,
                    activityId: this.detailForm.activityId
                }
            },
            fileQuery() {
                return {
                    objectId:this.detailForm.id,
                }
            },
            showFileQuery(){
                return {
                    objectId:this.feedBackObject.id,
                }
            },
            //会议时常
            timeLength(){
                if(this.timeLines[0]&&this.timeLines[1]){
                    let sec1=parseInt(this.timeLines[0].substr(11,2))*60*60+parseInt(this.timeLines[0].substr(14,2))*60+parseInt(this.timeLines[0].substr(17,2));
                    let sec2=parseInt(this.timeLines[1].substr(11,2))*60*60+parseInt(this.timeLines[1].substr(14,2))*60+parseInt(this.timeLines[0].substr(17,2));
                    let interval = Math.abs(sec2-sec1)
                    let length = ''
                    if(interval/3600>=1){
                        length = length+parseInt(interval/3600)+':'+parseInt((interval%3600)/60)
                    }else{
                        length = length+'00:'+parseInt(interval/60)
                    }
                    return length
                }

            }
        },
        components: {
            CommonFileUpload,
            PictureShot,
            FeedBackFile,
            ShowFeedBack
        },
        methods: {
            showVideo(data) {
            },
            //选择radio时触发
            radioChoose(val) {
                if (val == 'Party') {
                    this.addVideo = false
                } else {
                    this.addVideo = true;
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
                    this.$message({
                        type: 'warning',
                        message: '视频信息拉取失败'
                    })
                })
            },
            //关闭镇详情
            townDetailClose() {
                this.townDetailForm = {};
                this.townDetailVis = false;
            },
            //镇详情
            townDetailClick(val) {
                this.townTitle = val.tn
                let path = `${this.apiRootObject}/list?sort=status,desc&organizationId,asc`;
                let query = {
                    attachTo: val.townCode,
                    activityId: this.detailForm.id
                };
                this.townDetailVis = true;
                this.townDetailLoading = true;
                this.townDetailTable = [];
                this.Pic = [];
                this.PicFull = [];
                this.loadTownTable(path, query).then(data => {
                    if (data.length > 0) {
                        if(this.detailForm.objectType==='1'){
                            this.getTV(data[0]);
                        }else if(this.detailForm.objectType.indexOf('2')===0){
                            this.getFeedBack(data[0]);
                        }
                    }
                });
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
            //处理不同角色的进度跟踪内容
            handleDifferentRole() {
                if (this.roleCode === 'CITY_LEADER') {
                    let path = `${this.apiRootTrack}/${this.detailForm.id}perList`;
                    this.loadTrackTable(path, {});
                } else if (this.roleCode === 'TOWN_REVIEWER') {
                    let path = `${this.apiRootObject}/list`;
                    let query = {
                        attachTo: this.sysDistrict.districtId,
                        activityId: this.detailForm.id
                    };
                    this.loadTownTable(path, query).then(() => {
                        setTimeout(() => {
                            this.detailLoading = true;
                        }, 200);
                    })
                } else if (this.roleCode === 'COUNTRY_SIDE_ACTOR') {
                    let path = `${this.apiRootObject}/findByOrganizationIdAndActivityId`;
                    let query = {
                        organizationId: this.sysDistrict.districtId,
                        activityId: this.detailForm.activityId
                    };
                    this.$http("POST", path, query, false).then(data => {
                        this.detailForm.status = data.status;
                        setTimeout(() => {
                            this.detailLoading = true;
                        }, 200);
                    })
                }
            },
            // 获取表格数据
            loadTableData(path, statusChange) {
                this.activityLoading = false;
                if (this.roleCode === 'COUNTRY_SIDE_ACTOR') {
                    path = path.replace('parActivity', 'parActivityObject');
                    this.queryForm.organizationId = this.sysDistrict.districtId;
                }
                this.$http('POST', path, this.queryForm, false).then(
                    data => {
                        this.tableData = data.content;
                        this.pageable.total = data.totalElements;
                        this.loading = false;
                        this.activityLoading = true;
                        if(!this.detailLoading || statusChange) {
                            if (this.tableData[0]) {
                                this.detailForm = this.tableData[0];
                                this.handleFile(this.detailForm);
                                this.handleDifferentRole();
                            } else {
                                this.detailLoading = false;
                            }
                        }
                    }
                ).catch(res => {
                    this.loading = false;
                });
            },
            calcSummary() {
                let temp = ['总计', 0, 0, 0, 0];
                this.trackTable.forEach((item) => {
                    temp[1] += item.passed;
                    temp[2] += item.waitCheck;
                    temp[3] += item.fail;
                });
                temp[4] = (temp[2] * 100/(temp[1] + temp[2] + temp[3])).toFixed(1) + '%';
                return temp;
            },
            //跟踪数据
            loadTrackTable(path, query) {
                this.$http('POST', path, query, false).then(
                    data => {
                        this.trackTable = data;
                        if(this.detailForm.objectType.indexOf('2')===0){
                            this.trackTable.forEach(item=>{
                                item.finishRatio = this.detailForm.activityOfficeProgresses[item.townCode] || 0;
                            })
                        }
                        this.pageableTrack.total = data.totalElements;
                        setTimeout(() => {
                            this.detailLoading = true;
                        }, 500);
                    }
                ).catch(res => {
                    this.$message({
                        type: 'warning',
                        message: '跟踪信息拉取失败'
                    })
                });
            },
            //镇详情数据
            loadTownTable(path, query) {
                return this.$http('POST', path, query, false).then(
                    data => {
                        this.townDetailTable = data;
                        this.townDetailLoading = false;
                        return data;
                    }
                ).catch(res => {
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
                this.queryForm.taskType = val;
                this.loadTableData(path);
            },
            //进行中、计划中获取
            loadByStatus(val) {
                this.pageable.currentPage = 1;
                let path = `${this.apiRoot}/page?page=${this.pageable.currentPage - 1}&size=${this.pageable.pageSize}`;
                this.queryForm.currentStatus = val;
                this.loadTableData(path, true);
            },
            //列表显示机关和农村任务
            loadByObjectType(){
                let objectType = this.radioName==='农村'?'1':'2';
                this.pageable.currentPage = 1;
                let path = `${this.apiRoot}/page?page=${this.pageable.currentPage - 1}&size=${this.pageable.pageSize}`;
                this.queryForm.objectType = objectType;
                this.loadTableData(path, true);
            },
            handleFile(val) {
                let fileStr = '';
                for (let i in val.urls) {
                    if (i == val.urls.length - 1) {
                        fileStr = fileStr + val.urls[i].url
                    } else {
                        fileStr = fileStr + val.urls[i].url + ','
                    }
                }
                this.detailForm.fileUrls = fileStr;
            },
            //详情
            details(val) {
                if (val.id === this.detailForm.id) {
                    return;
                }
                this.detailLoading = false;
                this.row = val;
                this.detailForm = JSON.parse(JSON.stringify(val));
                if(this.detailForm.urls){
                    this.detailForm.fileUrls = this.detailForm.urls.map(item => item.url).join(",");
                }
                if( this.detailForm.video){
                    this.detailForm.video = this.detailForm.video.map(item => {
                        let temp = "http://42.48.60.247:8085/xingsha/info-video.html?assetId=";
                        let videoCode = item.videoUrl.split('/')[4].split('.')[0];
                        let videoCover = item.videoCover.split("/");
                        item.videoCover = videoCover[7] + "/" + videoCover[8];
                        return '{"name":"' + item.name + '","lengthOfTime":"' + item.lengthOfTime + '","videoUrl":"' + temp + videoCode + '","videoCover":"' + item.videoCover + '"}'
                    });
                }
                this.lookType = true;
                this.editType = false;
                this.handleDifferentRole();
                this.townAcId = val.id

            },
            //编辑查看
            lookOrEdit() {
                if (this.lookType == true && this.editType == false) {
                    this.lookType = false;
                    this.editType = true;
                    this.loadVideo();
                } else {
                    this.lookType = true
                    this.editType = false
                }
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
                this.dialogVisible = true;
                this.form = val;
                let fileStr = '';
                for (var i in val.urls) {
                    if (i == val.urls.length - 1) {
                        fileStr = fileStr + val.urls[i].url;
                    } else {
                        fileStr = fileStr + val.urls[i].url + ','
                    }
                }
                this.form.fileUrls = fileStr
            },
            enclosure(val) {
                this.dialogVisible = true;
                this.form = val;
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
                this.dialogVisible = true;
                var type = this.queryForm.taskType;
                this.form = {taskType: 'Party', score: 10};
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
            detailSubmit(form) {
                let data = Object.assign({}, this.detailForm);
                data.districtID = JSON.parse(sessionStorage.getItem('userInfo')).sysDistrict.districtId;
                if (data.fileUrls) {
                    data.fileUrls = this.detailForm.fileUrls.split(",");
                }
                let video = data.video;
                let videoList = [];
                video.forEach(item => {
                    videoList.push(JSON.parse(item))
                });
                data.video = videoList;
                this.$http('put', `/identity/parActivity/${data.id}id`, data, false).then(
                    () => {
                        this.$message({
                            type: 'success',
                            message: '修改成功'
                        });
                        this.detailForm.version ++;
                        let path = `${this.apiRoot}/page?page=${this.pageable.currentPage - 1}&size=${this.pageable.pageSize}`;
                        this.loadTableData(path);
                        this.lookType = true;
                        this.editType = false;
                    }).catch(res => {
                    this.$message({
                        type: 'error',
                        message: '修改失败'
                    });
                    return false;
                });

            },
            calcLeftDays(date){
                date += ' 23:59:59'
                //开始时间
                let stop = new Date(date);
                //结束时间
                let now = new Date();
                let distance = stop.getTime()-now.getTime();
                //计算出相差天数
                return Math.floor(distance/(24*3600*1000))
            },
            getTV(item){
                this.phoneOrTv = true;
                if (!this.townDetailVis) {
                    this.townDetailVis = true;
                }
                this.picTitle = `${item.districtName}电视端截图`;
                this.picLoading = true;
                this.Pic = [];
                this.PicFull = [];
                let path = `/identity/parPictureInfro/page?page=0&size=500&sort=CreateTime,desc`;
                let form = {organizationId:item.districtId,studyContent:item.activityId};
                let timeAll = []
                this.$http("Post",path,form,false).then(data=>{
                    data.content.forEach((item,index)=>{
                        let formItem = {};
                        formItem.timestamp =item.createTime;
                        formItem.imgurl = item.imageURL;
                        this.Pic.push(formItem);
                        this.PicFull.push(this.imgTF(item.imageURL));
                        timeAll.push(item.createTime)

                    });
                    this.timeLines = []
                    this.timeLines[0] = timeAll[0]
                    this.timeLines[1] = timeAll[timeAll.length -1]
                    this.picLoading = false;
                }).catch(()=>{
                    this.$message({
                        type: 'error',
                        message: '电视截图拉取失败'
                    });
                    this.picLoading = false;
                });
            },
            getPhone(item) {
                this.phoneOrTv = false
                if (!this.townDetailVis) {
                    this.townDetailVis = true;
                }
                this.picTitle = `${item.districtName}手机端截图`;
                this.picLoading = true;
                this.Pic = [];
                this.PicFull = [];
                let phonePath = `/identity/parActivityFeedback/phonePage?page=0&size=500&sort=time,desc`;
                let phoneForm = {userId:item.districtId,snId:item.activityId};
                this.$http("Post",phonePath,phoneForm,false).then((data)=>{
                    if (!data.content[0]) {
                        this.picLoading = false;
                        return;
                    }
                    if (data.content.length && data.content.length > 0) {
                        for (let i = 0; i < data.content.length; i++) {
                            if (data.content[i].imageUrl) {
                                data.content[i].imageUrl.forEach((item) => {
                                    item.time = data.content[i].time;
                                    let formItem = {};
                                    formItem.timestamp = data.content[i].time;
                                    formItem.imgurl = data.content[i].imageUrl;
                                    this.Pic.push(formItem);
                                    this.PicFull.push(this.imgTFPhone(item));
                                });
                            }
                        }}
                    this.picLoading = false;
                }).catch(()=>{
                    this.$message({
                        type: 'error',
                        message: '手机截图拉取失败'
                    });
                    this.picLoading = false;
                });
            },
            getFeedBack(item){
                this.phoneOrTv = false;
                this.feedFile = false;
                if (!this.townDetailVis) {
                    this.townDetailVis = true;
                }
                this.picTitle = `${item.districtName}--${this.detailForm.title}`;
                this.picLoading = true;
                this.feedBackObject = item;
               // this.detailForm = item;
                setTimeout(()=>{
                    this.feedFile = true;
                });
            },
            imgTF(val){
                if (val.indexOf("http" )== -1) {
                    return `http://122.97.218.162:18106/JRPartyService/JRPartyScreenshot/${val}`
                }else {
                    return val
                }
            },
            imgTFPhone(item){
                let imgUrl = item.imageUrl.toString()
                if (imgUrl.indexOf("http" )== -1) {
                    if(imgUrl[0] === '.'){
                        if(new Date(Date.parse(item.time))<new Date("2018-11-23T00:00:00")){
                            return `http://jrweixin.zj96296.com:18006/JRPartyService/Upload/PhotoTake/${item.imageUrl}`
                        }else {
                            return `http://jrweixin.zj96296.com:18006/JRPartyService/Upload/PhotoTakeUpload/${item.imageUrl}`
                        }
                    }else {
                        let time1 = item.time.toString().split("T")[0]
                        let time2 =  Number(time1.split("-")[0])
                        let time3 = Number(time1.split("-")[1])
                        let time4 = Number(time1.split("-")[2])
                        let time5 = time3.toString()+time4.toString()
                        if(new Date(Date.parse(item.time))<new Date("2018-11-23T00:00:00")){
                            return `http://jrweixin.zj96296.com:18006/JRPartyService/Upload/PhotoTake/${item.imageUrl}`
                        }else {
                            return `http://jrweixin.zj96296.com:18006/JRPartyService/Upload/PhotoTakeUpload/${time2}/${time5}/${item.userId}/${imgUrl}`

                        }
                    }
                }else {
                    return item.imageUrl
                }
            },

            dateFormatter(row, cell, value) {
                return new Date(value).toLocaleDateString() || '暂无';
            },

        },
        created() {
            this.handleSelectOptions();
            let path = `${this.apiRoot}/page?page=${this.pageable.currentPage - 1}&size=${this.pageable.pageSize}`;
            //句容市委进入页面，初始化时，列表显示农村的任务
            if(this.user.districtId==='01'){
                this.queryForm.objectType = "1";
            }
            if(this.user.organizationName==='句容市委市级机关工委'){
                this.queryForm.objectType = "2";
            }
            this.loadTableData(path);
            this.progressType = document.body.clientWidth/1920 <= 0.73 ? 'dashboard' : 'line';
            window.onresize = () => {
                this.progressType = document.body.clientWidth/1920 <= 0.73 ? 'dashboard' : 'line';
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
    .el-timeline .el-loading-mask {
        height: 300px;
    }
    .processing svg {
        margin: 0 !important;
    }
    .processing .el-progress--line {
        width: 80% !important;
        text-align: center;
    }
    .cell .el-progress--line {
        width: 100% !important;
        text-align: left;
    }
    @media screen and (max-width: 1430px) {
        .right-detail {
            font-size: 14px;
        }
        .processing {
            flex: 1;
        }
        .right-detail .el-col-4 {
            width: 20% !important;
        }
    }
    /*.activity-management .el-textarea__inner {*/
        /*width: auto !important;*/
    /*}*/
</style>

