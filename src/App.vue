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

<style>
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
        width:200px !important;;
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
</style>
