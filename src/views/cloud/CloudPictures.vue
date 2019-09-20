<template>
    <div class="carouselStyle">
        <el-carousel trigger="click" height="250px"  arrow="never">
            <el-carousel-item v-for="(item,index) in TvPic" :key="index">
                <span style="position: absolute; bottom: 10px;left: 20px;color: #fff;font-size: 16px;">{{title}}</span>
                <img
                    :src=item
                    style="width: 100%;height: 100%;">
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
                title:'',
            }
        },
        methods: {
            showTvPictures(){
                this.title = this.currentVal.districtName+"-"+this.currentVal.title;
                this.TvPic = [];
                let path = `/identity/parPictureInfro/list?sort=CreateTime,asc`;
                let form = {organizationId:this.currentVal.districtId,studyContent:this.currentVal.activityId};
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
            if(localStorage.getItem('cloudPicture')){
                this.currentVal = JSON.parse(localStorage.getItem('cloudPicture'));
                this.showTvPictures();
            }else{
                this.TvPic = [];
                this.TvPic.push('/static/img/temp1.jpg');
            }
            window.addEventListener('storage', ()=> {
                this.currentVal = JSON.parse(localStorage.getItem('cloudPicture'));
                this.showTvPictures();
            });
        },
    }
</script>

<style scoped>
    .carouselStyle{
        width: 535px;
        height: 250px;
        background-color: transparent;
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
