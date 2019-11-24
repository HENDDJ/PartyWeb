<template>
    <div class="common-crud">
        <div class="common-query">
            <el-form :inline="true" :model="queryForm" ref="form" class="demo-form-inline" label-width="75px">
                <slot name="query"></slot>
                <el-form-item v-for="item in queryFormColumns" v-if="item.visible" :key="item.des" :label="item.type === 'checkbox' ? '' : item.des">
                    <el-input v-model="queryForm[item.name]" v-if="item.type === 'string'" clearable></el-input>
                    <el-select v-model="queryForm[item.name]" v-else-if="item.type === 'select'" clearable>
                        <el-option v-for="opItem in item.options" filterable :value="opItem.value" :label="opItem.label" :key="opItem.value" ></el-option>
                    </el-select>
                    <el-cascader v-model="queryForm[item.name]" v-else-if="item.type === 'cascader'" clearable
                                 :options="item.options"  @change="(val) => {handleChange(val,queryForm, item.name, 'query')}" :show-all-levels="false"   :props="item.props">
                    </el-cascader>
                    <el-radio-group v-if="item.type === 'radio'" v-model="queryForm[item.name]"  clearable>
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                    <el-date-picker v-if="item.type === 'date'"
                                    v-model="queryForm[item.name]"
                                    type="date"
                                    placeholder="选择日期"
                                    value-format="yyyy-MM-dd"
                                    clearable
                                    >
                    </el-date-picker>
                    <el-date-picker v-if="item.type === 'datetime'"
                                    v-model="queryForm[item.name]"
                                    type="datetime"
                                    value-format="yyyy-MM-ddTHH:mm:ss"
                                    placeholder="选择日期"
                                    clearable
                                    >
                    </el-date-picker>
                    <el-checkbox v-if="item.type === 'checkbox'"
                                 v-model="queryForm[item.name]"
                                 clearable
                    :label="item.des" border size="mini" true-label="true" false-label="false">
                    </el-checkbox>
                </el-form-item>
                <el-button v-if="queryFormColumns.filter(item => item.visible === true).length > 0" @click="query" type="primary" size="mini" icon="el-icon-search">搜索</el-button>
            </el-form>
        </div>
        <div class="handler-btn">
            <!--<el-button type="success" plain @click="$router.go(-1)" class="self-back self-btn">&nbsp;</el-button>-->
            <el-button v-if="addBtnVis" type="primary" plain @click="add" class="self-add self-btn">&nbsp;</el-button>
            <el-button v-if="editBtnVis" :style="{marginLeft: addBtnVis ? '10px' : '3px'}" type="success" plain class="self-btn self-edit" @click="edit">&nbsp;</el-button>
            <el-button v-if="lookBtnVis" :style="{marginLeft: addBtnVis && editBtnVis ? '10px' : '3px'}" type="success" plain class="self-btn self-look" @click="look">&nbsp;</el-button>
            <el-button v-if="delBtnVis" :style="{marginLeft: addBtnVis && editBtnVis && lookBtnVis ? '10px' : '3px'}" type="danger" plain @click="deleteRow" class="self-del self-btn">&nbsp;</el-button>
            <slot :style="{marginLeft: addBtnVis && editBtnVis && lookBtnVis && delBtnVis ? '10px' : '3px'}" name="header-btn" :selected="selected"></slot>
        </div>
        <p class="clear-float">&nbsp;</p>
        <el-table :data="tableData" v-loading="loading" border
                  :max-height="tableMaxHeight"
                  ref="table"
                  @row-click="rowClick"
                  :header-cell-style="{'background-color': '#fafafa','color': 'rgb(80, 80, 80)','border-bottom': '1px solid #dee2e6'}"
                  @selection-change="handleSelectionChange"
                  :span-method="objectSpanMethod">
            <el-table-column
                type="selection"
                width="55"
                align="center">
            </el-table-column>
            <el-table-column v-for="item in columns" v-if="item.notShow !== 'true' && !item.slot" :key="item.name" :prop="item.aliasName || item.name" :label="item.des"
                             :width="item.width || ''"
                             :formatter="(row, cell,val,index) => {
                                 if (item.formatter) {
                                    return item.formatter(row, cell,val,index);
                                 } else if (item.lookupKey) {
                                    if (LookUp[item.lookupKey].filter(subitem => subitem.value === val)[0]) {
                                        return LookUp[item.lookupKey].filter(subitem => subitem.value === val)[0].label;
                                    }
                                 }
                                 return val;
                             }"
                             align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column v-for="item in columns" v-if="item.slot" :label="item.des" :key="item.name" align="center" >
                <template slot-scope="scope">
                    <slot :name="item.slotName" :row="scope.row"></slot>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="text-align: right;margin-top: 20px; margin-bottom: 20px" ref="pagination"
                       background
                       :total="pageable.total" :current-page.sync="pageable.currentPage" :page-size.sync="pageable.pageSize"
                       @current-change="currentChange" @size-change="sizeChange" layout="total, sizes, prev, pager, next">
        </el-pagination>
        <el-dialog
        v-if="dialogVisible"
        :title="title"
        :visible.sync="dialogVisible"
        width="880px"
        align="left"
        :append-to-body="true"
        :before-close="handleClose">
        <el-form :inline="true" :model="form" :rules="rules" ref="form" class="demo-form-inline" label-width="170px" >
            <el-form-item v-for="item in formColumns"  :key="item.des" :label="item.des" :prop="item.name" v-if="item.formShow !== 'false'">
                <el-input v-model="form[item.name]" v-if="item.type === 'string'" :disabled="item.disabled || disabled"></el-input>
                <el-select v-model="form[item.name]" v-else-if="item.type === 'select'" filterable :disabled="item.disabled || disabled">
                    <el-option v-if="item.options" v-for="opItem in item.options" :value="opItem.value" :label="opItem.label" :key="opItem.value"></el-option>
                    <el-option v-if="item.lookupKey" v-for="opItem in LookUp[item.lookupKey]" :value="opItem.value" :label="opItem.label" :key="opItem.value"></el-option>
                </el-select>
                <!--层级clearable属性只用于绑定值为districtId-->
                <el-cascader v-model="form[item.name]" v-else-if="item.type === 'cascader'" :disabled="item.disabled || disabled" clearable
                             :options="item.options"  @change="(val) => {handleChange(val, form, item.name, 'crud')}" :show-all-levels="false"   :props="{value: 'id',label: 'label',children: 'children',leaf: 'leaf'}">
                </el-cascader>
                <el-radio-group v-if="item.type === 'radio'" v-model="form[item.name]" :disabled="item.disabled || disabled" style="width: 178px" >
                    <el-radio v-if="item.opinions" v-for="opItem in item.options" :label="opItem.value" :key="opItem.value"> {{opItem.label}}</el-radio>
                </el-radio-group>
                <el-date-picker v-if="item.type === 'date'"
                                v-model="form[item.name]"
                                type="date"
                                :disabled="item.disabled || disabled"
                                placeholder="选择日期"
                                >
                </el-date-picker>
                <el-date-picker v-if="item.type === 'datetime'"
                                v-model="form[item.name]"
                                type="datetime"
                                value-format="yyyy-MM-ddTHH:mm:ss"
                                placeholder="选择日期"
                >
                </el-date-picker>
                <el-input v-model="form[item.name]" class="common-textarea" type="textarea" :rows="4" v-if="item.type === 'textarea'" :disabled="item.disabled || disabled"></el-input>
                <!--预留富文本编辑-->
                <Tinymce v-if="item.type === 'rich-editor'" v-model="form[item.name]"></Tinymce>
                <CommonFileUpload v-if="item.type === 'file'" :value="form[item.name]" :disabled="item.disabled || disabled" @getValue="form[item.name] = $event"></CommonFileUpload>
                <CommonUpload v-if="item.type === 'image'" :value="form[item.name]" :disabled="item.disabled || disabled"  :limit="genLimit(item)" @getValue="form[item.name] = $event"></CommonUpload>
                <MapLocation v-if="item.type === 'location'" :value="form[item.name]" :disabled="item.disabled || disabled" @getValue="form[item.name] = $event"></MapLocation>
            </el-form-item>
            <slot v-if="formAfterVis" name="form-after"></slot>
        </el-form>
        <div slot="footer" class="dialog-footer  footer-position" v-if="buttonVis">
            <el-button type="primary" :loading="submitLoading" @click="submit('form')">确 定</el-button>
            <el-button @click="handleClose">返 回</el-button>
        </div>
    </el-dialog>
    </div>
</template>

<script>
    import reqType from '@/api/reqType';
    import CommonUpload from '@/components/UpLoad';
    import Tinymce from '@/components/Tinymce';
    import CommonFileUpload from '@/components/FileUpLoad';
    import MapLocation from '@/components/MapLocation';
    import LookUp from '@/lookup';
    export default {
        name: 'CommonCRUD',
        props: {
            //显示按钮是否显示
            addBtnVis:{
                type:Boolean,
                default :true
            },
            editBtnVis:{
                type:Boolean,
                default :true
            },
            delBtnVis:{
                type:Boolean,
                default :true
            },
            lookBtnVis:{
                type: Boolean,
                default: true
            },
            //表单提交返回按钮
            buttonVis:{
                type: Boolean,
                default: true
            },
            // 表格字段显示配置
            columns: Array,
            // 请求根路径，对应后台Controller @RequestMapping注解的值
            apiRoot: String,
            // 表单字段
            formColumns: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            // 查询字段集
            queryFormColumns: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            sortColumns: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            objectSpanMethod: {
                type: Function
            },
            // form-after 是否显示
            formAfterVis: {
                type: Boolean,
                default: false
            },
            editEvent: null
        },
        data () {
            return {
                // 表格数据
                tableData: [],
                // 加载样式
                loading: false,
                pageable: {
                    total: 0,
                    currentPage: 1,
                    pageSize: 10
                },
                dialogVisible: false,
                form: {},
                imgUrl: '',
                selected: [],
                queryForm: {},
                submitLoading: false,
                rules: {},
                title: '',
                disabled: false,
                LookUp: LookUp
            };
        },
        computed: {
            path() {
                return `${this.apiRoot}/page?page=${this.pageable.currentPage - 1}&size=${this.pageable.pageSize}`;
            },
            tableMaxHeight() {
                return document.documentElement.clientHeight - (this.$touristScreenWid == 1 ? 260 : 240);
            }
        },
        components: {
            CommonFileUpload,
            CommonUpload,
            Tinymce,
            MapLocation
        },
        methods: {
            genLimit(item) {
                if (item.limit) {
                    return item.limit;
                } else {
                    if (item.max) {
                        return Number(item.max)
                    } else {
                        return 10;
                    }
                }
            },
            rowClick(row) {
                this.$refs.table.toggleRowSelection(row)
            },
            validateRows() {
                if (this.selected.length !== 1) {
                    this.$message({
                        type: 'warning',
                        message: this.selected.length > 1 ? '仅能选择一行记录' : '请选择一行记录'
                    });
                    return false;
                }
                return true;
            },
            currentChange(value) {
                let path = `${this.apiRoot}/page?page=${value - 1}&size=${this.pageable.pageSize}`;
                this.loadTableData(path)
            },
            sizeChange(value) {
                let path = `${this.apiRoot}/page?page=0&size=${value}`;
                this.loadTableData(path)
            },
            // 获取表格数据
            loadTableData (path) {
                this.loading = true;
                this.sortColumns.forEach((item) => {
                    path += `&sort=${item.name},${item.type}`;
                });
                this.$http(reqType.POST, path, this.queryForm, false).then(
                    data => {
                        this.tableData = data.content;
                        this.pageable.total = data.totalElements;
                        this.loading = false;
                        this.$emit('getTableData', this.tableData)
                    }
                ).catch(res => {
                    this.loading = false;
                });
            },
            add() {
                this.title='新增'
                this.dialogVisible = true;
                this.buttonVis = true;
                this.form = {};
                this.formColumns.forEach((item) => {
                    if (item.value) {
                        this.form[item.name] = item.value;
                    }
                });
            },
            edit() {
                this.title='编辑'
                if (this.validateRows()) {
                    let isGoing = true;
                    if (this.editEvent) {
                        isGoing = this.editEvent(this.selected[0]);
                    }
                    if (isGoing) {
                        this.form = Object.assign({}, this.selected[0]);
                        this.dialogVisible = true;
                        this.buttonVis = true;
                    }
                }
            },
            look() {
                this.title = '查看';
                this.disabled = true;
                if (this.validateRows()) {
                    this.form = Object.assign({}, this.selected[0]);
                    this.dialogVisible = true;
                    this.buttonVis = true;
                }
            },
            deleteRow() {
                if (!this.validateRows()) {
                    return;
                }
                this.$confirm('确认删除？')
                    .then(_ => {
                        this.$http(reqType.DELETE, `${this.apiRoot}/${this.selected[0].id}id`).then(_ => {
                            this.loadTableData(this.path);
                        });
                    })
                    .catch(_ => {});
            },
            submit (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.submitLoading = true;
                        this.$nextTick(() => {
                            let type = this.form.id ? reqType.PUT : reqType.POST;
                            let path = `${this.apiRoot}/${this.form.id ? this.form.id + 'id' : ''}`;
                            this.$http(type, path, Object.assign({}, this.form)).then(() => {
                                this.submitLoading = false;
                                this.dialogVisible = false;
                                let path = `${this.apiRoot}/page?page=${this.pageable.currentPage - 1}&size=${this.pageable.pageSize}`;
                                this.loadTableData(path);
                                this.from = {};
                            }).catch(()=>{
                                this.submitLoading = false;
                            });
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            handleClose () {
                this.from = {};
                this.$refs['form'].resetFields();
                this.disabled = false;
                this.dialogVisible = false;
                this.submitLoading = false;
                this.$emit('handleClose');
            },
            handleAvatarSuccess (res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            handleSelectionChange(val) {
                this.selected = val;
            },
            defaultRequestConfig(path) {
                this.queryFormColumns.forEach((item) => {
                    if (item.value) {
                        this.queryForm[item.name] = item.value;
                    }
                });
                this.sortColumns.forEach((item) => {
                    path += `&sort=${item.name},${item.type}`;
                });
            },
            query() {
                this.pageable.currentPage = 1;
                this.pageable.pageSize = 10;
                let path = `${this.apiRoot}/page?page=${this.pageable.currentPage - 1}&size=${this.pageable.pageSize}`;
                this.refreshTableData(path);
            },
            //生成验证策略
            validationRules(){
                this.formColumns.forEach((item) => {
                    this.rules[item.name] = [];
                    if (item.triggerCheck) {
                        if (item.type === 'image' && item.required) {
                            this.rules[item.name].push({required: true, validator: (rule, value, callback) => {
                                    if (!value) {
                                        callback(new Error('请至少上传一张图片'));
                                    } else {
                                        callback();
                                    }
                                }, trigger: 'change'});
                            return;
                        }
                        if (item.required){
                            this.rules[item.name].push({required: true, message: `请输入${item.des}`, trigger: item.triggerCheck});
                        }
                        if (item.min && !item.max){
                            this.rules[item.name].push({min:Number(item.min), message: `输入最少${item.min}位`, trigger: item.triggerCheck});
                        }
                        if (item.max && item.min){
                            if(item.max == item.min){
                                this.rules[item.name].push({min:Number(item.min), message: `请输入${item.min}位`, trigger: item.triggerCheck});
                            }else{
                            this.rules[item.name].push({min:Number(item.min),max:Number(item.max), message: `请输入${item.min}位到${item.max}位`, trigger: item.triggerCheck});
                        }
                        }
                        if (item.max && !item.min){
                            this.rules[item.name].push({max:Number(item.max), message: `输入最多${item.max}位`, trigger: item.triggerCheck});
                        }
                    }
                });
            },
            refreshTableData() {
                let path = `${this.apiRoot}/page?page=${this.pageable.currentPage - 1}&size=${this.pageable.pageSize}`;
                this.defaultRequestConfig(path);
                this.loadTableData(path);
            },
            handleChange(value, obj, fieldName, type) {
                console.log(value);
                if (value.length>0) {
                    obj[fieldName] = value[value.length - 1];
                    if (type === 'query') {
                        this.queryFormColumns.filter(item => item.name == 'districtId')[0].value = value[value.length - 1];
                    }
                } else {
                     obj[fieldName] = "";
                     if (type === 'query') {
                        let districtId = JSON.parse(sessionStorage.getItem('userInfo')).districtId;
                        this.queryFormColumns.filter(item => item.name == 'districtId')[0].value = districtId;
                    }

                }
            }
        },
        created() {
            let path = `${this.apiRoot}/page?page=${this.pageable.currentPage - 1}&size=${this.pageable.pageSize}`;
            this.defaultRequestConfig(path);
            this.loadTableData(path);
            this.validationRules();
        },
        mounted() {
            setTimeout( () => {
                let headerHeight = this.$screen() * 156;
                let menuHeight = this.$screen() * 53;
                document.getElementsByClassName('common-crud')[0].style.minHeight = `${Math.ceil(document.body.clientHeight - headerHeight - menuHeight - 310)}px`;
            }, 200)
            let query = window.location.href;
            if(query.indexOf('?')!=-1){
                query.split('?')[1].split('&').forEach(item=>{
                    if(item.split('=')[0]=='positionName'){
                        console.log(123)
                        this.queryForm={}
                        this.queryForm.name = decodeURI(item.split('=')[1])
                        this.query();
                    }else {

                    }
                })

            }
        }
    };
</script>

<style scoped>
    .btn-right {
        float: right;
    }

</style>
<style>
    .clear-float {
        clear: both;
        height: 10px;
    }
    .common-crud {
        width: calc(100% - 10px);
    }
    .common-query {
        float: right;
    }
    .handler-btn {
        float: left;
    }
    .common-query .el-form--inline .el-form-item {
        margin: 0;
    }
    .common-crud i {
        font-size: 12px;
    }
    .el-checkbox.is-bordered.el-checkbox--mini {
        padding : 5px 15px 5px 10px !important;
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
        transform: scale(1.1);
    }
    .self-add {
        margin-left: 3px !important;
        background: url('../../static/img/add.png') !important;
        background-size: cover !important;
    }

    .self-del {
        background: url('../../static/img/del.png') !important;
        background-size: cover !important;
    }
    .self-back {
        background: url('../../static/img/back.png') !important;
        background-size: cover !important;
    }
    .self-edit {
        background: url('../../static/img/edit.png') !important;
        background-size: cover !important;
    }
    .self-look {
        background: url('../../static/img/look.png') !important;
        background-size: cover !important;
    }
    .footer-position {
        margin-right: 86px;
    }
    .common-textarea .el-textarea__inner {
        width: 585px !important;
    }
    #mceu_47 {
        width: calc(100% - 1px) !important;
    }
</style>
