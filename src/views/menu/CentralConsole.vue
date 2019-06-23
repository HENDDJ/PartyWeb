<template>
    <section>
        <div id="dashboard">
            <br>
            <el-row :gutter="30" type="flex" justify="space-between">
                <el-col :span="5">
                    <vs-card class="card-sat" style="background-image: linear-gradient(to right, #1ca5ff, #28c9fa);color: #f2f2f2">
                        <div style="display: flex">
                            <div style="flex: 2;text-align: left;">
                                <p style="line-height: 34px;font-weight: bold">党员总人数</p>
                                <p style="font-size: 32px;font-weight: bold">
                                    <template>
                                        <CountTo :startVal="0" :endVal="18856" :duration="1300"></CountTo>
                                    </template>
                                </p>
                            </div>
                            <div style="flex: 1;text-align: center">
                                <template>
                                    <icon name="user" scale="9"></icon>
                                </template>
                            </div>
                        </div>
                        <div slot="footer" style="border-top: 1px #fff solid">
                            <p style="font-size: 14px;text-align: right;line-height: 34px;">截止{{new Date().toLocaleDateString()}}</p>
                        </div>
                    </vs-card>
                </el-col>
                <el-col :span="5">
                    <vs-card class="card-sat" style="background-image: linear-gradient(to right, #ffa10e, #fdb513);color: #f2f2f2">
                        <div style="display: flex">
                            <div style="flex: 2;text-align: left;">
                                <p style="line-height: 34px;font-weight: bold">下属组织数</p>
                                <p style="font-size: 32px;font-weight: bold">
                                    <template>
                                        <CountTo :startVal="0" :endVal="200" :duration="1300"></CountTo>
                                    </template>
                                </p>
                            </div>
                            <div style="flex: 1;text-align: center">
                                <template>
                                    <icon name="user" scale="9"></icon>
                                </template>
                            </div>
                        </div>
                        <div slot="footer" style="border-top: 1px #fff solid">
                            <p style="font-size: 14px;text-align: right;line-height: 34px;">截止{{new Date().toLocaleDateString()}}</p>
                        </div>
                    </vs-card>
                </el-col>
                <el-col :span="5">
                    <vs-card class="card-sat" style="background-image: linear-gradient(to right, #fe8e8b, #ff7288);color: #f2f2f2">
                        <div style="display: flex">
                            <div style="flex: 2;text-align: left;">
                                <p style="line-height: 34px;font-weight: bold">下属阵地数</p>
                                <p style="font-size: 32px;font-weight: bold">
                                    <template>
                                        <CountTo :startVal="0" :endVal="positionNumber" :duration="1300"></CountTo>
                                    </template>
                                </p>
                            </div>
                            <div style="flex: 1;text-align: center">
                                <template>
                                    <icon name="user" scale="9"></icon>
                                </template>
                            </div>
                        </div>
                        <div slot="footer" style="border-top: 1px #fff solid">
                            <p style="font-size: 14px;text-align: right;line-height: 34px;">截止{{new Date().toLocaleDateString()}}</p>
                        </div>
                    </vs-card>
                </el-col>
                <el-col :span="5">
                    <vs-card class="card-sat" style="background-image: linear-gradient(to right, #0dc9ce, #22e3ac);color: #f2f2f2">
                        <div style="display: flex">
                            <div style="flex: 2;text-align: left;">
                                <p style="line-height: 34px;font-weight: bold">下属村干部总数</p>
                                <p style="font-size: 32px;font-weight: bold">
                                    <template>
                                        <CountTo :startVal="0" :endVal="villageCadresNumber" :duration="1300"></CountTo>
                                    </template>
                                </p>
                            </div>
                            <div style="flex: 1;text-align: center">
                                <template>
                                    <icon name="user" scale="9"></icon>
                                </template>
                            </div>
                        </div>
                        <div slot="footer" style="border-top: 1px #fff solid">
                            <p style="font-size: 14px;text-align: right;line-height: 34px;">截止{{new Date().toLocaleDateString()}}</p>
                        </div>
                    </vs-card>
                </el-col>
                <el-col :span="5">
                    <vs-card class="card-sat" style="background-image: linear-gradient(to right, #cf8bf3, #fdb99b);color: #f2f2f2">
                        <div style="display: flex">
                            <div style="flex: 2;text-align: left;">
                                <p style="line-height: 34px;font-weight: bold">下属村书记总数</p>
                                <p style="font-size: 36px;font-weight: bold">163</p>
                            </div>
                            <div style="flex: 1;text-align: center">
                                <template>
                                    <icon name="user" scale="9"></icon>
                                </template>
                            </div>
                        </div>
                        <div slot="footer" style="border-top: 1px #fff solid">
                            <p style="font-size: 14px;text-align: right;line-height: 34px;">截止{{new Date().toLocaleDateString()}}</p>
                        </div>
                    </vs-card>
                </el-col>
            </el-row>
            <div style="display: flex">
                <div class="content-left">
                    <vs-card class="card-sat">
                        <div slot="header">
                            <h3>
                                指标信息
                            </h3>
                        </div>
                        <div style="display: flex;align-items: center" slot="media">
                            <div style="flex: 1">
                                <div class="content-unit">
                                    <div class="outer">
                                        <div class="inner"></div>
                                    </div>
                                    <div style="display: inline-block;font-size: 36px;">
                                        <template>
                                            <CountTo :startVal="0" :endVal="activityPerformNumber" :duration="1300"></CountTo>
                                        </template>
                                        <p style="font-size: 18px;color: #6d6d6d">
                                            活动执行次数
                                        </p>
                                    </div>
                                </div>
                                <div class="content-unit">
                                    <div class="outer1">
                                        <div class="inner1"></div>
                                    </div>
                                    <div style="display: inline-block;font-size: 36px;">
                                        <template>
                                            <CountTo :startVal="0" suffix="%" :decimals="1" :endVal="activityCompleteRate" :duration="1300"></CountTo>
                                        </template>
                                        <p style="font-size: 18px;color: #6d6d6d">
                                            活动完成率
                                        </p>
                                    </div>
                                </div>

                            </div>
                            <div style="width: 30px;border-left: 2px solid #ebebeb;height: 200px;"></div>
                            <div style="flex: 1">
                                <div class="content-unit">
                                    <div class="outer2">
                                        <div class="inner2"></div>
                                    </div>
                                    <div style="display: inline-block;font-size: 36px;">
                                        <template>
                                            <CountTo :startVal="0" :endVal="activityPerformNumber" :duration="1300"></CountTo>
                                        </template>
                                        <p style="font-size: 18px;color: #6d6d6d">
                                            当日阵地总人流量

                                        </p>
                                    </div>
                                </div>
                                <div class="content-unit">
                                    <div class="outer3">
                                        <div class="inner3"></div>
                                    </div>
                                    <div style="display: inline-block;font-size: 36px;">
                                        <template>
                                            <CountTo :startVal="0" suffix="%" :decimals="1" :endVal="activityCompleteRate" :duration="1300"></CountTo>
                                        </template>
                                        <p style="font-size: 18px;color: #6d6d6d">
                                            阵地平均人流量
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div id="pieBar" style="flex: 1.25;height: 300px"></div>

                        </div>
                    </vs-card>
                    <vs-card class="card-sat">
                    </vs-card>
                </div>
                <div class="content-right">
                    <vs-card :fixed-height="true" class="card-sat">
                    </vs-card>
                </div>
            </div>
                              <vs-card>
                        <div slot="header">
                            <h3>
                                组织信息
                            </h3>
                        </div>
                        <div>
                           <!-- <img src="./dq.jpg" alt="党旗">-->
                            <div style="display: inline-block;font-size: 16px;line-height: 32px;">
                                <p>名&emsp;&emsp;称:&emsp;中共句容市XXX党委</p>
                                <p>书&emsp;&emsp;记:&emsp;XXX</p>
                                <p>委&emsp;&emsp;员:&emsp;XXX、XXX、XXX、XXX、 XXX、XXX</p>
                                <p>成立日期:&emsp;1990年11月12日</p>
                                <p>地&emsp;&emsp;址:&emsp;中共句容市XXX路XX号</p>
                            </div>
                        </div>
                        <div slot="footer">
                            <vs-row vs-justify="flex-end">
                            </vs-row>
                        </div>
                    </vs-card>
        </div>
    </section>
</template>

<script>
    import Highcharts from 'highcharts/highstock';
    import highchartsDrilldown from 'highcharts/modules/drilldown';
    import highcharts3D from 'highcharts/highcharts-3d';
    import variablePie from 'highcharts/modules/variable-pie';
    variablePie(Highcharts)
    highchartsDrilldown(Highcharts);
    highcharts3D(Highcharts);

    import CountTo from 'vue-count-to';
    export default {
        name: "CentralConsole",
        data(){
            return {
                activityPerformNumber:0, //活动执行次数
                activityCompleteRate:0,//活动完成率
                villageCadresNumber:0, //村干部数量
                positionNumber:0,//阵地数量
                rank: {
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['蒸发量','降水量']
                    },
                    toolbox: {
                        show : true,
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            data : ['XX村','XX村','XX村','XX村','XX村','XX村','XX村','XX村','XX村','XX村']
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            max: 200
                        }
                    ],
                    series : [
                        {
                            name:'积分',
                            type:'bar',
                            data:[150,150,145,140,135,135,130,128,115,110],
                            markPoint : {
                                data : [
                                    {type : 'max', name: '最大值'},
                                    {type : 'min', name: '最小值'}
                                ]
                            },
                            markLine : {
                                data : [
                                    {type : 'average', name: '平均值'}
                                ]
                            }
                        }
                    ]
                },
                flow: {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['党员教育室','党内关爱室','党群工作室','组织议事室']
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['8: 00','8: 30','9: 00','9: 30','10: 00','10: 30','11: 00']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name:'党员教育室',
                            type:'line',
                            stack: '总量',
                            data:[120, 132, 101, 134, 90, 230, 210]
                        },
                        {
                            name:'党内关爱室',
                            type:'line',
                            stack: '总量',
                            data:[220, 182, 191, 234, 290, 330, 310]
                        },
                        {
                            name:'党群工作室',
                            type:'line',
                            stack: '总量',
                            data:[150, 232, 201, 154, 190, 330, 410]
                        },
                        {
                            name:'组织议事室',
                            type:'line',
                            stack: '总量',
                            data:[320, 332, 301, 334, 390, 330, 320]
                        }
                    ]
                },
            }
        },
        methods:{
            //统计总数
            totalStatistics(){
                this.$http("POST",`identity/centralConsole/statistics`,false).then( data => {
                    this.activityPerformNumber = data.activityPerformNumber;
                    this.villageCadresNumber = data.villageCadresNumber;
                    this.positionNumber =data.positionNumber;
                    this.activityCompleteRate = ((data.activityCompleteRate*1000).toFixed())/10;
                })
            },
            hot(){
                let hours = ['XXX村','XXX村','XXX村','XXX村','XXX村','XXX村','XXX村','XXX村','XXX村','XXX村','XXX村','XXX村','XXX村','XXX村','XXX村','XXX村','XXX村','XXX村','XXX村','XXX村','XXX村','XXX村','XXX村','XXX村'];
                let days = ['党员教育室', '党群工作室', '组织议事室', '党内关爱室'];

                let data = [[0,0,5],[0,1,1],[0,2,0],[0,3,0],[0,4,0],[0,5,0],[0,6,0],[0,7,0],[0,8,0],[0,9,0],[0,10,0],[0,11,2],[0,12,4],[0,13,1],[0,14,1],[0,15,3],[0,16,4],[0,17,6],[0,18,4],[0,19,4],[0,20,3],[0,21,3],[0,22,2],[0,23,5],[1,0,7],[1,1,0],[1,2,0],[1,3,0],[1,4,0],[1,5,0],[1,6,0],[1,7,0],[1,8,0],[1,9,0],[1,10,5],[1,11,2],[1,12,2],[1,13,6],[1,14,9],[1,15,11],[1,16,6],[1,17,7],[1,18,8],[1,19,12],[1,20,5],[1,21,5],[1,22,7],[1,23,2],[2,0,1],[2,1,1],[2,2,0],[2,3,0],[2,4,0],[2,5,0],[2,6,0],[2,7,0],[2,8,0],[2,9,0],[2,10,3],[2,11,2],[2,12,1],[2,13,9],[2,14,8],[2,15,10],[2,16,6],[2,17,5],[2,18,5],[2,19,5],[2,20,7],[2,21,4],[2,22,2],[2,23,4],[3,0,7],[3,1,3],[3,2,0],[3,3,0],[3,4,0],[3,5,0],[3,6,0],[3,7,0],[3,8,1],[3,9,0],[3,10,5],[3,11,4],[3,12,7],[3,13,14],[3,14,13],[3,15,12],[3,16,9],[3,17,5],[3,18,5],[3,19,10],[3,20,6],[3,21,4],[3,22,4],[3,23,1]];

                data = data.map(item => {
                    return [item[1], item[0], item[2] || '-'];
                });

                let option = {
                    tooltip: {
                        position: 'top'
                    },
                    animation: false,
                    xAxis: {
                        type: 'category',
                        data: hours,
                        splitArea: {
                            show: true
                        }
                    },
                    yAxis: {
                        type: 'category',
                        data: days,
                        splitArea: {
                            show: true
                        }
                    },
                    visualMap: {
                        min: 0,
                        max: 10,
                        calculable: true,
                        orient: 'horizontal',
                        left: 'center',
                        top: 0
                    },
                    series: [{
                        name: 'Punch Card',
                        type: 'heatmap',
                        data: data,
                        label: {
                            normal: {
                                show: true
                            }
                        },
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }]
                };
                return option;
            },
            initBar() {

                new Highcharts.Chart('pieBar', {
                    chart: {
                        type: 'variablepie'
                    },
                    title: {
                        text: null
                    },
                    tooltip: {
                        headerFormat: '',
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
                            '面积 (平方千米): <b>{point.y}</b><br/>' +
                            '人口密度 (每平方千米人数): <b>{point.z}</b><br/>'
                    },
                    plotOptions: {
                        series: {
                            showInLegend: false
                        },
                        variablepie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                distance: 10,//控制饼图外面的线的长短,为负数时文本内容在饼图内部
                                formatter: function() {
                                    //this 为当前的点（扇区）对象，可以通过  console.log(this) 来查看详细信息
                                    return '<span style="color: ' + this.point.color + '">'
                                        + this.point.name + '(' + Math.round(this.percentage) + '%)</span>';
                                }
                            }
                        }
                    },
                    series: [{
                        minPointSize: 10,
                        innerSize: '20%',
                        zMin: 0,
                        name: 'countries',
                        data: [{
                            name: '党群工作室',
                            y: 505370,
                            z: 92.9
                        }, {
                            name: '党员教育室',
                            y: 551500,
                            z: 118.7
                        }, {
                            name: '党内关爱室',
                            y: 312685,
                            z: 124.6
                        }, {
                            name: '组织议事室',
                            y: 78867,
                            z: 137.5
                        }]
                    }]
                });
            }
        },
        components: {
            CountTo
        },
        mounted() {
            this.hot();
            this.initBar();
        },
        created(){
            this.totalStatistics();
        }
    }
</script>

<style scoped>
    #app {
        padding: 30px 10px;
    }
    body {
        background-color: #f8f8f8;
    }
    .con-vs-card {
        transition: all .5s;
    }
    .con-vs-card:hover {
        transform: translateY(-15px);
        cursor: pointer;
    }
    .con-vs-card:hover .icon-tran {
        transform: rotateY(180deg);
        transition: all .5s;
    }
    .con-vs-card:hover div>p:nth-child(2) {
        color: #fffa49;
    }
    .card-sat {
        padding: 22px 30px;
    }
    @media screen and (max-device-width: 1400px){
        .card-sat {
            padding: 25px 10px;
        }
    }
    body {
        overflow-x: hidden;
    }
    .echarts {
        width: calc(100vw/1920 * 600) !important;
        height: calc(100vw/1920 * 400) !important;
    }
</style>
<style>
    #dashboard {
        margin-top: -20px;
    }
    #dashboard .vs-card--content {
        margin-bottom: 0!important;
        padding: 0 10px;
    }
    #dashboard svg {
        margin: 0!important;
    }
    #dashboard .vs-card--footer {
        margin-top: -20px !important;
    }
    #dashboard .vs-card--header {
        box-shadow: none;
    }
    .content-left {
        flex: 2;
        margin-right: 30px;
        text-align: left;
    }
    .content-right {
        flex: 1;
    }
    .outer {
        width: 26px;
        height: 26px;
        background-image: linear-gradient(to right, #f54744, #c05fbf);
        border-radius: 50%;
        display: inline-block;
        vertical-align: top;
        margin-top: 10px;
        margin-right: 15px;
    }
    .inner {
        width: 16px;
        height: 16px;
        left: 5px;
        top: 5px;
        position: relative;
        border-radius: 50%;
        background: white;
    }
    .outer1 {
        width: 26px;
        height: 26px;
        background-image: linear-gradient(to top, #5c37e2, #c15bf0);
        border-radius: 50%;
        display: inline-block;
        vertical-align: top;
        margin-top: 10px;
        margin-right: 15px;
    }
    .inner1 {
        width: 16px;
        height: 16px;
        left: 5px;
        top: 5px;
        position: relative;
        border-radius: 50%;
        background: white;
    }
    .outer2 {
        width: 26px;
        height: 26px;
        background-image: linear-gradient(to top, #3656d9, #1bb8db);
        border-radius: 50%;
        display: inline-block;
        vertical-align: top;
        margin-top: 10px;
        margin-right: 15px;
    }
    .inner2 {
        width: 16px;
        height: 16px;
        left: 5px;
        top: 5px;
        position: relative;
        border-radius: 50%;
        background: white;
    }
    .outer3 {
        width: 26px;
        height: 26px;
        background-image: linear-gradient(to top, #10afca, #2bf7c8);
        border-radius: 50%;
        display: inline-block;
        vertical-align: top;
        margin-top: 10px;
        margin-right: 15px;
    }
    .inner3 {
        width: 16px;
        height: 16px;
        left: 5px;
        top: 5px;
        position: relative;
        border-radius: 50%;
        background: white;
    }
    .content-unit {
        width: 200px;
        margin: 50px auto;
    }
</style>
