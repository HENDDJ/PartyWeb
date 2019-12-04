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
        <el-card style="width: 45%;margin: -10px 20px 20px ;float: left;">
            <div slot="header" class="clearfix">
                <span>XXX饼图</span>
            </div>
            <div id="pieChart" style="height:200px;width: 98%;"></div>
        </el-card>
        <el-card style="width: 45%;margin: -10px 20px 20px ;float: left;">
            <div slot="header" class="clearfix">
                <span>XXX饼图</span>
            </div>
            <div id="pieChart1" style="height:200px;width: 98%;"></div>
        </el-card>
        <el-card style="width: 92%;margin: 20px;height: 440px;">
            <div>
                <el-col :span="5" style="text-align: left" >详细信息</el-col>
                <el-col :span="19">
                    <el-input style="text-align: right;right: 33px" v-model="queryName" placeholder="请输入村书记姓名"></el-input>
                </el-col>
            </div>
            <div>
                <el-card v-for="item in secretaryList" :key="item.name" style="width: 17%;margin: 10px 25px;height: 150px;float: left;" @click.native="showDetailSecretary(item)">
                    <el-col :span="12">
                        <el-image style="width: 72px; height: 108px;border-radius: 5px;border: 1px white solid;" :src="item.image"></el-image>
                    </el-col>
                    <el-col :span="10" style="text-align: left;margin-top: 10px">
                        <div style="font-size: 14px;margin: 5px;">
                            <span style="width: 50px;display: inline-block">姓名:</span>{{item.name}}
                        </div>
                        <div style="font-size: 14px;margin: 5px;">
                            <span style="width: 50px;display: inline-block">组织：</span>{{item.districtId}}
                        </div>
                    </el-col>
                    <el-image style="width: 70px; height: 70px;margin-top:-10px ;" :src="item.image"></el-image>
                </el-card>
            </div>
            <div style="clear: both;text-align: right;margin-right: 20px" >
                <el-pagination background layout="prev, pager, next" :total=secretaryList.length+10 ></el-pagination>
            </div>
        </el-card>
        <el-dialog title="村书记信息" :visible.sync="dialogVis" style="text-align: left">

        </el-dialog>
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
                    },
                    {
                        name:'张三7',
                        image:'111',
                        districtId:'宝华村'
                    },
                    {
                        name:'张三8',
                        image:'111',
                        districtId:'宝华村'
                    },
                    {
                        name:'张三9',
                        image:'111',
                        districtId:'宝华村'
                    }
                ],
                dialogVis:false,
                form:{},
            }
        },
        methods:{
            showPie(){
                let pieChart = echarts.init(document.getElementById("pieChart"));
                let option = {
                    title : {
                        text: '',
                        subtext: '',
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
                        text: '',
                        subtext: '',
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
            showDetailSecretary(item){
                this.dialogVis = true;
                this.form = item;
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
        height:100px;
        border-radius:15px;
    }
    .typeNumberCard span{
        color: #fff;
        position:relative;
        text-align:center;
        top: 15px;
    }
</style>
