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
                <div>
                    <el-card class="box-card">
                        <div class="chartDivStyle">
                            <div class="query-position">
                                <el-select v-model="realLineTownId" placeholder="请选择" @change="showCountryList('realLine')" size="mini">
                                    <el-option
                                        v-for="item in townList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-select v-model="realLineCountryId" placeholder="请选择" @change="showRealLineChart()" size="mini">
                                    <el-option
                                        v-for="item in realLineCountryList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                            <div id="realLineChart" class="chartStyle"></div>
                        </div>
                    </el-card>
                    <el-card class="box-card">
                        <div class="chartDivStyle">
                            <div class="query-position">
                                <el-select v-model="peakLineTownId" placeholder="请选择" @change="showCountryList('peakLine')" size="mini">
                                    <el-option
                                        v-for="item in townList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-select v-model="peakLineCountryId" placeholder="请选择" @change="showPeakLineChart('')" size="mini">
                                    <el-option
                                        v-for="item in peakLineCountryList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-button type="info" plain @click="showPeakLineChart('7')">近7日</el-button>
                                <el-button type="info" plain @click="showPeakLineChart('30')">近30日</el-button>
                            </div>
                            <div id="peakLineChart" class="chartStyle"></div>
                        </div>
                    </el-card>
                    <el-card class="box-card" v-if="this.userAuthority!=3">
                        <div class="chartDivStyle">
                            <div class="query-position" >
                                <el-select v-model="heatMapTownId" placeholder="请选择" @change="showHeatMap('')" size="mini">
                                    <el-option
                                        v-for="item in townList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-button type="info" plain @click="showHeatMap('7')">近7日</el-button>
                                <el-button type="info" plain @click="showHeatMap('30')">近30日</el-button>
                            </div>
                            <div id="heatMap" class="chartStyle"></div>
                        </div>
                    </el-card>
                    <el-card class="box-card" v-if="this.userAuthority!=3">
                        <div class="chartDivStyle">
                            <div class="query-position">
                                <el-select v-model="useHistogramTownId" placeholder="请选择" @change="showUseHistogram('')" size="mini">
                                    <el-option
                                        v-for="item in townList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-button type="info" plain @click="showUseHistogram('7')">近7日</el-button>
                                <el-button type="info" plain @click="showUseHistogram('30')">近30日</el-button>
                            </div>
                            <div id="useHistogram" class="chartStyle"></div>
                        </div>
                    </el-card>
                    <el-card class="box-card" v-if="this.userAuthority!=3">
                        <div class="chartDivStyle">
                            <div class="query-position">
                                <el-select v-model="frequencyRadarTownId" placeholder="请选择" @change="showFrequencyRadar('')" size="mini">
                                    <el-option
                                        v-for="item in townList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-button type="info" plain @click="showFrequencyRadar('7')">近7日</el-button>
                                <el-button type="info" plain @click="showFrequencyRadar('30')">近30日</el-button>
                            </div>
                            <div id="frequencyRadar" class="chartStyle"></div>
                        </div>
                    </el-card>
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
                townList:'',//查询条件镇list
                heatMapTownId:'01',//热力图查询条件镇id
                heatMapInterval:'30',//热力图显示时间间隔

                realLineTownId:'01',//实时折线图查询条件镇id
                realLineCountryId:'',//实时折线图查询条件村id
                realLineCountryList:'',//实时折线图查询条件村list

                peakLineTownId:'01',//总人流量折线图查询条件镇id
                peakLineCountryId:'',//总人流量折线图查询条件村id
                peakLineCountryList:'',//总人流量折线图查询条件村list
                peakLineInterval:'30',//总人流量显示时间间隔

                useHistogramTownId:'01',//使用次数柱状图查询条件镇id
                useHistogramInterval:'30',//使用次数柱状图显示时间间隔

                frequencyRadarTownId:'01',//使用次数雷达图查询条件镇id
                frequencyRadarInterval:'30',//使用次数雷达图显示时间间隔

                positionList:[],
                pageable: {
                    total: 0,
                    currentPage: 1,
                    pageSize: 10
                },
                indexValue:1,
                colorx:'success',
                user:'',
                userAuthority:''
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
                if(this.userAuthority==1){
                    //镇级组织
                    this.$http('POST',`identity/sysDistrict/list`,{districtLevel:2},false).then(data => {
                        data.forEach( item => {
                            this.townList.push( {value:item.districtId , label:item.districtName});
                        });
                        this.townList.push({value:'01',label:'全市'});
                    })
                }
                if(this.userAuthority==2){
                    this.townList.push({value:this.user.districtId , label:this.user.organizationName});
                    this.heatMapTownId = this.user.districtId;
                    this.realLineTownId = this.user.districtId;
                    this.peakLineTownId = this.user.districtId;
                    this.useHistogramTownId = this.user.districtId;
                    this.frequencyRadarTownId = this.user.districtId;
                    //村级组织
                    this.$http('POST',`identity/sysDistrict/list`,{attachTo:this.user.districtId},false).then(data => {
                        this.realLineCountryList = [];
                        this.peakLineCountryList = [];
                        data.forEach( item => {
                            //实时折线图
                            this.realLineCountryList.push({value:item.districtId , label:item.districtName});
                            this.peakLineCountryList.push({value:item.districtId , label:item.districtName});
                        });

                    })
                }
                if(this.userAuthority ==3){
                    this.townList = [];
                    this.realLineCountryList = [];
                    this.peakLineCountryList = [];
                    this.$http('POST',`identity/sysDistrict/list`,{districtLevel:2,districtId:this.user.sysDistrict.attachTo},false).then(data => {
                        data.forEach( item => {
                            this.townList.push( {value:item.districtId , label:item.districtName});
                        });
                    });
                    this.realLineCountryList.push({value:this.user.districtId , label:this.user.organizationName});
                    this.peakLineCountryList.push({value:this.user.districtId , label:this.user.organizationName});
                    this.realLineTownId = this.user.sysDistrict.attachTo;
                    this.peakLineTownId = this.user.sysDistrict.attachTo;
                    this.realLineCountryId = this.user.districtId;
                    this.peakLineCountryId = this.user.districtId;

                }

            },
            //村级查询框下拉项
            showCountryList(type){
                if(type=='realLine'){
                    this.realLineCountryList = [];
                    this.realLineCountryId = '';
                    if(this.realLineTownId.length>2){
                        //村级组织
                        this.$http('POST',`identity/sysDistrict/list`,{attachTo:this.realLineTownId},false).then(data => {
                            data.forEach( item => {
                                this.realLineCountryList.push({value:item.districtId , label:item.districtName})
                            });
                            this.$nextTick(()=>{
                                this.showRealLineChart();
                            })
                        })
                    }
                }
                if(type=='peakLine'){
                    this.peakLineCountryList = [];
                    this.peakLineCountryId = '';
                    if(this.peakLineTownId.length>2){
                        //村级组织
                        this.$http('POST',`identity/sysDistrict/list`,{attachTo:this.peakLineTownId},false).then(data => {
                            data.forEach( item => {
                                this.peakLineCountryList.push({value:item.districtId , label:item.districtName})
                            });
                            this.$nextTick(()=>{
                                this.showPeakLineChart('');
                            })
                        })
                    }
                }
            },
            showCharts(){
                this.colorx = 'danger';
                this.$nextTick(()=>{
                    if(this.userAuthority == 3){
                        this.showRealLineChart();
                        this.showPeakLineChart('');
                    }else{
                        this.showHeatMap('');
                        this.showRealLineChart();
                        this.showPeakLineChart('');
                        this.showUseHistogram('');
                        this.showFrequencyRadar('');
                    }
                })
            },
            //热力图
            showHeatMap(interval){
                if(interval){
                    this.heatMapInterval = interval;
                }
                let heatMap = echarts.init(document.getElementById("heatMap"));
                let heatX=[];
                let titleName = this.townList.filter( item => item.value==this.heatMapTownId)[0].label;
                this.$http('Post',`identity/positionChart/useHistogram?interval=`+this.heatMapInterval+`&districtId=`+this.heatMapTownId,false).then( data => {
                    heatX = data.districtName;
                    let heatY = ['党员教育室','党内关爱室','组织议事室','党群工作室'];
                    let dataFormate = [];
                    data.MEMBER_EDUCATION.forEach((item,index) =>{
                        dataFormate.push([0,index,item])
                    });
                    data.PARTY_CARE.forEach((item,index) =>{
                        dataFormate.push([1,index,item])
                    });
                    data.ORGANIZATIONAL_CONFERENCE.forEach((item,index) =>{
                        dataFormate.push([2,index,item])
                    });
                    data.PARTY_STUDIO.forEach((item,index) =>{
                        dataFormate.push([3,index,item])
                    });
                    dataFormate = dataFormate.map(function (item) {
                        return [item[1], item[0], item[2] || '-'];
                    });

                    let option = {
                        title: {
                            text: titleName+'近'+this.heatMapInterval+'日各阵地使用次数热力图' ,
                        },
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
                            },
                            axisLabel:{
                                interval: 0,
                                rotate:40
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
                            type: 'heatmap',
                            data: dataFormate,
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
                });
            },
            //实时人流量折线图
            showRealLineChart(){
                let districtId = this.realLineCountryId?this.realLineCountryId:this.realLineTownId;
                let townTitleName = this.townList.filter( item => item.value==this.realLineTownId)[0].label;
                let countryTitleName = this.realLineCountryId ? this.realLineCountryList.filter(item => item.value==this.realLineCountryId)[0].label:'';
                this.$http('Post',`identity/positionChart/realLineChart?districtId=`+districtId,false).then( data =>{
                    let realLineChart = echarts.init(document.getElementById("realLineChart"));
                    let hours = [];
                    data.monthDay.forEach(item =>{
                        hours.push(item.substr(11,5))
                    });
                    let option = {
                        title: {
                            text: townTitleName+countryTitleName+'各阵地实时人流量统计折线图' ,
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            x:'center',
                            y:'bottom',
                            data:['党员教育室','党内关爱室','组织议事室','党群工作室']
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
                                data:data.MEMBER_EDUCATION,
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
                                data:data.PARTY_CARE,
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
                                data:data.ORGANIZATIONAL_CONFERENCE,
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
                                data:data.PARTY_STUDIO,
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
            //人流量折线图
            showPeakLineChart(interval){
                let peakLineChart = echarts.init(document.getElementById("peakLineChart"));
                let townTitleName = this.townList.filter( item => item.value==this.peakLineTownId)[0].label;
                let countryTitleName = this.peakLineCountryId ? this.peakLineCountryList.filter(item => item.value==this.peakLineCountryId)[0].label:'';
                if(interval){
                    this.peakLineInterval = interval;
                }
                let districtId = this.peakLineCountryId?this.peakLineCountryId:this.peakLineTownId;
                let peakX = [];
                this.$http('Post',`identity/positionChart/peakLineChart?interval=`+this.peakLineInterval+`&districtId=`+districtId,false).then( data =>{
                    data.monthDay.forEach(item =>{
                        peakX.push(item.substr(5,5))
                    });
                    let option = {
                        title: {
                            text: townTitleName+countryTitleName+'近'+this.peakLineInterval+'日各阵地人流量统计折线图' ,
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            x:'center',
                            y:'bottom',
                            data:['党员教育室','党内关爱室','组织议事室','党群工作室']
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
                                data:data.MEMBER_EDUCATION,
                            },
                            {
                                name:'党内关爱室',
                                type:'line',
                                stack: '总量',
                                data:data.PARTY_CARE,
                            },
                            {
                                name:'组织议事室',
                                type:'line',
                                stack: '总量',
                                data:data.ORGANIZATIONAL_CONFERENCE,
                            },
                            {
                                name:'党群工作室',
                                type:'line',
                                stack: '总量',
                                data:data.PARTY_STUDIO,
                            }
                        ]
                    };
                    peakLineChart.setOption(option);
                });



            },
            //阵地使用次数柱状图
            showUseHistogram(interval){
                if(interval){
                    this.useHistogramInterval = interval;
                }
                let titleName = this.townList.filter( item => item.value==this.useHistogramTownId)[0].label;
                let useHistogram = echarts.init(document.getElementById("useHistogram"));
                let histogramX = [];
                this.$http('Post',`identity/positionChart/useHistogram?interval=`+this.useHistogramInterval+`&districtId=`+this.useHistogramTownId,false).then( data =>{
                    histogramX = data.districtName;
                    let histogramY = ['党员教育室','党内关爱室','组织议事室','党群工作室'];
                    let option = {
                        title: {
                            text: titleName+'近'+this.useHistogramInterval+'日各阵地使用次数柱状图' ,
                        },
                        tooltip : {
                            trigger: 'axis',
                            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                               type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        legend: {
                            x:'center',
                            y:'bottom',
                            data:histogramY
                        },
                        xAxis : [
                            {
                               type : 'category',
                               data : histogramX,
                               axisLabel:{
                                   interval: 0,
                                   rotate:40
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
                               name:'党员教育室',
                               type:'bar',
                               stack: '类型',
                               data:data.MEMBER_EDUCATION,
                           },
                           {
                               name:'党内关爱室',
                               type:'bar',
                               stack: '类型',
                               data:data.PARTY_CARE,
                           },
                           {
                               name:'组织议事室',
                               type:'bar',
                               stack: '类型',
                               data:data.ORGANIZATIONAL_CONFERENCE,
                           },
                           {
                               name:'党群工作室',
                               type:'bar',
                               stack: '类型',
                               data:data.PARTY_STUDIO,
                           },
                        ]
                    };
                    useHistogram.setOption(option);
                });
            },
            //阵地使用频率雷达图
            showFrequencyRadar(interval){
                if(interval){
                    this.frequencyRadarInterval = interval;
                }
                let frequencyRadar = echarts.init(document.getElementById("frequencyRadar"));
                let titleName = this.townList.filter( item => item.value==this.frequencyRadarTownId)[0].label;
                let radarX = [];
                let radarDataFormate = [];
                let maxNumber =10;
                this.$http('Post',`identity/positionChart/frequencyRadar?interval=`+this.frequencyRadarInterval+`&districtId=`+this.frequencyRadarTownId,false).then( data => {
                    data.forEach(item=>{
                        radarX.push(item.districtName);
                        maxNumber = Math.max(maxNumber,item.memberEducation,item.partyCare,item.organizationalConference,item.partyStudio);
                        radarDataFormate.push({value:[item.memberEducation,item.partyCare,item.organizationalConference,item.partyStudio],name:item.districtName})
                    });
                    this.$nextTick(()=>{
                        let option = {
                            title: {
                                text: titleName+'近'+this.frequencyRadarInterval+'日各阵地使用次数雷达图' ,
                            },
                            tooltip: {},
                            legend: {
                                x:'left',
                                width:170,
                                padding:[50,0,0,10],
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
                                    { name: '党员教育室', max: maxNumber+3},
                                    { name: '党内关爱室', max: maxNumber+3},
                                    { name: '组织议事室', max: maxNumber+3},
                                    { name: '党群工作室', max: maxNumber+3},
                                ]
                            },
                            series: [{
                                type: 'radar',
                                data :radarDataFormate,
                            }]
                        };
                        frequencyRadar.setOption(option);
                    })

                });
            },

        },
        created(){
            this.user = JSON.parse(sessionStorage.getItem("userInfo"));
            if(this.user.sysDistrict.districtLevel == 3){
                this.userAuthority = 3;
            }else  if(this.user.sysDistrict.districtLevel == 2){
                this.userAuthority = 2;
            }else{
                this.userAuthority = 1;
            }
            this.showPositionList();
            this.showTownList();

        }
    }
</script>

<style>
    .el-table .success-row {
        background: #e8f5e7 !important;
    }
    .chartDivStyle {
        height: 500px;
        width: 770px;
      /*  border: 1px red solid;
        float: left;
        margin:30px 20px;*/
    }
    .query-position{
        position: relative;
        float: left;
        margin:20px 10px;
        z-index: 9999;
    }
    .chartStyle {
        height: 400px;
        width: 770px;
    }
    .box-card{
        height: 500px;
        width: 770px;
        float: left;
        margin:30px 20px;
    }

</style>

<style scoped>
    svg {
        margin: 0 5px;
    }

</style>
