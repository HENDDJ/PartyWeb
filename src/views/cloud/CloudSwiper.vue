<template>
    <swiper :options="swiperOption" style = "width: 1510px;height: 150px;">
        <swiper-slide v-for="(item,index) in positionRankList" :key="item.id">
            <el-card class="cardStyle">
                <div>
                    <icon name="NO.1" scale="3"  class="rankTagStyle" v-if="index===0"></icon>
                    <icon name="NO.2" scale="3" class="rankTagStyle" v-if="index===1"></icon>
                    <icon name="NO.3" scale="3" class="rankTagStyle" v-if="index===2"></icon>
                    <div v-if="index>2"><el-tag class="rankNumberTagStyle">{{index+1}}</el-tag></div>
                </div>
                <div style="margin-top: 10px;">{{item.name}}</div>
                <div style="margin-top: 5px;">热度:{{item.degree}}</div>
            </el-card>
        </swiper-slide>
    </swiper>
</template>

<script>
    import 'swiper/dist/css/swiper.css';
    import { swiper, swiperSlide } from 'vue-awesome-swiper';
    export default {
        name: "cloud-swiper",
        data() {
            return {
                swiperOption: {
                    slidesPerView : 9,
                    autoplay: true,
                    loop:true,
                },
                positionRankList:[],
                list:[],
            }
        },
        components: {
            swiper,
            swiperSlide
        },
        methods:{
            showPositionRank(){
                this.$http('POST',`identity/positionInformation/list?sort=hotDegree,desc`,false).then(data => {
                    data.forEach(item =>{
                        if(this.positionRankList.length<21){
                           this.positionRankList.push(item);
                        }
                    });
                });
            } ,
        },
        created(){
           this.showPositionRank();

        }
    }
</script>

<style scoped>
    .cardStyle {
        width: 150px;
        height: 120px;
        font-size: 14px;
        margin-top: 20px;
        background-color: rgba(63, 177, 227,0.1);
        color: rgba(255,255,255,0.9);
        border: none;
    }
    .rankTagStyle{
        vertical-align: sub;
        width: 30px;
        height: 30px;
        margin-top:-10px;
    }
    .rankNumberTagStyle{
        width: 30px;
        height: 30px;
        margin-top:-10px;
        line-height: 30px;
        font-size: 18px;
        border-radius: 15px;
        background-color:#d8b788 ;
        border: none;
        font-weight: bold;
        color:#122747;
    }

</style>
