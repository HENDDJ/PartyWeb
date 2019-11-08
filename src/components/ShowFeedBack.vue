<template>
    <div class="showFeedBack">
        <el-card v-for="item in feedBackItemList" :key="item.id"  shadow="hover" >
            <div slot="header" class="clearfix">
                <span style="font-size: 15px;font-weight: bold">{{item.name}}</span>
            </div>
            <CommonFileUpload :value="item.value" @getValue="item.value = $event" :disabled = "true"  v-if="item.type === 'File'&&item.value " style="margin-top: -20px;margin-bottom: 15px"></CommonFileUpload>
            <div v-if="item.type === 'Image'&&item.value  ">
                <el-carousel  type="card" arrow="always" height="150px" :autoplay=false>
                    <el-carousel-item v-for="sub in item.value.indexOf(',')>0 ? item.value.split(',') : item.value " :key="sub" v-if="item.value">
                        <img :src=sub style="width: 100%;height: 100%;">
                    </el-carousel-item>
                </el-carousel>
            </div>
            <div v-if="item.type === 'String'&&item.value " style="margin: 20px;" >{{item.value}}</div>
            <div v-if="!item.value"  style="margin: 20px;">暂无内容</div>
        </el-card>
    </div>
</template>

<script>
    import CommonFileUpload from '@/components/FileUpLoad';
    import CommonImageUpload from '@/components/UpLoad';

    export default {
        name: "show-feed-back",
        props: {
            fileData:{

            }
        },
        data(){
            return {
                feedBackItemList:[],
            }
        },
        components:{
            CommonFileUpload,
            CommonImageUpload,
        },
        methods: {
            showFeedBackItem(objectId){
                this.$http('POST',`/identity/feedbackItemValue/list`,{objectId:objectId},false).then((data)=>{
                    this.feedBackItemList = data;
                });
            },
        },
        created(){
            this.showFeedBackItem(this.fileData.objectId);
        }
    }
</script>

<style scoped>
    .showFeedBack .el-card{
        border: none;
    }
  /*  .showFeedBack .el-card  .el-carousel__item--card{
        width: 100% !important;
    }*/

  /*  .showFeedBack .el-card .carousel-arrow-left-enter, .carousel-arrow-right-leave-active{
        transform: translateY(-70%) translateX(-10px)!important;

    }
    .showFeedBack .el-card .carousel-arrow-left-enter, .carousel-arrow-left-leave-active{
        transform: translateY(-70%) translateX(-10px)!important;

    }*/


</style>
