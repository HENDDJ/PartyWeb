<template>
    <section>
        <CommonCRUD :columns="columns" api-root="identity/reserve" :formColumns="formColumns" :queryFormColumns="queryForm">
            <template slot="header-btn" slot-scope="slotProps">
                <el-cascader :props="props" placeholder="选择镇名" size="small"></el-cascader>
            </template>
        </CommonCRUD>
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    export default {
        name: "TeamReserve",
        data(){
            return {
                columns:[],
                formColumns:[],
                queryForm:[
                    {
                        des: '姓名',
                        name: 'name',
                        type: 'string',
                        value: '',
                        visible: true,
                    }
                ],
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
        components: {
            CommonCRUD
        },
        created(){
            this.columns = this.$store.state.classInfo.properties;
            this.formColumns =this.$store.state.classInfo.properties;
        }
    }
</script>

<style scoped>

</style>
