<template>
    <section>
        <CommonCRUD :columns="columns" api-root="identity/villageCadres" :formColumns="formColumns" :queryFormColumns="queryForm"></CommonCRUD>
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    export default {
        name: "VillageSecretary",
        data(){
            return {
                columns:[],
                formColumns:[],
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
                        name: 'post',
                        type: 'string',
                        value: '',
                        visible: false
                    },
                ]
            }
        },
        methods:{
            handelOrg(){
                //层级组织请求
                this.$http('GET',`identity/sysDistrict/${'01'}alltree`,false).then( data => {
                    this.districtList = data[0].children;
                    this.handleOrgLeaf(this.districtList);
                    this.formColumns.filter(item => item.name === 'districtId')[0].options = this.districtList;
                });
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
            this.queryForm[1].value = 'SECRETARY';
            this.handelOrg();
        }
    }
</script>

<style scoped>

</style>
