<template>
    <section class="villageDisplay">
        <el-card class="typeNumberCard" style="background-color: #1e6abc">
            <span>员额村书记：</span>
            <CountTo :startVal="0"  :endVal="15" :duration="1300"></CountTo>
        </el-card>
        <el-card class="typeNumberCard" style="background-color: #1e6abc">
            <span>员额村书记：</span>
            <CountTo :startVal="0"  :endVal="15" :duration="1300"></CountTo>
        </el-card>
        <el-card class="typeNumberCard" style="background-color: #1e6abc">
            <span>员额村书记：</span>
            <CountTo :startVal="0"  :endVal="15" :duration="1300"></CountTo>
        </el-card>
        <el-card class="typeNumberCard" style="background-color: #1e6abc">
            <span>员额村书记：</span>
            <CountTo :startVal="0"  :endVal="15" :duration="1300"></CountTo>
        </el-card>
        <el-card class="typeNumberCard" style="background-color: #1e6abc">
            <span>员额村书记：</span>
            <CountTo :startVal="0"  :endVal="15" :duration="1300"></CountTo>
        </el-card>
        <el-card class="box-card" style="width: 45%;margin: 20px;float: left;">
            <div slot="header" class="clearfix">
                <span>XXX饼图</span>
            </div>
            <div id="pieChart" style="height:250px;width: 98%;"></div>
        </el-card>
        <el-card class="box-card" style="width: 45%;margin: 20px;float: left;">
            <div slot="header" class="clearfix">
                <span>XXX饼图</span>
            </div>
            <div id="pieChart1" style="height:250px;width: 98%;"></div>
        </el-card>
        <el-card style="width: 92%;margin: 20px;height: 350px;">
            <div>
                <span style="width: 10%;">详细信息</span>
                <el-input style="margin-left: 80%;width: 10%" v-model="queryName" placeholder="请输入村书记姓名"></el-input>
            </div>
            <el-card v-for="item in secretaryList" :key="item.name" style="width: 17%;margin: 20px;height: 100px;float: left;">
                <el-col :span="15">
                    <el-image style="width: 60px; height: 60px" :src="item.image"></el-image>
                </el-col>
                <el-col :span="8">
                    <div style="font-size: 12px;">{{item.name}}</div>
                    <div style="font-size: 12px;">{{item.districtId}}</div>
                </el-col>
            </el-card>
        </el-card>
    </section>
</template>

<script>
    import CountTo from 'vue-count-to';
    export default {
        name: "village-secretary-display",
        data(){
            return {
                queryName:'',
                secretaryList:[
                    {
                        name:'张三',
                        image:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                        districtId:'宝华村'
                    },
                    {
                        name:'张三1',
                        image:'111',
                        districtId:'宝华村'
                    },
                    {
                        name:'张三2',
                        image:'111',
                        districtId:'宝华村'
                    },
                    {
                        name:'张三3',
                        image:'111',
                        districtId:'宝华村'
                    },
                    {
                        name:'张三4',
                        image:'111',
                        districtId:'宝华村'
                    },
                    {
                        name:'张三5',
                        image:'111',
                        districtId:'宝华村'
                    },
                    {
                        name:'张三6',
                        image:'111',
                        districtId:'宝华村'
                    }
                ],
            }
        },
        methods:{
            showPie(){
                let pieChart = echarts.init(document.getElementById("pieChart"));
                let option = {
                    title : {
                        text: '某站点用户访问来源',
                        subtext: '纯属虚构',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
                    },
                    series : [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data:[
                                {value:335, name:'直接访问'},
                                {value:310, name:'邮件营销'},
                                {value:234, name:'联盟广告'},
                                {value:135, name:'视频广告'},
                                {value:1548, name:'搜索引擎'}
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                pieChart.setOption(option);
            },
            showPie1(){
                let pieChart = echarts.init(document.getElementById("pieChart1"));
                let option = {
                    title : {
                        text: '某站点用户访问来源',
                        subtext: '纯属虚构',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
                    },
                    series : [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data:[
                                {value:335, name:'直接访问'},
                                {value:310, name:'邮件营销'},
                                {value:234, name:'联盟广告'},
                                {value:135, name:'视频广告'},
                                {value:1548, name:'搜索引擎'}
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                pieChart.setOption(option);
            }
        },
        components:{
            CountTo
        },
        mounted(){
            this.showPie();
            this.showPie1();
        },
        created(){

        }
    }
</script>

<style scoped>
    .typeNumberCard{
        width: 17%;
        margin: 20px;
        float: left;
        height:120px;
        border-radius:15px;
    }
</style>
