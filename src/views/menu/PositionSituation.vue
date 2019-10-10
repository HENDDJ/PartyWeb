<template>
    <section>
        <vs-tabs :color="colorx">
            <vs-tab @click="colorx='success'" label="使用排行">
                <div class="con-tab-ejemplo">
                    <el-table :data="positionList" border align="center"
                              :header-cell-style="{'background-color': '#fafafa','color': 'rgb(80, 80, 80)','border-bottom': '1px solid #dee2e6'}"
                              :row-class-name="tableRowClassName">
                        <el-table-column prop="index" label="名次" align="center"  >
                            <template slot-scope="scope">
                                <icon v-if="indexValue + scope.$index ===1" name="RankFirstIcon" scale="2"></icon>
                                <icon v-if="indexValue + scope.$index ===2" name="RankSecondIcon" scale="2"></icon>
                                <icon v-if="indexValue + scope.$index ===3" name="RankThirdIcon" scale="2"></icon>
                                <slot v-if="indexValue + scope.$index>3">{{indexValue + scope.$index}}</slot>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="名称" align="center"></el-table-column>
                        <el-table-column prop="type" label="阵地类型" align="center"  ></el-table-column>
                        <el-table-column prop="districtName" label="所属组织" align="center" ></el-table-column>
                        <el-table-column prop="area" label="占地面积" align="center" ></el-table-column>
                        <el-table-column prop="facilities" label="设施" align="center" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column prop="hotDegree" label="热度" align="center" ></el-table-column>

                    </el-table>
                    <el-pagination style="text-align: right;margin-top: 20px;"
                                   background
                                   :total="pageable.total" :current-page.sync="pageable.currentPage" :page-size.sync="pageable.pageSize"
                                   @current-change="currentChange" @size-change="sizeChange" layout="total, sizes, prev, pager, next">
                    </el-pagination>
                </div>
            </vs-tab>
            <vs-tab @click="showCharts()" label="数据统计">
                <el-select v-model="townId" placeholder="请选择" @change="showCountryList()" size="mini">
                    <el-option
                        v-for="item in townList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="countryId" placeholder="请选择" @change="showCharts()" size="mini">
                    <el-option
                        v-for="item in countryList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <div>
                    <div id="heatMap" class="chartStyle"></div>
                    <div id="realLineChart" class="chartStyle"></div>
                    <div id="peakLineChart" class="chartStyle"></div>
                    <div id="useHistogram" class="chartStyle"></div>
                    <div id="frequencyRadar" class="chartStyle"></div>
                    <div id="frequencyDistribution" class="chartStyle"></div>
                </div>
            </vs-tab>
        </vs-tabs>
    </section>
</template>

<script>
    import LookUp from '@/lookup';
    export default {
        name: "PositionSituation",
        data(){
            return{
                townId:'',//查询条件镇id
                townList:'',//查询条件镇list
                countryId:'',//查询条件村id
                countryList:'',//查询条件村list
                positionList:[],
                heatMapTownX:[],//热力图镇x轴
                heatMapCountryX:[],//热力图村x轴
                pageable: {
                    total: 0,
                    currentPage: 1,
                    pageSize: 10
                },
                indexValue:1,
                colorx:'success',
                realLinkChartData:[],
            }
        },
        methods: {
            currentChange(currentPage){
                this.pageable.currentPage = currentPage;
                this.showPositionList();
                this.indexValue = (this.pageable.currentPage-1)* this.pageable.pageSize +1 ;
            },
            sizeChange(size){
                this.pageable.pageSize = size;
                this.showPositionList();
                this.indexValue = (this.pageable.currentPage-1)* this.pageable.pageSize +1 ;
            },
            showPositionList(){
                this.$http('POST',`identity/positionInformation/page?page=${this.pageable.currentPage-1}&size=${this.pageable.pageSize}&sort=hotDegree,desc`,false).then(data => {
                    this.positionList = data.content;
                    this.pageable.total= data.totalElements;
                    //表格显示中文
                    this.positionList.filter( item => {
                        if (LookUp['PositionType'].filter(subitem => subitem.value === item.type)[0]) {
                            item.type = LookUp['PositionType'].filter(subitem => subitem.value === item.type)[0].label;
                        }else{
                            return ''
                        }
                    })
                });
            },
            tableRowClassName({row,rowIndex}) {
                if(this.pageable.currentPage<2){
                    if (rowIndex < 3) {
                        return 'success-row';
                    }
                    return '';
                }
            },
            //镇级查询框下拉项
            showTownList(){
                this.townList = [];
                //镇级组织
                this.$http('POST',`identity/sysDistrict/list`,{districtLevel:2},false).then(data => {
                    data.forEach( item => {
                        this.townList.push( {value:item.districtId , label:item.districtName});
                        this.heatMapTownX.push(item.districtName);
                    });
                    this.townList.push({value:'01',label:'句容市委'});
                })
            },
            //村级查询框下拉项,热力图x轴
            showCountryList(){
                this.countryList = [];
                this.heatMapCountryX = [];
                if(this.townId.length>2){
                    //村级组织
                    this.$http('POST',`identity/sysDistrict/list`,{attachTo:this.townId},false).then(data => {
                        data.forEach( item => {
                            this.countryList.push( {value:item.districtId , label:item.districtName});
                            this.heatMapCountryX.push(item.districtName);
                        });
                        this.$nextTick(()=>{
                            this.showCharts();
                        })
                    })
                }
            },
            showCharts(){
                this.colorx = 'danger';
                this.$nextTick(()=>{
                    this.showHeatMap();
                    this.showRealLineChart();
                    this.showPeakLineChart();
                    this.showUseHistogram();
                    this.showFrequencyRadar();
                    this.showFrequencyDistribution();
                })
            },
            //热力图
            showHeatMap(){
                let heatMap = echarts.init(document.getElementById("heatMap"));
                let heatX=[];
                if(this.heatMapCountryX.length>0){
                    heatX = this.heatMapCountryX;
                }else{
                    heatX = this.heatMapTownX;
                }
                let heatY = ['党员教育室','党内关爱室','组织议事室','党群工作室'];
                let data = [[0,0,5],[0,1,1],[0,2,0],[0,3,0],[0,4,0],[0,5,0],[0,6,0],[0,7,0],[0,8,0],[0,9,0],[0,10,0],[0,11,2],[0,12,4],[0,13,1],[0,14,1],[0,15,3],[0,16,4],[0,17,6],[0,18,4],[0,19,4],[0,20,3],[0,21,3],[0,22,2],[0,23,5],[1,0,7],[1,1,0],[1,2,0],[1,3,0],[1,4,0],[1,5,0],[1,6,0],[1,7,0],[1,8,0],[1,9,0],[2,0,1],[2,1,1],[2,2,0],[2,3,0],[2,4,0],[2,5,0],[2,6,0],[2,7,0],[2,8,0],[2,9,0],[3,0,7],[3,1,3],[3,2,0],[3,3,0],[3,4,0],[3,5,0],[3,6,0],[3,7,0],[3,8,1],[3,9,0]];

                data = data.map(function (item) {
                    return [item[1], item[0], item[2] || '-'];
                });

                let option = {
                    tooltip: {
                        position: 'top'
                    },
                    animation: false,
                    grid: {
                        height: '50%',
                        y: '10%'
                    },
                    xAxis: {
                        type: 'category',
                        data: heatX,
                        splitArea: {
                            show: true
                        }
                    },
                    yAxis: {
                        type: 'category',
                        data: heatY,
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
                        bottom: '15%'
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
                heatMap.setOption(option);
            },
            //实时人流量折线图
            showRealLineChart(){
                let districtId = '010806';
                this.$http('Post',`identity/positionChart/realLinkChart?districtId=`+districtId,false).then( data =>{
                    this.realLinkChartData = data;
                    let realLineChart = echarts.init(document.getElementById("realLineChart"));
                    let time = new Date().getHours();
                    let hours = [time-6+":00",time-5+":00",time-4+":00",time-3+":00",time-2+":00",time-1+":00",time+":00"]
                    let option = {
                        title: {
                            text: '阵地实时人流量折线图',
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data:['党员教育室','党内关爱室','组织议事室','党群工作室']
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                dataZoom: {
                                    yAxisIndex: 'none'
                                },
                                dataView: {readOnly: false},
                                magicType: {type: ['line', 'bar']},
                                restore: {},
                                saveAsImage: {}
                            }
                        },
                        xAxis:  {
                            type: 'category',
                            boundaryGap: false,
                            data: hours
                        },
                        yAxis: {
                            type: 'value',
                            axisLabel: {
                                formatter: '{value} '
                            }
                        },
                        series: [
                            {
                                name:'党员教育室',
                                type:'line',
                                data:this.realLinkChartData.MEMBER_EDUCATION,
                                markPoint: {
                                    data: [
                                        {type: 'max', name: '最大值'},
                                    ]
                                },
                                markLine: {
                                    data: [
                                        {type: 'average', name: '平均值'}
                                    ]
                                }
                            },
                            {
                                name:'党内关爱室',
                                type:'line',
                                data:this.realLinkChartData.PARTY_CARE,
                                markPoint: {
                                    data: [
                                        {type: 'max', name: '最大值'},
                                    ]
                                },
                                markLine: {
                                    data: [
                                        {type: 'average', name: '平均值'},
                                    ]
                                }
                            },
                            {
                                name:'组织议事室',
                                type:'line',
                                data:this.realLinkChartData.ORGANIZATIONAL_CONFERENCE,
                                markPoint: {
                                    data: [
                                        {type: 'max', name: '最大值'},
                                    ]
                                },
                                markLine: {
                                    data: [
                                        {type: 'average', name: '平均值'}
                                    ]
                                }
                            },
                            {
                                name:'党群工作室',
                                type:'line',
                                data:this.realLinkChartData.PARTY_STUDIO,
                                markPoint: {
                                    data: [
                                        {type: 'max', name: '最大值'},
                                    ]
                                },
                                markLine: {
                                    data: [
                                        {type: 'average', name: '平均值'}
                                    ]
                                }
                            },
                        ]
                    };
                    realLineChart.setOption(option);
                });

            },
            //峰值人流量折线图
            showPeakLineChart(){
                let peakLineChart = echarts.init(document.getElementById("peakLineChart"));
                let time = new Date();
                let month = time.getMonth()+1+"/";
                let day = time.getDate();
                let peakX = [month+(day-6),month+(day-5),month+(day-4),month+(day-3),month+(day-2),month+(day-1),month+day]
                let option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['党员教育室','党内关爱室','组织议事室','党群工作室']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: peakX
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
                            name:'组织议事室',
                            type:'line',
                            stack: '总量',
                            data:[150, 232, 201, 154, 190, 330, 410]
                        },
                        {
                            name:'党群工作室',
                            type:'line',
                            stack: '总量',
                            data:[320, 332, 301, 334, 390, 330, 320]
                        }
                    ]
                };
                peakLineChart.setOption(option);
            },
            //阵地使用次数柱状图
            showUseHistogram(){
                let useHistogram = echarts.init(document.getElementById("useHistogram"));
                let histogramX = [];
                if(this.heatMapCountryX.length>0){
                    histogramX = this.heatMapCountryX;
                }else{
                    histogramX = this.heatMapTownX;
                }
                let histogramY = ['党员教育室','党内关爱室','组织议事室','党群工作室'];
                let option = {
                   tooltip : {
                       trigger: 'axis',
                       axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                           type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                       }
                   },
                   legend: {
                       data:histogramY
                   },
                   xAxis : [
                       {
                           type : 'category',
                           data : histogramX
                       }
                   ],
                   yAxis : [
                       {
                           type : 'value'
                       }
                   ],
                   series : [
                       {
                           name:'党员教育室',
                           type:'bar',
                           stack: '广告',
                           data:[120, 132, 101, 134, 90, 230, 210]
                       },
                       {
                           name:'党内关爱室',
                           type:'bar',
                           stack: '广告',
                           data:[220, 182, 191, 234, 290, 330, 310]
                       },
                       {
                           name:'组织议事室',
                           type:'bar',
                           stack: '广告',
                           data:[150, 232, 201, 154, 190, 330, 410]
                       },
                       {
                           name:'党群工作室',
                           type:'bar',
                           stack: '广告',
                           data:[150, 232, 201, 154, 190, 330, 410]
                       },
                   ]
                };
                useHistogram.setOption(option);
            },
            //阵地使用频率雷达图
            showFrequencyRadar(){
                let frequencyRadar = echarts.init(document.getElementById("frequencyRadar"));
                let radarX = [];
                if(this.heatMapCountryX.length>0){
                    radarX = this.heatMapCountryX;
                }else{
                    radarX = this.heatMapTownX;
                }
                let option = {
                    tooltip: {},
                    legend: {
                        data: radarX,
                    },
                    radar: {
                        // shape: 'circle',
                        name: {
                            textStyle: {
                                color: '#fff',
                                backgroundColor: '#999',
                                borderRadius: 3,
                                padding: [3, 5]
                            }
                        },
                        indicator: [
                            { name: '党员教育室', max: 6500},
                            { name: '党内关爱室', max: 16000},
                            { name: '组织议事室', max: 30000},
                            { name: '党群工作室', max: 38000},
                        ]
                    },
                    series: [{
                        type: 'radar',
                        data : [
                            {
                                value : [4300, 10000, 28000, 35000],
                                name : '预算分配（Allocated Budget）'
                            },
                            {
                                value : [5000, 14000, 28000, 31000],
                                name : '实际开销（Actual Spending）'
                            }
                        ]
                    }]
                };
                frequencyRadar.setOption(option);
            },
            //阵地使用次数分布柱状图
            showFrequencyDistribution(){
                let frequencyDistribution = echarts.init(document.getElementById("frequencyDistribution"));
                let option = {
                    color: ['#3398DB'],
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : ['0-2次', '3-5次', '6-8次', '9-11次', '12-14次', '15-18次', '18次以上'],
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'直接访问',
                            type:'bar',
                            barWidth: '60%',
                            data:[10, 52, 200, 334, 390, 330, 220]
                        }
                    ]
                };
                frequencyDistribution.setOption(option)

            },

        },
        created(){
            this.showPositionList();
            this.showTownList();
        }
    }
</script>

<style>
    .el-table .success-row {
        background: #e8f5e7 !important;
    }
    .chartStyle {
        height: 500px;
        width: 730px;
        border: 1px red solid;
        float: left;
        margin:30px 20px;
    }
</style>

<style scoped>
    svg {
        margin: 0 5px;
    }

</style>
