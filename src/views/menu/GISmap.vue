<template>
    <section>
        <div id="allmap"></div>
        <nav class="nav">
           <!-- <ul>
                <li class="store" @click="showBattleField()"><span class="store-icon"></span><a href="#">基本阵地分布图</a></li>
                <li class="movies" @click="showPapo()"><span class="movies-icon"></span><a href="#">各阵地人流量气泡图</a></li>
                <li class="books" @click="showChild()"><span class="books-icon"></span><a href="#">各支部分布图</a></li>
                <li class="music" @click="showPapo()"><span class="music-icon"></span><a href="#">各阵地活动次数柱状图</a></li>
                <li class="books" @click="showLeader()"><span class="books-icon"></span><a href="#">村干部分布图</a></li>
            </ul>-->
            <ul>
                <li class="store" @click="showChild()"><span class="books-icon"></span><a href="#">党组织</a></li>
                <li class="movies" @click="showBattleField()"><span class="store-icon"></span><a href="#">基本阵地</a></li>
            </ul>
        </nav>
        <div id="census" onclick="toggleDiv('')">
            <img src="/static/img/test.png" height="472" width="670" />
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
                        width: "350px",
                        height: "300px"
                    },
                    closeIconUrl:"/static/img/close.png",
                    closeIconMargin: "5px 5px 0 0",
                    enableAutoPan: true,
                    align: INFOBOX_AT_TOP,
                },
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
                        fillColor: "rgb(246,246,246)",
                        fillOpacity: 0.8,
                        strokeOpacity: 0.5
                    }); //建立多边形覆盖物
                    self.map.addOverlay(ply1);

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
                    }
                    for (let i = 0; i < count; i++) {
                        let ply = new BMap.Polygon(rs.boundaries[i], {
                            strokeWeight: 3,
                            strokeColor: "#ff0000",
                            strokeOpacity: 0.8,
                            fillColor: '#fff',
                            fillOpacity: "0.1"
                        }); //建立多边形覆盖物
                        self.map.addOverlay(ply)
                    }
                });
            },
            //展示基本阵地点位
            showBattleField() {
               /* if (this.mapvLayer) {
                    this.mapvLayer.hide();
                }
                this.clearBattleField();
                this.pointList.forEach( item =>  {
                     var marker = new BMap.Marker(new BMap.Point(item.x, item.y));
                    this.markerList.push(marker);
                    marker.addEventListener('click', function (e) {
                        this.openInfo(item.label,e);
                        this.toggleDiv("show");
                    });
                    this.map.addOverlay(marker);
                 });*/
               var infoBox = new BMapLib.InfoBox(this.map,this.pContent,this.opts );
               this.$http("POST",`identity/gis/positionlist`,false).then( data =>{
                   data.forEach(item => {
                       if(item.positionLonLat){
                           let marker = new BMap.Marker(new BMap.Point(item.positionLonLat.split(",")[0],item.positionLonLat.split(",")[1]));
                           marker.addEventListener('click', e => {
                               let title= LookUp['PositionType'].filter(sub => sub.value === item.positionType)[0].label;
                               this.pContent =
                                   "<div class='infoBoxContent'>" +
                                   "<div class='infoBoxTitle'>"+title+"</div>"+
                                   "<div style='padding: 10px;'><p>&nbsp;&nbsp;&nbsp;名&nbsp;&nbsp;称&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;"+item.positionName+"</p>" +
                                   "<p>&nbsp;&nbsp;所属组织&nbsp;&nbsp;:&nbsp;&nbsp;"+item.positionDistrictName+"</p>"+
                                   "<p>村干部数量&nbsp;:&nbsp;&nbsp;"+item.positionCadresNumber+"</p>"+
                                   "<p>&nbsp;&nbsp;村&nbsp;书&nbsp;记&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;"+item.positionCadreName+"</p>"+
                                   "<p>&nbsp;&nbsp;功能介绍&nbsp;&nbsp;:&nbsp;&nbsp;"+item.positionIntroduction+"</p></div>"+
                                   "</div>";
                               infoBox._setContent(this.pContent,infoBox.open(marker));
                           });
                           this.map.addOverlay(marker);
                       }
                   })
               });
            },
            clearBattleField() {
                this.markerList.forEach( item => {
                    this.map.removeOverlay(item);
                })
            },
            showPapo() {
                this.clearBattleField();
                if (this.mapvLayer) {
                    this.mapvLayer.hide();
                }
                let data = [];
                this.pointList.forEach( item => {
                    data.push({
                        geometry: {
                            type: 'Point',
                            coordinates: [item.x, item.y]
                        },
                        count: Math.random() * 100
                    });
                });
                var dataSet = new mapv.DataSet(data);
                var options = {
                    fillStyle: 'rgba(255, 50, 50, 0.6)',
                    maxSize: 20,
                    max: 100,
                    draw: 'bubble'
                }

                this.mapvLayer = new mapv.baiduMapLayer(this.map, dataSet, options);
            },
            showChild() {
                if (this.mapvLayer) {
                    this.mapvLayer.hide();
                }
                this.clearBattleField();
                var icon = new BMap.Icon('./zheng.png', new BMap.Size(30, 30));
                this.orgList.forEach( item => {
                    var marker = new BMap.Marker(new BMap.Point(item.x, item.y),{icon: icon});
                    marker.addEventListener('click', function (e) {
                        this.openInfo(item,e);
                     });
                    this.markerList.push(marker);
                    this.map.addOverlay(marker);
                });
            },
            showLeader() {
                if (this.mapvLayer) {
                    this.mapvLayer.hide();
                }
                this.clearBattleField();
                var icon = new BMap.Icon('./dangy.png', new BMap.Size(30, 30));
                this.leaderList.forEach( item => {
                     var marker = new BMap.Marker(new BMap.Point(item.x, item.y),{icon: icon});
                     this.markerList.push(marker);
                    this.map.addOverlay(marker);
                });
            },
            openInfo(content,e){
                let p = e.target;
                let point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
                let infoWindow = new BMap.InfoWindow(content,this.opts);  // 创建信息窗口对象
                this.map.openInfoWindow(infoWindow,point); //开启信息窗口
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
            this.initMap();
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
        padding: 10px;
        width: 100%;
        height:40px;
        font-size: 16px;
        background-color: #ffbe3c;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
    }
    .infoBox {
        border-radius: 12px;
        box-shadow: 1px 1px 1px 1px rgba(167,167,167,0.2);
    }
    .infoBox:after{
        /* content: "";
         box-shadow: 80px 10px 5px #888888;
       !*  transform:rotate(40deg);
        transform-origin: bottom center;*!*/
        content: "";
        position: absolute;
        bottom: -30px;
        left: 10px;
        width: calc(0.5 * 1144px);
        height: calc(0.5 * 370px);
        background-size: contain;
        background: url("/static/img/iws3.png") no-repeat;
   //   background-color: rgba(167,167,167,0.5);
     //   -moz-box-shadow: 10px 10px 10px 10px rgba(0,0,0,0.3);
    //  box-shadow: 10px 0px 5px  rgba(167,167,167,0.5),10px 0px 5px  rgba(167,167,167,0.5),0px -10px 5px  rgba(167,167,167,0.5),0px 10px 5px  rgba(167,167,167,0.5);
     //   transform: skewX(130deg);
        z-index: -1;
      //  transform-origin: bottom center;
    }

</style>
<style scoped>
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
        z-index: 8888;
        top: 100px;
        top: 100px;
        left: 30px;
        margin:30px 0 0 200px;
    }

</style>

