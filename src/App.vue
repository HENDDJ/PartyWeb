<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'App',
        data () {
            return {
            };
        },
        components: {
        },
        methods: {
        }
    };
</script>

<style lang="stylus">
    #app {
        font-family: 'webfont', 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }
    .fade-enter-active {
        transition: opacity 2.2s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
    .el-input--small .el-input__inner {
        height: 32px;
        line-height: 46px;
    }
    .el-select {
        width: 200px !important;
    }
    .el-radio-group {
        width:200px !important;
    }
    .el-input--mini .el-input__inner {
        width:200px !important;
    }
    .el-date-editor.el-input, .el-date-editor.el-input__inner{
        width:200px !important;
    }
    i {
        font-size: 16px !important;
    }
    body::-webkit-scrollbar {
        /*width: 0;*/
    }
    body {
        overflow: hidden;
    }
    html {
        font-size: 18px;
    }
    .vs-tabs--btn {
        font-size: 16px !important
    }
    @font-face {
        font-family: 'webfont';
        font-display: swap;
        src: url('//at.alicdn.com/t/webfont_xae7g4lgcki.eot'); /* IE9*/
        src: url('//at.alicdn.com/t/webfont_xae7g4lgcki.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
        url('//at.alicdn.com/t/webfont_xae7g4lgcki.woff2') format('woff2'),
        url('//at.alicdn.com/t/webfont_xae7g4lgcki.woff') format('woff'), /* chrome、firefox */
        url('//at.alicdn.com/t/webfont_xae7g4lgcki.ttf') format('truetype'), /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
        url('//at.alicdn.com/t/webfont_xae7g4lgcki.svg#AlibabaPuHuiTiL') format('svg'); /* iOS 4.1- */
    }

    .el-dialog__headerbtn .el-dialog__close {
        -webkit-transition: all .23s ease .1s;
        transition: all .23s ease .1s;
        position: relative;
        padding: 8px;
        cursor: pointer;
        -webkit-box-shadow: 0 5px 20px 0 rgba(0,0,0,.1);
        box-shadow: 0 5px 20px 0 rgba(0,0,0,.1);
        border-radius: 5px;
        -webkit-transform: translate(8px,-8px);
        transform: translate(25px,-25px);
        background: #fff;
        font-size: 1.25em;
    }
    .el-dialog {
        border-radius: 8px;
        animation: an-dialog .5s
    }
    .el-dialog__headerbtn .el-dialog__close:hover {
        transform: translate(20px,-20px);
    }
    .el-dialog__header {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        padding: 10px 5px !important;
        background: #f8f8f8;
        border-left: 3px solid rgba(31,116,255,1);
    }
    .el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li {
        background: white
    }

</style>
<style lang="stylus">
    :root {
        --vs-primary:31,116,255;--vs-danger:255,71,87;--vs-success:70,201,58;--vs-dark:30,30,30;--vs-warning:255,186,0;--vs-light:245,245,245
    }
    .el-dialog__title {
        padding-left: 7px!important
        color: rgba(31,116,255,1) !important;
    }
</style>
<style>
    @keyframes an-dialog{
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.2);
        }
        100% {
            transform: scale(1);
        }
    }
</style>
