<template>
    <section class="mutipart-search">
        <el-input size="large" class="search-input" placeholder="请输入内容" v-model="queryParam">
            <el-button slot="append" icon="el-icon-search" @click="search">  搜索</el-button>
        </el-input>
        <div class="search-type">
            <el-tabs v-model="activeName" @tab-click="search">
                <el-tab-pane label="综合" name="mutipart">综合</el-tab-pane>
                <el-tab-pane label="党员" name="second">党员</el-tab-pane>
                <el-tab-pane label="台账" name="third">台账</el-tab-pane>
                <el-tab-pane label="村干部" name="fourth">村干部</el-tab-pane>
            </el-tabs>
        </div>
        <p v-show="result.total.value > 0" class="result-remind">&emsp;为您找到相关结果约{{result.total.value}}个</p>
        <div style="max-height: 700px;overflow-y: scroll;overflow-x: hidden">
            <div class="content-item" v-for="item in result.hits">
                <h5 style="color: #1e6abc;text-decoration-line: underline;line-height: 26px;" v-html="item.title"></h5>
                <p style="font-size: 14px" v-html="item.html"></p>
            </div>
            <el-pagination v-show="result.total.value > 0" style="float: left;text-align: right;margin-top: 20px;" ref="pagination"
                           background
                           :total="pageable.total" :current-page.sync="pageable.currentPage" :page-size.sync="pageable.pageSize"
                           @current-change="search" layout="prev, pager, next"></el-pagination>
        </div>
    </section>
</template>

<script>
    // import { esApi } from '@/api';
    import elasticsearch  from 'elasticsearch'
    export default {
        name: "search",
        data(){
            return {
                queryParam: '',
                activeName: 'mutipart',
                result: {
                    total: {
                        value: 0
                    }
                },
                codeLabel: {
                    par_member: '党员'
                },
                parMemberMap: {},
                pageable: {
                    total: 0,
                    currentPage: 1,
                    pageSize: 10
                },
                esClient: {}
            }
        },
        methods:{
            search() {
                switch (this.activeName) {

                    default:
                        this.mutipartSearch(this.queryParam);
                }
            },
            mutipartSearch(queryParam) {
                this.esClient.search({
                    q: queryParam,
                    from: (this.pageable.currentPage - 1) * this.pageable.pageSize,
                    size: this.pageable.pageSize,
                    body: {
                        highlight: {
                            require_field_match: false,
                            fields: {
                                '*': {}
                            }
                        }
                    }
                }).then( data => {
                    this.result = data.hits;
                    this.pageable.total = this.result.total.value;
                    this.result.hits.forEach( item => {
                        let temp = this.getHtmlAndTitle(item);
                        item.html = temp.html;
                        item.title = temp.title;
                    });
                })
            },
            getHtmlAndTitle(obj) {
                Object.keys(obj.highlight).forEach( item => {
                    obj._source[item] = obj.highlight[item];
                });
                let title = '[' + this.codeLabel[obj._index] + ']' + obj._source.name;
                let html = '<label>' + new Date(obj._source.modifiedby).Format('yyyy年MM月dd日') + ' ' + '-' + ' </label>';
                Object.keys(obj._source).forEach( index => {
                    let value = this.parMemberMap[index];
                    if (value && obj._source[index]) {
                        html += value + ':' + obj._source[index] + ' ';
                    }
                });
                return { html, title};
            },
        },
        created() {
            this.esClient  = new elasticsearch.Client({
                host: './es',
                log: 'trace'
            });
            if (this.$route.query.keyword) {
                let temp = this.$route.query.keyword;
                this.queryParam = temp;
                this.search();
            }
        },
        mounted() {
            this.$store.state.menuList[3].children.filter( (item) => item.name === 'parMember')[0].sysClass.properties.forEach(item => {
                this.parMemberMap[item.name] = item.des;
            })
        }
    }
</script>

<style scoped>
    .mutipart-search {
        width: 100%;
    }
    .search-input {
        width: 600px;
        margin-bottom: 10px;
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
    .result-remind {
        color: #a1a1a1;
        font-size: 12px;
        text-align: left;
        line-height: 26px;
    }
    .content-item {
        text-align: left;
        margin-bottom: 10px;
        width: 700px;
        padding-left: 5px;
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
    .mutipart-search em {
        font-style: normal;
        color: red;
    }
    .mutipart-search label {
        color: #858585;
    }
</style>
