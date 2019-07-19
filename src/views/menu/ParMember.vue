<template>
    <CommonCRUD :columns="columns" apiRoot="/identity/parMember" :formColumns="formColumns">
        <template slot="header-btn" slot-scope="slotProps">
            <el-cascader :props="props" placeholder="选择镇名" size="small"></el-cascader>
        </template>
    </CommonCRUD>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    export default {
        name: "ParMember",
        data() {
            return {
                columns: [],
                formColumns: [],
                self:this,
                props: {
                    lazy: true,
                    lazyLoad:(node, resolve)=>{
                        if(node.level==0){
                            let nodes = []
                            this.$http('GET', `/identity/sysDistrict/01tree`, false).then((data) => {
                                data.forEach(item=>{
                                    nodes.push({label:item.label,value:item.id,leaf:item.leaf})
                                })
                                resolve(nodes);
                            })

                        }else {
                            let nodes = []
                            this.$http('GET', `/identity/sysDistrict/${node.value}tree`, false).then((data) => {
                                data.forEach(item=>{
                                    nodes.push({label:item.label,value:item.id,leaf:item.leaf})
                                })
                                resolve(nodes);
                            })
                        }

                    }
                }
            }
        },
        methods: {
            getNodeData(val){
                this.$http('GET', `/identity/sysDistrict/${val}tree`, false).then((data) => {
                    return data
                })
            }
        },
        components: {
            CommonCRUD
        },
        mounted () {
            this.columns = this.$store.state.classInfo.properties;
            this.formColumns =this.$store.state.classInfo.properties;
        }
    }
</script>

<style>
    .el-cascader--small{
        width: 178px !important;
    }
</style>
<style scoped>

</style>
