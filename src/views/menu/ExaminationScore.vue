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
            <p style="float:left;margin-left: 160px">区域：</p>
            <vs-select
                class="selectExample"
                style="position: absolute;margin-left: 270px"
                label=""
                v-model="chooseRegion"
                width="120px"
                @change="con"
            >
                <vs-select-item :key="index" :value="item.value" :text="item.text" v-for="item,index in optionsRegion"/>
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
                chooseYear: 0,
                chooseRegion: ' ',
                chart: {},
                theme: {
                    colors: "#f45b5b #8085e9 #8d4654 #7798BF #aaeeee #ff0066 #eeaaee #55BF3B #DF5353 #7798BF #aaeeee".split(" "),
                    chart: {backgroundColor: null, style: {fontFamily: "Signika, serif"}},
                    title: {style: {color: "black", fontSize: "16px", fontWeight: "bold"}},
                    subtitle: {style: {color: "black"}},
                    tooltip: {borderWidth: 0},
                    legend: {itemStyle: {fontWeight: "bold", fontSize: "13px"}},
                    xAxis: {labels: {style: {color: "#6e6e70"}}},
                    yAxis: {labels: {style: {color: "#6e6e70"}}},
                    plotOptions: {series: {shadow: !0}, candlestick: {lineColor: "#404048"}, map: {shadow: !1}},
                    navigator: {xAxis: {gridLineColor: "#D0D0D8"}},
                    rangeSelector: {
                        buttonTheme: {
                            fill: "white",
                            stroke: "#C0C0C8",
                            "stroke-width": 1,
                            states: {select: {fill: "#D0D0D8"}}
                        }
                    },
                    scrollbar: {trackBorderColor: "#C0C0C8"},
                    background2: "#E0E0E8"
                },
                theme1: {
                    colors: "#2b908f #90ee7e #f45b5b #7798BF #aaeeee #ff0066 #eeaaee #55BF3B #DF5353 #7798BF #aaeeee".split(" "),
                    chart: {
                        backgroundColor: {
                            radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
                            stops: [
                                [0, '#ed1414'],
                                [1, '#f2f2f2'],
                            ]
                        }, style: {fontFamily: "'Unica One', sans-serif"}, plotBorderColor: "#606063"
                    },
                    title: {style: {color: "#E0E0E3", textTransform: "uppercase", fontSize: "20px"}},
                    subtitle: {style: {color: "#E0E0E3", textTransform: "uppercase"}},
                    xAxis: {
                        gridLineColor: "#707073",
                        labels: {style: {color: "#E0E0E3"}},
                        lineColor: "#707073",
                        minorGridLineColor: "#505053",
                        tickColor: "#707073",
                        title: {style: {color: "#A0A0A3"}}
                    },
                    yAxis: {
                        gridLineColor: "#707073",
                        labels: {style: {color: "#E0E0E3"}},
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
                        itemStyle: {color: "#E0E0E3"},
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
                console.log(val)
            },
            scoreData() {
                Highcharts.setOptions(this.theme);
                this.chart = new Highcharts.Chart('containerScore', {
                    chart: {
                        type: 'column',
                        margin: 75,
                        options3d: {
                            enabled: true,
                            alpha: 10,
                            beta: 25,
                            depth: 70,
                            viewDistance: 100,      // 视图距离，它对于计算角度影响在柱图和散列图非常重要。此值不能用于3D的饼图
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
                    },
                    title: {
                        text: '包含空值的3D柱状图'
                    },

                    plotOptions: {
                        column: {
                            depth: 25
                        }
                    },
                    xAxis: {
                        categories: Highcharts.getOptions().lang.shortMonths
                    },
                    yAxis: {
                        title: {
                            text: null
                        }
                    },
                    series: [{
                        name: '销售',
                        data: [2, 3, null, 4, 0, 5, 1, 4, 6, 3]
                    }],
                    plotOptions: {
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

            },
            show(val) {
                console.log(val)
            },
            percentData() {
                Highcharts.setOptions(this.theme1);
                this.chart = new Highcharts.Chart('containerPer', {
                    chart: {
                        type: 'column',
                        margin: 75,
                        options3d: {
                            enabled: true,
                            alpha: 10,
                            beta: 25,
                            depth: 70,
                            viewDistance: 100,      // 视图距离，它对于计算角度影响在柱图和散列图非常重要。此值不能用于3D的饼图
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
                    },
                    title: {
                        text: '包含空值的3D柱状图'
                    },

                    plotOptions: {
                        column: {
                            depth: 25
                        }
                    },
                    xAxis: {
                        categories: Highcharts.getOptions().lang.shortMonths
                    },
                    yAxis: {
                        title: {
                            text: null
                        }
                    },
                    series: [{
                        name: '销售',
                        data: [2, 3, null, 4, 0, 5, 1, 4, 6, 3]
                    }],
                    plotOptions: {
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
            this.scoreData();
            this.percentData();
        },
        created() {
            let nowYear = new Date().Format('yyyy')
            let interval = Number(nowYear) - 2017
            for (let i = 0; i <= interval; i++) {
                this.options.push({text: i + 2017, value: i + 2017})
            }
            this.chooseYear = 2019
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
