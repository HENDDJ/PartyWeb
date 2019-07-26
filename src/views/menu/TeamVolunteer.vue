<template>
    <section>
        <vs-tabs :color="colorx">
            <vs-tab @click="handleSelect()" label="志愿者信息">
                <div class="con-tab-ejemplo">
                    <CommonCRUD
                        ref="table"
                        :formColumns="volunteerFormColumns"
                        apiRoot="/identity/volunteer"
                        :columns="volunteerColumns"
                        :addBtnVis=false
                        :editBtnVis=false
                        :lookBtnVis = false
                        :delBtnVis=false
                        :queryFormColumns="volunteerQuery">
                        <template slot="header-btn" slot-scope="slotProps">
                            <el-button type="primary"  plain  class="self-btn self-add" @click="add()" >&nbsp;</el-button>
                            <el-button type="warning"  plain  class="self-btn self-edit" @click="edit(slotProps.selected)" >&nbsp;</el-button>
                            <el-button type="success" plain  class="self-btn self-look" @click="look(slotProps.selected)" >&nbsp;</el-button>
                            <el-button type="danger" plain class="self-del self-btn" @click="del(slotProps.selected)" >&nbsp;</el-button>

                        </template>
                        <template slot="query" slot-scope="slotProps" v-if="userAuthority!=3">
                            <label style="font-size: 14px;width: 75px">所属组织</label>
                            <el-cascader :props="propsOne" v-if="userAuthority === 1" placeholder="选择镇名" size="mini"
                                         style="margin-right: -28px;" @change="selValue"></el-cascader>
                            <el-cascader :props="propsTwo" v-if="userAuthority === 2" placeholder="选择村名" size="mini"
                                         style="margin-right: -28px;" @change="selValueCun"></el-cascader>
                        </template>
                    </CommonCRUD>
                </div>
            </vs-tab>
            <vs-tab @click="colorx = 'danger'" label="服务队伍信息">
                <div class="con-tab-ejemplo">
                    <CommonCRUD :columns="teamColumns" api-root="identity/volunteerGroup" :formColumns="teamFormColumns" :queryFormColumns="teamQuery">
                        <template slot="query" slot-scope="slotProps" v-if="userAuthority!=3">
                            <label style="font-size: 14px;width: 75px">所属组织</label>
                            <el-cascader :props="propsOne" v-if="userAuthority === 1" placeholder="选择镇名" size="mini"
                                         style="margin-right: -28px;" @change="selValue"></el-cascader>
                            <el-cascader :props="propsTwo" v-if="userAuthority === 2" placeholder="选择村名" size="mini"
                                         style="margin-right: -28px;" @change="selValueCun"></el-cascader>
                        </template>
                    </CommonCRUD>
                </div>
            </vs-tab>
        </vs-tabs>
        <!--新增、编辑、查看-->
        <el-dialog
            v-if="dialogVisible"
            :title="title"
            :visible.sync="dialogVisible"
            width="880px"
            align="left"
            :modal-append-to-body='false'
            :append-to-body="true"
            :before-close="handleClose">
            <el-form :inline="true" :model="form"  ref="form" class="demo-form-inline" label-width="170px" >
                <el-form-item label="姓名">
                    <el-select v-model="form.partyMemberId" placeholder="请选择" filterable :disabled="disabled" @change="handleName()">
                        <el-option v-for="item in partyMemberList" :key="item.id" :label="item.name" :value="item.id" >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="性别">
                    <el-input v-model="form.sex" disabled></el-input>
                </el-form-item>
                <el-form-item label="出生日期">
                    <el-date-picker type="date" v-model="form.birthday" disabled></el-date-picker>
                </el-form-item>
                <el-form-item label="入党时间">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.joinDate" disabled></el-date-picker>
                </el-form-item>
                <el-form-item label="一对一长期结对服务">
                    <div style="display: flex;">
                        <vs-checkbox :disabled="disabled" v-model=" checkBoxList" vs-value="01">民政优抚对象</vs-checkbox >
                        <vs-checkbox :disabled="disabled" v-model=" checkBoxList" vs-value="02">老人</vs-checkbox >
                        <vs-checkbox :disabled="disabled" v-model=" checkBoxList" vs-value="03">儿童</vs-checkbox >
                        <vs-checkbox :disabled="disabled" v-model=" checkBoxList" vs-value="04">残疾人</vs-checkbox >
                        <vs-checkbox :disabled="disabled" v-model=" checkBoxList" vs-value="05">下岗职工</vs-checkbox >
                        <vs-checkbox :disabled="disabled" v-model=" checkBoxList" vs-value="06">精神/心理病人</vs-checkbox >
                        <vs-checkbox :disabled="disabled" v-model=" checkBoxList" vs-value="07">其他</vs-checkbox >
                    </div>
                </el-form-item>
                <el-form-item label="社区教育、科普、文化">
                    <div style="display: flex;min-width: 400px;">
                        <vs-checkbox :disabled="disabled" v-model=" checkBoxList" vs-value="08">教育</vs-checkbox >
                        <vs-checkbox :disabled="disabled" v-model=" checkBoxList" vs-value="09">科普</vs-checkbox >
                        <vs-checkbox :disabled="disabled" v-model=" checkBoxList" vs-value="10">文化</vs-checkbox >
                    </div>
                </el-form-item>
                <el-form-item label="健康救助">
                    <div style="display: flex;min-width: 400px;">
                        <vs-checkbox :disabled="disabled" v-model=" checkBoxList" vs-value="11">献血</vs-checkbox >
                        <vs-checkbox :disabled="disabled" v-model=" checkBoxList" vs-value="12">献骨髓</vs-checkbox >
                        <vs-checkbox :disabled="disabled" v-model=" checkBoxList" vs-value="13">其他</vs-checkbox >
                    </div>
                </el-form-item>
                <el-form-item label="环保活动">
                    <div style="display: flex;width: 400px;">
                        <vs-checkbox :disabled="disabled" v-model=" checkBoxList" vs-value="14">环保宣传</vs-checkbox >
                        <vs-checkbox :disabled="disabled" v-model=" checkBoxList" vs-value="15">环境清理</vs-checkbox >
                        <vs-checkbox :disabled="disabled" v-model=" checkBoxList" vs-value="16">其他</vs-checkbox >
                    </div>
                </el-form-item>
                <el-form-item label="大型赛会服务">
                    <div style="display: flex;width: 400px;">
                        <vs-checkbox :disabled="disabled" v-model=" checkBoxList" vs-value="17">技能服务</vs-checkbox >
                        <vs-checkbox :disabled="disabled" v-model=" checkBoxList" vs-value="18">体力服务</vs-checkbox >
                        <vs-checkbox :disabled="disabled" v-model=" checkBoxList" vs-value="19">其他</vs-checkbox >
                    </div>
                </el-form-item>
                <el-form-item label="志愿者组织管理">
                    <div style="display: flex;">
                        <vs-checkbox :disabled="disabled" v-model=" checkBoxList" vs-value="20">组织管理</vs-checkbox >
                        <vs-checkbox :disabled="disabled" v-model=" checkBoxList" vs-value="21">技能培训</vs-checkbox >
                        <vs-checkbox :disabled="disabled" v-model=" checkBoxList" vs-value="22">其他</vs-checkbox >
                    </div>
                </el-form-item>
                <el-form-item label="家政服务">
                    <div style="display: flex;">
                        <vs-checkbox :disabled="disabled" v-model=" checkBoxList" vs-value="23">电脑网络服务</vs-checkbox >
                        <vs-checkbox :disabled="disabled" v-model=" checkBoxList" vs-value="24">水电管道维修</vs-checkbox >
                        <vs-checkbox :disabled="disabled" v-model=" checkBoxList" vs-value="25">其他</vs-checkbox >
                    </div>
                </el-form-item>
                <el-form-item label="维权服务">
                    <div style="display: flex;">
                        <vs-checkbox :disabled="disabled" v-model=" checkBoxList" vs-value="26">法律法规咨询</vs-checkbox>
                        <vs-checkbox :disabled="disabled" v-model=" checkBoxList" vs-value="27">妇女青少年维权</vs-checkbox>
                        <vs-checkbox :disabled="disabled" v-model=" checkBoxList" vs-value="28">其他</vs-checkbox >
                    </div>
                </el-form-item>
                <el-form-item label="其他服务项目">
                    <el-input v-model="form.otherCategory" :disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item label="服务志愿">
                    <el-input v-model="form.promise" :disabled="disabled"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer footer-position">
                <el-button type="primary" :loading="submitLoading" @click="submit(form)">确 定</el-button>
                <el-button @click="handleClose">取 消</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    import { tansfer } from "../../lookup/transfer";
    export default {
        name: "TeamVolunteer",
        data(){
            return {
                colorx:'success',
                volunteerColumns:[],//志愿者列表
                volunteerformColumns:[],//志愿者
                //志愿者查询条件
                volunteerQuery:[
                    {
                        des: '姓名',
                        name: 'name',
                        type: 'string',
                        value: '',
                        visible: true,
                    }
                ],
                //志愿者队伍查询条件
                teamQuery:[
                    {
                        des: '名称',
                        name: 'name',
                        type: 'string',
                        value: '',
                        visible: true,
                    }
                ],

                dialogVisible:false,
                form:{
                    partyMemberId:'',
                    name:'',
                    sex:'',
                    birthday:'',
                    joinDate:'',
                    category:'',
                    promise:'',
                    otherCategory:'',
                },//志愿者表单
                checkBoxList:[],//多选框数组
                submitLoading:false,
                title:'',
                //服务队伍列表
                teamColumns:[
                    {
                        name: 'code',
                        des: '编号'
                    },
                    {
                        name: 'name',
                        des: '名称'
                    },
                    {
                        name: 'partyBranchId',
                        des: '所属党组织'
                    },
                    {
                        name: 'unit',
                        des: '所属单位'
                    },
                    {
                        name: 'captialName',
                        des: '队长姓名'
                    },
                    {
                        name: 'contactOfficer',
                        des: '联络员'
                    },
                    {
                        name: 'phoneNumber',
                        des: '手机号码'
                    },
                ],
                //服务队伍表单
                teamFormColumns:[
                    {
                        name: 'code',
                        des: '编号',
                        type: 'string'
                    },
                    {
                        name: 'name',
                        des: '名称',
                        type: 'string'
                    },
                    {
                        name: 'partyBranchId',
                        des: '所属党组织',
                        type: 'string'
                       /* type: 'select',
                        options: 'branchList'*/
                    },
                    {
                        name: 'unit',
                        des: '所属单位',
                        type: 'string'
                    },
                    {
                        name: 'tenet',
                        des: '服务宗旨',
                        type: 'textarea'
                    },
                    {
                        name: 'officeNumber',
                        des: '办公电话',
                        type: 'string'
                    },
                    {
                        name: 'captialName',
                        des: '队长姓名',
                        type: 'string'
                    },
                    {
                        name: 'captialPosition',
                        des: '队长职务',
                        type: 'string'
                    },
                    {
                        name: 'captialContact',
                        des: '队长联系方式',
                        type: 'string'
                    },
                    {
                        name: 'contactOfficer',
                        des: '联络员',
                        type: 'string'
                    },
                    {
                        name: 'officerPosition',
                        des: '联络员职务',
                        type: 'string'
                    },
                    {
                        name: 'phoneNumber',
                        des: '手机号码',
                        type: 'string'
                    },
                    {
                        name: 'qqNumber',
                        des: 'qq号码',
                        type: 'string'
                    },
                    {
                        name: 'email',
                        des: '电子邮箱',
                        type: 'string'
                    },
                    {
                        name: 'basicSiution',
                        des: '基本情况',
                        type: 'rich-editor'
                    },
                ],
                partyMemberList:[],//党员
              /*  distictList:[],//所属组织
                villageCadreList:[],//干部人员列表*/
                propsOne: {
                    lazy: true,
                    lazyLoad: (node, resolve) => {
                        if (node.level == 0) {
                            let nodes = []
                            this.$http('GET', `/identity/sysDistrict/01tree`, false).then((data) => {
                                data.forEach(item => {
                                    nodes.push({label: item.label, value: item.id, leaf: item.leaf})
                                })
                                resolve(nodes);
                            })

                        } else {
                            let nodes = []
                            this.$http('GET', `/identity/sysDistrict/${node.value}tree`, false).then((data) => {
                                data.forEach(item => {
                                    nodes.push({label: item.label, value: item.id, leaf: item.leaf})
                                })
                                resolve(nodes);
                            })
                        }

                    }
                },
                propsTwo: {
                    lazy: true,
                    lazyLoad: (node, resolve) => {
                        if (node.level == 0) {
                            let nodes = []
                            let userId = JSON.parse(sessionStorage.getItem('userInfo')).districtId
                            this.$http('GET', `/identity/sysDistrict/${userId}tree`, false).then((data) => {
                                data.forEach(item => {
                                    nodes.push({label: item.label, value: item.id, leaf: item.leaf})
                                })
                                resolve(nodes);
                            })

                        }
                    }
                },

                userAuthority: 1,
            }
        },
        methods:{
            handleName(){
                if(this.form.partyMemberId){
                    this.$http('GET',`identity/parMember/${this.form.partyMemberId}id`,false).then( data => {
                        this.form.name = data.name;
                        this.form.sex = data.sex;
                        this.form.birthday = data.birth;
                    })
                }
            },
            add(){
                this.title = "新增";
                this.dialogVisible = true;
                this.disabled = false;
            },
            edit(data){
                if (data.length !== 1) {
                    this.$message({
                        type: 'warning',
                        message: data.length > 1 ? '仅能选择一行记录' : '请选择一行记录'
                    });
                    return;
                }
                if(data[0].category){
                    this.checkBoxList = data[0].category.split(",");
                }
                this.title = "编辑";
                this.dialogVisible = true;
                this.disabled = false;
                this.form = data[0];
            },
            look(data){
                if (data.length !== 1) {
                    this.$message({
                        type: 'warning',
                        message: data.length > 1 ? '仅能选择一行记录' : '请选择一行记录'
                    });
                    return;
                }
                if(data[0].category){
                    this.checkBoxList = data[0].category.split(",");
                }
                this.title = "查看";
                this.dialogVisible = true;
                this.disabled = true;
                this.form = data[0];
            },
            del(data){
                if (data.length !== 1) {
                    this.$message({
                        type: 'warning',
                        message: data.length > 1 ? '仅能选择一行记录' : '请选择一行记录'
                    });
                    return;
                }
                this.$confirm('确认删除？')
                    .then(_ => {
                        this.$http(`DELETE`, `identity/volunteer/${data[0].id}id`).then(_ => {
                            this.$refs.table.refreshTableData();
                        });
                    })
                    .catch(_ => {});
            },
            submit (form) {
                this.submitLoading = true;
                //复选框内容转换为字符类型
                if(this.checkBoxList){
                    form.category = this.checkBoxList.join(",");
                }
                //新增
                if(form.id==null){
                    this.$http('POST',`identity/volunteer/`,form).then(() => {
                        this.submitLoading = false;
                        this.dialogVisible = false;
                        this.$refs.table.refreshTableData();
                        this.initForm();
                        this.checkBoxList=[];
                    });
                }
                //编辑
                if((form.id!=null)&&(this.disabled===false)){
                    this.$http('PUT', `identity/volunteer/${form.id}id`,form).then(() =>{
                        this.submitLoading = false;
                        this.dialogVisible = false;
                        this.$refs.table.refreshTableData();
                        this.initForm();
                        this.checkBoxList=[];
                    });
                }else{//查看
                    this.submitLoading = false;
                    this.dialogVisible = false;
                    this.initForm();
                    this.checkBoxList=[];
                }
            },
            //关闭dialog
            handleClose (done) {
                this.$confirm('确认关闭？')
                    .then(_=> {
                        this.disabled = false;
                        this.dialogVisible = false;
                        this.checkBoxList=[];
                        this.initForm();
                        done();
                    })
                    .catch(_ => {});
            },
            handleSelect(){
                this.colorx = 'success';
                this.$http('POST',`identity/parMember/list` ,false).then(data => {
                    this.partyMemberList = data;
                });
            },
            initForm() {
                this.form = {
                    partyMemberId:'',
                    name:'',
                    sex:'',
                    birthday:'',
                    joinDate:'',
                    category:'',
                    promise:'',
                    otherCategory:'',
                };
            },
            selValue(val){
                // this.queryForm[1].value = val[1]
            },
            selValueCun(val){
                // this.queryForm[1].value = val[0]

            }
        },
        components: {
            CommonCRUD
        },
        created(){
            this.volunteerColumns = this.$store.state.classInfo.properties;
            this.volunteerFormColumns =this.$store.state.classInfo.properties;

            let user = JSON.parse(sessionStorage.getItem('userInfo'));
            if (user.sysDistrict.districtLevel == 3) {
                this.userAuthority = 3
            } else if (user.sysDistrict.districtLevel == 2) {
                this.userAuthority = 2
            } else {
                this.userAuthority = 1
            }

            this.handleSelect();
            tansfer(this.volunteerColumns);
            this.initForm();
        }
    }
</script>

<style>
    .vs-tabs--btn {
        font-size: 14px !important;
    }

</style>
