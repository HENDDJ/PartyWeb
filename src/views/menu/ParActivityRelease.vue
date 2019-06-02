<template>
    <div>
        <template lang="html">
            <div class="centerx">
                <el-form :inline="true" :model="form" ref="form" class="demo-form-inline" align="left"
                         label-width="170px">
                    <template>
                        <el-form-item label="任务对象" prop="taskObject">
                            <el-tree
                                :data="objectData"
                                :props="props"
                                ref="tree"

                                lazy
                                show-checkbox
                                >
                            </el-tree>
                        </el-form-item>
                        <el-form-item label="任务分类" prop="taskType">
                            <el-radio-group size="medium" v-model="form.taskType" style="margin-left: 10px;"
                                            @change="radioChoose">
                                <el-radio label="Party">党建任务</el-radio>
                                <el-radio label="DistLearning">远教任务</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="计划名称" prop="title">
                            <el-input v-model="form.title" :disabled=disabled></el-input>
                        </el-form-item>
                        <el-form-item label="任务类型" prop="type">
                            <el-input v-model="form.type" :disabled=disabled></el-input>
                        </el-form-item>
                        <el-form-item label="工作要求" prop="context">
                            <el-input v-model="form.context" :disabled=disabled></el-input>
                        </el-form-item>
                        <el-form-item label="分值" prop="score">
                            <el-input-number v-model="form.score" label="分值" style="width: 200px"></el-input-number>
                        </el-form-item>
                        <el-form-item label="截止时间" prop="monVal">
                            <el-date-picker
                                v-model="monVal"
                                type="date"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </template>
                    <el-form-item label="上传文件" prop="fileUrls">
                        <CommonFileUpload :value="form.fileUrls" @getValue="form.fileUrls = $event"></CommonFileUpload>
                    </el-form-item>
                    <el-form-item label="上传视频" prop="video" v-if="addVideo">
                        <template>
                            <el-transfer
                                filterable
                                v-model="form.video"
                                :titles="['可选视频', '已选视频']"
                                :props="{
                                      key: 'value',
                                      label: 'desc'
                                    }"
                                :data="addVideoList">
                            </el-transfer>
                        </template>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer  footer-position">
                    <el-button type="primary"  @click="submit('form')">确 定</el-button>
                    <el-button @click="ss()">重 置</el-button>
                </div>

            </div>
        </template>

    </div>

</template>

<script>
    import CommonFileUpload from '@/components/FileUpLoad';

    export default {
        name: "ParActivityRelease",
        data() {
            return {
                queryForm: {taskType: ''},
                form:{
                    taskObject:{
                        label: 'name',
                        children: 'children'
                    }},
                props: {
                    children: 'children',
                    label: 'label'
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
                monVal:'',
                count: 1,
                objectData:[{
                    id: 1,
                    label: '一级 1',
                    children: [{
                        id: 4,
                        label: '二级 1-1',
                        children: [{
                            id: 9,
                            label: '三级 1-1-1'
                        }, {
                            id: 10,
                            label: '三级 1-1-2'
                        }]
                    }]
                }, {
                    id: 2,
                    label: '一级 2',
                    children: [{
                        id: 5,
                        label: '二级 2-1'
                    }, {
                        id: 6,
                        label: '二级 2-2'
                    }]
                }, {
                    id: 3,
                    label: '一级 3',
                    children: [{
                        id: 7,
                        label: '二级 3-1'
                    }, {
                        id: 8,
                        label: '二级 3-2'
                    }]
                }]
            }
        },
        watch: {
            checkboxGroup: {
                handler: function (newVal, oldVal) {
                    console.log(newVal)
                }
            },


        },
        components: {
            CommonFileUpload
        },
        methods: {
            ss(){
              console.log(this.$refs.tree.getCheckedNodes())

            },
            // loadNode(node, resolve){
            //     this.$http('Post','/identity/sysDistrict/list',{districtType:'Party'},false).then((data)=>{
            //         var partyList = []
            //         var townList = []
            //         var cunList = []
            //         var one = {}
            //         if (node.level === 0) {
            //             data.forEach(item=>{
            //                 if(item.districtLevel == '1'){
            //                      one = {name : item.districtName,value:item.id}
            //
            //                 }
            //             })
            //
            //             partyList.push(one)
            //             console.log(partyList)
            //             return resolve(partyList);
            //         }
            //         if(node.level === 1){
            //             data.forEach(item=>{
            //                 if(item.districtLevel == '2'){
            //                     townList.push({name : item.districtName,value:item.id})
            //                 }
            //                 return resolve(townList);
            //             })
            //         }
            //         if(node.level === 2 && ){
            //             node.data.name
            //         }
            //     }).catch((res)=>{
            //
            //     })
            //
            // },
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
                        this.form.districtID = JSON.parse(sessionStorage.getItem('userInfo')).sysDistrict.districtId
                        this.form.status = '1'
                        this.form.month = this.monVal
                        this.form.releaseTime = new Date().Format("yyyy-MM-ddTHH:mm:ss");
                        if (this.form.fileUrls) {
                            var ss = this.form.fileUrls.toString().split(",")
                            this.form.fileUrls = ss
                        }
                        var video = this.form.video
                        var videoList = []
                        video.forEach(item => {
                            videoList.push(JSON.parse(item))
                        })
                        this.form.video = videoList
                        console.log(this.form)
                        this.$http('Post', '/identity/parActivity/', this.form, false).then(
                            (data) => {
                                this.$message({
                                    type: 'success',
                                    message: '上传成功'
                                })
                                this.$refs[form].resetFields();
                                let path = `${this.apiRoot}/page?page=${this.pageable.currentPage - 1}&size=${this.pageable.pageSize}`;
                                this.queryForm.taskType = this.form.taskType
                                let type = this.form.taskType
                                this.loadTableData(path);
                                this.form = {taskType: type}
                                this.dialogVisible = false

                            }).catch(res => {
                            this.dialogVisible = true;
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
        },
        created() {

        }
    }
</script>

<style>
    .footer-position {
        margin-right: 86px;
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
</style>
