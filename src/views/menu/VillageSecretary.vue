<template>
    <section>
        <vs-tabs :color="colorx">
            <vs-tab @click="colorx = 'success'" label="村书记信息" >
                <CommonCRUD
            ref="father" :columns="columns" api-root="identity/villageCadres" :formColumns="formColumns"
                :buttonVis="confirmBtnVis"    :queryFormColumns="queryForm" :objectSpanMethod="objectSpanMethod"
            :addBtnVis="addBtnVis" :editBtnVis="editBtnVis" :delBtnVis="delBtnVis" :editEvent="doEdit"
                    @getTableData="handleTableData" :sortColumns="sortColumns" :formAfterVis="formAfterVis" @handleClose="formAfterVis = false">
            <template slot="query" slot-scope="slotProps" v-if="userAuthority!=3">
                <el-form-item label="所属组织">
                    <el-cascader :props="propsOne"  placeholder="请选择组织" size="mini"
                                 style="margin-right: -28px;" @change="selValue" clearable></el-cascader>
                </el-form-item>
            </template>
            <template slot="Handle" slot-scope="scope">
                <el-tag v-if="scope.row.state==='0'"
                        close-transition type="danger"  effect="dark">待提交</el-tag>
                <el-tag v-if="scope.row.state==='1'"
                        close-transition  type="warning"  effect="dark">待镇党委审核</el-tag>
                <el-tag v-if="scope.row.state==='2'"
                        close-transition  type="primary"  effect="dark">待市委审核</el-tag>
                <el-tag v-if="scope.row.state==='3'"
                        close-transition  type="success"  effect="dark">市委审核通过</el-tag>
            </template>

            <template slot="header-btn" slot-scope="slotProps" >
                <el-button type="danger" plain @click="submit(slotProps.selected)"  class="self-btn self-submit" v-if="userAuthority==3"> 提交</el-button>
                <el-button type="primary" plain @click="verify(slotProps.selected)"   class="self-btn self-submit" v-if="userAuthority!=3"  >审核</el-button>
            </template>

            <template slot="form-after">
                <div v-if="currentRow.state == '2'">
                    <h4 style="margin-left: 50px;">镇级审核信息</h4>
                    <br>
                    <el-form ref="reviewInfo" :inline="true" :model="currentRow" class="demo-form-inline  common-textarea  " label-width="170px">
                        <el-form-item label="镇级审核人">
                            <el-input type="textarea" v-model="currentRow.auditor" :rows="2" disabled></el-input>
                        </el-form-item>
                        <br>

                        <el-form-item label="审核意见">
                            <el-input type="textarea" :rows="2" v-model="currentRow.auditAdvice" disabled></el-input>
                        </el-form-item>
                    </el-form>
                </div>

                <h4 style="margin-left: 50px;">审核信息</h4>
                <br>
                <el-form ref="reviewForm" :inline="true" :model="reviewForm" class="demo-form-inline  common-textarea  " label-width="170px">
                    <el-form-item label="审核人" prop="auditor" :rules="{required: true, message: '审核人不能为空', trigger: 'blur'}">
                        <el-input type="textarea" v-model="reviewForm.auditor" :rows="2"></el-input>
                    </el-form-item>
                    <br>

                    <el-form-item label="审核意见" prop="auditAdvice" :rules="{required: true, message: '审核意见不能为空', trigger: 'blur'}">
                        <el-input type="textarea" :rows="2" v-model="reviewForm.auditAdvice"></el-input>
                    </el-form-item>
                </el-form>
                <div  style="margin-right: 86px;">
                    <el-button type="danger" :loading="rejectLoading" @click="review('FAILED')" style="float: right">驳回</el-button>
                    <el-button type="primary" :loading="passLoading" @click="review('SUCCESS')" style="float: right;margin-right: 10px">通过</el-button>
                </div>
            </template>

        </CommonCRUD>
            </vs-tab>
            <vs-tab @click="showDisplay()" label="村书记统计" >
                <div class="villageDisplay">
                    <el-card class="typeNumberCard" style="background-color: #1e6abc">
                        <span>一级员额村书记：</span>
                        <CountTo :startVal="0"  :endVal=secretaryNumber.levelOne :duration="1300"></CountTo>
                    </el-card>
                    <el-card class="typeNumberCard" style="background-color: #1e6abc">
                        <span>二级员额村书记：</span>
                        <CountTo :startVal="0"  :endVal=secretaryNumber.levelTwo :duration="1300"></CountTo>
                    </el-card>
                    <el-card class="typeNumberCard" style="background-color: #1e6abc">
                        <span>三级员额村书记：</span>
                        <CountTo :startVal="0"  :endVal=secretaryNumber.levelThree :duration="1300"></CountTo>
                    </el-card>
                    <el-card class="typeNumberCard" style="background-color: #1e6abc">
                        <span>四级员额村书记：</span>
                        <CountTo :startVal="0"  :endVal=secretaryNumber.levelFour :duration="1300"></CountTo>
                    </el-card>
                    <el-card class="typeNumberCard" style="background-color: #1e6abc">
                        <span>五级员额村书记：</span>
                        <CountTo :startVal="0"  :endVal=secretaryNumber.levelFive :duration="1300"></CountTo>
                    </el-card>
                    <el-card class="pieStyle">
                        <div slot="header" class="clearfix">
                            <span>XXX饼图</span>
                        </div>
                        <div id="pieChart" style="height:200px;width: 98%;"></div>
                    </el-card>
                    <el-card class="pieStyle">
                        <div slot="header" class="clearfix">
                            <span>XXX饼图</span>
                        </div>
                        <div id="pieChart1" style="height:200px;width: 98%;"></div>
                    </el-card>
                    <el-card class="showSecretary" >
                        <div>
                            <el-col :span="4" style="text-align: left" >详细信息</el-col>
                            <el-col :span="15" style="text-align: right;">
                                <el-select v-model="displayType" placeholder="请选择村书记类型" @change="showSecretaryList">
                                    <el-option
                                        v-for="item in displayTypeQuery"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="4" style="text-align: right;right: 1%">
                                <el-input  v-model="displayNameQuery" placeholder="请输入村书记姓名" @input="showSecretaryList"></el-input>
                            </el-col>
                        </div>
                        <div style="height: 370px;">
                            <el-card v-for="item in secretaryList" :key="item.name" class="detailSecretary" @click.native="showDetailSecretary(item)" >
                                <el-col :span="10">
                                    <el-image style="width: 72px; height: 108px;border-radius: 5px;border: 1px white solid;" :src="item.headSculpture"></el-image>
                                </el-col>
                                <el-col :span="14" style="text-align: left;margin-top: 10px;">
                                    <div style="font-size: 14px;margin-top: 6px;">
                                        <span style="display: inline-block">{{item.name}}</span>
                                    </div>
                                    <div style="font-size: 14px;margin-top: 6px;">
                                        <span style="display: inline-block">{{item.districtName}}</span>
                                    </div>
                                </el-col>
                                <el-image class="sealStyle" src="../../../static/img/levelOne.png" v-if="item.quasiAssessmentRank==='FIRST_CLASS'"></el-image>
                                <el-image class="sealStyle" src="../../../static/img/levelTwo.png" v-if="item.quasiAssessmentRank==='SECOND_CLASS'"></el-image>
                                <el-image class="sealStyle" src="../../../static/img/levelThree.png" v-if="item.quasiAssessmentRank==='THIRD_CLASS'"></el-image>
                                <el-image class="sealStyle" src="../../../static/img/levelFour.png" v-if="item.quasiAssessmentRank==='FOUR_CLASS'"></el-image>
                                <el-image class="sealStyle" src="../../../static/img/levelFive.png" v-if="item.quasiAssessmentRank==='FIRTH_CLASS'"></el-image>
                            </el-card>
                        </div>
                        <div style="clear: both;text-align: right;margin-right: 1%" >
                            <el-pagination background  @current-change="currentChange"
                                           layout="total,prev, pager, next"
                                           :total="pageable.total"
                                           :current-page.sync="pageable.currentPage"
                                           :page-size.sync="pageable.pageSize"></el-pagination>
                        </div>
                    </el-card>
                    <el-dialog :visible.sync="dialogVis"  style="text-align: left" :modal-append-to-body='false' >
                        <el-col :span="8" style="margin-top: 50px;">
                            <div style="width: 100%;text-align: center;margin-bottom: 30px">
                                <el-image class="headPicture" :src=form.headSculpture>
                                </el-image>
                                <div style="font-size: 20px;margin: 10px 0;font-weight: bold">{{form.name}}</div>
                            </div>
                            <div class="diaDivTitle">&nbsp;&nbsp;基 本 信 息</div>
                            <div class="dialogDivStyle">
                                <div><span>性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别：</span>{{form.sex||"暂无"}}</div>
                                <div><span>出生日期：</span>{{form.birth}}</div>
                                <div><span>民&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;族：</span>{{form.nation||"暂无"}}</div>
                                <div><span>籍&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;贯：</span>{{form.nativePlace||"暂无"}}</div>
                                <div><span>文化程度：</span>{{form.education}}</div>
                            </div>
                            <div class="diaDivTitle">&nbsp;&nbsp;其 他 信 息 </div>
                            <div class="dialogDivStyle">
                                <div><span>入党时间：</span>{{form.partyTime||"暂无"}}</div>
                                <div><span>参加工作时间：</span>{{form.workTime||"暂无"}}</div>
                                <div><span>担任村书记时长：</span>{{form.onDutyTime||"暂无"}}</div>
                                <div><span>专业职称：</span>{{form.professionalTitle||"暂无"}}</div>
                                <div><span>健康情况：</span>{{form.health||"暂无"}}</div>
                            </div>
                        </el-col>
                        <el-col :span="16"  class="baseInfo">
                            <div style="margin:25px 0;">
                                <el-image class="smallTitle"  style="width: 13px;height: 23px;" src="../../../static/img/post.png"></el-image>
                                <span>工作单位及职务</span>
                                <hr style="margin:10px 0;background-color: #171111a8" size="5px">
                                <div style="color: #f93737;font-size: 16px;font-weight: bold;margin-left: 5px;" >{{form.postName||"暂无"}}</div>
                            </div>
                            <div style="margin:25px 0;">
                                <el-image class="smallTitle" style="width: 17px;height: 21px;"  src="../../../static/img/level.png"></el-image>
                                <span>拟评定职称</span>
                                <hr style="margin:10px 0;background-color: #171111a8" size="5px">
                                <div style="font-size: 16px;font-weight: bold;margin-left: 5px;">{{form.name||"暂无"}}</div>
                            </div>
                            <div style="margin:25px 0;">
                                <el-image  class="smallTitle" style="width: 16px;height: 18px;" src="../../../static/img/workExperience.png"></el-image>
                                <span >工作简历</span>
                                <hr style="margin:10px 0;background-color: #171111a8" size="5px">
                                <pre>{{form.workExperience||"暂无"}}</pre>
                            </div>
                            <div style="margin:25px 0;">
                                <el-image  class="smallTitle" style="width: 18px;height: 19px;" src="../../../static/img/reward.png"></el-image>
                                <span >曾受综合表彰情况</span>
                                <hr style="margin:10px 0;background-color: #171111a8" size="5px">
                                <pre>{{form.comprehensiveCommendation||"暂无"}}</pre>
                            </div>
                            <div style="margin:25px 0;">
                                <el-image class="smallTitle"  style="width: 21px;height: 21px;" src="../../../static/img/check.png"></el-image>
                                <span>年度考核情况</span>
                                <hr style="margin:10px 0;background-color: #171111a8" size="5px">
                                <pre>{{form.annualAssessment||"暂无"}}</pre>
                            </div>
                        </el-col>
                    </el-dialog>
                </div>
            </vs-tab>
        </vs-tabs>
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    import CountTo from 'vue-count-to';
    import LookUp from '@/lookup';
    export default {
        name: "VillageSecretary",
        data(){
            return {
                colorx:'success',
                columns:[],
                formColumns:[],
                districtList:[],
                queryForm:[
                    {
                        des: '姓名',
                        name: 'name',
                        type: 'string',
                        value: '',
                        visible: true,
                    },
                    {
                        name: 'post',
                        type: 'string',
                        value: '',
                        visible: false
                    },
                    {
                        des: '组织',
                        name: 'districtId',
                        type: 'string',
                        value: '',
                        visible: false,
                    },
                ],
                user:{},
                propsOne: {
                    lazy: true,
                    checkStrictly:true,
                    lazyLoad:(node, resolve)=>{
                        if(this.userAuthority ==1){
                            if(node.level==0){
                                let nodes = [];
                                this.$http('GET', `/identity/sysDistrict/01tree`, false).then((data) => {
                                    data.forEach(item=>{
                                        nodes.push({label:item.label,value:item.id,leaf:item.leaf})
                                    });
                                    resolve(nodes);
                                })
                            }else {
                                let nodes = [];
                                this.$http('GET', `/identity/sysDistrict/${node.value}tree`, false).then((data) => {
                                    data.forEach(item=>{
                                        nodes.push({label:item.label,value:item.id,leaf:item.leaf})
                                    });
                                    resolve(nodes);
                                })
                            }
                        }
                        if(this.userAuthority==2){
                            if(node.level==0){
                                let nodes = [];
                                this.$http('GET', `/identity/sysDistrict/${this.user.districtId}tree`, false).then((data) => {
                                    data.forEach(item=>{
                                        nodes.push({label:item.label,value:item.id,leaf:item.leaf})
                                    });
                                    resolve(nodes);
                                })
                            }
                        }
                    }
                },
                userAuthority:1,
                spanParentObject: new Map(),
                spanObject: new Map(),
                sortColumns: [
                    {
                        name: 'districtId',
                        type: 'asc'
                    }
                ],
                reviewForm: {
                    auditor: null,
                    auditAdvice: null
                },
                formAfterVis: false,
                currentRow: {},
                addBtnVis: true,
                editBtnVis: true,
                delBtnVis: true,
                doEdit: (row) => {
                    if (row.state !== '0') {
                        this.$message({
                            type: 'warning',
                            message: '已提交、待审核等状态不可修改'
                        });
                        return false;
                    }
                    return true;
                },
                confirmBtnVis: true,
                passLoading: false,
                rejectLoading: false,
                secretaryList:[],
                dialogVis:false,
                form:{},
                pageable: {
                    total: 0,
                    currentPage: 1,
                    pageSize: 10
                },
                displayTypeQuery:LookUp["SecretaryClassType"],
                displayNameQuery:'',
                displayType:LookUp["SecretaryClassType"][0].value,
                secretaryNumber:{},
            }
        },
        methods:{
            selValue(val){
                if(val.length>0){
                    this.queryForm[2].value = val[val.length-1];
                }else{
                    this.queryForm[2].value = this.user.districtId;
                }
            },
            handleTableData(data) {
                let parentDistrictIds = data.map(item => item.parentDistrictId);
                parentDistrictIds = new Set(parentDistrictIds);
                let order = 0;
                this.spanParentObject.clear();
                parentDistrictIds.forEach((item) => {
                    if (item === null) {
                        item = 'null'
                    }
                    data.forEach((subItem, subIndex) => {
                        if (String(subItem.parentDistrictId) == item) {
                            this.spanParentObject.set(item, {index: order, end: subIndex})
                        }
                    })
                    order ++;
                })

                let districtIds = data.map(item => item.districtId);
                districtIds = new Set(districtIds);
                order = 0;
                this.spanObject.clear()
                districtIds.forEach(item => {
                    if (item === null) {
                        item = 'null'
                    }
                    data.forEach((subItem, subIndex) => {
                        if (String(subItem.districtId) == item) {
                            this.spanObject.set(item, {index: order, end: subIndex})
                        }
                    })
                    order ++;
                })
            },
            objectSpanMethod({row, column, rowIndex, columnIndex}) {
                if (columnIndex === 1) {
                    if (this.spanParentObject.size === 0) {
                        return ;
                    }
                    let key;
                    if (row.parentDistrictId === null) {
                        key = 'null';
                    } else {
                        key = row.parentDistrictId;
                    }
                    let index = this.spanParentObject.get(key).index;
                    let end = this.spanParentObject.get(key).end;
                    let start = 0;
                    if (index !== 0) {
                        this.spanParentObject.forEach((v,key) => {
                            if (v.index === (index - 1)) {
                                start = v.end + 1;
                            }
                        })
                    }
                    if (rowIndex === start) {
                        return {
                            rowspan: end - start + 1,
                            colspan: 1
                        }
                    }
                    else if (start < rowIndex <= end) {
                        return {
                            rowspan: 0,
                            colspan: 0
                        }
                    } else {
                        return {
                            rowspan: 1,
                            colspan: 1
                        }
                    }
                } else if (columnIndex === 2) {
                    if (this.spanObject.size === 0) {
                        return ;
                    }
                    let key;
                    if (row.districtId === null) {
                        key = 'null';
                    } else {
                        key = row.districtId;
                    }
                    let index = this.spanObject.get(key).index;
                    let end = this.spanObject.get(key).end;
                    let start = 0;
                    if (index !== 0) {
                        this.spanObject.forEach((v,key) => {
                            if (v.index === (index - 1)) {
                                start = v.end + 1;
                            }
                        })
                    }
                    if (rowIndex === start) {
                        return {
                            rowspan: end - start + 1,
                            colspan: 1
                        }
                    }
                    else if (start < rowIndex <= end) {
                        return {
                            rowspan: 0,
                            colspan: 0
                        }
                    } else {
                        return {
                            rowspan: 1,
                            colspan: 1
                        }
                    }
                } else {
                    return {
                        rowspan: 1,
                        colspan: 1
                    }
                }
            },
            handelOrg(){
                this.queryForm[1].value = 'SECRETARY';
                this.queryForm[2].value = this.user.districtId;
                if(this.user.sysDistrict.districtLevel == 3){
                    this.userAuthority = 3;
                }else  if(this.user.sysDistrict.districtLevel == 2){
                    this.userAuthority = 2;
                }else{
                    this.userAuthority = 1;
                }
                //层级组织请求
                this.$http('GET',`identity/sysDistrict/${this.user.districtId}alltree`,false).then( data => {
                    this.districtList = data[0].children;
                    this.handleOrgLeaf(this.districtList);
                    this.formColumns.filter(item => item.name === 'districtId')[0].options = this.districtList;
                    if(this.userAuthority == 3){
                        let filterElement = this.formColumns.filter(item => item.name === 'districtId')[0];
                        filterElement.value = this.user.districtId;
                        filterElement.formShow = 'false';
                    }
                });
            },
            //处理村级组织children为空的情况
            handleOrgLeaf(districtList){
                districtList.forEach(item => {
                    if (item.children.length === 0) {
                        delete item.children;
                    } else {
                        this.handleOrgLeaf(item.children)
                    }
                })
            },
            submit(row) {
                if (row.length !== 1) {
                    this.$message({
                        type: 'warning',
                        message: row.length > 1 ? '仅能选择一行记录' : '请选择一行记录'
                    })
                    return;
                }else {
                    if(this.userAuthority==3&&row[0].state==0){
                        this.$confirm('确认提交？')
                            .then(_ => {
                                this.$http('PUT', 'identity/villageCadres/submit/' + row[0].id, false).then(content => {
                                    this.$refs.father.refreshTableData();
                                });
                            })
                            .catch(_ => {});
                    }else {
                        this.$message({
                            type: 'warning',
                            message: '该内容已经提交过了'
                        });
                    }
                }
            },
            verify(selected) {
                if (selected.length !== 1) {
                    this.$message({
                        type: 'warning',
                        message: selected.length > 1 ? '仅能选择一行记录' : '请选择一行记录'
                    });
                    return false;
                }else {
                     if((this.userAuthority==2&&selected[0].state==1)||(this.userAuthority==1&&selected[0].state==2)){
                         this.formAfterVis = true;
                         this.currentRow = selected[0];
                         this.confirmBtnVis = false;
                         this.$refs.father.look();
                     }else {
                         let message;
                         if(selected[0].state==0){
                             message='当前记录未提交,无法审核';
                         }else if(selected[0].state==1){
                             message='当前记录应该为镇审核';
                         }else if(selected[0].state==2){
                             message='当前记录应该为市审核';
                         }else {
                             message='当前记录已经审核通过';
                         }
                         this.$message({
                             type: 'warning',
                             message: message
                         });
                     }
                }
            },
            review(code) {
                this.$refs['reviewForm'].validate((valid) => {
                    if (valid) {
                        console.log(valid, 'dada')
                        if (code === 'SUCCESS') {
                            this.passLoading = true;
                        } else {
                            this.rejectLoading = true;
                        }
                        this.$http('PUT', `identity/villageCadres/verify/${this.currentRow.id}/${code}`, this.reviewForm,false).then(content => {
                            this.$message({
                                type: 'success',
                                message: code==='SUCCESS' ?'审核通过':'审核不通过'
                            });
                            this.formAfterVis=false;
                            this.$refs.father.dialogVisible = false;
                            this.$refs.father.refreshTableData();
                            this.passLoading = false;
                            this.rejectLoading = false;
                        }).catch(()=> {
                            this.$message({
                                type: 'error',
                                message: '网络错误'
                            });
                        });
                    }
                });
            },
            loadPost() {
                let param = {
                    districtId: this.user.districtId
                };
                this.$http('POST', `identity/cadrePosition/list`, param, false).then( content => {
                    let list = [];
                    content.forEach(item => {
                        list.push({value: item.id, label: item.name});
                    })
                    let filterElement = this.formColumns.filter(item => item.name === 'post')[0];
                    filterElement.options = list;
                })
            },
            showDisplay(){
                this.colorx = 'danger';
                setTimeout(()=>{
                    this.showPie();
                    this.showPie1();
                },0);
                this.showSecretaryList();
                this.showSecretaryNumber();
            },
            currentChange(currentPage){
                this.pageable.currentPage = currentPage;
                this.showSecretaryList();
                this.indexValue = (this.pageable.currentPage-1)* this.pageable.pageSize +1 ;
            },
            showPie(){
                let pieChart = echarts.init(document.getElementById("pieChart"));
                let option = {
                    title : {
                        text: '',
                        subtext: '',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
                    },
                    series : [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data:[
                                {value:335, name:'直接访问'},
                                {value:310, name:'邮件营销'},
                                {value:234, name:'联盟广告'},
                                {value:135, name:'视频广告'},
                                {value:1548, name:'搜索引擎'}
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                pieChart.setOption(option);
            },
            showPie1(){
                let pieChart = echarts.init(document.getElementById("pieChart1"));
                let option = {
                    title : {
                        text: '',
                        subtext: '',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
                    },
                    series : [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data:[
                                {value:335, name:'直接访问'},
                                {value:310, name:'邮件营销'},
                                {value:234, name:'联盟广告'},
                                {value:135, name:'视频广告'},
                                {value:1548, name:'搜索引擎'}
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                pieChart.setOption(option);
            },
            showDetailSecretary(item){
                this.dialogVis = true;
                this.form = item;
            },
            showSecretaryList(){
                this.$http('POST',`identity/villageCadres/page?page=${this.pageable.currentPage-1}&size=${this.pageable.pageSize}`,
                    {post: "SECRETARY",quasiAssessmentRank:this.displayType,name:this.displayNameQuery},false).then(data => {
                    this.secretaryList = data.content;
                    this.pageable = {total:data.totalElements,currentPage: 1, pageSize: 10};
                });
            },
            showSecretaryNumber(){
                this.$http('POST',`identity/villageCadres/secretaryNumber`,false).then(data => {
                    this.secretaryNumber = data;
                    console.log(this.secretaryNumber);
                });
            }

        },
        components: {
            CommonCRUD,
            CountTo,
            LookUp
        },
        created () {
            this.columns = [];
            this.columns.length = 0;
            let temp = JSON.parse(JSON.stringify(this.$store.state.classInfo.properties));
            let temp1 = JSON.parse(JSON.stringify(this.$store.state.classInfo.properties));
            this.formColumns = temp1;
            this.columns = temp;
            this.user = JSON.parse(sessionStorage.getItem('userInfo'));
            this.columns.push({slot: true, name: 'state', des: '状态', slotName: 'Handle'});
            this.handelOrg();
            this.loadPost();
            if (this.user.roleCode !== 'COUNTRY_SIDE_ACTOR') {
                this.addBtnVis = false;
                this.editBtnVis = false;
                this.delBtnVis = false;
            }
        }
    }
</script>

<style scoped>
    .common-textarea .el-textarea__inner {
        width: 585px !important;
    }
    .r{
        position:absolute;
        right:5px;
        bottom:5px;
    }
    .self-btn {
        width: 56px !important;
        height: 28px !important;
        border-radius: 5px !important;
        transform: scale(1.1);
    }
    .self-submit {
        background-size: cover !important;
    }
    .villageDisplay .typeNumberCard{
        width: 18%;
        margin-right: 2%;
        float: left;
        height:100px;
        border-radius:15px;
    }
    .villageDisplay .typeNumberCard span{
        color: #fff;
        position:relative;
        text-align:center;
        top: 15px;
    }
    .villageDisplay .pieStyle {
        width: 47%;
        margin: 10px 30px 10px 10px ;
        float: left;
    }
    .villageDisplay .showSecretary{
        width: 97%;
        margin: 10px;
        height: 440px;
    }
    .villageDisplay .detailSecretary{
        width: 18%;
        margin: 10px 1%;
        height: 150px;
        float: left;
    }
    .dialogDivStyle{
        margin: 15px;
    }
    .dialogDivStyle div{
        font-size: 15px;
        line-height: 30px;
        font-weight: bold;
    }
    .dialogDivStyle span {
        width: 50%;
        text-align: right;
        display: inline-block;
    }
    .villageDisplay pre {
        font-size:15px;
        font-weight: bold;
        line-height: 26px;
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
    }
    .diaDivTitle {
        width: 181px;
        height: 26px;
        background-image: url('../../../static/img/titleContentBg.png');
        color: white;
        font-size: 16px;
        line-height: 28px;
        margin: 20px 0;
    }
    .villageDisplay .baseInfo {
        margin-top: 50px;
    }
    .villageDisplay .headPicture {
        width: 150px;
        height: 150px;
        border-radius: 75px;
        border: 2px white solid;
        box-shadow: 0 0 0 3px #f5ad40;
        overflow: hidden;
    }
    .villageDisplay .baseInfo .smallTitle {
        vertical-align: middle;
        margin-right: 5px;
    }
    .villageDisplay .baseInfo span {
        color: #ce0505;
        font-weight: bold;
        font-size: 16px;
        vertical-align:middle
    }
    .showSecretary .sealStyle {
        width: 100px;
        height: 100px;
        margin-top:-30px ;
        margin-left: 30px;
        transform:rotate(-30deg) !important;
    }

</style>
<style>
    .villageDisplay .el-dialog {
        width: 850px;
        height: 852px;
        background-image: url("../../../static/img/secretarybg.png") !important;
    }
    .villageDisplay .el-dialog__header {
        padding: 0 !important;
        height: 0 !important;
    }
    .villageDisplay .el-image__inner{
        height: auto;
    }
</style>
