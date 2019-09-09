<template>
    <div class="block">
        <el-carousel height="150px" autoplay interval:3000  loop>
            <el-carousel-item v-for="item in 4" :key="item">
                <h3 class="small">{{ item }}</h3>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
    export default {
        name: "CloudPictures",
        data(){
            return {
                currentVal:{},
            }
        },
        methods: {
            showTvPictures(){
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
            }
        },
        mounted() {
             window.addEventListener('setItem', ()=> {
                this.currentVal = sessionStorage.getItem('cloudPicture');
                console.log(this.currentVal,"1212");
            })
        },
        created () {

        },
    }
</script>

<style scoped>
    .el-carousel__item h3 {
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        line-height: 150px;
        margin: 0;
    }

    .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
    }

    .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
    }
</style>
