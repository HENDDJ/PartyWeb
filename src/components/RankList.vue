<template>
    <section class="rankList">
        <CommonCRUD
            ref="father" :columns="columns" api-root="identity/ratingStandard"
            :queryFormColumns="queryForm"
            :addBtnVis="false" :editBtnVis="false" :delBtnVis="false" :lookBtnVis="false">
            <!--<template slot="query" slot-scope="slotProps" v-if="userAuthority!=3">
                <el-form-item label="所属组织">
                    <el-cascader :props="propsOne"  placeholder="请选择组织" size="mini"
                                 style="margin-right: -28px;" @change="selValue" clearable></el-cascader>
                </el-form-item>
            </template>-->
            <template slot="header-btn" slot-scope="slotProps" >
                <el-button type="success" plain class="self-btn self-look" @click="look(slotProps.selected)">&nbsp;</el-button>
            </template>
        </CommonCRUD>
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    import RankListColumns from "@/views/data/RankListColumns";
    export default {
        name: "RankList",
        data(){
            return {
                columns:RankListColumns.columns,
                districtList:[],
                queryForm:[
                    {
                        des: '姓名',
                        name: 'name',
                        type: 'string',
                        value: '',
                        visible: true,
                    },
                    {
                        des: '是否是标准',
                        name: 'isStandard',
                        type: 'string',
                        value: '0',
                        visible: false,
                    },
                ],
                user:{},
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
                userAuthority:1,
                spanParentObject: new Map(),
                spanObject: new Map(),
               /* sortColumns: [
                    {
                        name: 'districtId',
                        type: 'asc'
                    }
                ],*/
                currentRow: {},
            }
        },
        methods:{
           /* selValue(val){
                if(val.length>0){
                    this.queryForm[2].value = val[val.length-1];
                }else{
                    this.queryForm[2].value = this.user.districtId;
                }
            },*/
           /* handleTableData(data) {
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
            },*/
           /* objectSpanMethod({row, column, rowIndex, columnIndex}) {
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
            },*/
            look(selected) {
                if (selected.length !== 1) {
                    this.$message({
                        type: 'warning',
                        message: selected.length > 1 ? '仅能选择一行记录' : '请选择一行记录'
                    });
                    return false;
                }else {
                    this.currentRow = selected[0];
                    this.$emit('handleRank', this.currentRow)
                }
            },
            /*handelOrg(){
                console.log(this.user);
                if(this.user.sysDistrict.districtLevel == 3){
                    this.userAuthority = 3;
                }else  if(this.user.sysDistrict.districtLevel == 2){
                    this.userAuthority = 2;
                }else{
                    this.userAuthority = 1;
                }
                //层级组织请求
                this.$http('GET',`identity/sysDistrict/${this.user.districtId}alltree`,false).then( data => {
                    this.districtList = data[0].children;
                    this.handleOrgLeaf(this.districtList);
                    this.formColumns.filter(item => item.name === 'districtId')[0].options = this.districtList;
                    if(this.userAuthority == 3){
                        let filterElement = this.formColumns.filter(item => item.name === 'districtId')[0];
                        filterElement.value = this.user.districtId;
                        filterElement.formShow = 'false';
                    }
                });
            },
            //处理村级组织children为空的情况
            handleOrgLeaf(districtList){
                districtList.forEach(item => {
                    if (item.children.length === 0) {
                        delete item.children;
                    } else {
                        this.handleOrgLeaf(item.children)
                    }
                })
            },*/
        },
        components: {
            CommonCRUD,
        },
        created () {
            this.user = sessionStorage.getItem("userInfo");
           // this.handelOrg();
        }
    }
</script>

<style>

</style>
