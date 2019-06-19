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

            <vs-button type="gradient" style="float:left;margin-left: 160px">可视化统计图</vs-button>
            <vs-button color="success" style="float:left;margin-left: 20px" type="gradient">表格数据</vs-button>
        </div>
        <div style="clear: both">
            <div class="downLeft">
                <div id="containerScore" style="height: 400px"></div>
                <div id="containerPer" style="height: 400px"></div>
            </div>
            <div class="downRight">
                123s
            </div>
        </div>
    </div>
</template>

<script>
    import Highcharts from 'highcharts/highstock';
    import HighchartsMore from 'highcharts/highcharts-more';
    import Highcharts3D from 'highcharts/highcharts-3d';

    HighchartsMore(Highcharts);
    Highcharts3D(Highcharts);
    export default {
        name: "ExaminationScore",
        data() {
            return {
                options: [],
                optionsRegion: [{text: '全市', value: ' '}],
                chooseYear: 2019,
                chooseRegion: ' ',
                chart: {},
                chart01:{},
                pageable :{
                    total: 0,
                    pageNumber: 1,
                    pageSize: 10
                },
                scoreOptions:[],
                theme1: {
                    colors: "#2b908f #90ee7e #f45b5b #7798BF #aaeeee #ff0066 #eeaaee #55BF3B #DF5353 #7798BF #aaeeee".split(" "),
                    chart: {
                        backgroundColor: {
                            radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
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
                }
            }
        },
        methods: {
            con(val) {
                this.chooseYear = val
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
            },
            scoreData(Options) {
                Highcharts.setOptions(this.theme1);

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
                        max: Options[0][1]+50,
                        tickInterval: 50,
                        title: {
                            text: '分数'
                        }
                    },
                    series: [{
                        name:['得分'],
                        data: Options,
                    }],
                    plotOptions: {
                        column: {
                            colorByPoint:true,
                            dataLabels: {
                                enabled: true,
                                color: '#FFFFFF',
                                align: 'right',
                                format: '{point.y:.1f}', // :.1f 为保留 1 位小数
                                y: 10
                            }
                        },
                        series: {
                            cursor: 'pointer',
                            events: {
                                click: function (event) {
                                    alert(
                                        this.name + ' 被点击了\n' +
                                        '最近点：' + event.point + '\n' +
                                        'Alt 键: ' + event.altKey + '\n' +
                                        'Ctrl 键: ' + event.ctrlKey + '\n' +
                                        'Meta 键（win 键）： ' + event.metaKey + '\n' +
                                        'Shift 键：' + event.shiftKey
                                    );
                                    console.log(event.point)
                                }
                            }
                        }
                    },

                });

            },
            show() {
                let path=`identity/exaExamine/scoreTown?year=${this.chooseYear}`
                this.scoreOptions = []
                return this.$http('Post',path,false).then((data)=>{
                    data.forEach((item)=>{
                        this.scoreOptions.push([item.town,item.exam])
                    })
                    return this.scoreOptions
                }).catch(()=>{
                    this.$message({
                        type:'warning',
                        message: '分数获取失败，请检查网络'
                    })
                })
            },
            percentData() {
                Highcharts.setOptions(this.theme1);
                this.chart01 = new Highcharts.Chart('containerPer', {
                    colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9',
                        '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1'],
                    chart: {
                        type: 'column',
                        margin: 75,
                        options3d: {
                            enabled: true,
                            alpha: 15,
                            beta: 15,
                            viewDistance: 25,  // 视图距离，它对于计算角度影响在柱图和散列图非常重要。此值不能用于3D的饼图
                            depth: 40,
                            frame: {                // Frame框架，3D图包含柱的面板，我们以X ,Y，Z的坐标系来理解，X轴与 Z轴所形成
                                // 的面为bottom，Y轴与Z轴所形成的面为side，X轴与Y轴所形成的面为back，bottom、
                                // side、back的属性一样，其中size为感官理解的厚度，color为面板颜色
                                bottom: {
                                    size: 10
                                },
                                side: {
                                    size: 1,
                                    color: 'transparent'
                                },
                                back: {
                                    size: 1,
                                    color: 'transparent'
                                }
                            }
                        },
                        marginTop: 80,
                        marginRight: 40
                    },
                    title: {
                        text: '各镇得分百分比'
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
                        title: {
                            text: '百分比'
                        }
                    },
                    series: [{
                        name:['312','12','21'],
                        data: [
                    ['上海', 24.25],
                    ['卡拉奇', 23.50],
                    ['北京', 21.51],
                    ['德里', 16.78],
                    ['拉各斯', 16.06],
                    ['天津', 15.20],
                    ['伊斯坦布尔', 14.16],
                    ['东京', 13.51],
                    ['广州', 13.08],
                    ['孟买', 12.44],
                    ['莫斯科', 12.19],
                    ['圣保罗', 12.03],
                    ['深圳', 10.46],
                    ['雅加达', 10.07],
                    ['拉合尔', 10.05],
                    ['首尔', 9.99],
                    ['武汉', 9.78],
                    ['金沙萨', 9.73],
                    ['开罗', 9.27],
                    ['墨西哥', 8.87]
                                ],

                    }],
                    plotOptions: {
                        column: {
                            colorByPoint:true,
                            dataLabels: {
                                enabled: true,
                                color: '#FFFFFF',
                                align: 'right',
                                format: '{point.y:.1f}', // :.1f 为保留 1 位小数
                                y: 10
                            }
                        },
                        series: {
                            cursor: 'pointer',
                            events: {
                                click: function (event) {
                                    alert(
                                        this.name + ' 被点击了\n' +
                                        '最近点：' + event.point.category + '\n' +
                                        'Alt 键: ' + event.altKey + '\n' +
                                        'Ctrl 键: ' + event.ctrlKey + '\n' +
                                        'Meta 键（win 键）： ' + event.metaKey + '\n' +
                                        'Shift 键：' + event.shiftKey
                                    );
                                }
                            }
                        }
                    },

                });
            }
        },
        mounted() {
            let op = this.show();
            op.then(() => {
                this.scoreData(this.scoreOptions);
            })
            this.percentData();
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
        margin-top: 20px;
        width: 52%;
        text-align: left;
    }

    .downRight {
        display: inline-block;
        border: solid;
        margin-top: 20px;
        margin-left: 10px;
        width: 40%
    }
</style>
