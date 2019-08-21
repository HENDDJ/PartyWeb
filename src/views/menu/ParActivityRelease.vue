<template>
    <div>
    <div class="el-loading" v-if="isVisible">
        <div class="load">
            <a style="color: #409EFF">数据上传中，请稍后</a>
            <Spinner name="line-scale-pulse-out-rapid" color="#7cff66"/>
            <div></div>
        </div>
    </div>
    <div style="display: flex">

        <div class="activity-release">
            <div class="topCard">
                <el-card style="height:100%;text-align: left" class="titleCard">
                    <p style="color: white;font-size: 20px;margin-top:-5px;">任务发布</p>
                    <a style="color: hsla(0,0%,100%,.62);;margin-top:6px;position: absolute;font-size: 14px;">完成任务基本信息</a>
                </el-card>
            </div>
            <el-card style="margin-top: -50px;min-height: 700px;">
                <div>
                    <el-form :inline="true" :model="form" ref="form" class="demo-form-inline" align="left"
                             label-width="170px" id="labelOne" :rules="rules">
                        <el-row>
                            <div>&nbsp;</div>
                        </el-row>
                        <el-row>
                            <div>&nbsp;</div>
                        </el-row>
                        <el-row>
                            <div>&nbsp;</div>
                        </el-row>
                        <el-row>
                            <div>&nbsp;</div>
                        </el-row>
                        <el-row style="margin: 10px 0">
                            <el-col :span="10">
                                <el-form-item label="任务分类" prop="taskType">
                                    <vs-radio color="success" v-model="form.taskType" vs-value="Party">党建任务</vs-radio>
                                    <vs-radio color="success" v-model="form.taskType" vs-value="DistLearning"
                                              disabled="true">远教任务
                                    </vs-radio>
                                    <!--<vs-checkbox icon="flag" color="danger"   v-model="form.taskType" vs-value="Party">党建任务</vs-checkbox>-->
                                    <!--<vs-checkbox icon="cast" color="success" v-model="form.taskType" vs-value="DistLearning">远教任务</vs-checkbox>-->
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row style="margin: 10px 0">
                            <el-col :span="11">
                                <el-form-item label="任务名称" prop="title">
                                    <el-input v-model="form.title" :disabled=disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="11">
                                <el-form-item label="任务类型" prop="type">
                                    <el-input v-model="form.type" :disabled=disabled></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row style="margin: 10px 0">
                            <el-col :span="11">
                                <el-form-item label="截止时间" prop="monVal">
                                    <el-date-picker
                                        v-model="monVal"
                                        type="date"
                                        placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="11">
                                <el-form-item label="任务分值" prop="score">
                                    <el-input-number v-model="form.score" label="分值"
                                                     style="width: 200px"></el-input-number>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row style="margin: 10px 0">
                            <el-col :span="11">
                                <el-form-item label="上传文件" prop="fileUrls">
                                    <CommonFileUpload :value="form.fileUrls"
                                                      @getValue="form.fileUrls = $event"></CommonFileUpload>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row style="margin: 10px 0">
                            <el-col>
                                <el-form-item label="工作要求" prop="context">
                                    <el-input v-model="form.context" type="textarea" style="width:340px"
                                              :disabled=disabled :rows="4"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row style="margin: 10px 0">
                            <el-col :span="11">
                                <!--<el-form-item label="任务对象" prop="taskObject">-->
                                <!--<el-tree-->
                                <!--:props="props"-->
                                <!--ref="tree"-->
                                <!--:load="loadNode"-->
                                <!--lazy-->
                                <!--show-checkbox-->
                                <!--v-model="form.taskObject"-->
                                <!--@check="ss">-->
                                <!--</el-tree>-->
                                <!--</el-form-item>-->
                                <el-form-item label="任务对象" prop="newObject" class="is-required">
                                    <vs-checkbox v-model="form.newObject.countryside">农村</vs-checkbox>
                                    <vs-checkbox v-model="form.newObject.office">机关</vs-checkbox>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row style="margin: 10px 0">
                            <el-col :span="20">
                                <el-form-item label="上传视频" prop="video" v-if="addVideo">
                                    <el-transfer
                                        filterable
                                        v-model="form.video"
                                        :titles="['可选视频', '已选视频']"
                                        :props="{key: 'value',label: 'desc'}"
                                        :data="addVideoList">
                                    </el-transfer>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row style="margin-top: -52px;text-align: right;">
                            <el-col :span="10">
                                <div>&nbsp;</div>
                            </el-col>
                            <el-col :span="11" style="margin-top: 40px">
                                <br>
                                <el-form-item label=" ">
                                    <el-button type="primary" @click="submit('form')" size="large">
                                        <icon name="release" scale="2"
                                              style="margin-left: 0px;position:relative;vertical-align: middle"></icon>
                                        <a style="display: inline-block">发 布</a>
                                    </el-button>
                                    <el-button type="warning" @click="reWrite()" size="large">
                                        <icon name="reWrite" scale="2"
                                              style="margin-left: 0px;position:relative;vertical-align: middle"></icon>
                                        <a style="display: inline-block">重 置</a>
                                    </el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </el-card>

        </div>
        <div class="messageRight">
            <div class="topCardRight">
                <el-card style="height:100%;text-align: left" class="titleCard">
                    <p style="color: white;font-size: 20px;margin-top:-5px;">已发布任务</p>
                    <a style="color: hsla(0,0%,100%,.62);;margin-top:6px;position: absolute;font-size: 14px;">详细信息请到活动管理</a>
                </el-card>
            </div>
            <el-card style="height: 500px; margin-top: -50px;padding:50px 0;text-align: left;overflow: hidden">
                <div id="inner" class="inner-container" style="width: 100%" :style="scroll" ref="scl">
                        <div style="background-color: #ecf5ff;;border-radius: 4px;width: 100%;padding: 5px 0 5px 3px;margin-bottom: 8px" v-for="item in actiityList">
                            <el-tooltip :content="item.title" placement="left" v-if="item.title.length>=14">
                                <p style="font-size: 18px;padding: 5px 0 5px 3px">{{item.title.substring(0,13)}}...</p>
                            </el-tooltip>
                            <p style="font-size: 18px;padding: 5px 0 5px 3px" v-else>{{item.title}}</p>

                            <a style="display: inline-block;font-size: 14px;padding: 1px 0 1px 3px;width: 122px">任务类型:
                                <el-tooltip :content="item.type" placement="top" v-if="item.type.length>4">
                                    <span style="color: rgba(37, 37, 37, 0.51);padding-left: 3px;font-size: 13px;">
                                        {{item.type.substring(0,3)}}...
                                    </span>
                                </el-tooltip>
                                <span style="color: rgba(37, 37, 37, 0.51);padding-left: 3px;font-size: 13px;" v-else>
                                    {{item.type}}
                                </span>
                            </a>
                            |
                            <a style="display: inline-block;font-size: 14px;padding: 1px 0 1px 0px">截止日期:
                                <el-tooltip :content="item.month" placement="top" v-if="item.month">
                                    <span style="color: rgba(37, 37, 37, 0.51);padding-left: 3px;font-size: 13px;">
                                        {{item.month}}
                                    </span>
                                </el-tooltip>
                                <span style="color: rgba(37, 37, 37, 0.51);padding-left: 3px;font-size: 13px;" v-else>
                                    暂无
                                </span>
                            </a>
                        </div>
                    </div>
            </el-card>
        </div>
    </div>
    </div>
</template>

<script>
    import CommonFileUpload from '@/components/FileUpLoad';

    export default {
        name: "ParActivityRelease",
        data() {
            let validatePass = (rule, value, callback) => {
                if (!value.countryside && !value.office) {
                    callback(new Error('请选择对象'));
                } else {
                    callback();
                }
            }
            return {
                queryForm: {taskType: ''},
                form: {
                    taskObject: {
                        id: '',
                        label: '',
                        children: '',
                    },
                    taskType: 'Party',
                    score: 10,
                    newObject: {countryside: true, office: false}
                },
                props: {
                    id: 'id',
                    label: 'label',
                    children: 'children',
                    isLeaf: 'leaf'
                },
                loading: false,
                addVideo: false,
                apiRoot: '/identity/parActivity',
                checkboxGroup: 'Party',
                options: [],
                //视频添加
                addVideoList: [],
                chooseType: '',
                disabled: false,
                dialogVisible: false,
                title: '任务发布',
                //行数据
                row: {},
                monVal: '',
                count: 1,
                activeNames: ['1'],
                videoColl: '点击隐藏',
                isVisible: false,
                rules: {
                    title: [{required: true, message: '请输入任务名称', trigger: 'blur'}],
                    type: [{required: true, message: '请输入任务类型', trigger: 'blur'}],
                    newObject: [{validator: validatePass, trigger: 'blur'}]
                },
                actiityList:[],
                scroll:{
                    marginTop:'0px'
                }

            }
        },
        watch: {
            'form.taskType': {
                handler: function (newVal, oldVal) {
                    this.radioChoose(newVal);
                }
            },
            'actiityList': {
                handler: function (newVal, oldVal) {
                    if(newVal.length>0){
                        let height = this.actiityList.length*70
                        let time = (this.actiityList.length-6)*2000
                        this.scroll.marginTop = `-${height}px`
                        this.scroll.transition = `${this.actiityList.length*2}s`
                        setInterval(()=>{
                            if(this.scroll.marginTop == `-${height}px`){
                                this.scroll.marginTop = `0px`;
                                this.scroll.transition = `0s`;
                                setTimeout(()=>{
                                    this.scroll.marginTop = `-${height}px`
                                    this.scroll.transition = `${this.actiityList.length*2}s`
                                },500)

                            }else{
                                this.scroll.marginTop = `-${height}px`
                                this.scroll.transition = `${this.actiityList.length*2}s`
                            }
                        },time)
                    }
                }
            }

        },
        components: {
            CommonFileUpload,
        },
        methods: {

            reWrite() {
                this.form = {taskType: 'Party', score: 10, newObject: {countryside: true, office: false}}
                // this.$refs.tree.setChecked([]);
            },
            //给taskObject赋值
            ss() {
                var ids = {sid: [], zid: [], cid: []}
                this.$refs.tree.getCheckedNodes().forEach(item => {
                    console.log(item.id)
                    if (item.id.length == 2) {
                        ids.sid.push(item.id)
                    }
                    if (item.id.length == 4) {
                        ids.zid.push(item.id)
                    }
                    if (item.id.length == 6) {
                        ids.cid.push(item.id)
                    }
                })
                this.form.taskObject = ids


            },
            loadNode(node, resolve) {
                if (node.level === 0) {
                    return resolve([{id: '01', label: '句容市委', children: []}]);
                }
                this.$http('GET', `/identity/sysDistrict/${node.data.id}tree`, false).then((data) => {
                    return resolve(data);
                })
            },
            //加载视频数据
            loadVideo() {
                this.$http('GET', '/identity/distLearningActivityVideo/videoList', {}, false).then(
                    (data) => {
                        this.addVideoList = data.map(item => {
                            return {
                                desc: item.name,
                                value: '{"name":"' + item.name + '","lengthOfTime":"' + item.length + '","videoUrl":"' + item.playUrl + '","videoCover":"' + item.posterUrl + '"}'
                            }
                        })

                    }
                ).catch((res) => {
                    console.log(res)
                    this.$message({
                        type: 'warning',
                        message: '视频信息拉取失败'
                    })
                })
            },
            //选择radio时触发
            radioChoose(val) {
                if (val == 'Party') {
                    this.addVideo = false
                } else {
                    this.addVideo = true
                    this.loadVideo();
                }

            },
            submit(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.isVisible = true
                        this.form.districtID = JSON.parse(sessionStorage.getItem('userInfo')).sysDistrict.districtId
                        this.form.status = '0'
                        this.form.month = this.monVal
                        this.form.releaseTime = new Date().Format("yyyy-MM-ddTHH:mm:ss");
                        if (this.form.fileUrls) {
                            var ss = this.form.fileUrls.toString().split(",")
                            this.form.fileUrls = ss
                        }
                        if (this.form.video) {
                            var video = this.form.video
                            var videoList = []
                            video.forEach(item => {
                                videoList.push(JSON.parse(item))
                            })
                            this.form.video = videoList
                        }
                        console.log(this.form)
                        this.$http('Post', '/identity/parActivity/', this.form, false).then(
                            (data) => {
                                setTimeout(() => {
                                    this.isVisible = false
                                }, 1000)
                                this.$message({
                                    type: 'success',
                                    message: '上传成功'
                                });
                                this.$refs[form].resetFields();
                                this.form = {
                                    taskType: 'Party',
                                    score: 10,
                                    newObject: {countryside: true, office: false}
                                };
                                this.dialogVisible = false;
                            }).catch(res => {
                            this.dialogVisible = true;
                            this.isVisible = false
                            this.$message({
                                type: 'error',
                                message: '上传文件失败'
                            });
                            return false;
                        });
                    } else {

                    }
                })
            },
            handleChange() {
                if (this.videoColl == '点击隐藏') {
                    this.videoColl = '点击展开'
                } else {
                    this.videoColl = '点击隐藏'
                }
            },
            //发布的活动信息
            getActivity(){
                this.$http('Post','/identity/parActivity/listAll',false).then(data=>{
                    this.actiityList = data
                }).catch(_=>{
                    this.$messgae(
                        {
                            type:'warning',
                            message:'活动数据拉取失败，请检查网络'
                        }
                    )
                })
            },

        },
        mounted(){

        },
        created() {
            this.getActivity();
        },
    }
</script>

<style>
    .footer-position {
        margin-right: -120px;
    }

    .el-checkbox.is-bordered.el-checkbox--mini {
        padding: 5px 15px 5px 10px !important;
        margin-left: 10px;
    }

    .el-pagination__sizes .el-input--mini .el-input__inner {
        width: 120px !important;
    }

    .el-pagination__sizes .el-select {
        width: 120px !important;
    }

    .self-btn {
        width: 56px !important;
        height: 28px !important;
        border-radius: 5px !important;
    }

    .self-add {
        background: url('../../../static/img/add.png') !important;
        background-size: cover !important;
    }

    #vd .el-checkbox__inner {
        margin-left: -100px !important;
    }

    #labelOne .el-form-item__label {
        font-weight: bold;
        font-size: 16px !important;
    }

    .el-loading {
        position: absolute;
        z-index: 10000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: .5;
        background: #000;
        background-image: initial;
        background-position-x: initial;
        background-position-y: initial;
        background-size: initial;
        background-repeat-x: initial;
        background-repeat-y: initial;
        background-attachment: initial;
        background-origin: initial;
        background-clip: initial;
        background-color: rgb(0, 0, 0);

    }

    .load {
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        -o-transform: translateY(-50%);
        transform: translateY(-50%);
        -webkit-transform: translateX(-50%);
        -ms-transform: translateX(-50%);
        -o-transform: translateX(-50%);
        transform: translateX(-50%);
    }

    .activity-release {
        flex: 2;
        position: relative;
        z-index: 0;
        margin-right: 30px;
    }

    .activity-release .file-upload {
        width: 200px !important;
    }

    .activity-release .el-tree {
        padding-top: 5px;
        width: 200px !important;
        border: 1px solid #DCDFE6 !important;
        background: #fff !important;
        border-radius: 3px;
    }

    @media screen and (max-width: 1430px) {
        .activity-release {
            width: 100%;
        }
    }

    .topCard {
        width: 95%;
        margin: 0 auto;
        height: 80px;
        position: relative;
        z-index: 10;
    }

    .topCard .titleCard {
        background: linear-gradient(60deg, #66aabb, #43a047);
        box-shadow: 0 12px 20px -10px rgba(76, 175, 80, .28), 0 4px 20px 0 rgba(0, 0, 0, .12), 0 7px 8px -5px rgba(76, 175, 80, .2);
    }

    .topCardRight {
        width: 90%;
        height: 80px;
        position: relative;
        display: inline-block;
        z-index: 10;
    }

    .topCardRight .titleCard {
        background: linear-gradient(60deg, #66aabb, #43a047);
        box-shadow: 0 12px 20px -10px rgba(76, 175, 80, .28), 0 4px 20px 0 rgba(0, 0, 0, .12), 0 7px 8px -5px rgba(76, 175, 80, .2);
    }

    .messageRight {
        flex: 1;
        margin-right: 30px;
        height: 480px;
        display: inline-block;
        position: relative;
        z-index: 0;
    }
    .messageRight .el-card__body {
        overflow: hidden !important;
        padding-bottom: 50px;
    }
    /*.inner-container {*/
    /*animation: myMove 160s linear infinite;*/
    /*animation-fill-mode: forwards;*/
    /*}*/
    /*.inner-container:hover{*/
        /*animation-play-state: paused;*/
    /*}*/
    /*!*文字无缝滚动*!*/
    /*@keyframes myMove {*/
        /*0% {*/
            /*transform: translateY(0);*/
        /*}*/


        /*100% {*/
            /*transform: translateY(-6050px);*/
        /*}*/
    /*}*/
</style>
