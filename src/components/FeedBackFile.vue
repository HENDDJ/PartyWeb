<template>
    <div>
        <el-row class="detail-row" v-for="item in feedBackItemList" :key="item.id">
            <el-col :span="4">{{item.name}}：</el-col>
            <el-col :span="16" style="color: #25252582" v-if="item.type === 'String' ">
                {{item.value}}
            </el-col>
            <el-col :span="16" style="color: #25252582" v-if="item.type === 'File' ">
                <CommonFileUpload :value="item.value" @getValue="item.value = $event" :disabled = "true"></CommonFileUpload>
            </el-col>
            <el-col :span="16" style="color: #25252582" v-if="item.type === 'Image' ">
                <CommonImageUpload :value="item.value" @getValue="item.value = $event" :disabled = "true"></CommonImageUpload>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import CommonFileUpload from '@/components/FileUpLoad';
    import CommonImageUpload from '@/components/UpLoad';

    export default {
        name: "feed-back-file",
        props: {
            fileData:{
            }
        },
        data(){
            return {
                feedBackItemList:[],
               // activityDetail:{},
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
           // this.activityDetail = this.fileData.activityObject;
        }
    }
</script>

<style scoped>

</style>
