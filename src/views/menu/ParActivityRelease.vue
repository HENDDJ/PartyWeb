<template>
    <div class="activity-release">
        <div>
            <el-form :inline="true" :model="form" ref="form" class="demo-form-inline" align="left"
                     label-width="170px" id="labelOne">
                <el-row>
                    <div>&nbsp;</div>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="任务分类" prop="taskType">
                            <vs-radio color="success" v-model="form.taskType" vs-value="Party">党建任务</vs-radio>
                            <vs-radio color="success" v-model="form.taskType" vs-value="DistLearning">远教任务</vs-radio>
                            <!--<vs-checkbox icon="flag" color="danger"   v-model="form.taskType" vs-value="Party">党建任务</vs-checkbox>-->
                            <!--<vs-checkbox icon="cast" color="success" v-model="form.taskType" vs-value="DistLearning">远教任务</vs-checkbox>-->
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-col :span="20">
                    <vs-divider border-style="dashed"></vs-divider>
                    <br>
                </el-col>
                <el-row>
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
                <el-row>
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
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="上传文件" prop="fileUrls">
                            <CommonFileUpload :value="form.fileUrls"
                                              @getValue="form.fileUrls = $event"></CommonFileUpload>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="工作要求" prop="context">
                            <el-input v-model="form.context" type="textarea" style="width:200px" :disabled=disabled :rows="4"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="任务对象" prop="taskObject">
                            <el-tree
                                :props="props"
                                ref="tree"
                                :load="loadNode"
                                lazy
                                show-checkbox
                                v-model="form.taskObject"
                                @check="ss">
                            </el-tree>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
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
                <el-row>
                    <el-col :span="11">
                        <br>
                        <el-form-item label=" ">
                            <el-button type="primary" @click="submit('form')">发 布</el-button>
                            <el-button type="warning" @click="reWrite()">重 置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="el-loading" v-if="isVisible">
            <div class="load"><a style="color: #409EFF">数据上传中，请稍后</a>
                <Spinner name="line-scale-pulse-out-rapid" color="#7cff66"/>
                <div></div>
            </div>
        </div>
    </div>

</template>

<script>
    import CommonFileUpload from '@/components/FileUpLoad';

    export default {
        name: "ParActivityRelease",
        data() {
            return {
                queryForm: {taskType: ''},
                form: {
                    taskObject: {
                        id: '',
                        label: '',
                        children: '',
                    }
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
                form: {taskType: 'Party', score: 10},
                disabled: false,
                dialogVisible: false,
                title: '任务发布',
                //行数据
                row: {},
                monVal: '',
                count: 1,
                activeNames: ['1'],
                videoColl: '点击隐藏',
                isVisible: false
            }
        },
        watch: {
            'form.taskType': {
                handler: function(newVal, oldVal){
                    this.radioChoose(newVal);
                }
            },
        },
        components: {
            CommonFileUpload,
        },
        methods: {
            reWrite() {
                this.form = {taskType: 'Party', score: 10}
                this.$refs.tree.setChecked([]);
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
                        this.$http('Post', '/identity/parActivity/', this.form, false).then(
                            (data) => {
                                this.isVisible = false;
                                this.$message({
                                    type: 'success',
                                    message: '上传成功'
                                });
                                this.$refs[form].resetFields();
                                this.form = {taskType: 'Party',score: 10};
                                this.dialogVisible = false;
                            }).catch(res => {
                            this.dialogVisible = true;
                            this.isVisible = false
                            console.log(res)
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
            }
        },
        created() {

        }
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
        width: 70%;
    }
    .activity-release .file-upload {
        width: 200px !important;
    }
    .activity-release .el-tree {
        padding-top: 5px;
        width: 200px!important;
        border: 1px solid #DCDFE6 !important;
        background: #fff !important;
        border-radius: 3px;
    }
    @media screen and (max-width: 1400px){
        .activity-release {
            width: 100%;
        }
    }
</style>
