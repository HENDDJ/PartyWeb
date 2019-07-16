<template>
    <section>
        <div class="content-right">
            <swiper :options="swiperOption" ref="mySwiper" v-if="showSwiper()">
                <swiper-slide v-for="(item,index) in currentActivityList" :key="item.id">
                    <vs-card class="card-sat my-swiper" style="height: 668px;">
                        <div slot="media">
                            <el-row>
                                <el-col :span="8">
                                    <el-row>
                                        <el-col :span="20" style="color: #fff;margin: 30px 0">
                                            {{item.title}}
                                        </el-col>
                                    </el-row>
                                </el-col>
                                <el-col :span="16" >
                                    <br>
                                    <radial-progress-bar
                                        style="margin: -10px auto"
                                        :diameter="70"
                                        :completed-steps="handlePercent(item.totalPercent)"
                                        :total-steps="100"
                                        :strokeWidth="5"
                                        innerStrokeColor="#e4e7ed">
                                        <p style="font-size: 8px;line-height: 14px;position: relative;top:4px;color: #fff">{{handlePercent(item.totalPercent)}}%</p>
                                        <p style="font-size: 6px;color: #aeaeae">总进度</p>
                                    </radial-progress-bar>
                                </el-col>
                            </el-row>
                            <div style="margin: 0 20px;width: 95%">
                                <div class="progress-content">
                                    <div class="progress-item">
                                        <span style="float: left">宝华镇</span>
                                        <span style="float: right;width: 50px;">{{handlePercent(item.baoHuaPercent)}}%</span>
                                    </div>
                                    <vs-progress :height="4" :percent="handlePercent(item.baoHuaPercent)" :color="getColor(item.baoHuaPercent)"></vs-progress>
                                </div>
                                <div class="progress-content">
                                    <div class="progress-item">
                                        <span style="float: left">下蜀镇</span>
                                        <span style="float: right;width: 50px;">{{handlePercent(item.xiaShuPercent)}}%</span>
                                    </div>
                                    <vs-progress :height="4" :percent="handlePercent(item.xiaShuPercent)" :color="getColor(item.xiaShuPercent)"></vs-progress>
                                </div>
                                <div class="progress-content">
                                    <div class="progress-item">
                                        <span style="float: left">边城镇</span>
                                        <span style="float: right;width: 50px;">{{handlePercent(item.bianChengPercent)}}%</span>
                                    </div>
                                    <vs-progress :height="4" :percent="handlePercent(item.bianChengPercent)" :color="getColor(item.bianChengPercent)"></vs-progress>
                                </div>
                                <div class="progress-content">
                                    <div class="progress-item">
                                        <span style="float: left">郭庄镇</span>
                                        <span style="float: right;width: 50px;">{{handlePercent(item.guoZhuangPercent)}}%</span>
                                    </div>
                                    <vs-progress :height="4" :percent="handlePercent(item.guoZhuangPercent)" :color="getColor(item.guoZhuangPercent)"></vs-progress>
                                </div>
                                <div class="progress-content">
                                    <div class="progress-item">
                                        <span style="float: left">茅山镇</span>
                                        <span style="float: right;width: 50px;">{{handlePercent(item.maoShanPercent)}}%</span>
                                    </div>
                                    <vs-progress :height="4" :percent="handlePercent(item.maoShanPercent)" :color="getColor(item.maoShanPercent)"></vs-progress>
                                </div>
                                <div class="progress-content">
                                    <div class="progress-item">
                                        <span style="float: left">茅山风景区</span>
                                        <span style="float: right;width: 50px;">{{handlePercent(item.maoShanFengJingPercent)}}%</span>
                                    </div>
                                    <vs-progress :height="4" :percent="handlePercent(item.maoShanFengJingPercent)" :color="getColor(item.maoShanFengJingPercent)"></vs-progress>
                                </div>
                                <div class="progress-content">
                                    <div class="progress-item">
                                        <span style="float: left">华阳街道</span>
                                        <span style="float: right;width: 50px;">{{handlePercent(item.huaYangPercent)}}%</span>
                                    </div>
                                    <vs-progress :height="4" :percent="handlePercent(item.huaYangPercent)" :color="getColor(item.huaYangPercent)"></vs-progress>
                                </div>
                                <div class="progress-content">
                                    <div class="progress-item">
                                        <span style="float: left">开发区</span>
                                        <span style="float: right;width: 50px;">{{handlePercent(item.kaiFaPercent)}}%</span>
                                    </div>
                                    <vs-progress :height="4" :percent="handlePercent(item.kaiFaPercent)" :color="getColor(item.kaiFaPercent)"></vs-progress>
                                </div>
                                <div class="progress-content">
                                    <div class="progress-item">
                                        <span style="float: left">天王镇</span>
                                        <span style="float: right;width: 50px;">{{handlePercent(item.tianWangPercent)}}%</span>
                                    </div>
                                    <vs-progress :height="4" :percent="handlePercent(item.tianWangPercent)" :color="getColor(item.tianWangPercent)"></vs-progress>
                                </div>
                                <div class="progress-content">
                                    <div class="progress-item">
                                        <span style="float: left">后白镇</span>
                                        <span style="float: right;width: 50px;">{{handlePercent(item.houBaiPercent)}}%</span>
                                    </div>
                                    <vs-progress :height="4" :percent="handlePercent(item.houBaiPercent)" :color="getColor(item.houBaiPercent)"></vs-progress>
                                </div>
                                <div class="progress-content">
                                    <div class="progress-item">
                                        <span style="float: left">白兔镇</span>
                                        <span style="float: right;width: 50px;">{{handlePercent(item.baiTuPercent)}}%</span>
                                    </div>
                                    <vs-progress :height="4" :percent="handlePercent(item.baiTuPercent)" :color="getColor(item.baiTuPercent)"></vs-progress>
                                </div>
                            </div>
                        </div>
                    </vs-card>
                </swiper-slide>
            </swiper>
        </div>
    </section>
</template>

<script>
    import RadialProgressBar from 'vue-radial-progress';
    import 'swiper/dist/css/swiper.css';
    import { swiper, swiperSlide } from 'vue-awesome-swiper';
    export default {
        name: "cloud",
        data(){
            return{
                swiperOption: {
                    direction: 'horizontal',
                    observeSlideChildren:true,
                  /*  autoplay: {
                        delay: 5000,
                        autoplayDisableOnInteraction:false,
                    },*/
                    autoplay:false,
                    speed: 800,
                    effect: 'cube',
                    loop:true,
                    grabCursor: true,
                  /*  flip: {
                        slideShadows : true,
                        limitRotation : true,
                    },*/
                    cubeEffect: {
                        shadow: true,
                        slideShadows: true,
                        shadowOffset: 20,
                        shadowScale: 0.94
                    },
                },
                currentActivityList: [],
            }
        },
        components: {
            RadialProgressBar,
            swiper,
            swiperSlide
        },
        methods:{
            getCurrentActivity() {
                this.$http('POST',`/identity/parActivity/list`, {status: 'ACTING'},false).then(
                    data => {
                        this.currentActivityList = data;
                    }
                )
            },
            handlePercent(val) {
                return Math.round(val * 1000)/10;
            },
            getColor(val) {
                if(val <= 0.5) {
                    return 'danger';
                } else if (val <= 0.8) {
                    return 'warning';
                } else if (val < 1) {
                    return 'primary';
                } else {
                    return 'success';
                }
            },
            showSwiper () {
                return this.currentActivityList.length
            }
        },
        mounted() {
            this.getCurrentActivity();
        }
    }
</script>

<style scoped>
    .content-right {
     background-color: #0d1736;
        width: 560px;
        height: 370px;
        flex: 1;
        overflow: hidden;
    }
    .con-vs-card{
        background-color: transparent;
    }
    .progress-item {
        position: relative;
        top: 5px;
    }
    .progress-content {
        float: left;
        width: 45%;
        font-size: 16px;
        color: #fff;
        margin: 8px 13px ;
    }
    .vs-progress--background{
        float: right;
        width: 30%;
        margin-top: 12px;
        margin-right: 10px;
    }
    .radial-progress-inner{
        /*background: url("../../svg/progress.svg");*/
background: white;
    }
</style>
