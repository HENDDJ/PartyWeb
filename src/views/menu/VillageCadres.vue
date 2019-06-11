<template>
    <section>
        <vs-tabs :color="colorx">
            <vs-tab @click="colorx = 'success'" label="村干部信息">
                <div class="con-tab-ejemplo">
                    <CommonCRUD :columns="cadreColumns" api-root="identity/villageCadres" :formColumns="cadreFormColumns" :queryFormColumns="cadreQuery"></CommonCRUD>
                </div>
            </vs-tab>
            <vs-tab @click="handleSelect()" label="岗位信息">
                <div class="con-tab-ejemplo">
                    <CommonCRUD :columns="positionColumns" api-root="identity/cadrePosition" :formColumns="positionFormColumns" :queryFormColumns="positionQuery"></CommonCRUD>
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
                zhenList:[],//所有镇级
                cadreColumns:[],//村干部列表
                cadreFormColumns:{},//村干部表单
                //村干部查询条件
                cadreQuery:[
                    {
                        des: '名称',
                        name: 'name',
                        type: 'string',
                        value: '',
                        visible: true,
                    },
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
                        type: 'select',
                        visible: true,
                        options: ''
                    }
                ],
                //岗位列表
                positionColumns:[
                    {
                        name: 'name',
                        des: '名称'
                    },
                    {
                        name: 'post',
                        des: '职位',
                        transferType: 'lookup',
                        lookupKey: 'Post'
                    },
                    {
                        name: 'districtName',
                        des: '所属组织'
                    },
                    {
                        name: 'workPlace',
                        des: '工作地点'
                    },
                    {
                        name: 'duty',
                        des: '职责'
                    },
                    {
                        name: 'cadreName',
                        des: '任职干部'
                    }
                ],
                //岗位表单
                positionFormColumns:[
                    {
                        name: 'name',
                        des: '名称',
                        type: 'string',
                    },
                    {
                        name: 'post',
                        des: '职位',
                        type: 'select',
                    },
                    {
                        name: 'districtId',
                        des: '所属组织',
                        type: 'cascader',
                        options: 'districtList',
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
            }
        },
        methods:{
            handleSelect(){
                this.colorx = 'danger';
                //层级组织请求
                this.$http('GET',`identity/sysDistrict/${'01'}alltree`,false).then( data => {
                    this.districtList = data[0].children;
                    this.handleOrgLeaf(this.districtList)
                    this.positionFormColumns.filter(item => item.name === 'districtId')[0].options= this.districtList;
                });
                //镇级组织
                this.$http('POST',`identity/sysDistrict/list`,{districtLevel:2},false).then(data => {
                    data.forEach( item => {
                        this.zhenList.push( {value:item.districtId , label:item.districtName});
                    });
                    this.positionQuery[1].options = this.zhenList;
                });
                //任职人员
                this.$http('POST',`identity/villageCadres/list` ,false).then(data => {
                    this.villageCadreList = data;
                    this.positionFormColumns.filter( item => item.name === 'cadreId')[0].options = data.map(item => { return {value: item.id, label: item.name}});
                });
                //岗位显示中文
                this.positionFormColumns.filter(item => item.name === 'post')[0].options = LookUp['Post'];
            },

            //处理村级组织children为空的情况
            handleOrgLeaf(districtList){
                districtList.forEach(item => {
                    item.children.forEach(subitem => {
                        delete subitem.children;
                    })
                })
            }
        },
        components: {
            CommonCRUD
        },
        created(){
            this.cadreColumns = this.$store.state.classInfo.properties;
            this.cadreFormColumns =this.$store.state.classInfo.properties;
            tansfer(this.positionColumns)
        }
    }
</script>

<style scoped>

</style>
