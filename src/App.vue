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
    .el-textarea__inner{
        width:200px !important;
    }

</style>
