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
                districtList:[],
                ceshi:[
                    {
                        value: 'zhinan',
                        label: '指南',
                        children: [{
                            value: 'shejiyuanze',
                            label: '设计原则',
                        }],
                    },
                    {
                        value: 'zhinan1',
                        label: '指南1',
                        children: [{
                            value: 'shejiyuanze',
                            label: '设计原则1',
                        }],
                    },
                ],
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


              //  this.formColumns.filter(sub => sub.name === 'districtId')[0].options= this.ceshi;

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

