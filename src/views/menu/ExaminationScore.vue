<template>
    <div>
        <div style="position:relative;">
            <p style="float:left;margin-left: 10px">年份：</p>
            <vs-select
                class="selectExample"
                style="position: absolute;margin-left: 60px"
                label=""
                v-model="chooseYear"
                width="120px"
                @change="con"
            >
                <vs-select-item :key="index" :value="item.value" :text="item.text" v-for="item,index in options"/>
            </vs-select>

            <vs-button type="gradient" style="float:left;margin-left: 160px"@click="changeType">可视化统计图</vs-button>
            <vs-button color="success" style="float:left;margin-left: 20px" type="gradient">表格数据</vs-button>
        </div>
        <transition name="el-fade-in-linear">
        <div style="clear: both" v-if="pictureOrTable===true" v-show="pictureOrTableShow">
            <div class="downLeft">
                <div id="containerScore" style="height: 400px"></div>
                <div id="containerPer" style="height: 400px"></div>
            </div>
            <div class="downRight">
                <transition name="el-zoom-in-center" mode="out-in">
                    <div v-show="activityLoading">
                        <vs-card actionable class="cardx" v-if="scoreOrPercent">
                            <div slot="header">
                                <h3>
                                    {{this.firstTown}}各村分数
                                </h3>
                            </div>
                            <div slot="media">
                                <img src="static/img/blue.png" style="height:30px">
                            </div>
                            <div>
                                <div>
                                    <vs-table :data="cunData">
                                        <template slot="header">

                                        </template>
                                        <template slot="thead">
                                            <vs-th style="width: 180px">
                                                <a style="margin-left: 20px">排名</a>
                                            </vs-th>
                                            <vs-th>
                                                村名
                                            </vs-th>
                                            <vs-th>
                                                分数
                                            </vs-th>

                                        </template>

                                        <template slot-scope="{data}">
                                            <vs-tr
                                                :state="indextr == 0 || indextr == 1|| indextr == 2?'success':null&indextr == 4?'success':null"
                                                :key="indextr" v-for="(tr, indextr) in cunData">
                                                <vs-td style="text-align: left">
                                                    <icon v-if="indextr===0" name="RankFirstIcon" scale="2"></icon>
                                                    <icon v-if="indextr===1" name="RankSecondIcon" scale="2"></icon>
                                                    <icon v-if="indextr===2" name="RankThirdIcon" scale="2"></icon>
                                                    <a v-if="indextr<3">{{indextr+1}}</a>
                                                    <a v-else  style="margin-left: 45.28px" >{{indextr+1}}</a>
                                                </vs-td>

                                                <vs-td :data="tr.cun" style="text-align: left">
                                                    {{tr.cun}}
                                                </vs-td>

                                                <vs-td :data="tr.exam" style="text-align: left">
                                                    <countTo :startVal='0' :endVal='tr.exam' :duration='1500'></countTo>
                                                </vs-td>

                                            </vs-tr>
                                        </template>
                                    </vs-table>
                                </div>
                            </div>
                            <div slot="footer">
                                <vs-row vs-justify="flex-end">
                                    <vs-button color="primary" type="gradient">表格数据</vs-button>
                                </vs-row>
                            </div>
                        </vs-card>
                        <vs-card actionable class="cardx" v-if="scoreOrPercent===false">
                            <div slot="header">
                                <h3>
                                    {{this.secondTown}}各村完成比例
                                </h3>
                            </div>
                            <div slot="media">
                                <img src="static/img/blue.png" style="height:30px">
                            </div>
                            <div>
                                <div>
                                    <vs-table :data="cunPercent">
                                        <template slot="header">

                                        </template>
                                        <template slot="thead">
                                            <vs-th style="width: 180px">
                                                <a style="margin-left: 20px">排名</a>
                                            </vs-th>
                                            <vs-th>
                                                村名
                                            </vs-th>
                                            <vs-th>
                                                完成情况
                                            </vs-th>

                                        </template>

                                        <template slot-scope="{data}">
                                            <vs-tr
                                                :state="indextr == 0 || indextr == 1|| indextr == 2?'success':null"
                                                :key="indextr" v-for="(tr, indextr) in cunPercent">
                                                <vs-td style="text-align: left">
                                                    <icon v-if="indextr===0" name="RankFirstIcon" scale="2"></icon>
                                                    <icon v-if="indextr===1" name="RankSecondIcon" scale="2"></icon>
                                                    <icon v-if="indextr===2" name="RankThirdIcon" scale="2"></icon>
                                                    <a v-if="indextr<3">{{indextr+1}}</a>
                                                    <a v-else  style="margin-left: 45.28px" >{{indextr+1}}</a>
                                                </vs-td>

                                                <vs-td :data="tr.cun" style="text-align: left">
                                                    {{tr.cun}}
                                                </vs-td>

                                                <vs-td :data="tr.score" style="text-align: left">
                                                    <el-progress v-if="(tr.score || 0) < 0.3" :percentage="Math.round((tr.score || 0) * 1000)/10" color="#951200" :stroke-width="5"></el-progress>
                                                    <el-progress v-else-if="(tr.score || 0) < 0.7" :percentage="Math.round((tr.score || 0) * 1000)/10" color="#e6a23c" :stroke-width="5"></el-progress>
                                                    <el-progress v-else-if="(tr.score || 0) < 1" :percentage="Math.round((tr.score || 0) * 1000)/10" color="#0c89c2" :stroke-width="5"></el-progress>
                                                    <el-progress v-else-if="(tr.score || 0) === 1" :percentage="Math.round((tr.score || 0) * 1000)/10" color="#67c23a" :stroke-width="5"></el-progress>
                                                    <!--<vs-progress :percent="tr.score*100" color="primary">primary</vs-progress>-->
                                                    <!--{{tr.score*100}}-->

                                                </vs-td>

                                            </vs-tr>
                                        </template>
                                    </vs-table>
                                </div>
                            </div>
                            <div slot="footer">
                                <vs-row vs-justify="flex-end">
                                    <vs-button color="primary" type="gradient">表格数据</vs-button>

                                </vs-row>
                            </div>
                        </vs-card>
                    </div>
                </transition>
            </div>
        </div>

        <div style="clear: both" v-if="pictureOrTable===false" v-show="pictureOrTable">
123

        </div>
        </transition>
    </div>
</template>

<script>
    import Highcharts from 'highcharts/highstock';
    import HighchartsMore from 'highcharts/highcharts-more';
    import Highcharts3D from 'highcharts/highcharts-3d';
    import countTo from 'vue-count-to';

    HighchartsMore(Highcharts);
    Highcharts3D(Highcharts);
    export default {
        name: "ExaminationScore",
        components: { countTo },
        data() {
            return {
                options: [],
                optionsRegion: [{text: '全市', value: ' '}],
                chooseYear: 2019,
                chooseRegion: ' ',
                chart: {},
                chart01: {},
                pageable: {
                    total: 0,
                    pageNumber: 1,
                    pageSize: 10
                },
                scoreOptions: [],
                percentOptions:[],
                theme1: {
                    colors: "#2b908f #90ee7e #f45b5b #7798BF #aaeeee #ff0066 #eeaaee #55BF3B #DF5353 #7798BF #aaeeee".split(" "),
                    chart: {
                        backgroundColor: {
                            radialGradient: {cx: 0.5, cy: 0.5, r: 0.5},
                            stops: [
                                [0, '#89baed'],
                                [1, '#f2f2f2'],
                            ]
                        }, style: {fontFamily: "'Unica One', sans-serif"}, plotBorderColor: "#606063"
                    },
                    title: {style: {color: "#505053", textTransform: "uppercase", fontSize: "20px"}},
                    subtitle: {style: {color: "##505053", textTransform: "uppercase"}},
                    xAxis: {
                        gridLineColor: "#707073",
                        labels: {style: {color: "#505053"}},
                        lineColor: "#707073",
                        minorGridLineColor: "#505053",
                        tickColor: "#707073",
                        title: {style: {color: "#A0A0A3"}}
                    },
                    yAxis: {
                        gridLineColor: "#707073",
                        labels: {style: {color: "#505053"}},
                        lineColor: "#707073",
                        minorGridLineColor: "#505053",
                        tickColor: "#707073",
                        tickWidth: 1,
                        title: {style: {color: "#A0A0A3"}}
                    },
                    tooltip: {backgroundColor: "rgba(0, 0, 0, 0.85)", style: {color: "#F0F0F0"}},
                    plotOptions: {
                        series: {dataLabels: {color: "#B0B0B3"}, marker: {lineColor: "#333"}},
                        boxplot: {fillColor: "#505053"},
                        candlestick: {lineColor: "white"},
                        errorbar: {color: "white"}
                    },
                    legend: {
                        itemStyle: {color: "#505053"},
                        itemHoverStyle: {color: "#FFF"},
                        itemHiddenStyle: {color: "#606063"}
                    },
                    credits: {style: {color: "#666"}},
                    labels: {style: {color: "#707073"}},
                    drilldown: {activeAxisLabelStyle: {color: "#F0F0F3"}, activeDataLabelStyle: {color: "#F0F0F3"}},
                    navigation: {buttonOptions: {symbolStroke: "#DDDDDD", theme: {fill: "#505053"}}},
                    rangeSelector: {
                        buttonTheme: {
                            fill: "#505053", stroke: "#000000", style: {color: "#CCC"}, states: {
                                hover: {
                                    fill: "#707073", stroke: "#000000",
                                    style: {color: "white"}
                                }, select: {fill: "#000003", stroke: "#000000", style: {color: "white"}}
                            }
                        },
                        inputBoxBorderColor: "#505053",
                        inputStyle: {backgroundColor: "#333", color: "silver"},
                        labelStyle: {color: "silver"}
                    },
                    navigator: {
                        handles: {backgroundColor: "#666", borderColor: "#AAA"},
                        outlineColor: "#CCC",
                        maskFill: "rgba(255,255,255,0.1)",
                        series: {color: "#7798BF", lineColor: "#A6C7ED"},
                        xAxis: {gridLineColor: "#505053"}
                    },
                    scrollbar: {
                        barBackgroundColor: "#808083",
                        barBorderColor: "#808083",
                        buttonArrowColor: "#CCC",
                        buttonBackgroundColor: "#606063",
                        buttonBorderColor: "#606063",
                        rifleColor: "#FFF",
                        trackBackgroundColor: "#404043",
                        trackBorderColor: "#404043"
                    },
                    legendBackgroundColor: "rgba(0, 0, 0, 0.5)",
                    background2: "#505053",
                    dataLabelsColor: "#B0B0B3",
                    textColor: "#C0C0C0",
                    contrastTextColor: "#F0F0F3",
                    maskColor: "rgba(255,255,255,0.3)"
                },
                activityLoading: true,
                //村分数详细数据
                cunData: [],
                //分数默认第一个镇
                firstTown: '',
                //比例默认第一个镇
                secondTown:'',
                //村比例详细数据
                cunPercent:[],
                scoreOrPercent:true,
                //图表或表格
                pictureOrTable:true
            }
        },
        methods: {
            con(val) {
                this.chooseYear = val
                this.scoreOrPercent = true
                let op = this.show();
                op.then(() => {
                    this.chart.update({
                            series: [{
                                name: ['得分'],
                                data: this.scoreOptions,
                            }],
                            yAxis: {
                                min: 0,
                                max: this.scoreOptions[0][1] + 50,
                                tickInterval: 50,
                                title: {
                                    text: '分数'
                                }
                            }
                        }
                    )
                })

                let op2 = this.showPercent();
                op2.then(()=>{
                    this.chart01.update({
                            series: [{
                                name: ['完成比例'],
                                data: this.percentOptions,
                            }],
                            yAxis: {
                                min: 0,
                                max: 100,
                                tickInterval: 20,
                                title: {
                                    text: '比例（百分比）'
                                }
                            }
                        }
                    )
                })

            },
            scoreData(Options) {
                Highcharts.setOptions(this.theme1);
                let os = this
                this.chart = new Highcharts.Chart('containerScore', {
                    colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9',
                        '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1'],
                    chart: {
                        type: 'column',
                        margin: 75,
                        marginTop: 80,
                        marginRight: 40
                    },
                    title: {
                        text: '各镇得分'
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        column: {
                            depth: 25
                        }
                    },
                    xAxis: {
                        type: 'category',
                        labels: {
                            rotation: -45  // 设置轴标签旋转角度
                        }
                    },
                    yAxis: {
                        min: 0,
                        max: Options[0][1] + 50,
                        tickInterval: 50,
                        title: {
                            text: '分数'
                        }
                    },
                    series: [{
                        name: ['得分'],
                        data: Options,
                    }],
                    plotOptions: {
                        column: {
                            colorByPoint: true,
                            dataLabels: {
                                enabled: true,
                                color: '#FFFFFF',
                                align: 'right',
                                y: 0
                            }
                        },
                        series: {
                            cursor: 'pointer',
                            events: {
                                click: function (event) {
                                    os.scoreOrPercent = true
                                    let path1 = `identity/exaExamine/scoreCun${os.chooseYear}Y${event.point.name}T`
                                    os.activityLoading = false
                                    os.$http('Post', path1, false).then((data) => {
                                        os.activityLoading = true
                                        os.cunData = data
                                    }).catch(() => {
                                        os.$message({
                                            type: 'warning',
                                            message: '村级分数获取失败，请检查网络'
                                        })
                                    })

                                }
                            }
                        }
                    },

                });

            },
            //分数highCharts赋值
            show() {
                this.activityLoading = false
                let path = `identity/exaExamine/scoreTown?year=${this.chooseYear}`
                this.scoreOptions = []
                return this.$http('Post', path, false).then((data) => {
                    this.activityLoading = true
                    data.forEach((item) => {
                        this.scoreOptions.push([item.town, item.exam])
                    })
                    let town = this.scoreOptions[0][0]
                    this.firstTown = town
                    let path1 = `identity/exaExamine/scoreCun${this.chooseYear}Y${town}T`
                    this.$http('Post', path1, false).then((data) => {

                        this.cunData = data
                    }).catch(() => {
                        this.$message({
                            type: 'warning',
                            message: '村级分数获取失败，请检查网络'
                        })
                    })
                    return this.scoreOptions
                }).catch(() => {
                    this.$message({
                        type: 'warning',
                        message: '分数获取失败，请检查网络'
                    })
                })
            },
            //完成比例highCharts赋值
            showPercent() {
                this.activityLoading = false
                let path = `identity/exaScore/percentTown?year=${this.chooseYear}`
                this.percentOptions = []
                return this.$http('Post', path, false).then((data) => {
                    this.activityLoading = true
                    data.forEach((item) => {
                        this.percentOptions.push([item.town, item.score * 100])
                    })
                    let town = this.percentOptions[0][0]
                    this.secondTown = town
                    let path1 = `identity/exaScore/percentCun${this.chooseYear}Y${town}T`
                    this.$http('Post', path1, false).then((data) => {
                        this.cunPercent = data
                    }).catch(() => {
                        this.$message({
                            type: 'warning',
                            message: '村级比例获取失败，请检查网络'
                        })
                    })
                    return this.percentOptions
                }).catch(() => {
                    this.$message({
                        type: 'warning',
                        message: '分数获取失败，请检查网络'
                    })
                })
            },
            //比例highcharts赋值
            percentData(Options) {
                Highcharts.setOptions(this.theme1);
                let os = this
                this.chart01 = new Highcharts.Chart('containerPer', {
                    colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9',
                        '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1'],
                    tooltip:{
                        valueDecimals:1
                    },
                    chart: {
                        type: 'column',
                        margin: 75,
                        marginTop: 80,
                        marginRight: 40
                    },
                    title: {
                        text: '各镇完成比例'
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        column: {
                            depth: 25
                        }
                    },
                    xAxis: {
                        type: 'category',
                        labels: {
                            rotation: -45  // 设置轴标签旋转角度
                        }
                    },
                    yAxis: {
                        min: 0,
                        max: 100,
                        tickInterval: 20,
                        title: {
                            text: '比例（百分比）'
                        }
                    },
                    series: [{
                        name: ['比例'],
                        data: Options,
                    }],
                    plotOptions: {
                        column: {
                            colorByPoint: true,
                            dataLabels: {
                                enabled: true,
                                color: '#FFFFFF',
                                align: 'right',
                                format: '{point.y:.1f}%', // :.1f 为保留 1 位小数
                                y: 0
                            }
                        },
                        series: {
                            cursor: 'pointer',
                            events: {
                                click: function (event) {
                                    os.scoreOrPercent = false
                                    let path1 = `identity/exaScore/percentCun${os.chooseYear}Y${event.point.name}T`
                                    os.activityLoading = false
                                    os.$http('Post', path1, false).then((data) => {
                                        os.activityLoading = true
                                        os.cunPercent = data
                                    }).catch(() => {
                                        os.$message({
                                            type: 'warning',
                                            message: '村级分数获取失败，请检查网络'
                                        })
                                    })

                                }
                            }
                        }
                    },

                });
            },
            changeType(){
                if(this.pictureOrTable == true){
                    this.pictureOrTable = false
                }else if(this.pictureOrTable == false){
                    this.pictureOrTable = true
                    let op = this.show();
                    op.then(() => {
                        this.scoreData(this.scoreOptions);
                    })
                    let op2 = this.showPercent();
                    op2.then(()=>{
                        this.percentData(this.percentOptions);
                    })
                }
            }
        },
        mounted() {
            let op = this.show();
            op.then(() => {
                this.scoreData(this.scoreOptions);
            })
            let op2 = this.showPercent();
            op2.then(()=>{
                this.percentData(this.percentOptions);
            })
        },
        created() {
            let nowYear = new Date().Format('yyyy')
            let interval = Number(nowYear) - 2017
            for (let i = 0; i <= interval; i++) {
                this.options.push({text: i + 2017, value: i + 2017})
            }
            this.chooseYear = nowYear
            this.$http('Post', 'identity/sysDistrict/list', {districtLevel: 2}, false).then(data => {
                data.forEach(item => {
                    this.optionsRegion.push({text: item.districtName, value: item.id})
                })
            }).catch(_ => {
                this.$message(
                    {
                        type: 'warning',
                        message: '镇级数据拉取失败'
                    }
                )
            })
        }
    }
</script>

<style scoped>
    .selectExample {
        float: left;
    }

    .downLeft {
        display: inline-block;
        vertical-align: top;
        margin-top: 20px;
        width: 52%;
        text-align: left;
    }

    .downRight {
        display: inline-block;
        vertical-align: top;
        margin-top: 20px;
        margin-left: 10px;
        width: 40%
    }
</style>
