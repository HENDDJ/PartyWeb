<template>
    <div class="app-wrapper">
        <TopBar></TopBar>
        <div class="main">
            <!--占位元素-->
            <div class="side-position"></div>
            <sidebar class="sidebar-container "></sidebar>
            <div class="main-container">
                <div v-if="$route.name === 'DashboardRoot'" class="dashboard-bg">
                    <div class="dashboard-bg-top"></div>
                    <div class="dashboard-bg-bottom"></div>
                </div>
                <div style="position: relative;z-index: 10;width: inherit;height: inherit;">
                    <nav-bar></nav-bar>
                    <!--<tags-view></tags-view>-->
                    <app-main></app-main>
                    <div class="copyright">
                        Copyright ©2017-2019
                        <strong>中共句容市委组织部 句容广电网络有限公司 苏州佳图智绘信息技术有限公司</strong>
                        版权所有</div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import Sidebar from './components/SideBar';
    import AppMain from './components/AppMain';
    import NavBar from './components/Navbar';
    import TopBar from './components/TopBar';

    export default {
        name: 'layout',
        components: {
            Sidebar,
            AppMain,
            NavBar,
            TopBar
        },
        data() {
            return {
                containerClassName: 'main'
            }
        },
        computed: {
        },
        methods: {
        },
        mounted() {
            let user = JSON.parse(sessionStorage.getItem("userInfo"));
            if(user.sysDistrict.districtType==='Office'){
                document.getElementsByClassName("sidebar-container")[0].style.backgroundImage = "url('/static/img/menusideoffice.png')";
            }else if(user.sysDistrict.districtType==='Party'){
                if(user.roleCode === 'CITY_LEADER'){
                    document.getElementsByClassName("sidebar-container")[0].style.backgroundImage = "url('/static/img/menusideshi.png')";
                }else if(user.roleCode === 'TOWN_REVIEWER') {
                    document.getElementsByClassName("sidebar-container")[0].style.backgroundImage="url('/static/img/menusidezhen.png')";
                }else{
                    document.getElementsByClassName("sidebar-container")[0].style.backgroundImage="url('/static/img/menusidecun.jpg')";
                }
            }else{
                document.getElementsByClassName("sidebar-container")[0].style.backgroundImage="url('/static/img/menusidecun.jpg')";
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .app-wrapper {
        position: relative;
        height: 100%;
        width: 100%;
    }

    .drawer-bg {
        background: #fff;
        opacity: 0.3;
        width: 100%;
        top: 0;
        height: 100%;
        position: absolute;
        z-index: 1;
    }

    .main {
        height: calc(100vh - (70 * 100vw/1920));
        display: flex;
        overflow: hidden;
    }

    .side-position {
        width: 220px;
    }
    .sidebar-container {
        transition: width 0.28s;
        width: 220px !important;
        height: 100%;
        position: fixed;
        top: calc(70 * 100vw/1920);
        bottom: 0;
        left: 0;
        overflow: hidden;
    }
    @media screen and (max-width: 1600px){
        .sidebar-container {
            top: 50px;
        }
    }
    // 主体区域
    .main-container {
        flex: 1;
        height: 100%;
        padding: 7px 28px 30px 20px;
        transition: margin-left .28s, width .5s;
        overflow: hidden;
        background-image: url("/static/img/bg.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: 0 -6px;
        position: relative;
    }
    .copyright {
        padding-right: 20px;
        width: calc(100vw - 220px);
        height: 24px;
        line-height: 24px;
        font-size: 14px;
        background-color: white;
        text-align: right;

        position: fixed;
        bottom: 0;
        right: 0;
    }
    .dashboard-bg {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 0;
    }
    .dashboard-bg-top {
        height: 300px;
        background-image: linear-gradient(to bottom, #479bfe, #3e61fb);
    }
    .dashboard-bg-bottom {
        background: #e7f3ff;
        height: calc(100% - 300px);
    }
</style>
