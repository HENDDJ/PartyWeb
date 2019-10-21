<template>
    <section class="gis-map">
        <div class="realTimeChart" v-show="flag==4">
            <div class="query-position">
                <el-select v-model="realLineTownId" placeholder="请选择" @change="showCountryList()" size="mini">
                    <el-option
                        v-for="item in townList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="realLineCountryId" placeholder="请选择" @change="showRealLineChart({districtId: realLineCountryId}, 'realLineChart2')" size="mini">
                    <el-option
                        v-for="item in realLineCountryList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div id="realLineChart2" style="width: 500px;height: 400px;"></div>
        </div>
        <div id="allmap"></div>
        <nav class="nav">
            <el-button class="nav-btn" type="primary" size="large" @click="showParty()">
                <div class="logo-outer">
                    <img src="/static/img/org_logo.png" style="margin-top: 2px;" alt=""/>
                </div>
                <span>党组织分布</span>
            </el-button>
            <el-button class="nav-btn" type="primary" size="large" @click="showBattleField()">
                <div class="logo-outer">
                    <img src="/static/img/position_logo.png" style="margin-top: 5px;" alt=""/>
                </div>
                <span>阵地分布&emsp;</span>
            </el-button>
            <el-button class="nav-btn" type="primary" size="large" @click="showWorking()">
                <div class="logo-outer">
                    <img src="/static/img/act_logo.png" style="margin-top: 6px;" alt=""/>
                </div>
                <span>实时活动&emsp;</span>
            </el-button>
            <el-button class="nav-btn" type="primary" size="large" @click="showTown()">
                <div class="logo-outer">
                    <img src="/static/img/activity_logo.png" style="margin-top: 5px;" alt=""/>
                </div>
                <span>活动统计&emsp;</span>
            </el-button>
            <el-button class="nav-btn" type="primary" size="large" @click="showPeopleStream()">
                <div class="logo-outer">
                    <img src="/static/img/stream_logo.png" style="margin-top: 6px;" alt=""/>
                </div>
                <span>实时人流量</span>
            </el-button>
        </nav>
        <div v-if="showLeft" class="leftClose" @click="leftWidth.width = '0px';showLeft=false;">
        </div>
        <div class="leftList" :style="leftWidth" v-if="showLeft">
            <div style="z-index: 99">
                <el-tree :data="leftData" @node-click="handleNodeClick" ></el-tree>
            </div>
        </div>
        <div class="showLeftListTop">
        <div class="showLeftList" v-if="!showLeft&&flag!=3" @click="leftWidth.width = '220px';showLeft=true;"></div>
        </div>
        <div id="census" onclick="toggleDiv('')">
            <img src="/static/img/test.png" height="472" width="670" />
        </div>

        <div class="closeBtnBg" v-if="this.msgFloatRight.marginRight === '48px'" @click="close">
            <div class="closeBtn"></div>
        </div>
        <div style="width: 250px;height: 579px;position: absolute;right: 0px;top:10px">
            <vs-card class="msgCard" :style="msgFloatRight">
                <div slot="header" style="padding-bottom: 8px;padding-top: 6px;">
                    <a v-if="!rightMessage.districtName">暂无数据</a>
                    {{rightMessage.districtName}}
                </div>
                <div id="realLineChart" style="width: 470px;height: 330px;"></div>
            </vs-card>
        </div>
        <!--
        右上角数据展示
        -->
        <div style="position: absolute;top:70px;right: 350px" v-if="flag==2">
            <div style="display: inline-block">
                <span style="background-color: rgba(255,207,34,0.5);" class="positionIcon">关爱</span>{{positionNumber.partyCare}}
                <span style="background-color: rgba(108,116,255,0.5);" class="positionIcon">教育</span>{{positionNumber.memberEducation}}
                <span style="background-color: rgba(255,71,56,0.5);" class="positionIcon">议事</span>{{positionNumber.organizationalConference}}
                <span style="background-color: rgba(200,255,77,0.5); " class="positionIcon">党群</span>{{positionNumber.partyStudio}}
                <span style="background-color: rgba(214,109,86,0.5); " class="positionIcon">厅</span>{{positionNumber.hall}}
                <span style="background-color: rgba(158,204,255,0.5); " class="positionIcon">其他</span>{{positionNumber.column+positionNumber.hall}}
            </div>
        </div>

        <div style="position: absolute;top:120px;right: 550px" v-if="flag==4">
            <div style="display: inline-block;">
                <el-date-picker
                    v-model="heatMapRange"
                    type="datetimerange"
                    align="right"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :unlink-panels="true"
                    :default-time="['00:00:00', '00:00:00']"
                    value-format="yyyy-MM-ddTHH:mm:ss"
                    @change="showPeopleStream">
                </el-date-picker>
            </div>
        </div>

        <div style="position: absolute;top: 200px;right: 40px;" v-if="flag == 3">
            <div class="marker-data">
                <el-tag type="info" effect="dark" size="medium">今日执行次数 <span>{{this.executeNumber}}</span></el-tag>
            </div>
            <div class="marker-data">
                <el-tag type="success" effect="dark" size="medium">今日通过个数 <span>{{this.passNumber}}</span></el-tag>
            </div>
            <div class="marker-data">
                <el-tag effect="dark" size="medium">今日正在进行 <span>{{this.isWorkingNumber}}</span></el-tag>
            </div>
            <div style="position:absolute;margin-top: 250px;">
                <h4 style="text-align: left">实时动态</h4>
                <div style="font-size: 14px;text-align: left;">
                    <p style="max-width: 250px;margin: 10px 0;text-align:justify" v-for="item in realTimeLog">{{item.msg}}</p>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import LookUp from '@/lookup';
    import axios from 'axios';
    export default {
        name: "GISmap",
        data () {
            return {
                map: {},
                positionList:[],
                markerList:[],
                mapvLayer:'',
                pContent:'',
                opts:{
                    boxStyle: {
                        // opacity: "0.8",
                        background: 'white',
                        width: "650px",
                        // height:"300px"
                        maxHeight:'600px'
                    },
                    closeIconUrl:"/static/img/close.png",
                    closeIconMargin: "5px 5px 0 0",
                    enableAutoPan: true,
                    align: INFOBOX_AT_TOP,
                },
                workingOpts:{
                    boxStyle: {
                        // opacity: "0.8",
                        background: 'white',
                        width: "500px",
                        // height:"300px"
                        maxHeight:'700px'
                    },
                    closeIconUrl:"/static/img/close.png",
                    closeIconMargin: "5px 5px 0 0",
                    enableAutoPan: true,
                    align: INFOBOX_AT_TOP,
                },
                zhenList:[],
                //控制右侧导航栏
                msgFloatRight:{
                    marginRight: '-500px',
                    // marginRight:'48px',
                    position: 'absolute',
                    zIndex: 1000,
                    top:'90px',
                    right: '-45px',
                    transition: 'all 1.5s',
                },
                rightMessage:{},
                memberData:[{name:'12',sex:'1'}],
                //分页类
                pageable: {
                    total: 1,
                    currentPage: 0,
                    pageSize: 10,
                    flg:true
                },
                tableDataDistrictId:'',
                leftData:[],
                leftWidth:{
                    width:'0px'
                },
                //模块选择
                flag:0,
                //是否展开显示左侧
                showLeft:false,
                //阵地数量
                positionNumber:{
                    column: 0,
                    hall: 0,
                    memberEducation: 0,
                    organizationalConference: 0,
                    partyCare: 0,
                    partyStudio: 0,
                    square: 0,
                },
                heatMapRange: [],
                realLineTownId: '01',
                realLineCountryId: '',
                townList: [],
                realLineCountryList: [],
                userAuthority: '',
                executeNumber: 0,
                passNumber: 0,
                isWorkingNumber: 0,
                realTimeLog: [],
                heatMapRange: [],
                townPointList:[],
                cunPointList:[],
                cunLabelList:[],
                attachToCache: new Map(),
                _point:{},
                _map:{},
                _div:{},
                circleLayer:null,//活动统计镇气泡
                labelLayer:null,//活动统计镇label
                currentZhenPoint:{},
            }
        },
        methods: {
            handleNodeClick(data){
                if(data.leaf){
                    if(this.flag == 1){
                        this.$http('post','identity/sysDistrict/list',{districtId:data.id}).then(res=>{
                            this.setPartyMaker(res[0].attachTo);
                            setTimeout(()=>{
                                let maker = new BMap.Point(res[0].location.split(",")[0], res[0].location.split(",")[1])
                                this.map.panTo(maker);
                            },300)
                            setTimeout(()=> {
                                this.map.setZoom(14);
                            },500)
                        })
                    }else if(this.flag == 2){
                        this.$http('post','identity/sysDistrict/list',{districtId:data.id}).then(res=>{
                            this.setCunMaker(res[0].attachTo);
                            setTimeout(()=>{
                                let maker = new BMap.Point(res[0].location.split(",")[0], res[0].location.split(",")[1])
                                this.map.panTo(maker);
                            },300)
                            setTimeout(()=> {
                                this.map.setZoom(14);
                            },500)
                        })
                        //阵地个数
                        this.$http('post','identity/positionInformation/positionNumber?districtId='+data.id,false).then((data)=>{
                            this.positionNumber = data
                        })
                    }
                    else if(this.flag == 3){

                    }
                }
            },
            //取得树结构数据
            getTreeData(){
                this.$http('get','identity/sysDistrict/01alltree',false).then((data)=>{
                    this.leftData = data[0].children
                })
            },
            //open提示
            openNotify(val) {
                const h = this.$createElement;
                this.$notify({
                    title: '提示',
                    message: h('i', { style: 'color: teal'}, val)
                });
            },
            //关闭成员dialog
            closeMemberDialog(){
                document.getElementById('nnn').style.display = 'none'
            },
            //第几页
            currentPage(val){
                if(this.pageable.flg){
                    this.pageable.currentPage = val-1
                    this.$http('Post','identity/parMember/page?page='+this.pageable.currentPage+'&size='+this.pageable.pageSize,{districtId: this.tableDataDistrictId}).then((data)=>{
                        this.memberData = data.content
                    })
                }
            },
            //上一页
            prePage(){
                this.pageable.flg = false
                this.pageable.currentPage = this.pageable.currentPage-1
                this.$http('Post','identity/parMember/page?page='+this.pageable.currentPage+'&size='+this.pageable.pageSize,{districtId: this.tableDataDistrictId}).then((data)=>{
                    this.memberData = data.content
                    this.pageable.flg = true
                })
            },
            //下一页
            nextPage(){
                this.pageable.flg = false
                this.pageable.currentPage = this.pageable.currentPage+1
                this.$http('Post','identity/parMember/page?page='+this.pageable.currentPage+'&size='+this.pageable.pageSize,{districtId: this.tableDataDistrictId}).then((data)=>{
                    this.memberData = data.content
                    this.pageable.flg = true
                })
            },

            //关闭右侧弹出栏目
            close(){
                this.msgFloatRight.marginRight = '-500px'
            },
            posit(val){
                return `margin-top:${val*108}px;`;
            },
            initMap() {
                // 百度地图API功能
                this.map = new BMap.Map("allmap", {
                    minZoom: 11,
                    maxZoom: 18
                });    // 创建Map实例
                this.map.centerAndZoom(new BMap.Point(119.172559, 31.92500), 11);  // 初始化地图,设置中心点坐标和地图级别
                //添加地图类型控件
                this.map.addControl(new BMap.MapTypeControl({
                    mapTypes: [
                        BMAP_NORMAL_MAP,
                        BMAP_HYBRID_MAP
                    ]
                }));
                this.map.addEventListener("zoomend", () => {
                    //地图缩放时，村的活动执行柱状图跟随坐标移动
                    if(this.flag===4){
                        this.showCunPoint(this.currentZhenPoint);
                    }

                });
                this.map.setCurrentCity("镇江");          // 设置地图显示的城市 此项是必须设置的
                this.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放a

                let cityName = '镇江市句容市';
                let bdary = new BMap.Boundary();
                let self = this;
                bdary.get(cityName, function (rs) {       //获取行政区域       
                    let EN_JW = "180, 90;";         //东北角
                    let NW_JW = "-180, 90;";       //西北角
                    let WS_JW = "-180, -90;";       //西南角
                    let SE_JW = "180, -90;";        //东南角
                    //4.添加环形遮罩层
                    let ply1 = new BMap.Polygon(rs.boundaries[0] + SE_JW + SE_JW + WS_JW + NW_JW + EN_JW + SE_JW, {
                        strokeColor: "none",
                        fillColor: "rgb(246,246,246)",
                        fillOpacity: 0.8,
                        strokeOpacity: 0.5
                    }); //建立多边形覆盖物
                    self.map.addOverlay(ply1);
                    ply1.disableMassClear();

                    let count =  rs.boundaries.length; //行政区域的点有多少个
                    if (count === 0) {
                        alert('未能获取当前输入行政区域');
                        return;
                    }
                 //   let pointArray = [];
                    for (let i = 0; i < count; i++) {
                        let ply = new BMap.Polygon(rs.boundaries[i], {
                            strokeWeight: 7,
                            strokeColor: "#999",
                            strokeOpacity: 0.85,
                            fillColor: '#fff',
                            fillOpacity: "0"
                        }); //建立多边形覆盖物
                        self.map.addOverlay(ply)
                        ply.disableMassClear();
                    }
                    for (let i = 0; i < count; i++) {
                        let ply = new BMap.Polygon(rs.boundaries[i], {
                            strokeWeight: 3,
                            strokeColor: "#ff0000",
                            strokeOpacity: 0.8,
                            fillColor: '#fff',
                            fillOpacity: "0.1"
                        }); //建立多边形覆盖物
                        self.map.addOverlay(ply);
                        ply.disableMassClear();
                    }
                });
            },
            pandTo(val){
                this.map.panTo(val,500);
                setTimeout(()=> {
                    this.map.setZoom(14);
                },800)
            },
            //展示基本阵地点位
            showBattleField() {
                if (this.realTimer) {
                    window.clearInterval(this.realTimer)
                }
                this.leftWidth.width = '200px';
                this.showLeft=true;
                this.flag =2
                //阵地个数
                this.$http('post','identity/positionInformation/positionNumber?districtId=01',false).then((data)=>{
                    this.positionNumber = data
                });
                this.openNotify('基本阵地是党组织开展活动的重要场所，是党员接受教育、发挥作用的重要平台，也是把党员和群众团结凝聚在党组织周围的重要物质依托。');
                this.msgFloatRight.marginRight = '-500px';
                let allOverlay = this.map.getOverlays();
                if(allOverlay.length>4){
                    for (let i = 0; i < allOverlay.length; i++) {
                        if(allOverlay[i].Ac&&allOverlay[i].Ac.className === 'BMap_Marker') {
                            allOverlay[i].enableMassClear();
                        }
                    }
                }
                this.map.clearOverlays();
               // this.initMap();
                this.map.centerAndZoom(new BMap.Point(119.172559, 31.92500), 11);  // 初始化地图,设置中心点坐标和地图级别
                this.$http("POST",`identity/sysDistrict/list`,{districtLevel:2},false).then( data =>{
                    data.forEach(item => {
                        if(item.location) {
                            //定义镇名
                            this.zhenList.push(item.districtName);
                            let marker = new BMap.Point(item.location.split(",")[0], item.location.split(",")[1]);
                            let myIcon = new BMap.Icon("/static/img/house06.svg", new BMap.Size(45, 45));
                            let marker2 = new BMap.Marker(marker, {icon: myIcon,name:123},{name:123});  // 创建标注
                            marker2.addEventListener('click', e => {
                                this.pandTo(marker)
                                setTimeout(this.setCunMaker(item.districtId),600);
                                //阵地个数
                                this.$http('post','identity/positionInformation/positionNumber?districtId='+item.districtId,false).then((data)=>{
                                    this.positionNumber = data
                                })

                            })
                            this.map.addOverlay(marker2);
                            marker2.disableMassClear();
                            let label = new BMap.Label(item.districtName,{offset:new BMap.Size(-item.districtName.length * 6 + 12,28)});
                            label.setStyle({
                                backgroundColor: '#ecf5ff',
                            display: 'inline-block',
                            height: '28px',
                            padding: '0 5px',
                            lineHeight: '26px',
                            fontSize: '12px',
                            color: '#409eff',
                            border: '1px solid #d9ecff',
                            borderRadius: '4px',
                            boxSizing: 'border-box',
                            whiteSpace: 'nowrap',
                            });
                            marker2.setLabel(label);
                        }
                    })
                })
            },
            //展示正在执行
            showWorking(){
                if (this.realTimer) {
                    window.clearInterval(this.realTimer)
                }
                this.leftWidth.width = '200px';
                this.flag = 3;
                this.showLeft = false;
                this.openNotify('此处显示电视端正在执行的任务');
                let allOverlay = this.map.getOverlays();
                if(allOverlay.length>4){
                    for (let i = 0; i < allOverlay.length; i++) {
                        if(allOverlay[i].Ac&&allOverlay[i].Ac.className === 'BMap_Marker') {
                            allOverlay[i].enableMassClear();
                       }
                    }
                }
                this.map.clearOverlays();
               // this.initMap();
                this.map.centerAndZoom(new BMap.Point(119.172559, 31.92500), 11);  // 初始化地图,设置中心点坐标和地图级别
                this.workingDataList();
                this.getCurrentSituation();
                this.getRealTimeLog();
                this.realTimer = setInterval(() => {
                    this.workingDataList();
                    this.getCurrentSituation();
                    this.getRealTimeLog();
                }, 5000)
            },
            //展示正在执行内的封装方法
            workingDataList(){
                this.flag = 3;
                this.$http('Post','identity/parActivityObject/list',{isWorking:1},false).then(
                    (data)=>{
                        let orgId = [];
                        data.forEach(item=>{
                            orgId.push(item.organizationId)
                        });
                        let orgSort = [];
                        //删除重复阵地
                        for(let i = 0;i<orgId.length;i++){
                            if(orgSort.indexOf(orgId[i]) == -1){
                                orgSort.push(orgId[i]);
                            }
                        }
                        this.setWorkingMaker(orgSort,data);
                    }
                ).catch(_=>{
                    this.$message(
                        {
                            type:'error',
                            message:'网络错误'
                        }
                    )
                })
            },
            //定义村级阵地
            setCunMaker(val){
                this.map.clearOverlays();
                //基本阵地
                this.$http("POST",`identity/sysDistrict/list`,{attachTo:val},false).then( data =>{
                    data.forEach(item => {
                        if(item.location){
                            let marker = new BMap.Marker(new BMap.Point(item.location.split(",")[0],item.location.split(",")[1]));
                            let content = ''
                            //获取最新阵地修改时间
                            let newTime = ''
                            if(item.positionInformation){
                                let times = []
                                item.positionInformation.forEach((val)=>{
                                    times.push(val.modifiedAt.split('T')[0])
                                    content = content + "<div class='house'><div class='houseName'>"+val.name+":</div>" +
                                        "<div style=''><div class='blueBlockPos'></div><div class='blueBlockTopPos'></div>" +
                                        "<div class='rowF'><div class='row'><label class='detailLabel'>设施</label><div class='detailText'>"+ (val.facilities || "暂无") +"</div></div><div style='position: relative;float: left;'><span class='tooltiptext'>"+val.facilities+"</span></div></div>" +
                                        "<div class='rowF'><div class='row'><label class='detailLabel'>占地面积</label><div class='detailText'>"+val.area+"平方米</div></div></div>"+
                                        "<div class='rowF'><div class='row'><label class='detailLabel'>功能介绍</label><div class='detailText'><a style='width:95%'>"+val.introduction+"</a><div class='detailMore' onclick='window.location=&quot;/#/basePosition/positionInformation?positionName="+val.name+"&quot;'>更多</div></div></div><div style='position: relative;float: left;'><span class='tooltiptext'>"+val.introduction+"</span></div></div>"+
                                        "</div></div>"
                                })
                                let year=[]
                                let mon = []
                                let day = []
                                times.forEach((val)=>{
                                    year.push(Number(val.substring(0,4)))
                                    mon.push(Number(val.substring(5,7)))
                                    day.push(Number(val.substring(8,10)))
                                })
                                console.log(year)
                                if(year.length == 0 ||mon.length == 0  ||day.length == 0 ){
                                    newTime = '无数据'
                                }else {
                                    newTime =  Math.max.apply(Math,year)+'-'+Math.max.apply(Math,mon)+'-'+Math.max.apply(Math,day)

                                }
                            }
                            marker.addEventListener('click', e => {
                                this.showRealLineChart(item);

                                //阵地个数
                                this.$http('post','identity/positionInformation/positionNumber?districtId='+item.districtId,false).then((data)=>{
                                    this.positionNumber = data
                                })

                                this.pContent =
                                    "<div class='infoBoxContent'>" +
                                    "<div class='infoBoxTitle'><span class='text'>"+item.districtName+"</span>" +
                                    "<div class='system-field'><div class='title01'><img src='/static/img/active/party_build_active.png' class='zhen'><span>"+item.parentName+"</span></div><div class='title02'><img src='/static/img/active/party_build_active.png' class='zhen'><span>更新时间:"+newTime+"</span></div></div></div>"+
                                    "<div style='padding-top: 10px;overflow-y:scroll;OVERFLOW-X:hidden;max-height: 400px;width: 650px' class='flowWin'>"+content+
                                    "</div>"+
                                    "</div>";
                                setTimeout(()=> {
                                    this.map.panTo(new BMap.Point(item.location.split(",")[0],item.location.split(",")[1]));
                                },300)

                                this.rightMessage = item
                                this.msgFloatRight.marginRight = '48px'
                                this.msgFloatRight.display = 'block'
                                let infoBox = new BMapLib.InfoBox(this.map,this.pContent,this.opts );
                                infoBox.addEventListener('close', () => {
                                    this.close();
                                })
                                setTimeout(infoBox._setContent(this.pContent,infoBox.open(marker)),500)
                            });
                            this.map.addOverlay(marker);
                            let label = new BMap.Label(item.districtName,{offset:new BMap.Size(-item.districtName.length * 6,28)});
                            label.setStyle({
                                backgroundColor: '#ecf5ff',
                                display: 'inline-block',
                                height: '24px',
                                padding: '0 8px',
                                lineHeight: '22px',
                                fontSize: '12px',
                                color: '#139c56',
                                border: '1px solid #d9ecff',
                                borderRadius: '4px',
                                boxSizing: 'border-box',
                                whiteSpace: 'nowrap',
                            });
                            marker.setLabel(label);
                        }
                    })
                });
            },
            //定义正在执行maker
            setWorkingMaker(ids,value){
                this.map.clearOverlays();
                //正在执行的活动
                let workList = [];
                if(ids){
                    ids.forEach(idItem=>{     //整合数据，解决一村都任务的情况
                        let idValue = {};
                        let values= [];
                        value.forEach(valueItem=>{
                            if(idItem == valueItem.organizationId){
                                values.push(valueItem)
                            }
                        });
                        if(values){
                            idValue.id = idItem;
                            idValue.value = values;
                            workList.push(idValue)
                        }
                    });
                    workList.forEach(res=>{
                        let marker = new BMap.Point(res.value[0].location.split(",")[0], res.value[0].location.split(",")[1]);
                        let myIcon = new BMap.Icon("/static/img/working.gif", new BMap.Size(50, 50),{
                            imageOffset: new BMap.Size(0, 20) // 设置图片偏移
                        });
                        let marker2 = new BMap.Marker(marker, {icon: myIcon});  // 创建标注
                        let content = '';

                        let time = (res.value[0].modifiedAt.split('T')[0]+" "+res.value[0].modifiedAt.split('T')[1]).split('.')[0];
                        marker2.addEventListener('click', e => {
                            /*setTimeout(()=> {
                                this.map.panTo(new BMap.Point(res.value[0].location.split(",")[0], res.value[0].location.split(",")[1] + 0.001));
                            });*/
                            this.map.setZoom(13);
                            let path = 'identity/parPictureInfro/list';
                            this.$http('Post',path,{organizationId:res.value[0].districtId,studyContent:res.value[0].activityId},false).then(data=>{
                                let url = '';
                                if(data[0].imageURL){
                                     url = data[0].imageURL
                                }else {
                                    url='../../../static/img/nodata.png'
                                }
                                res.value.forEach(item=>{
                                    content = "<div class='realActDiv'><span class='realActTitleSpan'>任务名称：<span class='realActSpan'>"+item.title+"</span></span>" +
                                        "<span class='realActTitleSpan' style='right: 29px;position: absolute;;'>任务类型：<span class='realActSpan'>"+item.type+"</span></span>" +
                                        "</div>"+
                                        "<div class='realActDiv'><span class='realActTitleSpan'>截止日期：<span class='realActSpan'>"+item.month+"</span></span>" +
                                        "</div>"+
                                        "<div class='realActDiv'><span class='realActTitleSpan'>任务要求：<span class='realActSpan'>"+item.context+"</span></span>" +
                                        "</div>"+
                                        "<div class='realActDiv'><span class='realActTitleSpan'>直播截图：</span>" +
                                        "</div>"+
                                        "<div class='realActDiv'>" +
                                        // "<video class='tvhou' width='100%' height='100%'" +
                                        // " controls='controls' autoplay='autoplay'" +
                                        // " x-webkit-airplay='true' x5-video-player-fullscreen='true'" +
                                        // " preload='auto' playsinline='true' webkit-playsinline" +
                                        // " x5-video-player-typ='h5'>" +
                                        // " <source type='application/x-mpegURL' src='"+ip+"'>" +
                                        // "</video> "+
                                        "<img src="+url+" style='width:470px;margin-left:17px;margin-bottom:20px;'>"+
                                        "</div>"
                                });

                                this.pContent =
                                    "<div class='infoBoxContent'>" +
                                    "<div class='infoBoxTitle' style='background-color:#255cc296 '><span class='text'>"+res.value[0].parentName+"--"+res.value[0].districtName+"</span>" +
                                    "<div class='system-field'><div class='title01'><img src='/static/img/map/mapcamera.png' class='zhen'><span class='minitor'>在线</span></div>" +
                                    "<div class='title02' style='font-size:12px'><span style='margin-right: 3px'><img src='/static/img/map/maptime.png' class='zhen'>" +
                                    "<span style='color:white;font-size: 14px;'>"+time+"</span></div></div></div>"+
                                    "<div style='padding-top: 10px;overflow-y:scroll;OVERFLOW-X:hidden;max-height: 700px;width: 80%;margin: auto' class='flowWin'>"+content+
                                    "</div>"+
                                    "</div>";
                                let infoBox = new BMapLib.InfoBox(this.map,this.pContent,this.opts);
                                setTimeout(infoBox._setContent(this.pContent,infoBox.open(marker2)),600)
                            })
                        });
                        this.map.addOverlay(marker2);
                    })
                }
            },
            //展示党组织镇级
            showParty() {
                if (this.realTimer) {
                    window.clearInterval(this.realTimer)
                }
                this.flag = 1;
                this.leftWidth.width = '200px';
                this.showLeft = true;
                this.openNotify('党的基层组织是党在社会基层组织中的战斗堡垒，是党的全部工作和战斗力的基础。新形势下基层党组织工作开展的怎么样，直接影响到党的凝聚力、影响力、战斗力的充分发挥。');
                let allOverlay = this.map.getOverlays();
                if(allOverlay.length>4){
                    for (let i = 0; i < allOverlay.length; i++) {
                        if(allOverlay[i].Ac) {
                            allOverlay[i].enableMassClear();
                        }
                    }
                }
                this.map.clearOverlays();
               // this.initMap();
                this.map.centerAndZoom(new BMap.Point(119.172559, 31.92500), 11);
                this.$http("POST",`identity/sysDistrict/list`,{districtLevel:2},false).then( data =>{
                    data.forEach(item => {
                        if(item.location) {
                            //定义镇名
                            this.zhenList.push(item.districtName);
                            let marker = new BMap.Point(item.location.split(",")[0], item.location.split(",")[1]);
                            let myIcon = new BMap.Icon("/static/img/zhen_position.png", new BMap.Size(25, 34), {
                                anchor: new BMap.Size(11, 32),
                            });
                            let marker2 = new BMap.Marker(marker, {icon: myIcon,name:1},{name:1});  // 创建标注
                            marker2.addEventListener('click', e => {
                               this.pandTo(marker)
                                //定义具体党组织maker
                                setTimeout(this.setPartyMaker(item.districtId),500);
                                let tableData = "<div><div style='line-height: 20px;'><div style='display: inline-block;vertical-align: middle;margin: 8px 46px'>组织成员：</div></div>" +
                                    "<div style='position: relative'><div class='blueBlock'></div><div class='blueBlockTop'></div><div class='row'><label class='detailLabel'>组织人数</label><div class='detailText' style=''>"+666+"</div></div>"+
                                    "<div class='row'><label class='detailLabel'>书记</label><div class='detailText' style=''>"+666+"</div></div>"+
                                    "<div class='row'><label class='detailLabel'>副书记</label><div class='detailText' style=''>"+666+"</div></div>"+
                                    "<div class='row'><label class='detailLabel'>其他委员</label><div class='detailText' style='text-overflow:clip;word-break: normal;overflow: visible;white-space:normal'>"+'daoiwjdiwoadiajowwwwwwwwaw达瓦达瓦啊我的娃达娃大wwwwwwwwww'+"</div></div>"+
                                    "</div></div>"
                                this.pContent =
                                    "<div class='infoBoxContent'>" +
                                    "<div class='header'><div class='headerTitle' style='line-height: 32px;position: relative'><img src='static/img/partyTitle.png' style='width: 33px;height: 32px;'></img><a style='margin-top: -1px;position: absolute'>"+item.districtName+"</a></div>" +
                                    "<div>" +
                                    "<div style='display: inline-block' class='headerTwo'>所属组织:<sapn style='color: #8b8b8b'>"+item.parentName+"</sapn></div>" +
                                    "</div>" +
                                    "</div>"+
                                    "<div class='content'><div style='line-height: 20px;'>" +
                                    "<div style='display: inline-block;vertical-align: middle;margin: 8px 46px'>组织详情：</div></div>" +
                                    "<div  style='position: relative'><div class='blueBlock'></div><div class='blueBlockTop'></div><div  class='contentDetail'>"+"暂无数据暂无数据暂无数据暂无数据暂无数据暂无数据暂无数据暂无数据"+
                                    "</div></div>"+
                                    tableData+
                                    "</div>"+
                                    "</div>";
                                let infoBox = new BMapLib.InfoBox(this.map,this.pContent,this.opts );
                                setTimeout(
                                    ()=>{
                                        infoBox._setContent(this.pContent,infoBox.open(marker2))
                                   },1200)
                            })
                            this.map.addOverlay(marker2);
                            marker2.disableMassClear();
                            let offsetWidth = item.districtName.length * 12 / 2 - 12;
                            let label = new BMap.Label(item.districtName,{offset:new BMap.Size(-offsetWidth,34)});
                            label.setStyle({
                                backgroundColor: '#ecf5ff',
                                display: 'inline-block',
                                height: '28px',
                                padding: '0 3px',
                                lineHeight: '26px',
                                fontSize: '12px',
                                color: '#409eff',
                                border: '1px solid #d9ecff',
                                borderRadius: '4px',
                                boxSizing: 'border-box',
                                whiteSpace: 'nowrap',
                            });
                            marker2.setLabel(label);
                        }
                    });
                })
            },
            showCenterMarker() {
                let centerIcon = new BMap.Icon("/static/img/partyFlag.gif", new BMap.Size(50, 50), {
                    anchor: new BMap.Size(0, 50),
                });
                let centerMarker = new BMap.Marker(this.centerPoint,{icon: centerIcon});
                this.map.addOverlay(centerMarker);
                let label = new BMap.Label('句容市委',{offset:new BMap.Size(-24,50)});
                label.setStyle({
                    backgroundColor: 'rgba(255,7,0,0.9)',
                    display: 'inline-block',
                    height: '24px',
                    padding: '0 3px',
                    lineHeight: '26px',
                    fontSize: '12px',
                    color: '#fffe3e',
                    border: '1px solid red',
                    borderRadius: '4px',
                    boxSizing: 'border-box',
                    whiteSpace: 'nowrap',
                });
                centerMarker.setLabel(label);
            },
            generateHtml(arr) {
                let str = '';
                arr.forEach(item => {
                    str += `<div class="row"><div class="detailText">${item.name}</div><label class="detailLabel">${item.postExperience}</label></div>`
                })
                return str;
            },
            //展示党组织村级
            setPartyMaker(val){
                this.map.clearOverlays();
                this.$http("POST",`identity/sysDistrict/list`,{attachTo:val},false).then( data =>{
                    data.forEach(item => {
                        if(item.location) {
                            let myIcon = new BMap.Icon("/static/img/partyPosition.png", new BMap.Size(50, 50), {
                                anchor: new BMap.Size(11, 32),
                            });
                            let marker = new BMap.Marker(new BMap.Point(item.location.split(",")[0], item.location.split(",")[1]),{icon: myIcon,name:123},{name:123});// 创建标注
                            let content = ''
                            let type = item.districtType === 'Party'?'农村':'机关'
                            marker.addEventListener('click',()=>{
                                this.$http('POST', 'identity/villageCadres/list?sort=postExperience,asc', {districtId: item.districtId}, false).then(
                                    data => {
                                        this.pContent =
                                            "<div class='infoBoxContent'>" +
                                            "<div class='header'><div class='headerTitle' style='line-height: 32px;position: relative'><img src='static/img/partyTitle.png' style='width: 33px;height: 32px;'></img><a style='margin-top: -1px;position: absolute'>"+item.districtName+"</a></div>" +
                                            "<div>" +
                                            "<div style='display: inline-block' class='headerTwo'>所属组织:<sapn style='color: #8b8b8b'>"+item.parentName+"</sapn></div>" +
                                            "<div style='display: inline-block' class='headerThree'>组织类型:<sapn style='color: #8b8b8b'>"+type+"</sapn></div>" +
                                            "</div>" +
                                            "</div>"+
                                            "<div class='content'>" +
                                            "<div style='line-height: 20px;'>" +
                                            "<div style='display: inline-block;vertical-align: middle;margin: 8px 46px'>组织详情：</div>" +
                                            "</div>" +
                                            "<div style='position: relative'><div class='blueBlock'></div><div class='blueBlockTop'></div><div class='contentDetail'>"+"暂无数据暂无数据暂无数据暂无数据暂无数据暂无数据暂无数据暂无数据"+
                                            "</div></div>"+
                                            "<div style='line-height: 20px;'>" +
                                            "<div style='display: inline-block;vertical-align: middle;margin: 8px 46px'>组织成员：</div>" +
                                            "</div>" +
                                            "<div style='position: relative'><div class='blueBlock'></div><div class='blueBlockTop'></div>" +
                                            "<div class='contentDetail'></div>" + this.generateHtml(data) +
                                            "</div>" +
                                            "</div>" +
                                            "</div>";
                                        let infoBox = new BMapLib.InfoBox(this.map,this.pContent,this.opts );
                                        setTimeout(()=>{
                                            this.map.panTo(item.location.split(",")[0],item.location.split(",")[1]);
                                        },300)
                                        setTimeout(infoBox._setContent(this.pContent,infoBox.open(marker)),500);
                                    }
                                )
                            })
                            this.map.addOverlay(marker);
                            let offsetWidth = item.districtName.length * 12/2;
                            let label = new BMap.Label(item.districtName,{offset:new BMap.Size(-offsetWidth,28)});
                            label.setStyle({
                                backgroundColor: '#c8ff4d',
                                display: 'inline-block',
                                height: '24px',
                                padding: '0 8px',
                                lineHeight: '22px',
                                fontSize: '12px',
                                color: '#000000',
                                border: '1px solid #d9ecff',
                                borderRadius: '4px',
                                boxSizing: 'border-box',
                                whiteSpace: 'nowrap',
                            });
                            marker.setLabel(label);
                        }
                    })
                })

            },
            //阵地实时人流量
            showPeopleStream(value) {
                if (this.realTimer) {
                    window.clearInterval(this.realTimer)
                }
                let allOverlay = this.map.getOverlays();
                if(allOverlay.length>4){
                    for (let i = 0; i < allOverlay.length; i++) {
                        if(allOverlay[i].Ac&&allOverlay[i].Ac.className === 'BMap_Marker') {
                            allOverlay[i].enableMassClear();
                        }
                    }
                }
                this.map.clearOverlays();
                this.map.centerAndZoom(new BMap.Point(119.172559, 31.92500), 11);
               // this.initMap();
                this.showRealLineChart({districtId: '01'}, "realLineChart2")
                this.leftWidth.width = '200px';
                this.flag = 4;
                this.showLeft = false;
                if (!value || value.length === 0) {
                    return;
                }
                this.$http('POST', '/identity/sumPerHour/getHeatMapData', {
                    startTime: value[0],
                    endTime:  value[1]
                }).then(data => {
                    let max = 0;
                    data.forEach(item => {
                        item.geometry = {
                            type: 'Point',
                            coordinates: item.location.split(',')
                        };
                        item.count = item.total
                        if (item.count > max) {
                            max = item.count
                        }
                    });

                    let dataSet = new mapv.DataSet(data);

                    let options = {
                        size: 15,
                        gradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)"},
                        max: max,
                        // range: [0, 100], // 过滤显示数据范围
                        draw: 'heatmap'
                    }

                    let mapvLayer = new mapv.baiduMapLayer(this.map, dataSet, options);
                })
            },
            toggleDiv(action) {
                var census = document.getElementById('census');
                if (action === 'show') {
                    census.style.width = '350px';
                } else {
                    action = 'hide';
                    census.style.width = "0";
                }
                census.style.animation = action + ' 1s'
            },
            showRealLineChart(item, id) {
                this.$http('Post',`identity/positionChart/realLineChart?districtId=`+item.districtId,false).then( data =>{
                    let realLineChart = echarts.init(document.getElementById(id || "realLineChart"));
                    let hours = [];
                    data.monthDay.forEach(item =>{
                        hours.push(item.substr(11,5))
                    });
                    let option = {
                        title: {
                            text: item.districtName || "" + '各阵地实时人流量统计折线图' ,
                        },
                        grid: {
                          y: 80
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
                                }
                            },
                        ]
                    };
                    realLineChart.setOption(option);
                });

            },
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
                    this.realLineTownId = this.user.districtId;
                    //村级组织
                    this.$http('POST',`identity/sysDistrict/list`,{attachTo:this.user.districtId},false).then(data => {
                        this.realLineCountryList = [];
                        data.forEach( item => {
                            //实时折线图
                            this.realLineCountryList.push({value:item.districtId , label:item.districtName});
                        });

                    })
                }
                if(this.userAuthority ==3){
                    this.townList = [];
                    this.realLineCountryList = [];
                    this.$http('POST',`identity/sysDistrict/list`,{districtLevel:2,districtId:this.user.sysDistrict.attachTo},false).then(data => {
                        data.forEach( item => {
                            this.townList.push( {value:item.districtId , label:item.districtName});
                        });
                    });
                    this.realLineCountryList.push({value:this.user.districtId , label:this.user.organizationName});
                    this.realLineTownId = this.user.sysDistrict.attachTo;
                    this.realLineCountryId = this.user.districtId;

                }

            },
            showCountryList() {
                this.realLineCountryList = [];
                this.realLineCountryId = '';
                if(this.realLineTownId.length>2){
                    //村级组织
                    this.$http('POST',`identity/sysDistrict/list`,{attachTo:this.realLineTownId},false).then(data => {
                        data.forEach( item => {
                            this.realLineCountryList.push({value:item.districtId , label:item.districtName})
                        });
                    })
                }
                this.$nextTick(()=>{
                    let temp = {};
                    temp.districtId = this.realLineCountryId || this.realLineTownId;
                    console.log(temp, 7878)
                    this.showRealLineChart(temp, "realLineChart2");
                });
            },
            getCurrentSituation() {
                axios.all([
                    this.$http("post", 'identity/cloudStatistics/activityExecuteNumber', {}, false),
                    this.$http("post", 'identity/cloudStatistics/activityPassNumber', {}, false),
                    this.$http("post", 'identity/cloudStatistics/activityIsWorkingNumber', {}, false)
                ]).then(axios.spread((d1, d2, d3) => {
                    this.executeNumber = d1;
                    this.passNumber = d2;
                    this.isWorkingNumber = d3;
                }))
            },
            getRealTimeLog() {
                this.$http("post", 'identity/cloudStatistics/getCloudLog', {}, false).then(
                    data => {
                        this.realTimeLog = data.rows;
                    }
                )
            },
            //活动统计--显示当月镇活动完成情况的气泡图
            showTown() {
                this.flag = 4;
                let allOverlay = this.map.getOverlays();
                for (let i = 0; i < allOverlay.length; i++) {
                    console.log(allOverlay[i].Ac,i);
                    if(allOverlay[i].Ac){
                        allOverlay[i].enableMassClear();
                    }
                }
                this.map.clearOverlays();
               /* let allOverlay = this.map.getOverlays();
                if(allOverlay.length>4){
                    for (let i = 0; i < allOverlay.length; i++) {
                        if(allOverlay[i].Ac&&allOverlay[i].Ac.className === 'BMap_Marker') {
                            allOverlay[i].enableMassClear();
                        }
                    }
                }*/
               // this.initMap();
                this.map.centerAndZoom(new BMap.Point(119.172559, 31.92500), 11);  // 初始化地图,设置中心点坐标和地图级别
                this.$http('POST', `identity/cloudStatistics/townMonthRate`, {}, false).then(data => {
                    data.forEach(item => {
                        let count = Math.round(item.rate * 25) + 15;
                        let rate = Math.round(item.rate * 100);
                        this.townPointList.push({
                            geometry: {
                                type: 'Point',
                                coordinates: [item.location.split(",")[0], item.location.split(",")[1]]
                            },
                            count: count,
                            text: item.districtName + rate + "%",
                            item: item,
                        });
                    });
                    let dataSet = new mapv.DataSet(this.townPointList);
                    let circleOptions = {
                        fillStyle: 'rgba(64, 158, 255, 0.8)',
                        minSize: 25,
                        maxSize: 50,
                        max: 50,
                        draw: 'bubble',
                        methods: { // 一些事件回调函数
                            click: item => { // 点击事件，返回对应点击元素的对象值
                                if (item) {
                                    this.currentZhenPoint = item;
                                    this.showCunPoint(item, () => {
                                        this.map.centerAndZoom(new BMap.Point(item.item.location.split(",")[0], item.item.location.split(",")[1]), 13);
                                    });
                                }
                            },
                        },
                    };
                    let labelOptions = {
                        fillStyle: 'rgba(255,255,255,0.8)',
                        maxSize: 20,
                        max: 30,
                        draw: 'text'
                    };
                    if(this.circleLayer){
                         this.circleLayer.destroy();
                         this.labelLayer.destroy();
                         this.$nextTick(()=>{
                             this.circleLayer.show();
                             this.circleLayer.bindEvent();
                             this.labelLayer.show();
                           /*  this.circleLayer = new mapv.baiduMapLayer(this.map, dataSet, circleOptions);
                             this.labelLayer = new mapv.baiduMapLayer(this.map, dataSet, labelOptions);*/
                         })
                    }else{
                        this.circleLayer = new mapv.baiduMapLayer(this.map, dataSet, circleOptions);
                        this.labelLayer = new mapv.baiduMapLayer(this.map, dataSet, labelOptions);
                    }
                });

            },
            showCunPoint(item, cb) {
                this.cunLabelList.forEach(sub => {
                    this.map.removeOverlay(sub);
                });
                this.cunLabelList = [];
                this.cunPointList.forEach(item => {
                    item.ba.style.display = 'none';
                });
                if (cb) {
                    cb();
                }
                let temp = this.attachToCache.get(item.item.attachTo);
                if (temp) {
                    temp.forEach(subItem => {
                        let tempBar = document.getElementById("charts" + subItem.organizationId);
                        let latLonArr = subItem.location.split(",");
                        let point = new BMap.Point(latLonArr[0], latLonArr[1]);
                        let pixel = this.map.pointToOverlayPixel(point);
                        tempBar.style.display = 'block';
                        tempBar.style.left = pixel.x - 25 + "px";
                        tempBar.style.top = pixel.y - 80 + "px";
                        let opts = {
                            position: point,    // 指定文本标注所在的地理位置
                            offset: new BMap.Size(-25, -20)    //设置文本偏移量
                        };
                        let label = new BMap.Label(subItem.districtName, opts);  // 创建文本标注对象
                        label.setStyle({
                            backgroundColor: 'transparent',
                            display: 'inline-block',
                            height: '28px',
                            padding: '0 5px',
                            lineHeight: '26px',
                            fontSize: '12px',
                            color: '#265498',
                            border: '0px solid #d9ecff',
                            borderRadius: '4px',
                            boxSizing: 'border-box',
                            whiteSpace: 'nowrap',
                        });
                        this.map.addOverlay(label);
                        this.cunLabelList.push(label);
                    });
                    return;
                }
                this.$http('POST', `identity/cloudStatistics/cunMonthObject?attachTo=` + item.item.attachTo, false).then(data => {
                    this.attachToCache.set(item.item.attachTo, data);
                    data.forEach(subItem => {
                        this.drawBar(subItem);
                    })
                })
            },
            drawBar(subItem) {
                let cunPoint = new BMap.Point(subItem.location.split(",")[0], subItem.location.split(",")[1]);
                if (subItem.location) {
                    let opts = {
                        position: cunPoint,    // 指定文本标注所在的地理位置
                        offset: new BMap.Size(-25, -20)    //设置文本偏移量
                    };
                    let label = new BMap.Label(subItem.districtName, opts);  // 创建文本标注对象
                    label.setStyle({
                        backgroundColor: 'transparent',
                        display: 'inline-block',
                        height: '28px',
                        padding: '0 5px',
                        lineHeight: '26px',
                        fontSize: '12px',
                        color: '#265498',
                        border: '0px solid #d9ecff',
                        borderRadius: '4px',
                        boxSizing: 'border-box',
                        whiteSpace: 'nowrap',
                    });
                    this.map.addOverlay(label);
                    this.cunLabelList.push(label);

                    function ComplexCustomOverlay(point) {
                        this._point = point;
                    }

                    ComplexCustomOverlay.prototype = new BMap.Overlay();
                    ComplexCustomOverlay.prototype.initialize = (newMap) => {
                        this._map = newMap;
                        let div = this._div = document.createElement("div");
                        div.id = "charts" + subItem.organizationId;
                        div.style.position = "absolute";
                        div.style.zIndex = BMap.Overlay.getZIndex(cunPoint.lat);
                        div.style.color = "white";
                        div.style.height = "80px";
                        div.style.width = "50px";
                        div.style.whiteSpace = "nowrap";
                        div.style.MozUserSelect = "none";

                        this.map.getPanes().labelPane.appendChild(div);

                        let pieChar = echarts.init(document.getElementById("charts" + subItem.organizationId));
                        let option = {
                            color: ["red", "green"],
                            tooltip: {},
                            xAxis: {
                                show: false,
                                name: '',
                                nameGap: 1,
                                type: 'category',
                                data: ["未完成", "已完成"]
                            },
                            yAxis: {
                                show: false,
                                type: 'value',
                            },
                            series: [{
                                type: 'bar',
                                barWidth: 12,
                                data: [subItem.unfinished, subItem.finished],
                                label: {
                                    textStyle: {
                                        fontSize: 16,
                                        borderWidth: 1
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color: function (params) {
                                            let arr = [
                                                new echarts.graphic.LinearGradient(
                                                    0, 0, 0, 1,
                                                    [
                                                        {offset: 0, color: 'rgb(255,255,255)'},
                                                        {offset: 0.5, color: 'rgba(255,0,2,0.71)'},
                                                        {offset: 1, color: '#fe0700'}
                                                    ]
                                                ),
                                                new echarts.graphic.LinearGradient(
                                                    0, 0, 0, 1,
                                                    [
                                                        {offset: 0, color: 'rgba(37,246,15,0.41)'},
                                                        {offset: 0.5, color: '#17f01a'},
                                                        {offset: 1, color: '#07f05e'}
                                                    ]),

                                            ];
                                            return arr[params.dataIndex];
                                        }
                                    },
                                },
                            }]
                        };
                        pieChar.setOption(option);
                        return div;
                    };
                    ComplexCustomOverlay.prototype.draw = () => {
                        let newestMap = this._map;
                        let pixel = newestMap.pointToOverlayPixel(cunPoint);
                        this._div.style.left = pixel.x - 25 + "px";
                        this._div.style.top = pixel.y - 80 + "px";
                    };
                    let myCompOverlay = new ComplexCustomOverlay(cunPoint);
                    this.map.addOverlay(myCompOverlay);
                    this.cunPointList.push(myCompOverlay);
                }
            }
        },
        mounted() {
            this.user = JSON.parse(sessionStorage.getItem("userInfo"));
            this.userAuthority = this.user.sysDistrict.districtLevel;
            this.getTreeData();
            this.showTownList();
            this.initMap();
        }
    }
</script>

<style>
    .gis-map .el-tree-node__label {
        font-size: 14px !important;
    }
    .gis-map .el-tree-node__content:hover {
        background-color: #ffffff;
        color: red;
    }
    nav {
        background: rgba(245, 245, 245, 0.95);
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
        -moz-box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
        -webkit-box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
        width: 200px;
        margin:30px 0 0 200px;
    }
    nav ul {
        padding: 0;
        margin: 0;
    }
    nav ul li {
        list-style: none;
        height: 50px;
    }
/*    nav ul li:hover {
        width: 200px;
        height: 50px;
    }*/
    nav ul li a {
        position: absolute;
        width: 140px;
        height: 40px;
        text-decoration: none;
        color: #555;
        padding: 10px 0 0 60px;
    }
/*    nav ul li a:hover {
        color: #fff;
    }*/
    .devices {
        background: #658092;
        width: 50px;
        height: 50px;
    }
    .infoBoxContent{
        margin:0 ;
    }
  /*  .infoBoxContent button{
        background-color: #008CBA;
        border: none;
        color: white;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        border-radius: 16px;
        width: 120px;
    }*/
    .infoBoxContent p{
        color:black;
        font-size: 14px;
        line-height: 26px;
    }
    .infoBoxContent:before {
        content: '';
        width: 0;
        height: 0;
        border: 20px solid transparent;
        border-top-color:white;
        position: absolute;
        left: 50%;
        top: 94%;
        margin-left: -20px;
        transform: rotate(150deg);
    }
    .infoBoxTitle{
        padding: 12px 12px 16px 12px;
        background: #D2EDFE;
        color: #212121;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
    }
    .infoBoxTitle .text{
        display: block;
        width: 240px;
        font-size: 18px;
        color: #030303;
        font-family: "Microsoft YaHei";
        font-weight: bold;
    }
    .infoBoxTitle .system-field{
        display: flex;
        margin-top: 11px;
    }
    .infoBoxTitle .title01{
        max-width: 150px;
        overflow: hidden;
        font-size: 14px;
    }
    .infoBoxTitle .title02{
        flex: 1;
        text-align: right;
        font-size: 14px;
    }
    .infoBoxTitle .title01 .zhen{
        position: relative;
        width: 26px;
        height: 26px;
        top: 5px;
        margin-right: 5px;
    }
    .infoBoxTitle .title02 .zhen{
        position: relative;
        width: 26px;
        height: 26px;
        top: 5px;
        margin-right: 5px;
    }
    .infoBox {
        animation: boxmove 500ms ease;
        background: #fff;
        border-radius: 3px;
        box-shadow: 2px 2px 10px rgba(51, 51, 51, 0.6);
        z-index: 99;
        min-height: 450px;
    }
    .house{
        position: relative;
        z-index: 1111;
        text-align: center;
        border-bottom: 1px solid #c1c1c1;
        padding-bottom: 10px;
    }
    .tooltiptext{
        visibility: hidden;
        width: 500px;
        background-color: #1d21249e;
        color: #fff;
        text-align: left;
        border-radius: 6px;
        padding: 5px 0;
        white-space:normal;
        font-size: 14px;
        /* 定位 */
        position: absolute;
        margin-left: 75px;
        margin-top: -55px;
        z-index: 1999 !important;
    }
    .block{
        float: left;
        width: 9px;
        background: #108ee9;
        height: 22px;
        margin-right: 8px;
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .houseName{
        float: left;
        padding-top: 5px;
        padding-bottom: 5px;
        text-align: left;
        margin-left: 44px;
        font-weight: 500;
        font-size: 17px;
    }
    .row{
        margin: 0 auto;
        width: 85%;
        overflow: hidden;
        /*border: 1px solid #EDEDED;*/
        /*border-bottom: none;*/
        clear: both;
        background: #FAFAFA;

    }
    .detailMore{
        position: absolute;
        right: -15px;
        top: 7px;
        color: #06b1ff;
    }
    .detailMore:hover{
        cursor: pointer;
    }


    .detailLabel{
        display: inline-block;
        vertical-align: middle;
        min-width: 260px;
        padding: 7px 8px;
        color: #212121;
        font-size: 14px;
        /*border-right: 1px solid #EDEDED;*/
        background: #FAFAFA;
        line-height: 18px;
        margin-right: 15px;


    }
    .detailText{
        position: relative;
        text-align: left;
        margin-right: 20px;
        float: right;
        vertical-align: middle;
        width: 190px;
        line-height: 18px;
        padding: 7px 8px;
        font-size: 14px;
        color: #706874;

    }
    .detailText a{
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden
    }
    .rowF{
        margin: 0 auto;
        clear: both;
        width: 85%;
        z-index: 1111;
        background: #FAFAFA;

    }
    .rowF .row {
        width: 100%;
    }
    .rowF .row .detailLabel{
        min-width: 50px;
    }
    .rowF .row .detailText{
        width: 400px;
        display: inline-block;
    }
    /*.rowF:hover .tooltiptext{*/
        /*visibility: visible;*/
        /*z-index: 1000;*/
        /*animation: tooltiptext 0.1s;*/
    /*}*/
    /*@keyframes tooltiptext {*/
        /*0% {*/
            /*transform: scale(0.6);*/
        /*}*/
        /*10% {*/
              /*transform: scale(0.65);*/
          /*}*/
        /*20% {*/
            /*transform: scale(0.7);*/
        /*}*/
        /*35% {*/
            /*transform: scale(0.75);*/
        /*}*/
        /*50% {*/
            /*transform: scale(0.8);*/
        /*}*/
        /*70% {*/
            /*transform: scale(0.85);*/
        /*}*/
        /*85% {*/
            /*transform: scale(0.9);*/
        /*}*/
        /*100% {*/
            /*transform: scale(1);*/
        /*}*/
    /*}*/
    /*.infoBox:after{*/
        /*!* content: "";*/
         /*box-shadow: 80px 10px 5px #888888;*/
       /*!*  transform:rotate(40deg);*/
        /*transform-origin: bottom center;*!*!*/
        /*content: "";*/
        /*position: absolute;*/
        /*bottom: -30px;*/
        /*left: 10px;*/
        /*width: calc(0.5 * 1144px);*/
        /*height: calc(0.5 * 370px);*/
        /*background-size: contain;*/
        /*background: url("/static/img/iws3.png") no-repeat;*/
   /*//   background-color: rgba(167,167,167,0.5);*/
     /*//   -moz-box-shadow: 10px 10px 10px 10px rgba(0,0,0,0.3);*/
    /*//  box-shadow: 10px 0px 5px  rgba(167,167,167,0.5),10px 0px 5px  rgba(167,167,167,0.5),0px -10px 5px  rgba(167,167,167,0.5),0px 10px 5px  rgba(167,167,167,0.5);*/
     /*//   transform: skewX(130deg);*/
        /*z-index: -1;*/
      /*//  transform-origin: bottom center;*/
    /*}*/
    .msgCard{
        margin-top: 10px;
        overflow-y:scroll;
        position: relative;
    }
    .gis-map .con-vs-card {
        width:500px !important;
        height: 450px  !important;
    }
    .closeBtnBg{
        transition: all 0.3s;
        position: absolute;right: 505px;top: 110px;
        /*background-color: rgba(28, 24, 24, 0.60);*/
        width: 30px;height: 30px;border-radius: 3px
    }
    .closeBtnBg:hover{
        transform: scale(1.05);
        cursor:pointer;
        background-color: rgba(28, 24, 24, 0.34);
        width: 32px;
        z-index: 1001;
    }
    .closeBtn{
        top:4px;
        left: 13px;
        width: 0;
        height: 0;
        border: 13px solid;
        border-color:  transparent transparent transparent #73abff;
        position: relative;
    }
    .closeBtn:after{
        content: '';
        position: absolute;
        top:-13px;
        left: -19px;
        border: 13px solid;
        border-color:  transparent transparent transparent rgba(97, 133, 255, 0.6);
    }
    .flowWin::-webkit-scrollbar{
        width: 8px;
    }
    .minitor{
        margin-right: 8px;
        background-color: #67C23A;
        border-radius: 3px;
        color: #FFF;
        display: inline-block;
        padding: 0 6px;
    }
    .header{
        width:100%;
        height: 90px;
        padding: 5px;
        background:url("../../../static/img/partyHeader.jpg") ;
        border-top-left-radius:3px;
        border-top-right-radius:3px;
    }
    .content{

        width:100%;
        padding: 10px 10px;
    }
    .headerTitle{
        font-family: "Microsoft YaHei";
        font-weight: bold;
        font-size: 20px;
        margin-left: 5px;
        padding-bottom: 2px;
        padding-top: 10px;
        line-height: 20px;
        width:50%;

    }
    .headerTwo{
        font-size: 16px;
        margin-left: 36px;
        padding-top: 5px;
    }
    .headerThree{
        font-size: 15px;
        text-align: right;
        margin-right: 10px;
        float: right;
        padding-top: 5px;
    }
    /*党组织进度条样式*/
    .blueBlock{
        position: absolute;
        background: rgba(100, 100, 100, 0.5);
        height: 100%;
        margin-left: 15px;
        width: 3.5px;

    }
    .blueBlockTop{
        position: absolute;
        background: deepskyblue;
        width: 12px;
        height: 12px;
        margin-left: 10px;
        margin-top: -22px;
        transform:rotate(45deg);
    }
    /*基本阵地进度条样式*/
    .blueBlockPos{
        position: absolute;
        background: rgba(100, 100, 100, 0.5);
        height: 80%;
        margin-left: 20px;
        margin-top: 35px;
        width: 3.5px;

    }
    .blueBlockTopPos{
        position: absolute;
        background: deepskyblue;
        width: 12px;
        height: 12px;
        margin-left: 15px;
        margin-top: 10px;
        transform:rotate(45deg);
    }
    .contentDetail{
        border:2px solid #1d1f293d;
        font-size: 18px;
        line-height: 28px;
        text-indent : 36px;
        letter-spacing:2.5px;
        margin:0 auto;
        width: 85%;
    }
</style>
<style scope>
    .showLeftList{
        cursor: pointer;
        overflow-y:scroll;
        width: 0;
        height: 0;
        border: 15px solid;
        border-color:  transparent transparent transparent #73abff;
    }
    .showLeftList:after{
        content: '';
        left: 10px;
        top: 0px;
        position: absolute;
        border: 15px solid;
        border-color:  transparent transparent transparent rgba(97, 133, 255, 0.6);
    }

    .showLeftListTop{
        width: 50px;
        height: 50px;
        position: fixed;
        top: 350px;
        left: 250px;
        transition: all 0.5s;
    }
    .showLeftListTop:hover{
        margin-left: 10px;
        transform: scale(1.2);
    }
    .leftList{
        position: absolute;
        overflow-y: auto;
        overflow-x: hidden;
        top: 370px;
        left: 10px;
        height: 450px;
        background: rgba(158, 204, 255, 0.3);
        border-radius: 5px;
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
        -moz-box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
        -webkit-box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
        transition: all 0.6s;
        padding-top: 10px;
    }
    .leftList::-webkit-scrollbar {
        width: 4px;
    }
    .leftClose{
        z-index: 1000;
        cursor: pointer;
        position: absolute;
        top: 380px;
        left: 190px;
        width: 16px;
        height:2px;
        background: black;
        transform: rotate(45deg);
    }
    .leftClose:before{
        content:'';
        display:block;
        width: 16px;
        height:2px;
        background: black;
        transform: rotate(-90deg);
    }
    #allmap{
        width: 100%;
        height: 822px;
        overflow: hidden;
        margin:0;font-family:"微软雅黑";
    }

    #census{
        width: 0;
        height: 300px;
        position: fixed;
        top: 200px;
        right: 10px;
        border-left: 1px solid grey;
        border-top: 1px solid grey;
        overflow: hidden;
        box-shadow: 2px 2px gainsboro;
    }
    #census img {
        height: 31vh !important;
        width: 350px !important;
    }
    @keyframes show
    {
        from {width: 0}
        to {width: 350px}
    }
    @keyframes hide
    {
        from {width: 350px}
        to {width: 0}
    }
  /*  .nav {
        position: fixed;
        top: 30px;
        left: 30px;
        z-index: 8888;
        margin: 0;
    }*/
    .nav {
        position: absolute;
        background: rgba(255, 255, 255, 0.8);
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
        -moz-box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
        -webkit-box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
        width: 200px;
        z-index: 1000;
        top: 35px;
        left: 10px;
        margin:30px 0 0 0px;
        padding: 0 5px;
    }
    .member{
        color: #409eff;
        display: inline-block;
        margin-left: 335px;
        vertical-align: middle;
        cursor: pointer;
        padding: 0;
        font-size: 16px;
        font-weight: 500;
        text-decoration:underline
    }
    .newDia{
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: aquamarine;
        opacity: 0.5;
        z-index: 10000;
        margin-top: -23px;
        top:0px;
    }
 /* 右上角阵地个数图标*/
    .positionIcon{
        border-radius: 30px;
        padding: 6px;
        font-size: 13px;
        margin: 0px 2px
    }
    .gis-map .el-date-editor.el-input, .gis-map .el-date-editor.el-input__inner {
        width: 300px !important;
    }
    .nav-btn {
        width: 100%;
        display: block;
        margin: 6px 0 !important;
        padding: 6px 14px;
    }
    .logo-outer {
        width: 38px;
        height: 38px;
        border-radius: 6px;
        background-color: white;
        display: inline-block;
        vertical-align: middle;
    }
    .nav-btn span span {
        font-size: 18px;
        margin-left: 5px;
        position: relative;
        top: 2px;
    }
    .realTimeChart {
        position: absolute;
        top: 120px;
        right: 0;
        z-index: 2;
    }
    .query-position {
        text-align: left;
        margin-bottom: 20px;
    }
    .realActDiv{
        position: relative;
        padding-bottom: 10px;
        padding-top: 3px;
    }
    .realActTitleSpan{
        color:#2C3E50;
        font-size: 15px;
        font-weight: 500;
        margin-left: 17px
    }
    .realActSpan{
        color:rgba(37, 37, 37, 0.51);
        margin-left: 5px;
    }
    .marker-data {
        margin: 15px 0;
    }
    .marker-data .el-tag {
        width: 250px;
        height: 50px;
        padding: 12px 0px;
        font-size: 24px;
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
    }
    .marker-data .el-tag span{
        font-weight: bold;
    }
</style>

