<template>
    <section class="gis-map">
        <div id="allmap"></div>
        <nav class="nav">
            <ul>
                <li class="store" @click="leftWidth.width = '230px';flag = 1;showLeft=true;showParty()"><span class="books-icon"></span><a href="#" style="padding-left: 50px">党组织</a></li>
                <li class="movies" @click="leftWidth.width = '230px';flag = 2;showLeft=true;showBattleField()"><span class="store-icon"></span><a href="#" style="padding-left: 50px">基本阵地</a></li>
                <li class="working" @click="leftWidth.width = '230px';flag = 3;showLeft=false;showWorking()"><span class="working-icon"></span><a href="#" style="padding-left: 50px">执行任务中</a></li>
                <li class="working" @click="leftWidth.width = '230px';flag = 4;showLeft=false;showPeopleStream()"><span class="working-icon"></span><a href="#" style="padding-left: 50px">阵地实时人流量</a></li>
            </ul>
        </nav>
        <div class="leftList" :style="leftWidth" v-if="showLeft">
            <div class="leftClose" @click="leftWidth.width = '0px';showLeft=false;">

            </div>
            <div style="z-index: 99">
                <el-tree :data="leftData"  @node-click="handleNodeClick" ></el-tree>
            </div>
        </div>
        <div class="showLeftList" v-if="!showLeft&&flag!=3" @click="leftWidth.width = '230px';showLeft=true;">>>></div>
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
                <div  v-for="(item,index) in rightMessage.positionInformation">
                    <div class='block' style="margin-top: 2px"></div>
                    <div style="float: left;font-size: 17px">{{item.name}}</div><br>
                    <div style="font-size: 25px;text-align: left">
                        <el-tag style="margin-right: 200px" effect="plain" size="small">
                            <i class="el-icon-picture"style="margin-right: 5px;vertical-align: middle"/>
                            图片
                        </el-tag>
                    </div>
                    <div style="margin-top: 10px">
                        <viewer >
                            <img :src="item.pictures" v-if="item.pictures"
                                 style="width: 262px;height: 175px;">
                            <img src="/static/img/nodata.png" v-else
                                 style="width: 262px;height: 175px;">
                        </viewer>
                    </div>
                    <div style="font-size: 25px;text-align: left">
                        <el-tag style="margin-left: 15px" effect="plain" size="small">
                            <i class="el-icon-user-solid"style="margin-right: 5px;vertical-align: middle"/>
                            人流量统计图
                        </el-tag>
                    </div>
                    <div style="margin-top: 10px;width: 285px;height: 176px; border: 1px solid #c1c1c1;margin-left: 12px" :id='msgFloatRight.zIndex'>
                    </div>
                    <el-divider style="margin-top: 8px"></el-divider>
                </div>
            </vs-card>
            <el-dialog
                id="nnn"
                title="组织成员"
                visible.sync="true"
                width="580px"
                :before-close="closeMemberDialog">
                123
                <div slot="footer" class="dialog-footer">
                    <el-table
                        :data="memberData"
                        border
                        style="width: 100%">
                        <el-table-column
                            prop="name"
                            label="姓名"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="sex"
                            label="性别"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="nativePlace"
                            label="出生地"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="education"
                            label="学历"
                            width="180">
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        layout="prev, pager, next"
                        :page-count="pageable.total"
                        @current-change="currentPage"
                        @prev-click="prePage"
                        @next-click="nextPage"
                        hide-on-single-page="false">
                    </el-pagination>
                </div>
            </el-dialog>
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

        <div style="position: absolute;top:70px;right: 350px" v-if="flag==4">
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
    </section>
</template>

<script>
    import LookUp from '@/lookup';
    export default {
        name: "GISmap",
        data () {
            return {
                map: {},
                positionList:[],
                /* pointList:[
                     {label: '茅山村党员教育室', x: 119.302738, y: 31.797112},
                     {label: '宝华村党员教育室', x: 119.083573, y: 32.155268},
                     {label: '二圣村党员教育室', x: 119.195893, y: 31.86983},
                     {label: '古村党员教育室', x: 119.2061525, y: 31.82931},
                     {label: '城上村党员教育室', x: 119.185518, y: 31.992343},
                     {label: '莲塘村党员教育室', x: 119.139197, y: 31.997086},
                     {label: '马埂村党员教育室', x: 119.273542, y: 31.687244},
                     {label: '后塘村党员教育室', x: 119.140707, y: 32.027599},
                 ],
                 orgList:[
                     {label: '茅山村党支部', x: 119.302738, y: 31.797112},
                     {label: '宝华村党支部', x: 119.083573, y: 32.155268},
                     {label: '二圣村党支部', x: 119.195893, y: 31.86983},
                     {label: '古村党支部', x: 119.2061525, y: 31.82931},
                     {label: '城上村党支部', x: 119.185518, y: 31.992343},
                     {label: '莲塘村党支部', x: 119.139197, y: 31.997086},
                     {label: '马埂村党支部', x: 119.273542, y: 31.687244},
                     {label: '后塘村党支部', x: 119.140707, y: 32.027599},
                 ],
                 leaderList:[
                     {label: '沈海涛', x: 119.302738, y: 31.797112},
                     {label: '朱品兰', x: 119.083573, y: 32.155268},
                     {label: '唐金莲', x: 119.195893, y: 31.86983},
                     {label: '刘玲', x: 119.2061525, y: 31.82931},
                     {label: '丁璐', x: 119.185518, y: 31.992343},
                     {label: '王小斌', x: 119.139197, y: 31.997086},
                     {label: '巫诚', x: 119.273542, y: 31.687244},
                     {label: '朱倩', x: 119.140707, y: 32.027599},
                     {label: '贡彩霞', x: 119.211677, y: 32.021569},
                     {label: '吴正荣', x: 119.192597, y: 32.082439},
                     {label: '朱又专', x: 119.343567, y: 32.02349},
                     {label: '房贝林', x: 119.144667, y: 32.124599},
                     {label: '乔飞飞', x: 119.125817, y: 32.115599},
                     {label: '任玉生', x: 119.276697, y: 32.026439},
                     {label: '蒋振华', x: 119.187457, y: 32.137519},
                 ],*/
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
                    marginRight:'-315px',
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
                heatMapRange: []
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
                this.msgFloatRight.marginRight = '-315px'
            },
            posit(val){
                return `margin-top:${val*108}px;`;
            },
            initMap() {
                // 百度地图API功能
                this.map = new BMap.Map("allmap");    // 创建Map实例
                this.map.centerAndZoom(new BMap.Point(119.172559, 31.92500), 12);  // 初始化地图,设置中心点坐标和地图级别
                //添加地图类型控件
                this.map.addControl(new BMap.MapTypeControl({
                    mapTypes: [
                        BMAP_NORMAL_MAP,
                        BMAP_HYBRID_MAP
                    ]
                }));
                this.map.setCurrentCity("镇江");          // 设置地图显示的城市 此项是必须设置的
                this.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放a
                this.map.addControl(
                    new BMap.NavigationControl({
                        // 靠左上角位置
                        anchor: BMAP_ANCHOR_TOP_LEFT,
                        // LARGE类型
                        type: BMAP_NAVIGATION_CONTROL_LARGE,
                        // 启用显示定位
                    })
                );

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
                this.flag =2
                //阵地个数
                this.$http('post','identity/positionInformation/positionNumber?districtId=01',false).then((data)=>{
                    console.log(data)
                    this.positionNumber = data
                })

                this.openNotify('基本阵地是党组织开展活动的重要场所，是党员接受教育、发挥作用的重要平台，也是把党员和群众团结凝聚在党组织周围的重要物质依托。');
                this.msgFloatRight.marginRight = '-315px'
                let allOverlay = this.map.getOverlays();
                console.log(allOverlay)
                if(allOverlay.length>4){
                    for (let i = 0; i < allOverlay.length; i++) {
                        if(allOverlay[i].ba) {
                            allOverlay[i].enableMassClear();
                        }
                    };
                }

                this.map.clearOverlays();
                this.initMap();
                this.map.centerAndZoom(new BMap.Point(119.172559, 31.92500), 11);  // 初始化地图,设置中心点坐标和地图级别
                this.$http("POST",`identity/sysDistrict/list`,{districtLevel:2},false).then( data =>{
                    data.forEach(item => {
                            if(item.location) {
                                //定义镇名
                                this.zhenList.push(item.districtName);
                                let marker = new BMap.Point(item.location.split(",")[0], item.location.split(",")[1]);
                                let myIcon = new BMap.Icon("/static/img/house06.svg", new BMap.Size(50, 50));
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
                                let label = new BMap.Label(item.districtName,{offset:new BMap.Size(-5,28)});
                                label.setStyle({
                                    backgroundColor: '#ecf5ff',
                                display: 'inline-block',
                                height: '28px',
                                padding: '0 5px',
                                lineHeight: '26px',
                                fontSize: '13px',
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
                this.openNotify('此处显示电视端正在执行的任务');
                let allOverlay = this.map.getOverlays();
                if(allOverlay.length>4){
                    for (let i = 0; i < allOverlay.length; i++) {
                       if(allOverlay[i].ba){
                           allOverlay[i].enableMassClear();
                       }
                    };
                }
                this.map.clearOverlays();
                this.initMap();
                this.map.centerAndZoom(new BMap.Point(119.172559, 31.92500), 11);  // 初始化地图,设置中心点坐标和地图级别
                this.workingDataList();

            },
            //展示正在执行内的封装方法
            workingDataList(){
                this.flag = 3
                this.$http('Post','identity/parActivityObject/list',{isWorking:1},false).then(
                    (data)=>{
                        let orgId = []
                        data.forEach(item=>{
                            orgId.push(item.organizationId)
                        })
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
                let infoBox = new BMapLib.InfoBox(this.map,this.pContent,this.opts );
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
                                        "<div class='rowF'><div class='row'><label class='detailLabel'>设施</label><div class='detailText'>"+val.facilities+"</div></div><div style='position: relative;float: left;'><span class='tooltiptext'>"+val.facilities+"</span></div></div>" +
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
                                setTimeout(infoBox._setContent(this.pContent,infoBox.open(marker)),500)
                            });
                            this.map.addOverlay(marker);
                            let label = new BMap.Label(item.districtName,{offset:new BMap.Size(-8,28)});
                            label.setStyle({
                                backgroundColor: '#ecf5ff',
                                display: 'inline-block',
                                height: '24px',
                                padding: '0 8px',
                                lineHeight: '22px',
                                fontSize: '13px',
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
                let infoBox = new BMapLib.InfoBox(this.map,this.pContent,this.workingOpts );
                let workList = []
                if(ids){
                    ids.forEach(idItem=>{     //整合数据，解决一村都任务的情况
                        let idValue = {}
                        let values= []
                        value.forEach(valueItem=>{
                            if(idItem == valueItem.organizationId){
                                values.push(valueItem)
                            }
                        })
                        if(values){
                            idValue.id = idItem
                            idValue.value = values
                            workList.push(idValue)
                        }
                    })
                    console.log(workList)
                    workList.forEach(res=>{
                        let marker = new BMap.Point(res.value[0].location.split(",")[0], res.value[0].location.split(",")[1]);
                        let myIcon = new BMap.Icon("/static/img/working.gif", new BMap.Size(50, 50));
                        let marker2 = new BMap.Marker(marker, {icon: myIcon});  // 创建标注
                        let content = ''
                        let ip = '123'

                        let time = (res.value[0].modifiedAt.split('T')[0]+" "+res.value[0].modifiedAt.split('T')[1]).split('.')[0]
                        marker2.addEventListener('click', e => {
                            setTimeout(()=> {
                                this.map.panTo(new BMap.Point(res.value[0].location.split(",")[0], res.value[0].location.split(",")[1] + 0.001));
                            })
                                this.map.setZoom(13);
                            let path = 'identity/parPictureInfro/list';
                            this.$http('Post',path,{organizationId:res.value[0].districtId,studyContent:res.value[0].activityId},false).then(data=>{
                                let url = ''
                                    if(data[0].imageURL){
                                         url = data[0].imageURL
                                    }else {
                                        url='../../../static/img/nodata.png'
                                    }
                                res.value.forEach(item=>{
                                    content =   "<div style='position: relative;padding-bottom: 10px;padding-top: 3px'><span style='color:#2C3E50;font-size: 15px;font-weight: 500;margin-left: 17px;'>任务名称：<span style='color:rgba(37, 37, 37, 0.51);margin-left: 5px'>"+item.title+"</span></span>" +
                                        "<span style='color:#2C3E50;font-size: 15px;font-weight: 500;right: 29px;position: absolute;;'>任务类型：<span style='color:rgba(37, 37, 37, 0.51);margin-left: 5px'>"+item.type+"</span></span>" +
                                        "</div>"+
                                        "<div style='position: relative;padding-bottom: 10px;'><span style='color:#2C3E50;font-size: 15px;font-weight: 500;margin-left: 17px;'>截止日期：<span style='color:rgba(37, 37, 37, 0.51);margin-left: 5px'>"+item.month+"</span></span>" +
                                        "</div>"+
                                        "<div style='position: relative;padding-bottom: 10px;'><span style='color:#2C3E50;font-size: 15px;font-weight: 500;margin-left: 17px;float:left;'>任务要求：</span><div style='color:rgba(37, 37, 37, 0.51);font-size: 15px;font-weight: 500;margin-left: 92px;'>"+item.context+"</div>" +
                                        "</div>"+
                                        "<div style='position: relative;;padding-bottom: 10px;'><span style='color:#2C3E50;font-size: 15px;font-weight: 500;margin-left: 17px;'>直播截图：</span><span style='color:rgba(37, 37, 37, 0.51);font-size: 15px;float:right'>"+data[0].createdAt.split('T')[0]+' '+data[0].createdAt.split('T')[1]+"</span>" +
                                        "</div>"+
                                        "<div style='position: relative;margin-left: 17px'>" +
                                        // "<video class='tvhou' width='100%' height='100%'" +
                                        // " controls='controls' autoplay='autoplay'" +
                                        // " x-webkit-airplay='true' x5-video-player-fullscreen='true'" +
                                        // " preload='auto' playsinline='true' webkit-playsinline" +
                                        // " x5-video-player-typ='h5'>" +
                                        // " <source type='application/x-mpegURL' src='"+ip+"'>" +
                                        // "</video> "+
                                        "<img src="+url+" style='width:420px'>"+
                                        "</div>"
                                })

                                this.pContent =
                                    "<div class='infoBoxContent'>" +
                                    "<div class='infoBoxTitle' style='background-color:#255cc296 '><span class='text'>"+res.value[0].districtName+"</span>" +
                                    "<div class='system-field'><div class='title01'><img src='/static/img/active/party_build_active.png' class='zhen'><span>"+res.value[0].parentName+"</span></div><div class='title02' style='font-size:12px'><img src='/static/img/active/party_build_active.png' class='zhen'><span style='margin-right: 3px'>摄像头状态:<span class='minitor'>正常</span><img src='/static/img/active/party_build_active.png' class='zhen'>" +
                                    "<span>开始时间:<span style='background-color: #44ffd4ad;border-radius: 2px;margin-left: 2px;padding:0 5px'>"+time+"</span></span></div></div></div>"+
                                    "<div style='padding-top: 10px;overflow-y:scroll;OVERFLOW-X:hidden;max-height: 700px;width: 80%;margin: auto' class='flowWin'>"+content+
                                    "</div>"+
                                    "</div>";

                                setTimeout(infoBox._setContent(this.pContent,infoBox.open(marker2)),600)
                            })
                        });
                        this.map.addOverlay(marker2);
                    })
                }
            },
            //展示党组织镇级
            showParty() {
                this.flag = 1
                this.openNotify('党的基层组织是党在社会基层组织中的战斗堡垒，是党的全部工作和战斗力的基础。新形势下基层党组织工作开展的怎么样，直接影响到党的凝聚力、影响力、战斗力的充分发挥。');
                let allOverlay = this.map.getOverlays();
                if(allOverlay.length>4){
                    for (let i = 0; i < allOverlay.length; i++) {
                        if(allOverlay[i].ba){
                            allOverlay[i].enableMassClear();
                        }
                    };
                }
                this.map.clearOverlays();
                this.initMap();
                this.map.centerAndZoom(new BMap.Point(119.172559, 31.92500), 11);
                this.$http("POST",`identity/sysDistrict/list`,{districtLevel:2},false).then( data =>{
                    data.forEach(item => {
                        if(item.location) {
                            //定义镇名
                            this.zhenList.push(item.districtName);
                            let marker = new BMap.Point(item.location.split(",")[0], item.location.split(",")[1]);
                            let myIcon = new BMap.Icon("/static/img/partyFlag.svg", new BMap.Size(50, 50));
                            let marker2 = new BMap.Marker(marker, {icon: myIcon,name:123},{name:123});  // 创建标注
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
                                    "<div class='header'><div class='headerTitle'><img src='static/img/house06.svg' style='width: 20px;height: 20px'></img>"+item.districtName+"</div>" +
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
                                setTimeout(
                                    ()=>{
                                        let infoBox = new BMapLib.InfoBox(this.map,this.pContent,this.opts );
                                        infoBox._setContent(this.pContent,infoBox.open(marker2))},1200)
                            })
                            this.map.addOverlay(marker2);
                            marker2.disableMassClear();
                            let label = new BMap.Label(item.districtName,{offset:new BMap.Size(-5,28)});
                            label.setStyle({
                                backgroundColor: '#ecf5ff',
                                display: 'inline-block',
                                height: '28px',
                                padding: '0 5px',
                                lineHeight: '26px',
                                fontSize: '13px',
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
            //展示党组织村级
            setPartyMaker(val){
                this.map.clearOverlays();
                let infoBox = new BMapLib.InfoBox(this.map,this.pContent,this.opts );
                this.$http("POST",`identity/sysDistrict/list`,{attachTo:val},false).then( data =>{
                    data.forEach(item => {
                        if(item.location) {
                            let marker = new BMap.Marker(new BMap.Point(item.location.split(",")[0], item.location.split(",")[1]));
                            let content = ''
                            let type = item.districtType === 'Party'?'农村':'机关'
                            marker.addEventListener('click',()=>{
                                this.pContent =
                                    "<div class='infoBoxContent'>" +
                                    "<div class='header'><div class='headerTitle'><img src='static/img/house06.svg' style='width: 20px;height: 20px'></img>"+item.districtName+"</div>" +
                                    "<div>" +
                                    "<div style='display: inline-block' class='headerTwo'>所属组织:<sapn style='color: #8b8b8b'>"+item.parentName+"</sapn></div>" +
                                    "<div style='display: inline-block' class='headerThree'>组织类型:<sapn style='color: #8b8b8b'>"+type+"</sapn></div>" +
                                    "</div>" +
                                    "</div>"+
                                    "<div class='content'><div style='line-height: 20px;'>" +
                                    "<div style='display: inline-block;vertical-align: middle;margin: 8px 46px'>组织详情：</div><div class='member' onclick='document.getElementById("+'&quot;nnn&quot;'+").style.display="+'&quot;block&quot;'+";'><a href='##"+item.districtId+"'>组织成员</a></div></div>" +
                                    "<div  style='position: relative'><div class='blueBlock'></div><div class='blueBlockTop'></div><div class='contentDetail'>"+"暂无数据暂无数据暂无数据暂无数据暂无数据暂无数据暂无数据暂无数据"+
                                    "</div></div>"+
                                    "</div>"+
                                    "</div>";
                                setTimeout(()=>{
                                    this.map.panTo(item.location.split(",")[0],item.location.split(",")[1]);
                                },300)
                                setTimeout(infoBox._setContent(this.pContent,infoBox.open(marker)),500)

                            })
                            this.map.addOverlay(marker);
                            let label = new BMap.Label(item.districtName,{offset:new BMap.Size(-5,28)});
                            label.setStyle({
                                backgroundColor: '#c8ff4d',
                                display: 'inline-block',
                                height: '24px',
                                padding: '0 8px',
                                lineHeight: '22px',
                                fontSize: '13px',
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
                this.$http('POST', '/identity/sumPerHour/getHeatMapData', {
                    startTime: value[0],
                    endTime:  value[1]
                }).then(data => {
                    data.forEach(item => {
                        item.geometry = {
                            type: 'Point',
                            coordinates: item.location.split(',')
                        };
                        item.count = item.total
                    });

                    let dataSet = new mapv.DataSet(data);

                    let options = {
                        size: 15,
                        gradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)"},
                        max: 150,
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
            }

        },
        mounted() {
            this.getTreeData();
            this.initMap();
            window.addEventListener("hashchange",()=>{
                this.memberData = []
                if(window.location.hash.split("#").length-1>1){
                    this.tableDataDistrictId = window.location.hash.split("#")[2]
                    this.pageable.currentPage = 0
                    this.$http('Post','identity/parMember/page?page='+this.pageable.currentPage+'&size='+this.pageable.pageSize,{districtId:window.location.hash.split("#")[2]}).then((data)=>{
                        this.pageable.total = data.totalPages
                        this.memberData = data.content
                    })
                }
            });
        }
    }
</script>

<style>
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
    .store {
        background: #b3c833;
        width: 50px;
        height: 50px;
        margin-bottom: px;
    }
    .working{
        background: #c3cec1;
        width: 50px;
        height: 50px;
        margin-bottom: px;
    }
    .movies {
        background: #ce5043;
        width: 50px;
        height: 50px;
        margin-bottom: px;
    }

    .music {
        background: #fb8521;
        width: 50px;
        height: 50px;
        margin-bottom: px;
    }

    .books {
        background: #1aa1e1;
        width: 50px;
        height: 50px;
        margin-bottom: px;
    }

    .magazines {
        background: #5e5ca6;
        width: 50px;
        height: 50px;
        margin-bottom: px;
    }

    .devices {
        background: #658092;
        width: 50px;
        height: 50px;
        margin-bottom: px;
    }

    .store-icon {
        position: absolute;
        margin-left: -10px;
        padding-top: 12px;
    }
    .store-icon:before {
        width: 50px;
        height: 50px;
        margin-right: 30px;
        content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAA0UlEQVRIx+XWUQ2DMBCA4UpAAhIqAQmTgIRJqIRKqAQkIAEJSKiDfy+3rFm6wpWyJeySvnC0H1euBAOYbwzzE6gUQAcEIPKKCbCFOToIsAkQAAd4uRaBWytokQVtpspnrj8EAaNUMn7I95L3R6EJWDfeX/YeLTQD0wbkyCxQam9P+3A5yF0OuhcmRGBtBQ2FCXPS7lEBDVVQclDdTrAeejusoQbqNFAClh7QZg+ssqI9W2gOQdIUe7qwDpJtWhRdp4aifPe0oYZq4x+g6/1unTkek/bCyLhDiUMAAAAASUVORK5CYII=");
    }
    working-icon{
        position: absolute;
        margin-left: 10px;
        padding-top: 12px;
    }
    working-icon:before{
        width: 50px;
        height: 50px;
        margin-right: 30px;
        content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAANklEQVRIx2P4//8/Az0ww6hF1LCIVmCALWKAArJNxdQ/GnSjQTcadKNBNxp0wyLoRtsMI9wiAFADCXZf9dlZAAAAAElFTkSuQmCC");
    }
    .movies-icon {
        position: absolute;
        margin-left: 10px;
        padding-top: 12px;
    }
    .movies-icon:before {
        width: 50px;
        height: 50px;
        margin-right: 30px;
        content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAANklEQVRIx2P4//8/Az0ww6hF1LCIVmCALWKAArJNxdQ/GnSjQTcadKNBNxp0wyLoRtsMI9wiAFADCXZf9dlZAAAAAElFTkSuQmCC");
    }

    .music-icon {
        position: absolute;
        margin-left: 10px;
        padding-top: 12px;
    }
    .music-icon:before {
        width: 50px;
        height: 50px;
        margin-right: 30px;
        content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAABWklEQVRIx82W0Y2DMAxAGSEjZARGYARGYAQ2aDYoG7QbXDcoG8AGxwZlg3cf50i+NA2BRtVZCh/E8Usc23EFVJ8Yv58MAZpwJHT3gYAOuJGWEegOgYAWWNgnC9Bmg4AhYmQCzsBJjbP8D2XYBEUgF8Bu3J0VPS3XlyBxl5dH6rITwfJQNtonEGCAVUHq6oDI6b7Fzip2/4D6dyEKVquT9SFo9hNVAVEbn0PQCbhUhURsTmL3KRjGxO5cGH1yHy7mBTG+vAoGACOKRgx1OiEDY6uaawSq1xMLBqd8atRCp5MjAGnxuo2sn8Pk9SCdqKuKmDETNKgAWGNVwoNskGzeHbmgUfQJkt7GgqEvDOpTte6rEOi+VVRdIZD7NyBTCGRyHr6rKHc7QDf1zFxzX1gjdcqF/UJGwk6x06R6BquqQw6oFw/Yo11QrUM2mLurOftWu6VOVyc2YnP6uh+8uEodULzJQAAAAABJRU5ErkJggg==");
    }

    .books-icon {
        position: absolute;
        margin-left: -10px;
        padding-top: 12px;
    }
    .books-icon:before {
        width: 50px;
        height: 50px;
        margin-right: 30px;
        content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAA9klEQVRIx+3VYQ2DMBCGYSQgYRJwMCQgAQk4ACcgAQfgAAnMAXPw7sc+kqOjwBjjF5c0hGt7D21ILgCCM4abSIAaaPUsgFuwEsBNa+3e2AcVQASEQM40aiD2AJVZNwC55mKhH9AYlbAI6BywMEgKPM1cIzh0cC+ECqQq6J6u0BXbGE+ROfgqNEarr4z1xY3yD/MeaU3rqbEJGk+X4f+j5k6xC7IbtuQu6IIu6IJ2QAnvfnIUNKjmFDKNrDsA6lBnnoU0EQLlD1AJhKbePOR00OELaEDN0qmzDGmRbedLUAdEnhrrkHOVAdAbpFfubq9qFfr3OA16AcSstrz4r0qKAAAAAElFTkSuQmCC");
    }

    .magazines-icon {
        position: absolute;
        margin-left: 10px;
        padding-top: 12px;
    }
    .magazines-icon:before {
        width: 50px;
        height: 50px;
        margin-right: 30px;
        content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAA1klEQVRIx72WYQ3DIBBGkVAJSMDAEiQgoRIqAQmTMAmVgIRJqIQ5ePuxa8K6lgSyuy+5pAncfX1wvdQB7krABEQgAw+gAC9aSZ+8n3B1DuCBBViBjbbCkJG8+VF3oVqEqg7fbQQEKXqTovP+LImpVbiXaNezPrbD2ogujb53KRilwx0ULaO9dYscnxpRtCLKVkTeiihWRKrtPVkRTaNEF5Ph3KhqCF0iKdhN1Jh1TaOiPoJGjUaJshVRtiKarYiiFVEwITorWn1ffzdaZUMBkhtQ6y9IPd6TPeBqjeAP/QAAAABJRU5ErkJggg==");
    }

    .devices-icon {
        position: absolute;
        margin-left: 10px;
        padding-top: 12px;
    }
    .devices-icon:before {
        width: 50px;
        height: 50px;
        margin-right: 30px;
        content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAa0lEQVRIx2P4//8/Az0wusCC/5SDBAYowGcRVQDRFjGQCciyiBxfjFo0ci0C5TkBAqmQKhYZEKHmA8UWwdQQka9GLRq1aNSiUYtItYjYqpsii4gAB3BZhFyi47PoApEWgUplBShNVulNMwwA8TkerCj0FuMAAAAASUVORK5CYII=");
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
        top: 100%;
        margin-left: -20px;
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
        max-width: 100px;
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
       width: 18px;
        height: 18px;
        top:2px;
    }
    .infoBoxTitle .title02 .zhen{
        position: relative;
        width: 18px;
        height: 18px;
        top:2px;
    }
    .infoBox {
        animation: boxmove 500ms ease;
        background: #fff;
        border-radius: 3px;
        box-shadow: 2px 2px 10px rgba(51, 51, 51, 0.6);
        z-index: 99;
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
        min-height: 25px;
        overflow: hidden;
        /*border: 1px solid #EDEDED;*/
        /*border-bottom: none;*/
        clear: both;
        background: #FAFAFA;

    }
    .detailMore{
        position: absolute;
        right: -15px;
        top: 45px;
        color: #7bff50;
    }
    .detailMore:hover{
        cursor: pointer;
    }


    .detailLabel{
        display: inline-block;
        vertical-align: middle;
        width: 84px;
        padding: 7px 8px;
        color: #212121;
        font-size: 15px;
        /*border-right: 1px solid #EDEDED;*/
        background: #FAFAFA;
        line-height: 35px;
        margin-right: 15px;


    }
    .detailText{
        position: relative;
        text-align: left;
        margin-right: 20px;
        float: right;
        vertical-align: middle;
        width: 330px;
        line-height: 35px;
        padding: 7px 8px;
        font-size: 15px;
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
        width:250px;
        height: 579px;
        overflow-y:scroll;
        position: relative;
    }
    .gis-map .con-vs-card {
        width:330px !important;
        height: 682px  !important;
    }
    .closeBtnBg{
        transition: all 0.3s;
        position: absolute;right: 335px;top: 99px;
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
        height: 80px;
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
    }
    .headerTwo{
        font-size: 15px;
        margin-left: 25px;
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
        position: fixed;
        overflow-y:scroll;
        top: 350px;
        height: 50px;
        width: 50px;
        background: rgba(158, 204, 255, 0.3);
        transition: all 0.6s;
    }
    .leftList{
        position: fixed;
        overflow-y:scroll;
        top: 350px;
        height: 550px;
        background: rgba(158, 204, 255, 0.3);
        transition: all 0.6s;
    }
    .leftList::-webkit-scrollbar {
        width: 9px;
    }
    .leftClose{
        z-index: 1000;
        cursor: pointer;
        position: absolute;
        margin-top: 20px;
        margin-left: 180px;
        width: 25px;
        height:5px;
        background: black;
        transform: rotate(45deg);
        float: left;
    }
    .leftClose:before{
        content:'';
        display:block;
        width: 25px;
        height:5px;
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
        position: fixed;
        background: rgba(245, 245, 245, 0.95);
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
        -moz-box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
        -webkit-box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
        width: 200px;
        z-index: 1000;
        top: 100px;
        margin:30px 0 0 0px;
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
</style>

