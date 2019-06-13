<template>
    <section>
        <div id="app">
            <vs-row>
                <vs-col style="padding: 0 20px;" v-tooltip="'col - 4'" vs-type="flex" vs-justify="center" vs-align="center" vs-w="3">
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
                </vs-col>
                <vs-col style="padding: 0 0;" v-tooltip="'col - 4'" vs-type="flex" vs-justify="center" vs-align="center" vs-w="9">
                    <vs-row>
                        <vs-col style="padding: 0 30px;" v-tooltip="'col - 4'" vs-justify="center" vs-align="center" vs-w="12">
                            <vs-card class="card-sat">
                                <div style="display: flex">
                                    <div style="flex: 1;text-align: center">
                                        <vs-icon class="icon-tran" icon="person" size="75px" color="white" bg="red"></vs-icon>
                                    </div>
                                    <div style="flex: 2;text-align: right">
                                        <p style="line-height: 28px;color: #afafaf">党员总人数</p>
                                        <p style="font-size: 36px;">18,855</p>
                                    </div>
                                </div>
                                <div slot="footer" style="border-top: 1px grey solid">
                                    <p style="font-size: 14px;color: #cecece;text-align: right;line-height: 26px;">截止{{new Date().toLocaleDateString()}}</p>
                                </div>
                            </vs-card>
                            <vs-card class="card-sat" >
                                <div style="display: flex">
                                    <div style="flex: 1;text-align: center">
                                        <vs-icon class="icon-tran" icon="local_activity" size="75px" color="white" bg="red"></vs-icon>
                                    </div>
                                    <div style="flex: 2;text-align: right">
                                        <p style="line-height: 28px;color: #afafaf">活动执行次数</p>
                                        <p style="font-size: 36px;">56</p>
                                    </div>
                                </div>
                                <div slot="footer" style="border-top: 1px grey solid">
                                    <p style="font-size: 14px;color: #cecece;text-align: right;line-height: 26px;">截止{{new Date().toLocaleDateString()}}</p>
                                </div>
                            </vs-card>
                        </vs-col>
                    </vs-row>
                    <vs-row>
                        <vs-col style="padding: 0 30px;" v-tooltip="'col - 4'" vs-justify="center" vs-align="center" vs-w="12">
                            <vs-card class="card-sat">
                                <div style="display: flex">
                                    <div style="flex: 1;text-align: center">
                                        <vs-icon class="icon-tran" icon="group_work" size="75px" color="white" bg="red"></vs-icon>
                                    </div>
                                    <div style="flex: 2;text-align: right">
                                        <p style="line-height: 28px;color: #afafaf">下属组织数</p>
                                        <p style="font-size: 36px;">230</p>
                                    </div>
                                </div>
                                <div slot="footer" style="border-top: 1px grey solid">
                                    <p style="font-size: 14px;color: #cecece;text-align: right;line-height: 26px;">截止{{new Date().toLocaleDateString()}}</p>
                                </div>
                            </vs-card>
                            <vs-card class="card-sat">
                                <div style="display: flex">
                                    <div style="flex: 1;text-align: center">
                                        <vs-icon class="icon-tran" icon="trending_up" size="75px" color="white" bg="red"></vs-icon>
                                    </div>
                                    <div style="flex: 2;text-align: right">
                                        <p style="line-height: 28px;color: #afafaf">活动完成率</p>
                                        <p style="font-size: 36px;color: green;">95%</p>
                                    </div>
                                </div>
                                <div slot="footer" style="border-top: 1px grey solid">
                                    <p style="font-size: 14px;color: #cecece;text-align: right;line-height: 26px;">截止{{new Date().toLocaleDateString()}}</p>
                                </div>
                            </vs-card>
                        </vs-col>
                    </vs-row>
                    <vs-row>
                        <vs-col style="padding: 0 30px;" v-tooltip="'col - 4'" vs-justify="center" vs-align="center" vs-w="12">
                            <vs-card class="card-sat" >
                                <div style="display: flex">
                                    <div style="flex: 1;text-align: center">
                                        <vs-icon class="icon-tran" icon="home" size="75px" color="white" bg="red"></vs-icon>
                                    </div>
                                    <div style="flex: 2;text-align: right">
                                        <p style="line-height: 28px;color: #afafaf">下属阵地数</p>
                                        <p style="font-size: 36px;">458</p>
                                    </div>
                                </div>
                                <div slot="footer" style="border-top: 1px grey solid">
                                    <p style="font-size: 14px;color: #cecece;text-align: right;line-height: 26px;">截止{{new Date().toLocaleDateString()}}</p>
                                </div>
                            </vs-card>
                            <vs-card class="card-sat" >
                                <div style="display: flex">
                                    <div style="flex: 1;text-align: center">
                                        <vs-icon class="icon-tran" icon="school" size="75px" color="white" bg="red"></vs-icon>
                                    </div>
                                    <div style="flex: 2;text-align: right">
                                        <p style="line-height: 28px;color: #afafaf">村干部总数</p>
                                        <p style="font-size: 36px;">2,520</p>
                                    </div>
                                </div>
                                <div slot="footer" style="border-top: 1px grey solid">
                                    <p style="font-size: 14px;color: #cecece;text-align: right;line-height: 26px;">截止{{new Date().toLocaleDateString()}}</p>
                                </div>
                            </vs-card>
                        </vs-col>
                    </vs-row>
                </vs-col>
            </vs-row>
            <vs-row>
                <vs-col style="padding: 0 20px;" v-tooltip="'col - 4'" vs-type="flex" vs-justify="center" vs-align="center" vs-w="4">
                    <vs-card>
                        <div slot="header">
                            <h3>
                                积分排名
                            </h3>
                        </div>
                        <charts :options="rank"></charts>
                    </vs-card>
                </vs-col>
                <vs-col style="padding: 0 20px;" v-tooltip="'col - 4'" vs-type="flex" vs-justify="center" vs-align="center" vs-w="4">
                    <vs-card>
                        <div slot="header">
                            <h3>
                                XX村阵地实时流量图
                            </h3>
                        </div>
                        <charts :options="flow"></charts>
                    </vs-card>
                </vs-col>
                <vs-col style="padding: 0 20px;" v-tooltip="'col - 4'" vs-type="flex" vs-justify="center" vs-align="center" vs-w="4">
                    <vs-card>
                        <div slot="header">
                            <h3>
                                各村阵地使用分布图
                            </h3>
                        </div>
                        <charts :options="hot"></charts>
                    </vs-card>
                </vs-col>
            </vs-row>
        </div>
    </section>
</template>

<script>
    export default {
        name: "CentralConsole",
        data(){
            return {
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
            }
        },
      /*  components: {
            'charts': VueECharts
        },*/
        mounted() {
            this.hot()
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
        transform: scale(1.1);
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
