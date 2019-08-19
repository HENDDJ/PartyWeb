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
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
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
        border-radius: 8px!important;
        animation: an-dialog .5s;
        min-height: 180px;
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
    .con-vs-checkbox {
        display: inline-flex !important;
    }
    .con-vs-radio {
        display: inline-flex!important;
    }
    .el-table {
        font-size: 14px !important;
    }
    .slot-btn {
        transform: scale(1.15);
        margin-left: 14px !important
    }
</style>
<style lang="stylus">
    :root {
        --vs-primary:31,116,255;--vs-danger:255,71,87;--vs-success:70,201,58;--vs-dark:30,30,30;--vs-warning:255,186,0;--vs-light:245,245,245;
        --vs-menu:31,12,123;
    }
    .el-dialog__title {
        padding-left: 7px!important
        color: rgba(31,116,255,1) !important;
    }
    .el-dialog__body {
        padding: 15px 20px!important;
    }
    .el-dialog__wrapper {
        z-index: 1021 !important;
    }
    .v-modal {
        z-index: 1020 !important;
    }
    .viewer-backdrop {
        background-color: rgba(0, 0, 0, 0.8) !important;
    }
    .mce-tinymce {
        box-shadow: none!important;
    }
    .el-badge__content.is-fixed {
        top: 9px!important;
        right: 24px!important;
    }
    .el-tree {
        background: transparent!important;
    }
    .el-table .el-badge__content {
        vertical-align: baseline!important;
    }
    .vs-card--header {
        padding: 0;
    }
    .common-crud .el-button--mini, .el-button--mini.is-round {
        padding: 6px 15px !important;
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
