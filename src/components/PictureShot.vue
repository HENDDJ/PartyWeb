<template>
    <div>
    <el-row class="detail-row">
        <el-col :span="4">电视截图：</el-col>
        <el-col :span="8" v-if="TvPic.length === 0" style="color: rgba(37, 37, 37, 0.51)">
            暂无截图记录！
        </el-col>
        <el-col :span="8" v-else style="padding-top: 8px;">
            <viewer :images="TvPicFull">
                <el-timeline>
                    <el-timeline-item
                        v-for="(activity, index) in TvPic"
                        :key="index"
                        :timestamp="activity.timestamp | dateServer"
                        placement="top"
                        v-if="index<2">
                        <img
                            :src="TvPicFull[index]"
                            :key="index"
                            style="width: 225px"
                        >
                    </el-timeline-item>
                </el-timeline>
            </viewer>
        </el-col>

        <el-col :span="6" >
            <el-button  v-if="TvPic.length !== 0" type="text" @click="TvMore">更多</el-button>
        </el-col>

    </el-row>
    <el-row class="detail-row">
        <el-col :span="4">手机截图：</el-col>
        <el-col :span="8" v-if="PhonePic.length === 0" style="color: rgba(37, 37, 37, 0.51)">
            暂无截图记录！
        </el-col>
        <el-col v-else :span="8" style="padding-top: 8px;">
            <viewer :images="PhonePicFull">
                <el-timeline>
                    <el-timeline-item
                        v-for="(activity, index) in PhonePic"
                        :key="index"
                        :timestamp="activity.timestamp | dateServer"
                        placement="top"
                        v-if="index<2">
                        <img
                            :src="PhonePicFull[index]"
                            :key="index"
                            style="width: 225px"
                        >
                    </el-timeline-item>
                </el-timeline>
            </viewer>
        </el-col>
        <el-col :span="6" >
            <el-button v-if="PhonePic.length !== 0" type="text" @click="PhonePicShow">更多</el-button>
        </el-col>
    </el-row>
        <el-dialog
            v-if="picDetail"
            title="更多图片"
            :visible.sync="picDetail"
            width="820px"
            align="left"
            :modal-append-to-body='false'
            :append-to-body="true"
            :before-close="picDetailClose">
            <el-row>
                <div style="width: 100%;text-align: center;padding-bottom: 5px;">
                    <h4 style="text-align: left;line-height: 2;display: inline-block" v-if="timeLines[0] || timeLines[1] ">会议时间：<a style="font-weight: 100;color: #909399">{{timeLines[1]|dateServer}} — {{timeLines[0]|dateServer}}</a></h4>
                    <h4 style="text-align: right;line-height: 2;display: inline-block;margin-left: 25%" v-if="timeLines[0] && timeLines[1] ">时长：<a style="font-weight: 100;color: #909399">{{timeLength}}</a></h4>
                </div>
            </el-row>
            <el-row>
                <el-col :span="3">
                    &nbsp;
                </el-col>
                <el-col :span="18">
                    <viewer :images="TvPicFull">
                        <el-timeline>
                            <el-timeline-item
                                v-for="(activity, index) in TvPic"
                                :key="index"
                                :timestamp="activity.timestamp | dateServer"
                                placement="top">
                                <img
                                    :src="TvPicFull[index]"
                                    :key="index"
                                    style="width: 100%"
                                >

                            </el-timeline-item>
                        </el-timeline>
                    </viewer>
                </el-col>
            </el-row>

        </el-dialog>
        <el-dialog
            v-if="picPhoneDetail"
            title="更多图片"
            :visible.sync="picPhoneDetail"
            width="820px"
            align="left"
            :modal-append-to-body='false'
            :append-to-body="true"
            :before-close="picPhoneDetailClose">
            <el-row>
                <el-col :span="3">
                    &nbsp;
                </el-col>
                <el-col :span="18">
                    <viewer :images="PhonePicFull">
                        <el-timeline>
                            <el-timeline-item
                                v-for="(activity, index) in PhonePic"
                                :key="index"
                                :timestamp="activity.timestamp | dateServer"
                                placement="top">
                                <img
                                    :src="PhonePicFull[index]"
                                    :key="index"
                                    style="width: 100%"
                                >

                            </el-timeline-item>
                        </el-timeline>
                    </viewer>
                </el-col>
            </el-row>

        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "PictureShot",
        props: {
            picData:{}
        },
        data(){
            return{
                TvPic: [],
                TvPicFull:[],
                picDetail:false,
                PhonePic:[],
                PhonePicFull:[],
                picPhoneDetail:false,
                timeLines:[]
            }
        },
        methods:{
            details(item){
                this.TvPic = []
                this.PhonePic = []
                this.PhonePicFull = []
                this.TvPicFull = []
                let path = `/identity/parPictureInfro/page?page=0&size=500&sort=CreateTime,desc`;
                let form = {organizationId:item.districtId,studyContent:item.activityId}
                let timeAll = []
                this.$http("Post",path,form,false).then(data=>{
                    data.content.forEach((item,index)=>{
                        if(index<6) {
                            let formItem = {}
                            formItem.timestamp = item.createTime
                            formItem.imgurl = item.imageURL
                            this.TvPic.push(formItem)
                            this.TvPicFull.push(this.imgTF(item.imageURL))
                        }
                        timeAll.push(item.createTime)
                        this.timeLines = []
                        this.timeLines[0] = timeAll[0]
                        this.timeLines[1] = timeAll[timeAll.length -1]
                    })

                }).catch(()=>{
                    this.$message({
                        type: 'warning',
                        message: '电视截图拉取失败'
                    })
                })
                let phonePath = `/identity/parActivityFeedback/phonePage?page=0&size=6&sort=time,desc`;
                let phoneForm = {userId:item.districtId,snId:item.activityId}
                this.$http("Post",phonePath,phoneForm,false).then((data)=>{
                    if (!data.content[0]) {
                        return;
                    }
                    let i = 0
                    for(let j = 0;j<data.content.length;j++){
                        if(data.content[j].imageUrl){
                            i = j
                            break;
                            return;
                        }
                        else if(data.content.length -1 == j){
                            break;
                            return;
                            }
                            else {
                                continue;
                            }
                        }


                    if(!data.content[i].imageUrl){
                        return;
                    }
                    data.content[i].imageUrl.forEach((item)=>{
                        item.time = data.content[i].time;
                        let formItem = {};
                        formItem.timestamp =data.content[i].time;
                        formItem.imgurl = data.content[i].imageUrl;
                        this.PhonePic.push(formItem);
                        this.PhonePicFull.push(this.imgTFPhone(item));
                    })
                }).catch((res)=>{
                    this.$message({
                        type: 'error',
                        message: '手机截图拉取失败'+res
                    });
                    console.log(res)
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
                        return `http://jrweixin.zj96296.com:18006/JRPartyService/Upload/PhotoTakeUpload/${item.imageUrl}`
                    }else {
                        let time1 = item.time.toString().split("T")[0]
                        let time2 =  Number(time1.split("-")[0])
                        let time3 = Number(time1.split("-")[1])
                        let time4 = Number(time1.split("-")[2])
                        let time5 = time3.toString()+time4.toString()
                        return `http://jrweixin.zj96296.com:18006/JRPartyService/Upload/PhotoTakeUpload/${time2}/${time5}/${item.userId}/${imgUrl}`
                    }
                }else {
                    return item.imageUrl
                }
                },
            //关闭详情
            picDetailClose() {
                this.picDetail = false;
            },
            //关闭详情
            picPhoneDetailClose() {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        this.picPhoneDetail = false;
                        done();
                    })
                    .catch(_ => {
                    });
            },
            TvMore(){
                this.picDetail = true
            },
            PhonePicShow(){
                this.picPhoneDetail = true
            },
        },
        computed:{
            //会议时常
            timeLength(){
                if(this.timeLines[0]&&this.timeLines[1]){
                    let sec1=parseInt(this.timeLines[0].substr(11,2))*60*60+parseInt(this.timeLines[0].substr(14,2))*60+parseInt(this.timeLines[0].substr(17,2));
                    let sec2=parseInt(this.timeLines[1].substr(11,2))*60*60+parseInt(this.timeLines[1].substr(14,2))*60+parseInt(this.timeLines[0].substr(17,2));
                    let interval = Math.abs(sec2-sec1)
                    console.log(interval)
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
        created() {
            this.details(this.picData);
        }

    }
</script>

<style scoped>

</style>
