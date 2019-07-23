<template>
    <div class="bg">
        <div class="content">
            <div class="title"></div>
            <div  class="choose">
                <template v-for="(item,index) in picMenu">
                    <div style="display: inline-block;vertical-align: top">
                        <div class="jump" :class=" item.className" :alt=item.alt @click="router(item.path)">
                        </div>
                    </div>
                    <p v-if="index == 3"></p>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'MainView',
        data() {
            return {
                picMenu: [
                    {alt:"基本活动",path:"/activity/parActivityManage", className: 'activity'},
                    {alt:"基本队伍",path:"/baseTeam/parMember", className: 'team'},
                    {alt:"基本阵地",path:"/basePosition/positionInformation", className: 'position'},
                    {alt:"基本组织",path:"/baseOrg/sysDistrict", className: 'org'},
                    {alt:"GIS平台", path:"/gis/", className: 'gis'},
                    {alt:"综合考评",path:"/comprehensiveAccess/examinationScore", className: 'review'},
                    {alt:"党建品牌",path:"/siteSupervision/actualMonitor", className: 'brand'},
                    {alt:"系统运维",path:"/home/information", className: 'sys'},
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
                    width:  `${275 * this.$touristScreenWid}px`,
                    height :`${250 * this.$touristScreenHei}px`,
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
        }
    }
</script>

<style scoped>
    .content {
        max-width: 1344px;
        margin: 0 auto;
    }
    .bg{
        position: absolute;
        background: url("/static/img/inactive/bg.jpg") center no-repeat ;
        background-size: cover;
        width: 100%;
        height: 100%;
    }
    .title{
        background: url("/static/img/login/title.png") center no-repeat;
        background-size: 100% 100%;
        width: calc(1008 * 100vw/1920);
        height: calc(76 * 100vw/1920);
        margin: calc(100 * 100vw / 1920) auto calc(40 * 100vw / 1920) auto;
        position: relative;
        /*left: calc(-123 * 100vw / 1920);*/
    }
    .choose{
        overflow: hidden;
        position: relative;
        width:100%;
    }
    .jump {
        width: calc(260 * 100vw / 1920);
        height: calc(221 * 100vw / 1920);
        margin: calc(25 * 100vw / 1920);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center; /*水平居中*/
        align-items: center;
        font-size: 28px;
        color: #666;
        font-weight: 500;
        border-radius: 2px;
        background-size: 100% 100%;
        transition: all linear .1s;
    }
    .activity {
        background: url("/static/img/inactive/activity.png");
        background-size: 100% 100%;
    }
    .team {
        background: url("/static/img/inactive/team.png");
        background-size: 100% 100%;
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
        cursor: pointer;
    }

    .jump:hover.activity {
        background: url("/static/img/active/activity_active.png");
        background-size: 100% 100%;
    }
    .jump:hover.team {
        background: url("/static/img/active/team_active.png");
        background-size: 100% 100%;
    }
    .jump:hover.position {
        background-image: url("/static/img/active/position_active.png");
        background-size: 100% 100%;
    }
    .jump:hover.org {
        background-image: url("/static/img/active/org_active.png");
        background-size: 100% 100%;
    }
    .jump:hover.gis {
        background-image: url("/static/img/active/map_active.png");
        background-size: 100% 100%;
    }
    .jump:hover.review {
        background-image: url("/static/img/active/review_active.png");
        background-size: 100% 100%;
    }
    .jump:hover.brand {
        background-image: url("/static/img/active/party_build_active.png");
        background-size: 100% 100%;
    }
    .jump:hover.sys {
        background-image: url("/static/img/active/system_active.png");
        background-size: 100% 100%;
    }
</style>
