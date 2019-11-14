<template>
    <section id="example-map">
        <div id="allmap"></div>
        <el-button type="text" @click="showTown" style="position: absolute; top: 120px; left: 800px">统计</el-button>
        <el-button type="text" @click="showWorking" style="position: absolute; top: 120px; left: 850px">实时活动</el-button>
    </section>
</template>

<script>
    export default {
        name: "CloudMap",
        data () {
            return {
                map: {},
                townFillColor:'',
                cunPointList:[],
                cunLabelList:[],
                townPointList:[],
                _point:{},
                _map:{},
                currentZhenPoint:{},
                attachToCache: new Map(),
                activityWorkList:[],
                _div:{},
            }
        },
        methods: {
            initMap() {
                // 百度地图API功能
                this.map = new BMap.Map("allmap", {minZoom: 11, maxZoom: 13});    // 创建Map实例
                this.map.setMapStyle({style: 'midnight'});
                this.map.centerAndZoom(new BMap.Point(119.254197,31.886684), 11);  // 初始化地图,设置中心点坐标和地图级别
                this.map.disableDragging();
                this.map.setCurrentCity("镇江");          // 设置地图显示的城市 此项是必须设置的
                this.map.addEventListener("zoomend", () => {
                    //地图缩放时，村的活动执行柱状图跟随坐标移动
                    if (this.map.getZoom() > 11) {
                        this.map.enableDragging();
                    } else {
                        this.map.centerAndZoom(new BMap.Point(119.254197,31.886684), 11);
                        this.map.disableDragging();
                    }
                    this.showCunPoint(this.currentZhenPoint);
                });
                this.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放

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
                        /* fillColor: "rgb(246,246,246)",*/
                        //    fillColor:" transprate",
                        fillOpacity: 0,
                        strokeOpacity: 0.5
                    }); //建立多边形覆盖物
                    ply1.disableMassClear();

                    let count = rs.boundaries.length; //行政区域的点有多少个
                    if (count === 0) {
                        alert('未能获取当前输入行政区域');
                        return;
                    }
                    for (let i = 0; i < count; i++) {
                        let ply = new BMap.Polygon(rs.boundaries[i], {
                            strokeWeight: 2,
                            strokeColor: "#2f84e8",
                            strokeOpacity: 1,
                            fillColor: '#fff',
                            fillOpacity: "0"
                        }); //建立多边形覆盖物
                        self.map.addOverlay(ply);
                        ply.disableMassClear();
                    }
                });
            },
              //展示正在执行
            showWorking(){
                if (this.timer) {
                    window.clearInterval(this.timer)
                }
             /*  // let allOverlay = this.map.getOverlays();
                this.activityWorkList.forEach(item=>{
                    this.map.removeOverlay(item);
                });
               /!* if(this.activityWorkList.length>0){
                    for (let i = 0; i < allOverlay.length; i++) {
                        if(allOverlay[i].ba){
                            allOverlay[i].enableMassClear();
                        }
                    }
                }*!/
                this.workingDataList();*/
                this.activityWorkList.forEach(item=>{
                    this.map.removeOverlay(item);
                });
                this.activityWorkList = [];
                this.$nextTick(()=>{
                    this.workingDataList();
                });
                this.timer = setInterval(()=>{
                    this.activityWorkList.forEach(item=>{
                        this.map.removeOverlay(item);
                    });
                    this.activityWorkList = [];
                    this.$nextTick(()=>{
                        this.workingDataList();
                    });
                },30000)
            },
            //展示正在执行内的封装方法
            workingDataList(){
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
            //定义正在执行maker
            setWorkingMaker(ids,value){
                //正在执行的活动
                let workList = [];
                if(ids){
                    ids.forEach(idItem=>{     //整合数据，解决一村都任务的情况
                        let idValue = {};
                        let values= [];
                        value.forEach(valueItem=>{
                            if(idItem == valueItem.organizationId){
                                values.push(valueItem);
                            }
                        });
                        if(values){
                            idValue.id = idItem;
                            idValue.value = values;
                            workList.push(idValue);
                        }
                    });
                    if(!localStorage.getItem('cloudPicture')){
                        if(workList.length>0){
                           // let temp = { districtId: "1c8d1e35-cd63-4029-a20d-5f1a5766e54e",activityId: "60e9f56e-ff02-4a99-b57d-f1c6ab96f376",title:"一季度党员大会"}
                           //  this.resetSetItem('cloudPicture',JSON.stringify(temp));
                            this.resetSetItem('cloudPicture',JSON.stringify(workList[0].value[0]));
                      }
                  }
                  workList.forEach(res=>{
                      let marker = new BMap.Point(res.value[0].location.split(",")[0], res.value[0].location.split(",")[1]);
                      let myIcon = new BMap.Icon("/static/img/action.gif", new BMap.Size(12, 12), {
                          imageSize: new BMap.Size(12, 12),
                          anchor: new BMap.Size(6, 10)
                      });
                      let marker2 = new BMap.Marker(marker, {icon: myIcon});  // 创建标注
                      let opts = {
                          height: 30,     // 信息窗口高度
                          title : "<h5>实时活动</h5>" , // 信息窗口标题
                      }
                      let msg = `<p style="font-size: 14px;color: green">${res.value[0].districtName}正在执行${res.value[0].title}...</p>`;
                      let infoWindow = new BMap.InfoWindow(msg, opts);
                      marker2.addEventListener("mouseover", function(){
                          this.map.openInfoWindow(infoWindow,marker); //开启信息窗口
                      });
                      marker2.addEventListener("mouseout", function(){
                          this.map.closeInfoWindow(infoWindow,marker); //开启信息窗口
                      });
                      marker2.addEventListener('click', e => {
                          this.resetSetItem('cloudPicture',JSON.stringify(res.value[0]));
                          // console.log(JSON.parse(localStorage.getItem("cloudPicture")),"1");*!/
                          //   let temp = { districtId: "1c8d1e35-cd63-4029-a20d-5f1a5766e54e",activityId: "60e9f56e-ff02-4a99-b57d-f1c6ab96f376"}
                          //   this.resetSetItem('cloudPicture',JSON.stringify(temp));
                          //   console.log(JSON.parse(localStorage.getItem("cloudPicture")),"2");
                        });
                        this.map.addOverlay(marker2);
                        this.activityWorkList.push(marker2);
                    })
                }
            },
            // 自定义覆盖物,point为添加覆盖物的点位置
            showTown() {
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
                        fillStyle: 'rgba(255, 50, 50, 0.6)',
                        minSize: 15,
                        maxSize: 40,
                        max: 40,
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
                        fillStyle: 'rgba(255,255,255,0.6)',
                        maxSize: 20,
                        max: 30,
                        draw: 'text'
                    };
                   let circleLayer = new mapv.baiduMapLayer(this.map, dataSet, circleOptions);
                   let labelLayer = new mapv.baiduMapLayer(this.map, dataSet, labelOptions);
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
                let temp = this.attachToCache.get(item.item.attachTo)
                if (temp) {
                    temp.forEach(subItem => {
                        let tempBar = document.getElementById("charts" + subItem.organizationId)
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
                            color: '#cde0f3',
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
                        color: '#cde0f3',
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
                            color: ["red","green"],
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

                                            ]
                                            return arr[params.dataIndex]
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
                        this._div.style.left = pixel.x -25 + "px";
                        this._div.style.top = pixel.y -80 + "px";
                    };
                    let myCompOverlay = new ComplexCustomOverlay(cunPoint);
                    this.map.addOverlay(myCompOverlay);
                    this.cunPointList.push(myCompOverlay);

                }
            },
        },
        mounted() {
            this.initMap();
            this.showTown();
            // this.showWorking();
        },
        created() {
            localStorage.removeItem('cloudPicture');
        }
    }
</script>

<style scoped>
    #allmap, #example-map {
        width: 100%;
        height: 100%;
        z-index: 2;
        overflow: hidden;
        margin:0;font-family:"微软雅黑";
    }
</style>
<style>
    #example-map .BMap_mask {
        /*background-image: radial-gradient(90deg, #000000, rgba(0, 0, 0, 0.8), rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.8), #000000) !important;*/
        background: radial-gradient(circle at 960px 700px,rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.7),rgba(0, 0, 0, 0.9), #000000) !important;
    }
</style>


