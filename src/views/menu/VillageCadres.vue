<template>
    <section>
        <vs-tabs :color="colorx">
            <vs-tab @click="colorx = 'success';cadreQuery[0].value = '';cadreQuery[1].value = user.districtId;" label="村干部信息" >
                <div class="con-tab-ejemplo">
                    <br>
                    <CommonCRUD :columns="cadreColumns" api-root="identity/villageCadres" :formColumns="cadreFormColumns"
                                :queryFormColumns="cadreQuery" :sortColumns="sortColumns"
                                :objectSpanMethod="objectSpanMethod"
                                @getTableData="handleTableData">

                        <template slot="query" slot-scope="slotProps" v-if="userAuthority!=3">
                            <el-form-item label="所属组织">
                                <el-cascader :props="propsOne"  placeholder="请选择组织" size="mini"
                                             style="margin-right: -28px;" @change="selValue" clearable></el-cascader>
                            </el-form-item>
                        </template>
                    </CommonCRUD>
                </div>
            </vs-tab>
            <vs-tab @click="handleSelect()" label="岗位信息">
                <div class="con-tab-ejemplo">
                    <br>
                    <CommonCRUD :columns="positionColumns" api-root="identity/cadrePosition" :formColumns="positionFormColumns"
                                :queryFormColumns="positionQuery"
                                :sortColumns="sortColumns"
                                :objectSpanMethod="objectSpanMethodCadre"
                                @getTableData="handleTableDataCadre">
                        <template slot="query" slot-scope="slotProps" v-if="userAuthority!=3">
                            <el-form-item label="所属组织">
                                <el-cascader :props="propsOne"  placeholder="请选择组织" size="mini"
                                             style="margin-right: -28px;" @change="selValue" clearable></el-cascader>
                            </el-form-item>
                        </template>
                    </CommonCRUD>
                </div>
            </vs-tab>
        </vs-tabs>
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    import LookUp from '@/lookup';
    import { tansfer } from "../../lookup/transfer";
    export default {
        name: "VillageCadres",
        data(){
            return {
                colorx:'success',
                cadreColumns:[],//村干部列表
                cadreformColumns:[],//村干部表单
                user:{},
                sortColumns: [
                    {
                        name: 'districtId',
                        type: 'asc'
                    }
                ],
                //村干部查询条件
                cadreQuery:[
                    {
                        des: '名称',
                        name: 'name',
                        type: 'string',
                        value: '',
                        visible: true,
                    },
                    {
                        des: '所属组织',
                        name: 'districtId',
                        type: 'string',
                        visible: false,
                        value:''
                    }
                ],
                //岗位查询条件
                positionQuery:[
                    {
                        des: '名称',
                        name: 'name',
                        type: 'string',
                        value: '',
                        visible: true,
                     },
                    {
                        des: '所属组织',
                        name: 'districtId',
                        type: 'string',
                        visible: false,
                        value:''
                    }
                ],
                //岗位列表
                positionColumns:[
                    {
                        name: 'parentDistrictName',
                        des: '镇级组织'
                    },
                    {
                        name: 'districtName',
                        des: '村级组织'
                    },
                    {
                        name: 'name',
                        des: '名称'
                    },
                    {
                        name: 'cadreName',
                        des: '任职干部'
                    },
                    {
                        name: 'post',
                        des: '职位',
                        transferType: 'lookup',
                        lookupKey: 'Post'
                    },
                    {
                        name: 'workPlace',
                        des: '工作地点'
                    }
                ],
                //岗位表单
                positionFormColumns:[
                    {
                        name: 'name',
                        des: '名称',
                        required: "true",
                        triggerCheck: "blur",
                        type: 'string',
                    },
                    {
                        name: 'post',
                        des: '职位',
                        required: "true",
                        triggerCheck: "blur",
                        type: 'select',
                    },
                    {
                        name: 'districtId',
                        des: '所属组织',
                        type: 'cascader',
                        required: "true",
                        triggerCheck: "blur",
                        options: '',
                    },
                    {
                        name: 'workPlace',
                        des: '工作地点',
                        type: 'string'
                    },
                    {
                        name: 'cadreId',
                        des: '任职人员',
                        type: 'select',
                        options:'villageCadreList'
                    },
                    {
                        name: 'duty',
                        des: '职责',
                        type: 'rich-editor'
                    },
                ],
                districtList:[],//所属组织
                villageCadreList:[],//干部人员列表
                propsOne: {
                    lazy: true,
                    checkStrictly:true,
                    lazyLoad:(node, resolve)=>{
                        if(this.userAuthority ==1){
                            if(node.level==0){
                                let nodes = [];
                                this.$http('GET', `/identity/sysDistrict/01tree`, false).then((data) => {
                                    data.forEach(item=>{
                                        nodes.push({label:item.label,value:item.id,leaf:item.leaf})
                                    });
                                    resolve(nodes);
                                })
                            }else {
                                let nodes = [];
                                this.$http('GET', `/identity/sysDistrict/${node.value}tree`, false).then((data) => {
                                    data.forEach(item=>{
                                        nodes.push({label:item.label,value:item.id,leaf:item.leaf})
                                    });
                                    resolve(nodes);
                                })
                            }
                        }
                        if(this.userAuthority==2){
                            if(node.level==0){
                                let nodes = [];
                                this.$http('GET', `/identity/sysDistrict/${this.user.districtId}tree`, false).then((data) => {
                                    data.forEach(item=>{
                                        nodes.push({label:item.label,value:item.id,leaf:item.leaf})
                                    });
                                    resolve(nodes);
                                })
                            }
                        }
                    }
                },
                userAuthority: 1,
                spanParentObject: new Map(),
                spanObject: new Map(),
                spanParentCadreObject: new Map(),
                spanCadreObject: new Map(),

            }
        },
        methods:{
            handelOrg(){
                this.$http('GET',`identity/sysDistrict/${this.user.districtId}alltree`,false).then( data => {
                    this.districtList = data[0].children;
                    this.handleOrgLeaf(this.districtList);
                    this.positionFormColumns.filter(item => item.name === 'districtId')[0].options = this.districtList;
                    this.cadreFormColumns.filter(item => item.name === 'districtId')[0].options = this.districtList;
                    if(this.userAuthority == 3){
                        this.positionFormColumns.filter(item => item.name === 'districtId')[0].options = [{label:this.user.organizationName,leaf:true,value:this.user.districtId}];
                        this.cadreFormColumns.filter(item => item.name === 'districtId')[0].options = [{label:this.user.organizationName,leaf:true,value:this.user.districtId}];
                    }
                });
            },
            //处理村级组织children为空的情况
            handleOrgLeaf(districtList){
                districtList.forEach(item => {
                    if( this.userAuthority == 2){
                        delete item.children;
                    }else{
                        item.children.forEach(subitem => {
                            delete subitem.children;
                        })
                    }
                })
            },
            handleSelect(){
                this.colorx = 'danger';
                this.positionQuery[0].value = '';
                this.positionQuery[1].value = this.user.districtId;
                this.$http('POST',`identity/villageCadres/list`,false).then(data => {
                    this.villageCadreList = data;
                    this.positionFormColumns.filter( item => item.name === 'cadreId')[0].options = data.map(item => { return {value: item.id, label: item.name}});
                });
                //岗位显示中文
                this.positionFormColumns.filter(item => item.name === 'post')[0].options = LookUp['Post'];
            },
            selValue(val){
                if(val.length>0){
                    this.positionQuery[1].value = val[val.length-1];
                    this.cadreQuery[1].value = val[val.length-1];
                }else{
                    this.positionQuery[1].value = this.user.districtId;
                    this.cadreQuery[1].value = this.user.districtId;
                }

            },
            handleAuthority(){
                this.cadreQuery[1].value = this.user.districtId;
                this.positionQuery[1].value = this.user.districtId;
                if (this.user.sysDistrict.districtLevel == 3) {
                    this.userAuthority = 3;
                } else if (this.user.sysDistrict.districtLevel == 2) {
                    this.userAuthority = 2;
                } else {
                    this.userAuthority = 1;
                }
            },
            handleTableData(data) {
                let parentDistrictIds = data.map(item => item.parentDistrictId);
                parentDistrictIds = new Set(parentDistrictIds);
                let order = 0;
                this.spanParentObject.clear();
                parentDistrictIds.forEach((item) => {
                    if (item === null) {
                        item = 'null'
                    }
                    data.forEach((subItem, subIndex) => {
                        if (String(subItem.parentDistrictId) == item) {
                            this.spanParentObject.set(item, {index: order, end: subIndex})
                        }
                    })
                    order ++;
                })

                let districtIds = data.map(item => item.districtId);
                districtIds = new Set(districtIds);
                order = 0;
                this.spanObject.clear()
                districtIds.forEach(item => {
                    if (item === null) {
                        item = 'null'
                    }
                    data.forEach((subItem, subIndex) => {
                        if (String(subItem.districtId) == item) {
                            this.spanObject.set(item, {index: order, end: subIndex})
                        }
                    })
                    order ++;
                })
            },
            objectSpanMethod({row, column, rowIndex, columnIndex}) {
                if (columnIndex === 1) {
                    if (this.spanParentObject.size === 0) {
                        return ;
                    }
                    let key;
                    if (row.parentDistrictId === null) {
                        key = 'null';
                    } else {
                        key = row.parentDistrictId;
                    }
                    let index = this.spanParentObject.get(key).index;
                    let end = this.spanParentObject.get(key).end;
                    let start = 0;
                    if (index !== 0) {
                        this.spanParentObject.forEach((v,key) => {
                            if (v.index === (index - 1)) {
                                start = v.end + 1;
                            }
                        })
                    }
                    if (rowIndex === start) {
                        return {
                            rowspan: end - start + 1,
                            colspan: 1
                        }
                    }
                    else if (start < rowIndex <= end) {
                        return {
                            rowspan: 0,
                            colspan: 0
                        }
                    } else {
                        return {
                            rowspan: 1,
                            colspan: 1
                        }
                    }
                } else if (columnIndex === 2) {
                    if (this.spanObject.size === 0) {
                        return ;
                    }
                    let key;
                    if (row.districtId === null) {
                        key = 'null';
                    } else {
                        key = row.districtId;
                    }
                    let index = this.spanObject.get(key).index;
                    let end = this.spanObject.get(key).end;
                    let start = 0;
                    if (index !== 0) {
                        this.spanObject.forEach((v,key) => {
                            if (v.index === (index - 1)) {
                                start = v.end + 1;
                            }
                        })
                    }
                    if (rowIndex === start) {
                        return {
                            rowspan: end - start + 1,
                            colspan: 1
                        }
                    }
                    else if (start < rowIndex <= end) {
                        return {
                            rowspan: 0,
                            colspan: 0
                        }
                    } else {
                        return {
                            rowspan: 1,
                            colspan: 1
                        }
                    }
                } else {
                    return {
                        rowspan: 1,
                        colspan: 1
                    }
                }
            },
            handleTableDataCadre(data) {
                let parentDistrictIds = data.map(item => item.parentDistrictId);
                parentDistrictIds = new Set(parentDistrictIds);
                let order = 0;
                this.spanParentCadreObject.clear();
                parentDistrictIds.forEach((item) => {
                    if (item === null) {
                        item = 'null'
                    }
                    data.forEach((subItem, subIndex) => {
                        if (String(subItem.parentDistrictId) == item) {
                            this.spanParentCadreObject.set(item, {index: order, end: subIndex})
                        }
                    })
                    order ++;
                })

                let districtIds = data.map(item => item.districtId);
                districtIds = new Set(districtIds);
                order = 0;
                this.spanCadreObject.clear()
                districtIds.forEach(item => {
                    if (item === null) {
                        item = 'null'
                    }
                    data.forEach((subItem, subIndex) => {
                        if (String(subItem.districtId) == item) {
                            this.spanCadreObject.set(item, {index: order, end: subIndex})
                        }
                    })
                    order ++;
                })
            },
            objectSpanMethodCadre({row, column, rowIndex, columnIndex}) {
                if (columnIndex === 1) {
                    if (this.spanParentCadreObject.size === 0) {
                        return ;
                    }
                    let key;
                    if (row.parentDistrictId === null) {
                        key = 'null';
                    } else {
                        key = row.parentDistrictId;
                    }
                    let index = this.spanParentCadreObject.get(key).index;
                    let end = this.spanParentCadreObject.get(key).end;
                    let start = 0;
                    if (index !== 0) {
                        this.spanParentCadreObject.forEach((v,key) => {
                            if (v.index === (index - 1)) {
                                start = v.end + 1;
                            }
                        })
                    }
                    if (rowIndex === start) {
                        return {
                            rowspan: end - start + 1,
                            colspan: 1
                        }
                    }
                    else if (start < rowIndex <= end) {
                        return {
                            rowspan: 0,
                            colspan: 0
                        }
                    } else {
                        return {
                            rowspan: 1,
                            colspan: 1
                        }
                    }
                } else if (columnIndex === 2) {
                    if (this.spanCadreObject.size === 0) {
                        return ;
                    }
                    let key;
                    if (row.districtId === null) {
                        key = 'null';
                    } else {
                        key = row.districtId;
                    }
                    let index = this.spanCadreObject.get(key).index;
                    let end = this.spanCadreObject.get(key).end;
                    let start = 0;
                    if (index !== 0) {
                        this.spanCadreObject.forEach((v,key) => {
                            if (v.index === (index - 1)) {
                                start = v.end + 1;
                            }
                        })
                    }
                    if (rowIndex === start) {
                        return {
                            rowspan: end - start + 1,
                            colspan: 1
                        }
                    }
                    else if (start < rowIndex <= end) {
                        return {
                            rowspan: 0,
                            colspan: 0
                        }
                    } else {
                        return {
                            rowspan: 1,
                            colspan: 1
                        }
                    }
                } else {
                    return {
                        rowspan: 1,
                        colspan: 1
                    }
                }
            }
        },
        components: {
            CommonCRUD
        },
        created(){
            this.user = JSON.parse(sessionStorage.getItem('userInfo'));
            this.cadreColumns = this.$store.state.classInfo.properties;
            this.cadreFormColumns =this.$store.state.classInfo.properties;
            this.handleAuthority();
            this.handelOrg();
            tansfer(this.positionColumns);
            tansfer(this.cadreFormColumns);
        }
    }
</script>

<style>
    .vs-tabs--btn {
        font-size: 14px !important;
    }

</style>
