<template>
    <div class="map-location">
        <MapSearch v-if="!disabled" :map="map"></MapSearch>
        <div id="location-map"></div>
    </div>
</template>

<script>
    import MapSearch from '@/components/MapSearch';
    import locationIcon from '@/assets/location.png';
    export default {
        name: "MapLocation",
        props: {
            value: {
                type: String,
                default: ''
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        components: {
            MapSearch
        },
        data() {
            return {
                map: {},
                x: 0, //经度
                y: 0, //纬度
                currentPointMarker: null,
                top: 0
            }
        },
        methods: {
            initMap() {
                // 百度地图API功能
                this.map = new BMap.Map("location-map");    // 创建Map实例
                this.map.centerAndZoom(new BMap.Point(119.175002, 31.951788), 10);  // 初始化地图,设置中心点坐标和地图级别
                //添加地图类型控件
                this.map.addControl(new BMap.MapTypeControl({
                    mapTypes: [
                        BMAP_NORMAL_MAP,
                        BMAP_HYBRID_MAP
                    ]
                }));
                this.map.enableScrollWheelZoom(true);
                if (!this.disabled) {
                    this.map.addEventListener("click", this.located);
                }
                this.map.addEventListener("zoomstart", (e) => {
                    // this.top = document.getElementById('crud-dialog').scrollTop;
                    document.body.scrollTop = 0;
                    // document.getElementById('crud-dialog').style.height = '100%';
                    // document.getElementById('crud-dialog').scrollTop = 0;
                });
                this.map.addEventListener("zoomend", (e) => {
                    // document.getElementById('crud-dialog').scrollTop = this.top;
                });
            },
            initLocation() {
                if (this.value) {
                    this.x = this.value.split(',')[0];
                    this.y = this.value.split(',')[1];
                    this.currentPointMarker = new BMap.Marker(new BMap.Point(this.x, this.y), {icon: new BMap.Icon(locationIcon, new BMap.Size(32,32))});
                    this.map.addOverlay(this.currentPointMarker);
                    this.currentPointMarker.setAnimation(BMAP_ANIMATION_BOUNCE);
                }
            },
            located(e){
                if (this.currentPointMarker) {
                    this.map.removeOverlay(this.currentPointMarker);
                    this.currentPointMarker = '';
                }
                this.currentPointMarker = new BMap.Marker(e.point, {icon: new BMap.Icon(locationIcon, new BMap.Size(32,32))});
                this.map.addOverlay(this.currentPointMarker);
                this.currentPointMarker.setAnimation(BMAP_ANIMATION_BOUNCE);

                this.x = e.point.lng;
                this.y = e.point.lat;
                this.$emit('getValue', `${this.x},${this.y}`);
            }
        },
        mounted() {
            this.initMap();
            this.initLocation();
        }
    }
</script>

<style scoped>
    #location-map {
        width: 580px;
        height: 350px;
        border: 1px solid #e2ddd3;
        border-radius: 4px;
    }
</style>
