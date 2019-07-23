<template>
    <section class="gis-map">
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
                videoUrl:'http://172.16.1.140:9391/vod/JTEDU0245492022.mp4',
            }
        },
        methods: {
            initMap() {
                // 百度地图API功能
                this.map = new BMap.Map("allmap");    // 创建Map实例
                this.map.centerAndZoom(new BMap.Point(119.172559, 31.92500), 11);  // 初始化地图,设置中心点坐标和地图级别
                //添加地图类型控件
                this.map.addControl(new BMap.MapTypeControl({
                    mapTypes: [
                        BMAP_NORMAL_MAP,
                        BMAP_HYBRID_MAP
                    ]
                }));
                this.map.setCurrentCity("镇江");          // 设置地图显示的城市 此项是必须设置的
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
                        fillColor:" #0d1736",
                        fillOpacity: 1,
                        strokeOpacity: 0.5
                    }); //建立多边形覆盖物
                    self.map.addOverlay(ply1);
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
            //展示正在执行
            showWorking(){
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
                setInterval(()=>{
                    this.map.clearOverlays();
                    this.workingDataList();
                },30000)

            },
            //展示正在执行内的封装方法
            workingDataList(){
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
                            localStorage.setItem("videoUrl", this.videoUrl);
                            console.log(this.videoUrl);
                            this.map.panTo(new BMap.Point(res.value[0].location.split(",")[0], res.value[0].location.split(",")[1]+0.001));
                            this.map.setZoom(13);
                            let path = 'identity/parCamera/redisIp?key='+res.value[0].organizationId;
                            this.$http('Get',path,false).then(data=>{
                                /*if(data){
                                    ip = data.ip;
                                    res.value.forEach(item=>{
                                        content =   "<div style='position: relative;padding-bottom: 10px;padding-top: 3px'><span style='color:#2C3E50;font-size: 15px;font-weight: 500;margin-left: 17px;'>任务名称：<span style='color:rgba(37, 37, 37, 0.51);margin-left: 5px'>"+item.title+"</span></span>" +
                                            "<span style='color:#2C3E50;font-size: 15px;font-weight: 500;right: 29px;position: absolute;;'>任务类型：<span style='color:rgba(37, 37, 37, 0.51);margin-left: 5px'>"+item.type+"</span></span>" +
                                            "</div>"+
                                            "<div style='position: relative;padding-bottom: 10px;'><span style='color:#2C3E50;font-size: 15px;font-weight: 500;margin-left: 17px;'>截止日期：<span style='color:rgba(37, 37, 37, 0.51);margin-left: 5px'>"+item.month+"</span></span>" +
                                            "</div>"+
                                            "<div style='position: relative;padding-bottom: 10px;'><span style='color:#2C3E50;font-size: 15px;font-weight: 500;margin-left: 17px;float:left;'>任务要求：</span><div style='color:rgba(37, 37, 37, 0.51);font-size: 15px;font-weight: 500;margin-left: 92px;'>"+item.context+"</div>" +
                                            "</div>"+
                                            "<div style='position: relative;;padding-bottom: 10px;'><span style='color:#2C3E50;font-size: 15px;font-weight: 500;margin-left: 17px;'>直播视频：</span>" +
                                            "</div>"+
                                            "<div style='position: relative;margin-left: 17px'>" +
                                            "<video class='tvhou' width='100%' height='100%'" +
                                            " controls='controls' autoplay='autoplay'" +
                                            " x-webkit-airplay='true' x5-video-player-fullscreen='true'" +
                                            " preload='auto' playsinline='true' webkit-playsinline" +
                                            " x5-video-player-typ='h5'>" +
                                            " <source type='application/x-mpegURL' src='"+ip+"'>" +
                                            "</video> "+
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
                                }*/

                            })
                        });
                        this.map.addOverlay(marker2);
                    })

                }
            },
        },
        mounted() {
            this.initMap();
            this.showWorking();
        }
    }
</script>

<style>

</style>
<style scoped>
    #allmap{
        width: 554px;
        height: 418px;
        overflow: hidden;
        margin:0;font-family:"微软雅黑";
    }

</style>


