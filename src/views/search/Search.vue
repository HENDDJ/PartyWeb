<template>
    <section class="mutipart-search">
        <el-input size="large" class="search-input" placeholder="请输入内容" v-model="queryParam">
            <template slot="append"><i class="el-icon-search">  搜索</i></template>
        </el-input>
        <div class="search-type">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="综合" name="first">综合</el-tab-pane>
                <el-tab-pane label="党员" name="second">党员</el-tab-pane>
                <el-tab-pane label="台账" name="third">台账</el-tab-pane>
                <el-tab-pane label="村干部" name="fourth">村干部</el-tab-pane>
            </el-tabs>
        </div>
    </section>
</template>

<script>
    export default {
        name: "search",
        data(){
            return {
                queryParam: ''
            }
        },
        methods:{
        },
        mounted() {
        }
    }
</script>

<style scoped>
    .mutipart-search {
        width: 100%;
    }
    .search-input {
        width: 600px;
        margin-bottom: 15px;
        float: left;
    }
    .search-type {
        clear: both;
        padding-left: 20px;
        border-top: #ebebeb 1px solid;
        background: #f8f8f8;
        height: 42px;
        overflow: hidden;
    }
</style>
<style>
    .mutipart-search .el-tabs__nav-wrap::after {
        background-color: transparent !important;
    }
    .mutipart-search .el-tabs__item.is-active {
        color: #222;
        font-weight: 700;
    }
</style>
