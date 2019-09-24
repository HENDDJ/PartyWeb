<template>
    <section>
        <div id="allmap"></div>
    </section>
</template>

<script>
    export default {
        name: "CloudMap",
        data () {
            return {
                map: {},
                pContent:'',
                opts:{
                    boxStyle: {
                        // opacity: "0.8",
                        background: 'white',
                        width: "400px",
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
                videoUrl:'',
            }
        },
        methods: {
            initMap() {
                // 百度地图API功能
                this.map = new BMap.Map("allmap",{minZoom:11,maxZoom:20});    // 创建Map实例
                this.map.setMapStyle({style:'midnight'});
                this.map.centerAndZoom(new BMap.Point(119.172559, 31.92500), 11);  // 初始化地图,设置中心点坐标和地图级别
                this.map.disableDragging();
                //添加地图类型控件
               /* this.map.addControl(new BMap.MapTypeControl({
                    mapTypes: [
                        BMAP_NORMAL_MAP,
                        BMAP_HYBRID_MAP
                    ]
                }));*/
                this.map.setCurrentCity("镇江");          // 设置地图显示的城市 此项是必须设置的

                this.map.addEventListener("zoomend", ()=>{
                    if(this.map.getZoom()>11){
                        this.map.enableDragging();
                    }else{
                        this.map.centerAndZoom(new BMap.Point(119.172559, 31.92500),11);
                        this.map.disableDragging();
                    }

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
                        fillOpacity: 1,
                        strokeOpacity: 0.5
                    }); //建立多边形覆盖物
                //    self.map.addOverlay(ply1);
                    ply1.disableMassClear();

                    let count = rs.boundaries.length; //行政区域的点有多少个
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
                            strokeColor: "#1e3fa2",
                            strokeOpacity: 1,
                            fillColor: '#fff',
                            fillOpacity: "0.1"
                        }); //建立多边形覆盖物
                        self.map.addOverlay(ply);
                        ply.disableMassClear();
                    }
                });
            },
            //展示正在执行
            showWorking(){
                let allOverlay = this.map.getOverlays();
                if(allOverlay.length>4){
                    for (let i = 0; i < allOverlay.length; i++) {
                        if(allOverlay[i].ba){
                            allOverlay[i].enableMassClear();
                        }
                    }
                }
                this.map.clearOverlays();
                this.initMap();
                this.workingDataList();
                setInterval(()=>{
                    this.map.clearOverlays();
                    this.workingDataList();
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
                this.map.clearOverlays();
                //正在执行的活动
            //    let infoBox = new BMapLib.InfoBox(this.map,this.pContent,this.workingOpts );
                let workList = []
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
                          /*  let temp = { districtId: "1c8d1e35-cd63-4029-a20d-5f1a5766e54e",activityId: "60e9f56e-ff02-4a99-b57d-f1c6ab96f376",title:"一季度党员大会"}
                            this.resetSetItem('cloudPicture',JSON.stringify(temp));*/
                            this.resetSetItem('cloudPicture',JSON.stringify(workList[0].value[0]));
                      }
                  }
                  workList.forEach(res=>{
                      let marker = new BMap.Point(res.value[0].location.split(",")[0], res.value[0].location.split(",")[1]);
                      let myIcon = new BMap.Icon("/static/img/action.gif", new BMap.Size(50, 50));
                      let marker2 = new BMap.Marker(marker, {icon: myIcon});  // 创建标注
                      let label = new BMap.Label(res.value[0].districtName,{offset:new BMap.Size(-5,28)});
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
                      marker2.addEventListener('click', e => {
                          this.resetSetItem('cloudPicture',JSON.stringify(res.value[0]));
                          /*console.log(JSON.parse(localStorage.getItem("cloudPicture")),"1");*/
                            /*let temp = { districtId: "1c8d1e35-cd63-4029-a20d-5f1a5766e54e",activityId: "60e9f56e-ff02-4a99-b57d-f1c6ab96f376"}
                            this.resetSetItem('cloudPicture',JSON.stringify(temp));
                            console.log(JSON.parse(localStorage.getItem("cloudPicture")),"2");*/
                        });
                        this.map.addOverlay(marker2);
                        marker2.setLabel(label);
                    })

                }
            },
        },
        mounted() {
            this.initMap();
            this.showWorking();
        },
        created() {
            localStorage.removeItem('cloudPicture');
        }
    }
</script>

<style>

</style>
<style scoped>
    #allmap{
        width: 580px;
        height: 780px;
        overflow: hidden;
        margin:0;font-family:"微软雅黑";
    }

</style>


