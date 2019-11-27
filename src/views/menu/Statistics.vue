<template>
    <section class="statistics">
        <div style="position: absolute;right: 0;top: 6px;">
            <el-date-picker
                size="mini"
                v-model="year"
                align="right"
                type="year"
                placeholder="选择年" @change="loadTables()">
            </el-date-picker>
            <el-select v-model="districtId" placeholder="请选择" @change="loadTables()" size="mini" v-if="this.user.sysDistrict.districtLevel==1">
                <el-option
                    v-for="item in districtList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-radio-group v-model="radioName" size="mini" style="display: inline-block;position: relative;width: 115px !important;top:1px;" @change="handleRadioGroup" v-if="this.user.sysDistrict.districtLevel==1">
                <el-radio-button label="农村"></el-radio-button>
                <el-radio-button label="机关" ></el-radio-button>
            </el-radio-group>
            <el-button style="padding: 4px 10px;position: relative;top: 2px;" type="primary" icon="el-icon-printer" size="mini" @click="print()">打印</el-button>
        </div>
        <div>
            <el-button  @click="controlPicture(!pictureCollapse)" style="position: absolute;right: -30px;top: 80px;">反馈</el-button>
        </div>

        <div class='wholeContent' >
            <div class="contentDiv" style="border: 1px rgba(227,213,213,0.55) solid" >
                <p class="titleContent">{{toneName+"活动完成情况一览表"}}</p>
                <div style="display: flex">
                    <div>
                        <div class="tableline">
                            <p style="line-height: 50px; text-align: right;padding-right: 10px;">任务</p>
                            <p style="line-height: 50px; text-align: left;padding-left: 10px;">村名</p>
                        </div>
                        <table id="org-label-key" style="overflow-x: scroll;overflow-y: hidden;max-height: 620px;margin-top: 1px;" class="tableCol">
                            <tr v-for="(value,key) in activityList" v-if="key!='title'">
                                <td class="tableColContent" :title="key"> {{key}}</td>
                            </tr>
                        </table>
                    </div>
                    <div class="result-table">
                        <div class="activity-label" id="activity-label-key">
                            <div style="position: absolute;right: 5px;top:70px;">
                                <el-button @click="scrollTo('left')" type="text" icon="el-icon-caret-left"></el-button>
                                <el-button @click="scrollTo('right')" style="margin-left: -10px" type="text" icon="el-icon-caret-right"></el-button>
                            </div>
                            <table class="tableContent" >
                                <tr>
                                    <td v-for="item in activityList.title">
                                        <button type="text" >{{item}}</button>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <table id="result-table-content" class="tableContent" style="margin-top: -7px;overflow: scroll;max-height: 620px;" @scroll="handleScroll">
                            <tr v-for="(value,key) in activityList"  v-if="key!='title'">
                                <td class="sta-content" v-for="(index,item) in value"  >
                                    <div style="background-color: #39c667;line-height: 25px;height: 25px;" v-if="index.status=='2'" @click="showPictures(index)">已完成</div>
                                    <div style="background-color: #DC143C;line-height: 25px;height: 25px;"  v-else-if="index.status!='2' && (index.objectId !== null)" >未完成</div>
                                    <div style="background-color: #DC7F51;line-height: 25px;height: 25px;"  v-else-if="index.status== null && (index.objectId === null)">未指派</div>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <div class="pictureshow" style="border: 1px rgba(227,213,213,0.55) solid" v-show="pictureVisible">
                <p class="titleContent">{{countryName+"活动执行情况"}}</p><br/>
                <div v-if="tipShow">请选择需要查看的任务记录！</div>
                <div id="div-with-loading" class="vs-con-loading__container" v-show="!pictureShow"></div>
                <div v-if="!feedBackVis">
                    <div v-if="pictureShow">
                    <el-row class="detail-row">
                        <div v-if="TvPic.length != 0" class="detail-time">
                            <p>{{"时间："+new Date(TvPic[TvPic.length-1].timestamp).Format('yyyy-MM-dd HH:mm:ss')+" --  "+new Date(TvPic[0].timestamp).Format('yyyy-MM-dd HH:mm:ss')}}</p>
                            <p style="margin-bottom: 10px">{{"时长："+ meetDuration}}</p>
                        </div>
                        <el-col :span="2" v-if="TvPic.length === 0" ><icon name="tv" scale="3" style="vertical-align: sub;margin-left: 8px;"></icon></el-col>
                        <el-col :span="20" v-if="TvPic.length === 0" style="color: rgba(37, 37, 37, 0.51);padding-left: 40px;text-align: left;">
                            暂无截图记录！
                        </el-col>
                        <el-col :span="8" v-else style="padding-top: 8px;margin-left: 60px;">
                            <viewer :images="TvPicFull">
                                <el-timeline>
                                    <el-timeline-item
                                        v-for="(activity, index) in TvPic"
                                        :key="index"
                                        :timestamp="new  Date(activity.timestamp).Format('yyyy-MM-dd HH:mm:ss')"
                                        placement="top">
                                        <div style="margin-left: -98px;float: left; margin-top: -30px;"><icon name="tv" scale="3" style="vertical-align: sub"></icon></div>
                                        <img
                                            :src="TvPicFull[index]"
                                            :key="index"
                                            style="width: 280%">
                                    </el-timeline-item>
                                </el-timeline>
                            </viewer>
                        </el-col>
                    </el-row>
                    <el-row class="detail-row" style="padding-bottom: 20px;margin-top: 20px">
                        <el-col :span="2" v-if="PhonePic.length === 0"><icon name="mobile" scale="3" style="vertical-align: sub;margin-left: 11px;"></icon></el-col>
                        <el-col :span="20" v-if="PhonePic.length === 0" style="color: rgba(37, 37, 37, 0.51);padding-left: 40px;text-align: left;">
                            暂无截图记录！
                        </el-col>
                        <el-col v-else :span="8" style="padding-top: 8px;margin-left: 60px;">
                            <viewer :images="PhonePicFull">
                                <el-timeline>
                                    <el-timeline-item
                                        v-for="(activity, index) in PhonePic"
                                        :key="index"
                                        :timestamp="new Date(activity.timestamp).Format('yyyy-MM-dd HH:mm:ss')"
                                        placement="top">
                                        <div style="margin-left: -97px;float: left; margin-top: -30px;"><icon name="mobile" scale="3" style="vertical-align: sub"></icon></div>
                                        <img
                                            :src="PhonePicFull[index]"
                                            :key="index"
                                            style="width: 280%">
                                    </el-timeline-item>
                                </el-timeline>
                            </viewer>
                        </el-col>
                    </el-row>
                </div>
                </div>
                <div v-if="feedBackVis">
                    <el-row v-for="item in feedBackItemList" :key="item.id" v-if="pictureShow">
                        <el-col :span="4">{{item.name}}：</el-col>
                        <el-col :span="16" style="color: #25252582" v-if="item.type === 'String' ">
                            <span>{{item.value}}</span>
                        </el-col>
                        <el-col :span="16" style="color: #25252582" v-if="item.type === 'File' ">
                            <CommonFileUpload :value="item.value" @getValue="item.value = $event" :disabled = "true" style="width: 100%;"></CommonFileUpload>
                        </el-col>
                        <el-col :span="16" style="color: #25252582" v-if="item.type === 'Image' ">
                            <span v-if="!item.value">暂无图片</span>
                            <viewer v-if="item.value">
                                <img v-for="sub in item.value.split(',')" style="margin-bottom: 20px;width: 100%"
                                    :src="sub"
                                    :key="sub">
                            </viewer>
                        </el-col>
                    </el-row>
                  <!--  <FeedBackFile :fileData="fileQuery" style="text-align: left!important;"></FeedBackFile>-->
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import PictureShot from '@/components/PictureShot';
    import FeedBackFile from '@/components/FeedBackFile';
    import CommonFileUpload from '@/components/FileUpLoad';


    export default {
        name: "Statistics",
        data(){
            return{
                activityList:'',
                year:'',
                user:{},
                districtId:'',
                districtList:[],
                organizationId: '',
                activityId: '',
                pictureShow:false,
                countryName:'',
                toneName:'',
                tipShow:true,
                TvPic: [],
                TvPicFull:[],
                PhonePic:[],
                PhonePicFull:[],
                meetDuration:'',
                pictureCollapse:false,
                pictureVisible:false,
                queryVisible:false,
                objectType: '',
                districtType:'',
                radioName:'',
                feedBackVis:'',
                objectId:'',
                feedBackItemList:[],
            }
        },
        methods:{
            aa(sub){
              alert("12");
            },
            queryTable(objectType,districtType){
                this.objectType = objectType;
                this.districtType = districtType;
                this.showDistrictList();
            },
            loadTables(){
                if(!this.year){
                    this.year=new Date();
                }
                if(!this.objectType){
                    this.objectType = this.user.sysDistrict.districtType=='Party' ? '1':'2';
                    this.radioName = this.user.sysDistrict.districtType=='Party' ? '农村':'机关';
                }
                if(this.user.sysDistrict.districtLevel==3){
                    this.districtId = this.user.districtId;
                    this.toneName = this.user.organizationName;
                }else{
                    if(!this.districtId){
                        if(this.districtList.length>1){
                            this.districtId = this.user.districtId;
                        }else{
                            this.districtId = this.districtList[0].value;
                        }
                        this.toneName = this.user.organizationName;
                    }
                    this.toneName = this.districtList.filter( item => item.value==this.districtId)[0].label;
                }
                if(!this.districtType){
                    this.districtType = this.user.sysDistrict.districtType;
                }
                this.$http('post',`identity/parActivity/list/completion?year=${new Date(this.year).Format("yyyy")}&districtId=${this.districtId}&objectType=${this.objectType}&districtType=${this.districtType}`,false).then( data => {
                    this.activityList = data;
                });
            },
            //查询框下拉项
            showDistrictList(){
                this.districtList = [];
                this.districtId ='';
                if(!this.districtType){
                    this.districtType = this.user.sysDistrict.districtType;
                }
                //镇级组织
                this.$http('POST',`identity/sysDistrict/list`,{districtLevel:2,districtType: this.districtType},false).then(data => {
                    data.forEach( item => {
                        this.districtList.push( {value:item.districtId , label:item.districtName});
                    });
                    this.districtList.push({value:'01',label:'句容市委'});
                    this.loadTables();
                })
            },
            showPictures(item){
                this.controlPicture(true);
                this.$nextTick(()=>{
                    this.tipShow = false;
                    if(item.objectType === '1'){
                        this.feedBackVis = false;
                        this.pictureShow=false;
                        this.details(item);
                    }else if(item.objectType.indexOf('2')===0){
                        this.feedBackVis = false; //销毁组件，重新渲染
                        setTimeout(()=>{
                            this.feedBackVis = true;
                            this.objectId = item.objectId;
                            this.$http('POST',`/identity/feedbackItemValue/list`,{objectId:item.objectId},false).then((data)=>{
                                this.feedBackItemList = data;
                            });

                        },50);
                    }
                    this.$vs.loading({
                        container: '#div-with-loading',
                        scale: 0.9
                    });
                    this.countryName = item.districtName;
                    this.organizationId = item.organizationId;
                    this.activityId = item.activityId;
                    this.$nextTick( () => {
                        this.$vs.loading.close('#div-with-loading > .con-vs-loading');
                        setTimeout( ()=> {
                            this.$nextTick( ()=>{
                                this.pictureShow = true;
                            })
                        }, 1000);
                    })

                });
            },
            details(item){
                this.TvPic = [];
                this.PhonePic = [];
                this.PhonePicFull = [];
                this.TvPicFull = [];
                let path = `/identity/parPictureInfro/list?sort=CreateTime,desc`;
                let form = {organizationId:item.organizationId,studyContent:item.activityId}
                this.$http("Post",path,form,false).then(data=>{
                    data.forEach(item=>{
                        let formItem = {};
                        formItem.timestamp =item.createTime;
                        formItem.imgurl = item.imageURL;
                        this.TvPic.push(formItem);
                        this.TvPicFull.push(this.imgTF(item.imageURL));
                    });
                    if(data.length>0){
                        this.handleTime(data[data.length-1].createTime,data[0].createTime);
                    }
                }).catch((res)=>{
                    this.$message({
                        type: 'warning',
                        message: '电视截图拉取失败'+res
                    })
                });
                let phonePath = `/identity/parActivityFeedback/phonePage?page=0&size=30&sort=time,desc`;
                let phoneForm = {userId:item.organizationId,snId:item.activityId}
                this.$http("Post",phonePath,phoneForm,false).then((data)=>{
                    if (data.content.length && data.content.length > 0) {
                        for (let i = 0; i < data.content.length; i++) {
                            if (data.content[i].imageUrl) {
                                console.log(data.content[i].imageUrl)
                                data.content[i].imageUrl.forEach((item) => {
                                    item.time = data.content[i].time;
                                    let formItem = {};
                                    formItem.timestamp = data.content[i].time;
                                    formItem.imgurl = data.content[i].imageUrl;
                                    this.PhonePic.push(formItem);
                                    this.PhonePicFull.push(this.imgTFPhone(item));
                                });
                            }
                        }}
                }).catch((res)=>{
                    this.$message({
                        type: 'error',
                        message: '手机截图拉取失败'+res
                    });
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
                        if(new Date(item.time)<new Date("2018-11-23T00:00:00")){
                            return `http://jrweixin.zj96296.com:18006/JRPartyService/Upload/PhotoTake/${item.imageUrl}`
                        }else {
                            return `http://jrweixin.zj96296.com:18006/JRPartyService/Upload/PhotoTakeUpload/${item.imageUrl}`
                        }
                    }else {
                        let time1 = item.time.toString().split("T")[0];
                        let time2 =  Number(time1.split("-")[0]);
                        let time3 = Number(time1.split("-")[1]);
                        let time4 = Number(time1.split("-")[2]);
                        let time5 = time3.toString()+time4.toString();
                        if(new Date(item.time)<new Date("2018-11-23T00:00:00")){
                            return `http://jrweixin.zj96296.com:18006/JRPartyService/Upload/PhotoTake/${item.imageUrl}`
                        }else {
                            return `http://jrweixin.zj96296.com:18006/JRPartyService/Upload/PhotoTakeUpload/${time2}/${time5}/${item.userId}/${imgUrl}`
                        }
                    }
                }else {
                    return item.imageUrl;
                }
            },
            print(){
                let page = document.getElementsByClassName("contentDiv")[0];
                let newStr = page.innerHTML;
                let styleCollection = document.getElementsByTagName("style");
                let styleStr = Array.from(styleCollection).map(item => item.innerHTML).join(" ");
                let newWin = window.open(''); //新开空白标签页
                newWin.focus(); //获取焦点
                newWin.document.body.innerHTML = newStr +"<style>" +styleStr+ "</style>";
                newWin.print();
            },
            handleTime (time1,time2) {
                let start_time = Date.parse(new Date(time1));//开始时间的时间戳
                let end_time = Date.parse(new Date(time2));//结束时间的时间戳
                if (start_time>end_time) {
                    //  截止时间已过
                    return false
                }else {
                    //计算相差天数
                    let time_dis = end_time - start_time;
                    /*   var days=Math.floor(time_dis/(24*3600*1000));
                       //计算出小时数
                       var leave1=time_dis%(24*3600*1000);//计算天数后剩余的毫秒数*/
                    let hours = Math.floor(time_dis/(3600*1000));
                    //计算相差分钟数
                    let leave1 =time_dis%(3600*1000);//计算小时数后剩余的毫秒数
                    let minutes=Math.floor(leave1/(60*1000));
                    //计算相差秒数
                    /*   var leave3=leave2%(60*1000);//计算小时数后剩余的毫秒数
                       var second = leave3/1000;*/
                    if(hours>0){
                        this.meetDuration = hours+"小时"+minutes+"分钟";
                    }else{
                        this.meetDuration = minutes+"分钟";
                    }
                }
            },
            controlPicture(value){
                if(value){
                    this.pictureVisible = true;
                    document.getElementsByClassName('contentDiv')[0].style.width= '68%';
                    document.getElementsByClassName("contentDiv")[0].style.marginLeft='-25px';
                    document.getElementsByClassName("wholeContent")[0].style.width='100%';
                    this.pictureCollapse = value;
                }else{
                    this.pictureVisible = false;
                    document.getElementsByClassName('contentDiv')[0].style.width= '100%';
                    document.getElementsByClassName("contentDiv")[0].style.marginLeft='0';
                    document.getElementsByClassName("wholeContent")[0].style.width='99%';
                    this.pictureCollapse = value;
                }

            },
            handleScroll(e) {
                document.getElementById('activity-label-key').scrollLeft = e.target.scrollLeft;
                document.getElementById('org-label-key').scrollTop = e.target.scrollTop;
            },
            scrollTo(type) {
                if (type === 'left') {
                    document.getElementById('result-table-content').scrollLeft -= 400;
                    document.getElementById('activity-label-key').scrollLeft -= 400;

                } else {
                    document.getElementById('result-table-content').scrollLeft += 400;
                    document.getElementById('activity-label-key').scrollLeft += 400;
                }
            },
            handleRadioGroup(value) {
                if (value === '农村') {
                    this.radioName = '农村';
                    this.queryTable('1', 'Party');
                } else if (value=== '机关') {
                    this.radioName = '机关';
                    this.queryTable('2', 'Office')
                } else {
                    console.log('类型错误')
                }
            }
        },
        components:{
            FeedBackFile,
            CommonFileUpload
        },
        computed:{
            fileQuery() {
                return {
                    objectId:this.objectId,
                }
            },
        },
        created() {
            this.user = JSON.parse(sessionStorage.getItem("userInfo"));
            this.showDistrictList();
        }
    }
</script>

<style scoped>
    tr button {
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        font-size: 16px;
        font-weight: bold;
    }
    .tableline{
        position:relative;
        width:100px;
        height:100px;
        box-sizing:border-box;
        border:1px solid rgba(227,213,213,0.55);
    }

    .result-table {
        width: calc(100% - 100px);
        overflow-x: scroll;
        position: relative;
    }

    .tableline::before{
        content:"";
        position:absolute;
        left:0;
        top:0;
        width:100%;
        height:50px;
        box-sizing:border-box;
        border-bottom:1px solid rgba(227,213,213,0.55);
        transform-origin:bottom center;
        transform:rotateZ(45deg) scale(1.414);
    }
    #div-with-loading{
        background-color: transparent!important;
        width: 200px;
        height: 200px;
        margin: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
    }
    .pictureshow{
        width: 30%;
        display: inline-block;
        vertical-align: top;
    }
    .contentDiv{
        overflow-x: auto;
        text-align:center;
        width: 100%;
        display: inline-block;
    }
    .tableCol{
        width:106px;
        display: inline-block;
        vertical-align: top;
        margin-top: -3px;
        margin-left: -5px;
    }
    .tableCol td{
        height: 100px;
        font-size: 16px;
    }
    .tableColContent{
        background-color: #f3f3f3;
        width: 100px;
        font-family:' 黑体';
        font-weight:bold;
        line-height:25px;
        font-size: 12px!important;
        height: 25px!important;
        text-align: center;
        overflow:hidden;
        text-overflow:ellipsis;
        display:-webkit-box;
        -webkit-line-clamp:1;
        -webkit-box-orient:vertical;
        padding-left: 5px;
        padding-right: 5px;
    }
    .tableCol::-webkit-scrollbar {
        width: 0;
    }
    .tableContent{
        width: 100%;
        display: inline-block;
        text-align: center;
        margin-top: -3px;
    }

    .tableContent button{
        height: 100px;
        width: 100px;
        padding:3px 3px;
        border-radius:4px;
        background-color: #F4F4F4;
        font-size: 14px;
    }
    .tableContent > tr > td > div{
        height: 25px;
        width: 100px;
    }
    .tableContent .sta-content{
        width: 100px;
        font-size: 12px;
        color: white;
        height: 25px;
    }
    .tableContent .sta-content :hover{
        cursor: pointer;
    }
   .titleContent{
        border-bottom: 1px rgba(227,213,213,0.55) solid;
        line-height: 45px;
        font-size: 20px;
        font-weight: bold;
    }
    .detail-time p{
        text-align: left;
        font-size: 14px;
        font-weight: bold;
        margin-left: 15px;
        line-height: 30px;
    }
    .wholeContent{
        width: 99%;
    }
    .pictureshow .el-col {
        margin: 15px 10px;
        font-weight: bold;
        text-align: left!important;
        font-size: 14px;
    }
</style>
<style>
    .pictureshow .con-vs-loading{
        background: transparent!important;
    }
    .activity-label {
        width: calc(100% - 5px);
        overflow-x: hidden;
    }
    .activity-label::-webkit-scrollbar {
        width: 0;
    }
    .statistics td {
        padding: 0px;
    }

</style>
