<template>
    <div class="secretary-detail">
        <div style="text-align: left;font-size: 18px;font-weight: bold;margin-bottom: 10px;">当前状态：
            <el-tag type="success">已通过</el-tag>
            <el-button type="primary" @click="editInfo()">编辑</el-button>
            <el-button @click="saveBaseInfo()" v-if="!disabled">保存</el-button>
        </div>
        <div>
            <el-form label-position="right" label-width="120px" :model="form">
                <div style="width: 20%;float: left;margin-left: 40px">
                    <div style="width: 100%;text-align: center;margin-bottom: 30px">
                        <el-image class="headPicture" :src=form.headSculpture>
                        </el-image>
                        <div style="font-size: 20px;margin: 10px 0;font-weight: bold">{{form.name||"暂无"}}</div>
                    </div>
                    <div class="baseTitle">&nbsp;&nbsp;基 本 信 息</div>
                    <div class="baseInfo">
                        <el-form-item label="性别">
                            <el-input v-model="form.sex" v-show="!disabled"></el-input>
                            <span v-show="disabled">{{form.sex||"暂无"}}</span>
                        </el-form-item>
                        <el-form-item label="出生日期">
                            <el-date-picker
                                v-model="form.birth"
                                v-show="!disabled"
                                type="date"
                                value-format="yyyy-MM-dd">
                            </el-date-picker>
                            <span v-show="disabled">{{form.birth||"暂无"}}</span>
                        </el-form-item>
                        <el-form-item label="民族">
                            <el-input v-model="form.nation" v-show="!disabled"></el-input>
                            <span v-show="disabled">{{form.nation||"暂无"}}</span>
                        </el-form-item>
                        <el-form-item label="籍贯">
                            <el-input v-model="form.nativePlace" v-show="!disabled"></el-input>
                            <span v-show="disabled">{{form.nativePlace||"暂无"}}</span>
                        </el-form-item>
                        <el-form-item label="文化程度">
                            <el-input v-model="form.education" v-show="!disabled"></el-input>
                            <span v-show="disabled">{{form.education||"暂无"}}</span>
                        </el-form-item>
                    </div>
                    <div class="baseTitle">&nbsp;&nbsp;其 他 信 息 </div>
                    <div class="baseInfo">
                        <el-form-item label="入党时间">
                            <el-date-picker
                                v-model="form.partyTime"
                                v-show="!disabled"
                                type="date"
                                value-format="yyyy-MM-dd"></el-date-picker>
                            <span v-show="disabled">{{form.partyTime||"暂无"}}</span>
                        </el-form-item>
                        <el-form-item label="参加工作时间">
                            <el-date-picker
                                v-model="form.workTime"
                                v-show="!disabled"
                                type="date"
                                value-format="yyyy-MM-dd"></el-date-picker>
                            <span v-show="disabled">{{form.workTime||"暂无"}}</span>
                        </el-form-item>
                        <el-form-item label="担任村书记时长">
                            <el-input v-model="form.onDutyTime" v-show="!disabled"></el-input>
                            <span v-show="disabled">{{form.onDutyTime||"暂无"}}</span>
                        </el-form-item>
                        <el-form-item label="专业职称">
                            <el-input v-model="form.professionalTitle" v-show="!disabled"></el-input>
                            <span v-show="disabled">{{form.professionalTitle||"暂无"}}</span>
                        </el-form-item>
                        <el-form-item label="健康情况">
                            <el-input v-model="form.health" v-show="!disabled"></el-input>
                            <span v-show="disabled">{{form.health||"暂无"}}</span>
                        </el-form-item>

                    </div>
                </div>
                <div style="width:65%;float: left;margin-left: 50px">
                    <div class="otherInfo">
                        <div style="margin:25px 0;">
                            <el-image class="smallTitle"  style="width: 13px;height: 23px;" src="../../../static/img/post.png"></el-image>
                            <span>工作单位及职务</span>
                            <hr style="margin:10px 0;background-color: #171111a8" size="5px">
                            <div style="color: #f93737;font-size: 16px;font-weight: bold;margin-left: 5px;" >{{form.postName||"暂无"}}</div>
                        </div>
                        <div style="margin:25px 0;">
                            <el-image class="smallTitle" style="width: 17px;height: 21px;"  src="../../../static/img/level.png"></el-image>
                            <span>拟评定等级</span>
                            <hr style="margin:10px 0;background-color: #171111a8" size="5px">
                            <div style="font-size: 16px;font-weight: bold;margin-left: 5px;">{{form.name||"暂无"}}</div>
                        </div>
                        <div style="margin:25px 0;">
                            <el-image  class="smallTitle" style="width: 16px;height: 18px;" src="../../../static/img/workExperience.png"></el-image>
                            <span >工作简历</span>
                            <hr style="margin:10px 0;background-color: #171111a8" size="5px">
                            <el-input type="textarea"  v-show="!disabled" v-model="form.workExperience"></el-input>
                            <pre v-show="disabled">{{form.workExperience||"暂无"}}</pre>
                        </div>
                        <!--<div style="margin:25px 0;">
                            <el-image  class="smallTitle" style="width: 18px;height: 19px;" src="../../../static/img/reward.png"></el-image>
                            <span >曾受综合表彰情况</span>
                            <hr style="margin:10px 0;background-color: #171111a8" size="5px">
                            <pre >{{form.comprehensiveCommendation||"暂无"}}</pre>
                        </div>-->
                        <div style="margin:25px 0;">
                            <el-image  class="smallTitle" style="width: 18px;height: 19px;" src="../../../static/img/reward.png"></el-image>
                            <span >曾受综合表彰情况</span>
                            <hr style="margin:10px 0;background-color: #171111a8" size="5px">
                            <el-button v-if="!disabled" @click="add('honours')">添加</el-button>
                            <el-table :data="honoursList" style="width: 100%">
                                <el-table-column prop="achieveTime" label="获取时间" width="200">
                                    <template slot-scope="scope">
                                        <el-date-picker
                                            v-if="currentHonoursIndex === scope.$index"
                                            v-model="scope.row.achieveTime"
                                            type="year"
                                            value-format="yyyy-MM-dd"
                                            placeholder="选择日期">
                                        </el-date-picker>
                                        <span v-else>{{new Date(scope.row.achieveTime).getFullYear()}}年</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="content" label="表彰内容">
                                    <template slot-scope="scope">
                                        <el-input v-if="currentHonoursIndex === scope.$index" type="text" v-model="scope.row.content"></el-input>
                                        <span v-else>{{scope.row.content}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="supportDoc" label="佐证材料">
                                    <template slot-scope="scope">
                                        <CommonFileUpload  :value="scope.row.supportDoc" @getValue="scope.row.supportDoc = $event"
                                                           :disabled = "!(currentHonoursIndex === scope.$index && !disabled)" style="width: 100%;"></CommonFileUpload>
                                        <!-- <el-input v-if="currentHonoursIndex === scope.$index" type="text" v-model="scope.row.supportDoc"></el-input>-->
                                    </template>
                                </el-table-column>
                                <el-table-column fixed="right" label="操作" width="100" v-if="!disabled">
                                    <template slot-scope="scope">
                                        <el-button  type="text" size="small" @click="edit('honours',scope)" v-if="isHonoursEdit">编辑</el-button>
                                        <el-button  type="text" size="small" @click="finish('honours',scope)" v-if="!isHonoursEdit">完成</el-button>
                                        <el-button  type="text" size="small" @click="del('honours',scope)" v-if="isHonoursEdit">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div style="margin:25px 0;">
                            <el-image  class="smallTitle" style="width: 18px;height: 19px;" src="../../../static/img/reward.png"></el-image>
                            <span >报酬情况</span>
                            <hr style="margin:10px 0;background-color: #171111a8" size="5px">
                            <el-button v-if="!disabled" @click="add('rewards')">添加</el-button>
                            <el-table :data="rewardsList" style="width: 100%">
                                <el-table-column prop="achieveTime" label="获取时间" width="200">
                                    <template slot-scope="scope">
                                        <el-date-picker
                                            v-if="currentRewardsIndex === scope.$index"
                                            v-model="scope.row.achieveTime"
                                            type="year"
                                            value-format="yyyy-MM-dd"
                                            placeholder="选择日期">
                                        </el-date-picker>
                                        <span v-else>{{new Date(scope.row.achieveTime).getFullYear()}}年</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="basicReward" label="基本报酬">
                                    <template slot-scope="scope">
                                        <el-input v-if="currentRewardsIndex === scope.$index" type="text" v-model="scope.row.basicReward"
                                                  @change="getSum(scope.row)"></el-input>
                                        <span v-else>{{scope.row.basicReward}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="reviewReward" label="考核报酬">
                                    <template slot-scope="scope">
                                        <el-input v-if="currentRewardsIndex === scope.$index" type="text" v-model="scope.row.reviewReward"
                                                  @change="getSum(scope.row)"></el-input>
                                        <span v-else>{{scope.row.reviewReward}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="otherReward" label="增收奖励">
                                    <template slot-scope="scope">
                                        <el-input v-if="currentRewardsIndex === scope.$index" type="text" v-model="scope.row.otherReward"
                                                  @change="getSum(scope.row)"></el-input>
                                        <span v-else>{{scope.row.otherReward}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="totalReward" label="合计">
                                    <template slot-scope="scope">
                                        <el-input v-if="currentRewardsIndex === scope.$index" type="text" disabled v-model="scope.row.totalReward">
                                        </el-input>
                                        <span v-else>{{scope.row.totalReward}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="supportDoc" label="佐证材料">
                                    <template slot-scope="scope">
                                        <CommonFileUpload  :value="scope.row.supportDoc" @getValue="scope.row.supportDoc = $event"
                                                           :disabled="!(currentRewardsIndex === scope.$index && !disabled)" style="width: 100%;"></CommonFileUpload>
                                        <!-- <el-input v-if="currentHonoursIndex === scope.$index" type="text" v-model="scope.row.supportDoc"></el-input>-->
                                    </template>
                                </el-table-column>
                                <el-table-column fixed="right" label="操作" width="100" v-if="!disabled">
                                    <template slot-scope="scope">
                                        <el-button  type="text" size="small" @click="edit('rewards',scope)" v-if="isRewardsEdit">编辑</el-button>
                                        <el-button  type="text" size="small" @click="finish('rewards',scope)" v-if="!isRewardsEdit">完成</el-button>
                                        <el-button  type="text" size="small" @click="del('rewards',scope)" v-if="isRewardsEdit">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div style="margin:25px 0;">
                            <el-image class="smallTitle"  style="width: 21px;height: 21px;" src="../../../static/img/check.png"></el-image>
                            <span>年度考核情况</span>
                            <hr style="margin:10px 0;background-color: #171111a8" size="5px">
                            <pre>{{form.annualAssessment||"暂无"}}</pre>
                        </div>
                    </div>
                </div>
                <el-button type="primary" plain @click="submit"  class="self-btn self-submit"> 提交</el-button>
            </el-form>
        </div>
<!--        <el-button type="primary" plain @click="verify(slotProps.selected)"   class="self-btn self-submit" v-if="userAuthority!=3"  >审核</el-button>-->
    </div>
</template>


<script>
    import CommonFileUpload from '@/components/FileUpLoad';
    export default {
        name: "SecretaryDetail",
        props: {
            districtId: {
                type: String,
                default: ''
            }
        },
        data(){
            return{
                form:{},
                disabled:true,
                honoursList:[],
                currentHonoursIndex:'',
                currentRewardsIndex:'',
                isHonoursEdit:true,
                rewardsList:[],
                isRewardsEdit:true,
            }
        },
        methods:{
            initPara(){
                this.form={};
                this.disabled=true;
                this.currentHonoursIndex='';
                this.currentRewardsIndex='';
                this.isHonoursEdit=true;
                this.isRewardsEdit=true;
            },
            editInfo(){
                this.disabled = !this.disabled;
                this.currentHonoursIndex='';
                this.currentRewardsIndex='';
                this.isHonoursEdit=true;
                this.isRewardsEdit=true;
            },
            showBaseInfo(){
                this.honoursList = [];
                this.rewardsList = [];
                this.$http('POST',`identity/villageCadres/list`,
                    {post: "SECRETARY",quasiAssessmentRank:"FIRTH_CLASS"},false).then(data => {
                    this.form = data[0];
                    this.honoursList = data[0].honours;
                    this.rewardsList = data[0].rewards;
                });
            },
            edit(type,scope){
                if(type==='honours'){
                    this.currentHonoursIndex = scope.$index;
                    this.isHonoursEdit = false;
                }else if(type==='rewards'){
                    this.currentRewardsIndex = scope.$index;
                    this.isRewardsEdit = false;
                }
            },
            finish(type,scope){
                if(type==='honours'){
                    this.currentHonoursIndex = "";
                    this.isHonoursEdit = true;
                    this.honoursList[scope.$index]= scope.row;
                }else if(type==='rewards'){
                    this.currentRewardsIndex = "";
                    this.isRewardsEdit = true;
                    this.rewardsList[scope.$index]= scope.row;
                }
            },
            del(type,scope){
                if(type==='honours'){
                    this.honoursList.splice(scope.$index,1);
                }else if(type==='rewards'){
                    this.rewardsList.splice(scope.$index,1);
                }
            },
            add(type){
                if(type==='honours'){
                    this.honoursList.push({ cadresId:this.form.id});
                    this.currentHonoursIndex = this.honoursList.length-1;
                    this.isHonoursEdit = false;
                }else if(type==='rewards'){
                    this.rewardsList.push({ cadresId:this.form.id});
                    this.currentRewardsIndex = this.rewardsList.length-1;
                    this.isRewardsEdit = false;
                }
            },
            getSum(row){
                row.totalReward = parseFloat(row.basicReward)+ parseFloat(row.reviewReward) + parseFloat(row.otherReward);
            },
            saveBaseInfo(){
                this.honoursList.forEach(item =>{
                    delete item.id;
                    delete item.version;
                    delete item.isDelete;
                    delete item.createdAt;
                    delete item.modifiedAt;
                    delete item.createdBy;
                    delete item.modifiedBy;
                });
                this.rewardsList.forEach(item =>{
                    delete item.id;
                    delete item.version;
                    delete item.isDelete;
                    delete item.createdAt;
                    delete item.modifiedAt;
                    delete item.createdBy;
                    delete item.modifiedBy;
                });
                this.form.honours = this.honoursList;
                this.form.rewards = this.rewardsList;
                this.$http('PUT',`identity/villageCadres/${this.form.id}id`, this.form,false).then(data => {
                    this.initPara();
                    this.showBaseInfo();
                });
            },
            submit() {
                this.$confirm('确认提交？')
                    .then(_ => {
                        this.$http('PUT', 'identity/villageCadres/submit/' + this.form.id, false).then(content => {
                            this.$forceUpdate();
                        });
                    })
                    .catch(_ => {});
            },

        },
        components:{
            CommonFileUpload,
        },
        created() {
            this.showBaseInfo()
        }
    }
</script>
<style scoped>
    .secretary-detail .headPicture {
        width: 150px;
        height: 150px;
        border-radius: 75px;
        border: 2px white solid;
        box-shadow: 0 0 0 3px #f5ad40;
        overflow: hidden;
    }
    .secretary-detail .baseTitle {
        width: 181px;
        height: 26px;
        background-image: url('../../static/img/titleContentBg.png');
        color: white;
        font-size: 16px;
        line-height: 28px;
        margin: 20px 0;
    }

    .secretary-detail .baseInfo {
        margin: 15px;
        font-size: 15px;
        line-height: 30px;
        font-weight: bold;
    }


    .secretary-detail .baseInfo span{
        text-align: left;
    }

    .secretary-detail .otherInfo{
        margin-top: 50px;
        text-align: left;
    }

    .secretary-detail .otherInfo .smallTitle{
        vertical-align: middle;
        margin-right: 5px;
    }
    .secretary-detail .el-tag--mini {
        height: 30px!important;
        line-height: 30px!important;
    }
    .secretary-detail .el-tag {
        font-size: 16px!important;
    }
</style>
