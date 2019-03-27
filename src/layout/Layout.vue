<template>
    <div class="app-wrapper">
        <sidebar class="sidebar-container "></sidebar>
        <div class="main-container">
            <nav-bar></nav-bar>
            <!--<tags-view></tags-view>-->
            <app-main></app-main>
        </div>
    </div>
</template>

<script>
    import Sidebar from './components/SideBar';
    import AppMain from './components/AppMain';
    import NavBar from './components/Navbar';

    export default {
        name: 'layout',
        components: {
            Sidebar,
            AppMain,
            NavBar
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
        top: 0;
        bottom: 0;
        left: 0;
        z-index: 1001;
        overflow: hidden;
    }

    // 主体区域
    .main-container {
        min-height: 100%;
        transition: margin-left .28s;
        margin-left: 200px;
    }
</style>
