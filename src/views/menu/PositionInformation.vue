<template>
    <section>
        <CommonCRUD :columns="columns" api-root="identity/positionInformation" :formColumns="formColumns" :queryFormColumns="queryColumns"></CommonCRUD>
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    import LookUp from '@/lookup';
    import { tansfer } from "../../lookup/transfer";
    export default {
        name: "PositionInformation",
        data(){
            return {
                columns:[],
                formColumns:{},
                districtList:[],//所有组织层级
                zhenList:[],//所有镇级
                queryColumns:[
                    {
                        des: '名称',
                        name: 'name',
                        type: 'string',
                        value: '',
                        visible: true,
                    },
                    {
                        des: '阵地类型',
                        name: 'type',
                        type: 'select',
                        visible: true,
                        options:LookUp['PositionType']
                    },
                    {
                        des: '所属组织',
                        name: 'districtId',
                        type: 'select',
                        visible: true,
                        options: ''
                    }
                ],
            }
        },
        methods: {
            handleSelectOptions() {
                let  items = [
                    ['type', 'PositionType'],
                ].forEach(item => {
                    this.formColumns.filter(sub => sub.name === item[0])[0].options = LookUp[item[1]]
                })
            },
            showAllOrg(){
                //层级组织请求
                this.$http('GET',`identity/sysDistrict/${'01'}alltree`,false).then( data => {
                    this.districtList = data[0].children;
                    this.handleOrgLeaf(this.districtList);
                    this.formColumns.filter(sub => sub.name === 'districtId')[0].options= this.districtList;
                });
                //镇级组织
                this.$http('POST',`identity/sysDistrict/list`,{districtLevel:2},false).then(data => {
                    data.forEach( item => {
                        this.zhenList.push( {value:item.districtId , label:item.districtName});
                    })
                    this.queryColumns[2].options = this.zhenList;
                })
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
            this.columns = this.$store.state.classInfo.properties;
            this.formColumns =this.$store.state.classInfo.properties;
            this.showAllOrg();
            this.handleSelectOptions();
            tansfer(this.columns);
        }
    }
</script>

<style scoped>

</style>

