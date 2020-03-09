<template>
    <section class="rankDetails">
        <div style="text-align: right;padding-right: 25px">
            <el-button  type="warning" @click="() => {this.$emit('back')}"> 返回</el-button>
        </div>
        <div>
            <el-card class="standard">
                <div style="font-weight: bold;font-size: 20px;">选任标准</div>
                <br>
                <div style="text-align: left;font-size: 18px;line-height: 30px">
                    <div>
                        1.专职村书记人选，应当认真学习和忠实践行习近平新时代中国特色社会主义思想，思想政治素质好、道德品行好、带富能力强、协调能力强，
                        懂农村、爱农村、爱农民，依法办事、公道正派、廉洁自律，热心为群众服务、善于做群众工作；
                        <br/><br/>
                        2.新选任的专职村书记，男性一般应在50周岁以下，女性一般应在45周岁以下，具备大专以上的文化程度。特别优秀的，可适当放宽年龄、学历条件；
                        <br/><br/>
                        3.新选任的专职村书记，应具有正常履行职责的身体条件，与岗位相适应的身份条件，且符合任职回避等有关规定。
                    </div>
                </div>
            </el-card>
            <el-card class="standard">
                <div style="font-weight: bold;font-size: 20px;">职级评定</div>
                <br>
                <div style="text-align: left;font-size: 18px;line-height: 30px">
                    <div>
                        符合以下条件的，评定为一级专职村书记：<br/>
                        任村书记1年以上、能力研判合格、上年度专职村书记年度考核获得“称职”及以上等次的。
                        <br/><br/>
                        符合以下条件之一的，评定为二级专职村书记：<br/>
                        （1）任村书记5年以上、能力研判良好、累计3次专职村书记年度考核获得“称职”及以上等次的；<br/>
                        （2）连续3年专职村书记年度考核获得“称职”及以上等次的。
                        <br/><br/>
                        符合以下条件之一的，评定为三级专职村书记：<br/>
                        （1）任村书记10年以上、能力研判良好、连续2年专职村书记年度考核获得“优秀”等次的；<br/>
                        （2）累计5次专职村书记年度考核获得“优秀”等次的；<br/>
                        （3）被评为“千名领先”村书记的。
                        <br/><br/>
                        符合以下条件之一的，评定为四级专职村书记：<br/>
                        （1）任村书记15年以上、能力研判优秀、连续3年专职村书记年度考核在全市排名前10的；<br/>
                        （2）连续5年专职村书记年度考核在全市排名前5的；<br/>
                        （3）在任期间个人获得省委、省政府综合表彰或被评为“百名示范”村书记的。
                        <br/><br/>
                        符合以下条件之一的，评定为五级专职村书记：<br/>
                        （1）任村书记20年以上、能力研判优秀、连续3年专职村书记年度考核在全市排名前3的；<br/>
                        （2）连续5年专职村书记年度考核在全市排名前3的；<br/>
                        （3）在任期间个人获得党中央、国务院表彰的。
                    </div>
                </div>
            </el-card>
        </div>
        <h3 style="clear:both;text-align: left">目前情况</h3>
        <div style="text-align: left">{{secretaryMsg}}</div>
        <table class="tableDetails">
            <tr>
                <td style="width: 130px">职级评定</td>
                <td  v-for="item in standardItem">{{item}}</td>
            </tr>
            <tr v-for="(sub,index) in standardList">
                <td>{{sub.name}}</td>
                <td>
                    <el-tag :type= "Number(sub.workDuration)<=Number(currentInfo.workDuration) ?'success':'danger'" effect="dark">{{sub.workDuration}}</el-tag>
                </td>
                <td>
                    <el-tag v-if="index==0" :type= "currentInfo.abilityJudgement>=1 ?'success':'danger'" effect="dark"> {{sub.abilityJudgementLabel}}</el-tag>
                    <el-tag v-if="index==1" :type= "currentInfo.abilityJudgement>=2 ?'success':'danger'" effect="dark"> {{sub.abilityJudgementLabel}}</el-tag>
                    <el-tag v-if="index==2" :type= "currentInfo.abilityJudgement>=2 ?'success':'danger'" effect="dark"> {{sub.abilityJudgementLabel}}</el-tag>
                    <el-tag v-if="index==3" :type= "currentInfo.abilityJudgement==3 ?'success':'danger'" effect="dark"> {{sub.abilityJudgementLabel}}</el-tag>
                    <el-tag v-if="index==4" :type= "currentInfo.abilityJudgement==3 ?'success':'danger'" effect="dark"> {{sub.abilityJudgementLabel}}</el-tag>
                </td>
                <td>
                    <el-tag v-if="index==0" :type= "currentInfo.lastGrade>=2 ?'success':'danger'" effect="dark"> {{sub.lastGradeLabel}}</el-tag>
                    <span v-else>-</span>
                <td>
                    <el-tag v-if="sub.gradeTimes" :type= "Number(sub.gradeTimes)<=Number(currentInfo.gradeTimes) ?'success':'danger'" effect="dark">{{sub.gradeTimes}}</el-tag>
                    <span v-else>-</span>
                </td>
                <td>
                    <el-tag v-if="sub.gradeLastTimes" :type= "Number(sub.gradeLastTimes)<=Number(currentInfo.gradeLastTimes) ?'success':'danger'" effect="dark">{{sub.gradeLastTimes}}</el-tag>
                    <span v-else>-</span>
                </td>
                <td>
                    <el-tag v-if="sub.agradeLastTimes" :type= "Number(sub.agradeLastTimes)<=Number(currentInfo.agradeLastTimes) ?'success':'danger'" effect="dark">{{sub.agradeLastTimes}}</el-tag>
                    <span v-else>-</span>
                </td>
                <td>
                    <el-tag v-if="sub.agradeTimes" :type= "Number(sub.agradeTimes)<=Number(currentInfo.agradeTimes) ?'success':'danger'" effect="dark">{{sub.agradeTimes}}</el-tag>
                    <span v-else>-</span>
                </td>
                <td>
                    <el-tag v-if="sub.topTenGradeLastTimes" :type= "Number(sub.topTenGradeLastTimes)<=Number(currentInfo.topTenGradeLastTimes) ?'success':'danger'" effect="dark">{{sub.topTenGradeLastTimes}}</el-tag>
                    <span v-else>-</span>
                </td>
                <td>
                    <el-tag v-if="sub.topFiveGradeLastTimes" :type= "Number(sub.topFiveGradeLastTimes)<=Number(currentInfo.topFiveGradeLastTimes) ?'success':'danger'" effect="dark">{{sub.topFiveGradeLastTimes}}</el-tag>
                    <span v-else>-</span>
                </td>
                <td>
                    <el-tag v-if="sub.topThreeGradeLastTimes" :type= "Number(sub.topThreeGradeLastTimes)<=Number(currentInfo.topThreeGradeLastTimes) ?'success':'danger'" effect="dark">{{sub.topThreeGradeLastTimes}}</el-tag>
                    <span v-else>-</span>
                </td>
                <td>
                    <el-tag v-if="sub.honoursType" :type= "currentInfo.honoursType?(currentInfo.honoursType.indexOf(sub.honoursType)!=-1 ?'success':'danger'):'danger'" effect="dark">{{sub.honoursType}}</el-tag>
                    <span v-else>-</span>
                </td>
            </tr>
            <tr style="font-weight: bold">
                <td>目前情况</td>
                <td>{{currentInfo.workDuration}}</td>
                <td>{{currentInfo.abilityJudgementLabel}}</td>
                <td>{{currentInfo.lastGradeLabel||'-'}}</td>
                <td>{{currentInfo.gradeTimes||'-'}}</td>
                <td>{{currentInfo.gradeLastTimes||'-'}}</td>
                <td>{{currentInfo.agradeLastTimes||'-'}}</td>
                <td>{{currentInfo.agradeTimes||'-'}}</td>
                <td>{{currentInfo.topTenGradeLastTimes||'-'}}</td>
                <td>{{currentInfo.topFiveGradeLastTimes||'-'}}</td>
                <td>{{currentInfo.topThreeGradeLastTimes||'-'}}</td>
                <td>{{currentInfo.honoursType||'-'}}</td>
            </tr>

        </table>
    </section>
</template>

<script>
    import LookUp from  '@/lookup';
    export default {
        name: "RankDetails",
        props:{
            currentRankForm:{},
        },
        data(){
            return{
                secretaryMsg:'宝华村书记张三，担任村书记5年，年龄45周岁，文化程度大专，符合员额准入，可申请员额村书记职级评定',
                standardList:[],
                standardItem:["担任村书记时长","能力研判","上年度专职村书记考核等次","年度考核获得“称职”及以上等次的累计次数",
                    "年度考核获得“称职”及以上等次连续次数","年度考核获得“优秀”等次连续次数","年度考核获得“优秀”等次的累计次数",
                    "年度考核获得前10连续次数","年度考核获得前5连续次数","年度考核获得前3连续次数","表彰情况"],
                currentInfo:{
                    workDuration: "6",
                    abilityJudgement: "良好",
                    lastGrade: "称职",
                    gradeTimes: '2',
                    gradeLastTimes: '2',
                    topTenGradeLastTimes: '0',
                    topFiveGradeLastTimes: '0',
                    topThreeGradeLastTimes: '0',
                    honoursType: '千名领先,省委、省政府表彰或百名示范',
                    agradeLastTimes: '0',
                    agradeTimes: '0'
                },
            }
        },
        methods:{
            showStandardList(){
                this.$http('POST',`identity/ratingStandard/list?sort=createdAt,asc`,{isStandard:'1'},false).then(data => {
                    this.standardList = data;
                    this.standardList.forEach(item =>{
                        if(item.abilityJudgement){
                            item.abilityJudgementLabel = LookUp["AbilityJudgement"].filter(sub => sub.value===item.abilityJudgement)[0].label;
                        }
                        if(item.lastGrade){
                            item.lastGradeLabel =  LookUp["CheckGrade"].filter(sub => sub.value===item.lastGrade)[0].label;
                        }
                    });
                });
            },
            showCurrentInfo(){
                this.currentInfo = this.currentRankForm;
                this.currentInfo.abilityJudgementLabel = LookUp["AbilityJudgement"].filter(item => item.value===this.currentInfo.abilityJudgement)[0].label;
                this.currentInfo.lastGradeLabel =  LookUp["CheckGrade"].filter(item => item.value===this.currentInfo.lastGrade)[0].label;
            }
        },
        components:{
            LookUp,
        },
        created(){

            this.showStandardList();
            this.showCurrentInfo();
        }
    }
</script>

<style scoped>
    .rankDetails .standard{
        float: left;
        width: 45%;
        margin: 20px 2%
    }
    .rankDetails .tableDetails{
        font-size: 16px;
    }

    table {
        border-top: 1px solid #999;
        border-left: 1px solid #999;
        border-spacing: 0;/*去掉单元格间隙*/
    }
    table td {
        min-width: 100px;
        border-bottom: 1px solid #999;
        border-right: 1px solid #999;
    }

</style>
