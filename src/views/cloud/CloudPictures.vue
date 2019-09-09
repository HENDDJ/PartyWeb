<template>
    <div class="carouselStyle">
        <el-carousel height="200px" autoplay interval:3000  loop>
            <el-carousel-item v-for="(item,index) in TvPic" :key="index">
                <img
                    :src=item
                    style="width: 400px">
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
                TvPic:[],
            }
        },
        methods: {
            showTvPictures(){
                this.TvPic = [];
                let path = `/identity/parPictureInfro/list?sort=CreateTime,desc`;
                let form = {organizationId:this.currentVal.districtId,studyContent:this.currentVal.activityId}
                this.$http("Post",path,form,false).then(data=>{
                    data.forEach(item=>{
                        this.TvPic.push(this.imgTF(item.imageURL));
                    });
                }).catch((res)=>{
                    this.$message({
                        type: 'warning',
                        message: '电视截图拉取失败'+res
                    })
                });
            },
            imgTF(val){
                if (val.indexOf("http" )== -1) {
                    return `http://122.97.218.162:18106/JRPartyService/JRPartyScreenshot/${val}`
                }else {
                    return val
                }
            },
        },
        mounted() {
            window.addEventListener('storage', ()=> {
                this.currentVal = JSON.parse(localStorage.getItem('cloudPicture'));
             //   console.log("b电");
                this.showTvPictures();
            });
        },
        created () {
            this.currentVal = JSON.parse(localStorage.getItem('cloudPicture'));
     //       console.log(this.currentVal,"12312312321");
            this.showTvPictures();
        },
    }
</script>

<style scoped>
    .carouselStyle{
        width: 450px;
        height: 300px;
        padding: 10px;
    }
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
