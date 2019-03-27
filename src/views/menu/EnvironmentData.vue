<template>
    <section style="padding: 30px;">
        <el-select class="selectname" v-model="projectId" filterable placeholder="请选择" @change="loadData">
            <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
        </el-select>
        <transition name="fade">
            <div id="pmBox" v-show="projectId != ''">
            <div id="pmBox_left" :style="leftStyle"></div>
            <div id="pmBox_right" :style="rightStyle">
                <el-card class="card" style="background-color: aquamarine">
                    <div>
                        <span>PM2.5</span>
                    </div>
                    <div>
                        <span>{{Pm25}}μg/m³</span>
                    </div>
                </el-card>
                <el-card class="card" style="background-color: darkseagreen">
                    <div>
                        <span>PM10</span>
                    </div>
                    <div>
                        <span>{{Pm10}}mg/m³</span>
                    </div>
                </el-card>
                <el-card class="card" style="background-color: silver">
                    <div>
                        <span>风速</span>
                    </div>
                    <div>
                        <span>{{windSpeed}}m/s</span>
                    </div>
                </el-card>
                <el-card class="card" style="background-color: khaki">
                    <div>
                        <span>风向</span>
                    </div>
                    <div>
                        <span>{{windDirection}}</span>
                    </div>
                </el-card>
                <el-card class="card" style="background-color: lavenderblush">
                    <div>
                        <span>风力</span>
                    </div>
                    <div>
                        <span>{{windPower}}</span>
                    </div>
                </el-card>
                <el-card class="card" style="background-color: paleturquoise">
                    <div>
                        <span>噪音</span>
                    </div>
                    <div>
                        <span>{{noise}}dB</span>
                    </div>
                </el-card>
                <el-card class="card" style="background-color: peachpuff">
                    <div>
                        <span>温度</span>
                    </div>
                    <div>
                        <span>{{temperature}}℃</span>
                    </div>
                </el-card>
                <el-card class="card" style="background-color: lightblue">
                    <div>
                        <span>湿度</span>
                    </div>
                    <div>
                        <span>{{humidity}}%</span>
                    </div>
                </el-card>
                <el-card class="card" style="background-color: lightgreen">
                    <div>
                        <span>气压</span>
                    </div>
                    <div>
                        <span>{{atmos}}kPa</span>
                    </div>
                </el-card>
                <el-card class="card" style="background-color: lightcyan">
                    <div>
                        <span>TSP</span>
                    </div>
                    <div>
                        <span>{{TSP}}</span>
                    </div>
                </el-card>

            </div>
        </div>
        </transition>
    </section>
</template>

<script>
    import echarts from 'echarts';
    import axios from 'axios';
    export default {
        name: "EnvironmentData",
        data() {
            return {
                projectId: '',
                options: [],
                Pm10: '',
                Pm25: '',
                TSP: '',
                atmos: '',
                humidity: '',
                noise: '',
                temperature: '',
                windDirection: '',
                windPower: '',
                windSpeed: '',
            }
        },
        computed: {
            leftStyle() {
                let ra = window.screen.width/1920;
                return {
                    width: `${900 * ra}px`,
                    height: `${600 * ra}px`,
                }
            },
            rightStyle() {
                let ra = window.screen.width/1920;
                return {
                    width: `${600 * ra}px`,
                    height: `${500 * ra}px`,
                }
            }
        },
        methods: {
            loadProjects() {
                this.$http('post','/identity/projectInfo/list', false).then(
                    data => {
                        this.options = data;
                    }
                )
            },
            loadData() {
                axios.get(`http://122.97.218.162:18008/JRPSuperviseService/ThirdParty.svc/getRaiseDustNow?id=${this.projectId}`, false).then(
                    res => {
                        let dataX = [];
                        let dataY = [];
                        res.data.data2.forEach( item => {
                            dataY.push(item.value);
                            dataX.push(item.time);
                        })
                        this.initPM25(dataX, dataY);
                        this.loadCurrentData(res.data.data1);
                    }
                )
            },
            loadCurrentData(data1) {
                this.Pm10 = data1.Pm10;
                this.Pm25 = data1.Pm25;
                this.TSP = data1.TSP;
                this.atmos = data1.atmos;
                this.humidity = data1.humidity;
                this.noise = data1.noise;
                this.temperature = data1.temperature;
                this.windDirection = data1.windDirection;
                this.windPower = data1.windPower;
                this.windSpeed = data1.windSpeed;
            },
            initPM25(dataX, dataY) {
                let myChart = echarts.init(document.getElementById('pmBox_left'));
                let option = {
                    title: {
                        text: 'PM 2.5近8小时变化图',
                        top: 0
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['PM2.5']
                    },
                    grid: {
                        left: '10%'
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            mark: { show: true },
                            dataView: { show: true, readOnly: false },
                            restore: { show: true },
                            saveAsImage: { show: true }
                        }
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: dataX,
                            axisLabel: {
                                formatter: (value) => {
                                    let time = new Date(value);
                                    return time.getMonth()+1+'/'+time.getDate()+' '+ time.toLocaleTimeString();
                                }
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: 'μg/m³'
                        }
                    ],
                    series: [
                        {
                            name: 'PM2.5值',
                            type: 'line',
                            data: dataY,
                            markPoint: {
                                data: [
                                    { type: 'max', name: '最大值' },
                                    { type: 'min', name: '最小值' }
                                ]
                            },
                            markLine: {
                                data: [
                                    { type: 'average', name: '平均值' }
                                ]
                            }
                        }
                    ]
                };
                myChart.setOption(option);
            }
        },
        mounted() {
            this.loadProjects();
            if (this.$store.state.projectId) {
                this.projectId = this.$store.state.projectId;
                this.loadData();
            }
        }
    }
</script>

<style scoped>
    .selectname {
        float: right;
        clear: both;
    }
    #pmBox {
        margin: 0;
        padding: 0;
        display: inline-block;
        margin-top: 30px;
        width: 100%;
        min-height: 400px;
        display: inline-block;

    }
    #pmBox_left {
        margin: 0;
        padding: 0;
        background-size: cover;
        display: inline-block;
    }
    #pmBox_right {
        margin: 0;
        padding: 0;
        display: inline-block;
        vertical-align: top;
    }
    .card {
        width: 30%;
        height: 20%;
        float: left;
        margin: 2% 0 2% 20%;
    }
    /* 开始过渡阶段,动画出去阶段 */
    .fade-enter-active,.fade-leave-active{
        transition: all 0.5s ease-out;
    }
    /* 进入开始 */
    .fade-enter{
        transform: rotateY(90deg);
        opacity: 0;
    }
    /* 出去终点 */
    .fade-leave-active{
        transform: rotateY(-90deg);
        opacity: 0;
    }
</style>
<style>
    .card .el-card__body {
        padding: 3% !important;
        height: 100%;
    }
    .card div {
        padding: 5% !important;
    }
</style>
