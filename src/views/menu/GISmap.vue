<template>
    <section>
        <el-select v-model="region" size="large" filterable placeholder="输入工程名以筛选" class="search-input" @change="queryProject">
            <el-option
                v-for="(item,index) in options"
                :key="index"
                :label="item.name"
                :value="item.name">
            </el-option>
        </el-select>
        <el-button size="large" plain class="search-input reset-button" @click="reset">重置</el-button>
        <div id="allmap"></div>
        <el-dialog
            title="工程信息"
            :visible.sync="dialogVisible"
            width="700px"
            align="left"
            :before-close="handleClose">
            <div style="position: relative;left: 65%;margin-top: -20px">
                <el-button type="text" @click="toDustView">查看扬尘数据</el-button>
                <el-button type="text" @click="toCameraView">查看视频监控</el-button>
            </div>
            <el-form :inline="true" :model="form" ref="form" class="demo-form-inline" label-width="110px">
                <el-form-item v-for="item in formColumns" :key="item.des" :label="item.des">
                    <el-input v-model="form[item.name]" v-if="item.type === 'string'" disabled></el-input>
                    <el-select v-model="form[item.name]" v-else-if="item.type === 'select'" disabled>
                        <el-option v-for="opItem in item.options" :value="opItem.value" :label="opItem.label" :key="opItem.value"></el-option>
                    </el-select>
                    <el-radio-group style="width: 178px" v-if="item.type === 'radio'" v-model="form[item.name]" disabled>
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                    <el-date-picker style="width: 178px" v-if="item.type === 'date'" v-model="form[item.name]" type="date"
                                    placeholder="选择日期" disabled>
                    </el-date-picker>
                </el-form-item>
            </el-form>
        </el-dialog>
    </section>
</template>

<script>
    export default {
        name: "GISmap",
        data () {
            return {
                form: {},
                formColumns: [
                    {
                        name: 'name',
                        des: '工程名',
                        type: 'string'
                    },
                    {
                        name: 'number',
                        des: '工程编号',
                        type: 'string',
                    },
                    {
                        name:'longitude',
                        des: '经度',
                        type: 'string'
                    },
                    {
                        name:'latitude',
                        des:'纬度',
                        type: 'string'
                    },
                    {
                        name:'department',
                        des:'部门',
                        type: 'string'
                    },
                    {
                        name:' responsibility',
                        des:'负责项目组',
                        type: 'string',
                    },
                    {
                        name:'address',
                        des:'地址',
                        type: 'string'
                    },
                    {
                        name:'investment',
                        des:'计划总投资',
                        type: 'string'
                    },
                    {
                        name:'licenseNumber',
                        des:'立项批准文号',
                        type: 'string'
                    },
                    {
                        name:'type',
                        des:'工程类别',
                        type: 'string'
                    },
                    {
                        name:'isHazard',
                        des:'是否是可能存在重大危险源',
                        type:'radio'
                    },
                    {
                        name:'isFormwork',
                        des:'是否是模板工程',
                        type:'radio'
                    },
                    {
                        name:'isDeepExcavation',
                        des:'是否是深基坑',
                        type:'radio'
                    },
                    {
                        name:'property',
                        des:'建设性质',
                        type: 'string'
                    },
                    {
                        name:'size',
                        des:'工程规模',
                        type: 'string'
                    },
                    {
                        name:'license',
                        des:'建设用地许可证',
                        type: 'string'
                    },
                    {
                        name:'sourcesFunds',
                        des:'资金来源',
                        type: 'string'
                    },
                    {
                        name:'startTime',
                        des:'开始时间',
                        type: 'date'
                    },
                    {
                        name:'endTime',
                        des:'结束时间',
                        type: 'date'
                    }
                ],
                options: [],
                region: '',
                dialogVisible: false,
                markers: [],
                map: {},
                markerClusterer: {},
                optionsCopy: {}
            }
        },
        methods: {
            toDustView() {
                this.$store.commit('getProjectId', this.form.id);
                this.$router.push({path: '/siteSupervision/environmentData'});
            },
            toCameraView() {
                this.$store.commit('getProjectName', this.form.name);
                this.$router.push({path: '/siteSupervision/actualMonitor'});
            },
            reset() {
                this.region = '';
                this.initMap()
            },
            addOverlays(arr) {
                this.markers = [];
                arr.forEach( item => {
                    let marker = new BMap.Marker(new BMap.Point(item.longitude, item.latitude)); // 创建点
                    // let label = new BMap.Label(item.name, {offset:new BMap.Size(10,10)});
                    // marker.setLabel(label);
                    marker.addEventListener("click", () => {
                        this.showProjectInfo(item)
                    });
                    this.markers.push(marker);
                });
                this.markerClusterer = new BMapLib.MarkerClusterer(this.map, { markers: this.markers });
            },
            queryProject(name) {
                if (!this.region) {
                    return;
                }
                let arr = this.optionsCopy.filter(item => item.name == name);
                this.map.clearOverlays();
                this.markerClusterer.clearMarkers(this.markers);
                this.addOverlays(arr);
                if (arr.length <= 0) {
                    return;
                }
                this.map.centerAndZoom(new BMap.Point(arr[0].longitude,arr[0].latitude), 16);
            },
            handleClose(done) {
                this.dialogVisible = false;
                done()
            },
            initMap() {
                // 百度地图API功能
                this.map = new BMap.Map("allmap");    // 创建Map实例
                this.map.centerAndZoom(new BMap.Point(119.175002,31.951788), 12);  // 初始化地图,设置中心点坐标和地图级别
                //添加地图类型控件
                this.map.addControl(new BMap.MapTypeControl({
                    mapTypes:[
                        BMAP_NORMAL_MAP,
                        BMAP_HYBRID_MAP
                    ]}));
                this.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
                this.$http('post','/identity/projectInfo/list', false).then(
                    data => {
                        this.options = data;
                        this.optionsCopy = JSON.parse(JSON.stringify(this.options));
                        this.addOverlays(data);
                    }
                );
                //最简单的用法，生成一个marker数组，然后调用markerClusterer类即可。
            },
            showProjectInfo(row) {
                this.dialogVisible = true;
                this.form = row;
            }
        },
        mounted() {
            this.initMap();
        }
    }
</script>

<style>
    #allmap {
        width: 100%;
        height: 610px;
    }
    .search-input {
        position: absolute !important;
        z-index: 2000;
        top: 80px;
        left: 230px;
    }
    .reset-button {
        left: 460px;
    }
</style>
<style>
    .el-dialog__body {
        padding: 10px 20px !important;
    }
</style>
