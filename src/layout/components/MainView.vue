<template>
    <div class="bg">
        <div class="title"><h1 style="color:white;font-size: 300%;letter-spacing:8px">句容市建筑工程智慧安监</h1></div>
        <div  class="choose">
            <div v-for="item in picMenu"  class="jump"><img :src=item.src :alt=item.alt :style="picSty" @click="router(item.path)"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'MainView',
        data() {
            return {
                picSty: {},
                picMenu: [{src:"/static/img/menu/GIS平台.png",alt:"GIS平台",path:"/project/gismap"},
                    {src:"/static/img/menu/事故隐患.png",alt:"事故隐患",path:"/latentDanger/hiddenIssueMsg"},
                    {src:"/static/img/menu/企业安全.png",alt:"企业安全",path:"/enterpriseSafety/safetyRegulations"},
                    {src:"/static/img/menu/应急.png",alt:"应急",path:"/emergencyManagement/emergencyPrevention"},
                    {src:"/static/img/menu/政务.png",alt:"政务",path:""},
                    {src:"/static/img/menu/环保卫生.png",alt:"环保卫生",path:""},
                    {src:"/static/img/menu/监管监控.png",alt:"监管监控",path:"/siteSupervision/actualMonitor"},
                    {src:"/static/img/menu/综合.png",alt:"综合",path:""},
                    {src:"/static/img/menu/运维管理.png",alt:"运维管理",path:"/home/user"},
                    {src:"/static/img/menu/重大危险.png",alt:"重大危险",path:"/hazards/majorHazards"}]

            }
        },
        components: {

        },
        computed :{
        },
        methods: {
            resize(){
                this.picSty = {
                    width:  `${275 * this.$touristScreenWid()}px`,
                    height :`${250 * this.$touristScreenHei()}px`,
                    margin : '30px 10px',
                }
            },
            router(path){
                this.$store.commit("getRouterIndex",path);
                this.$router.push({path: path});
            }
        },
        mounted () {
            this.resize();
            window.onresize = ()=>{
                this.resize();
            }
        },
        beforeDestroy() {
            let matched = this.$route.matched;
            this.$store.commit("getClassInfo", matched[matched.length-1].meta.classInfo);
        }
    }
</script>

<style scoped>
    .bg{
        position: absolute;
        background: url("/static/img/mainback.png") center no-repeat ;
        background-size: 100% 100%;
        width: 100%;
        height: 100%;
    }
    .title{
        margin: 3% auto 0 auto ;
        top:5%;
    }
    .choose{
        overflow: hidden;
        margin: 4% auto 0 auto;
        width:85%;
        height:70%;
    }
    .jump {
        width: calc(315 * 100vw/1920);
        height: calc(290 * 100vw/1920);
        display: inline-block;
        overflow: hidden;
        text-align: center;
        vertical-align: middle;
    }
    .jump :hover{
        box-shadow: 0 0 10px grey;
        transform: scale(1.1) translateY(-15px);
        transition: all .5s;
        cursor: pointer;
    }
</style>
