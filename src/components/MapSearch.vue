<template>
    <div class="search-container">
        <el-input placeholder="搜索位置、公交站、地铁站" v-model="queryValue" class="input-with-select">
            <img slot="prepend" src="../../static/img/logo.png" alt="" style="height: 36px;">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
        <div id="r-result" style="text-align: left;max-height: 50vh;overflow: scroll;background-color: white;overflow-x: hidden"></div>
    </div>
</template>

<script>
    export default {
        name: "MapSearch",
        props: {
            map: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {
                queryValue: '',
            }
        },
        methods: {
            search() {
                let local = new BMap.LocalSearch(this.map, {
                    renderOptions: {map: this.map, panel: "r-result"}
                });
                local.search(this.queryValue)
            }
        },
        mounted() {
            // this.search();
        }
    }
</script>

<style scoped>
    .search-container {
        width: 300px;
    }
    .input-with-select {
        height: 40px;
    }
    .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }
</style>
<style>
    .search-container .el-input--mini .el-input__inner {
        height: 45px;
        font-size: 14px;
    }
    .search-container .el-input-group__prepend {
        padding: 4px 8px 0 8px;
        width: 46px !important;
        height: 43px;
        background: white;
    }
    .search-container i {
        font-size: 22px !important;
    }
    .search-container ol li > div > div:first-child > span {
        color: #555 !important;
        font-weight: bold;
        font-size: 14px;
    }
    .search-container ol li > div {
        border-bottom: 1px solid #9999992e;
        font-size: 12px;
        padding: 5px 0 !important;
        margin-right: 10px;
    }
    #r-result > div {
        /*font-family: 'STHeiti Light' !important;*/
        border: none !important;
        box-shadow: 1px 1px 1px #999999;
    }
</style>
