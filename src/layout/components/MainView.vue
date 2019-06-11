<template>
    <div class="bg">
        <div class="title"></div>
        <div  class="choose">
            <template v-for="(item,index) in picMenu">
                <div style="display: inline-block;vertical-align: top"><div class="jump"><div :class=" 'sub ' + item.className" :alt=item.alt @click="router(item.path)"></div><div class="label">{{item.alt}}</div></div></div>
                <p v-if="index == 3"></p>
            </template>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'MainView',
        data() {
            return {
                picMenu: [
                    {alt:"基本活动",path:"/activity/parActivityRelease", className: 'activity'},
                    {alt:"基本队伍",path:"/latentDanger/hiddenIssueMsg", className: 'team'},
                    {alt:"基本阵地",path:"/enterpriseSafety/safetyRegulations", className: 'position'},
                    {alt:"基本组织",path:"/emergencyManagement/emergencyPrevention", className: 'org'},
                    {alt:"GIS平台", path:"/gis/gisMap", className: 'gis'},
                    {alt:"综合考评",path:"", className: 'review'},
                    {alt:"党建品牌",path:"/siteSupervision/actualMonitor", className: 'brand'},
                    {alt:"系统运维",path:"", className: 'sys'},
                ]
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
        background: url("/static/img/inactive/bg.jpg") center no-repeat ;
        background-size: 100% 100%;
        width: 100%;
        height: 100%;
        padding: 50px 0;
    }
    .title{
        background: url("/static/img/inactive/title.png") center no-repeat;
        background-size: 100% 100%;
        width: calc(1318 * 100vw/1920);
        height: calc(84 * 100vw/1920);
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
        width: calc(261 * 100vw/1920);
        height: calc(215 * 100vw/1920);
        margin: 34px;
        overflow: hidden;
        background: url("/static/img/inactive/border.png") center no-repeat ;
        display: flex;
        flex-direction: column;
        justify-content: center;  /*水平居中*/
        align-items: center;
        font-size: 28px;
        color: #666;
        font-weight: 500;
        border-radius: 2px;
        transition: all .4s;
    }
    .sub {
        margin: 0 auto;
        transition: all .3s;
        width: 103px;
        height: 88px;
    }
    .label {
        padding-top: 16px;
        letter-spacing: 1px;
    }

    @media screen and (max-width: 1400px){
        .bg {
            padding: 30px;
        }
        .jump {
            font-size: 24px;
            margin: 22px;
        }
        .label {
            padding-top: 10px;
        }
    }
    /*.jump :hover{*/
    /*    box-shadow: 0 0 10px grey;*/
    /*    transform: scale(1.1) translateY(-15px);*/
    /*    transition: all .5s;*/
    /*    cursor: pointer;*/
    /*}*/
    .activity {
        background: url("/static/img/inactive/activity.png") no-repeat;
    }
    .team {
        background: url("/static/img/inactive/team.png")  no-repeat;
    }
    .position {
        background-image: url("/static/img/inactive/position.png");
    }
    .org {
        background-image: url("/static/img/inactive/org.png");
    }
    .gis {
        background-image: url("/static/img/inactive/map.png");
    }
    .review {
        background-image: url("/static/img/inactive/review.png");
    }
    .brand {
        background-image: url("/static/img/inactive/party_build.png");
    }
    .sys {
        background-image: url("/static/img/inactive/system.png");
    }

    .jump:hover {
        color: white;
        background: url("/static/img/active/border_active.png") center no-repeat ;
        transform: scale(1.15);
        cursor: pointer;
    }


    .jump:hover .activity {
        background: url("/static/img/active/activity_active.png") no-repeat;
    }
    .jump:hover .team {
        background: url("/static/img/active/team_active.png")  no-repeat;
    }
    .jump:hover .position {
        background-image: url("/static/img/active/position_active.png");
    }
    .jump:hover .org {
        background-image: url("/static/img/active/org_active.png");
    }
    .jump:hover .gis {
        background-image: url("/static/img/active/map_active.png");
    }
    .jump:hover .review {
        background-image: url("/static/img/active/review_active.png");
    }
    .jump:hover .brand {
        background-image: url("/static/img/active/party_build_active.png");
    }
    .jump:hover .sys {
        background-image: url("/static/img/active/system_active.png");
    }
</style>
