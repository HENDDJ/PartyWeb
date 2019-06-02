<template>
    <div class="app-wrapper">
        <TopBar></TopBar>
        <div style="display: flex">
            <!--占位元素-->
            <div style="width: 200px"></div>
            <sidebar class="sidebar-container "></sidebar>
            <div class="main-container">
                <nav-bar></nav-bar>
                <!--<tags-view></tags-view>-->
                <app-main></app-main>
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
        computed: {
        },
        methods: {
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

    .sidebar-container {
        transition: width 0.28s;
        width: 200px !important;
        height: 100%;
        position: fixed;
        top: calc(60 * 100vw/1920);
        bottom: 0;
        left: 0;
        z-index: 1001;
        overflow: hidden;
    }

    // 主体区域
    .main-container {
        flex: 1;
        min-height: 100%;
        background-color: #f2f2f2;
        padding: 10px 20px;
        transition: margin-left .28s;
    }
</style>
