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
                        :timestamp="activity.timestamp"
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
                        :timestamp="activity.timestamp"
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
                <el-col :span="3">
                    &nbsp;
                </el-col>
                <el-col :span="18">
                    <viewer :images="TvPicFull">
                        <el-timeline>
                            <el-timeline-item
                                v-for="(activity, index) in TvPic"
                                :key="index"
                                :timestamp="activity.timestamp"
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
                                :timestamp="activity.timestamp"
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
            }
        },
        methods:{
            details(item){
                this.TvPic = []
                this.PhonePic = []
                this.PhonePicFull = []
                this.TvPicFull = []
                let path = `/identity/parPictureInfro/page?page=0&size=6&sort=CreateTime,desc`;
                let form = {organizationId:item.districtId,studyContent:item.activityId}
                this.$http("Post",path,form,false).then(data=>{
                    data.content.forEach(item=>{
                        let formItem = {}
                        formItem.timestamp =item.createTime
                        formItem.imgurl = item.imageURL
                        this.TvPic.push(formItem)
                        this.TvPicFull.push(this.imgTF(item.imageURL))
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
                    console.log(data,11)
                    data.content[0].imageUrl.forEach((item)=>{
                        item.time = data.content[0].time;
                        let formItem = {};
                        formItem.timestamp =data.content[0].time;
                        formItem.imgurl = data.content[0].imageUrl;
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
        created() {
            this.details(this.picData);
        }

    }
</script>

<style scoped>

</style>
