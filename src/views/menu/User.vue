<template>
    <CommonCRUD :columns="columns" apiRoot="/identity/sysUser" :formColumns="formColumns"></CommonCRUD>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    import UserStrcutre from '../data/UserStrcutre';
    export default {
        name: "User",
        data() {
            return {
                columns: UserStrcutre.columns,
                formColumns: UserStrcutre.columns,
            }
        },
        methods: {
            changeCol() {
                this.columns.forEach(
                    item=>{
                        if(item.name == 'enable'){
                            item.formatter = (row, cell,val,index)=>{
                                console.log(val)
                                if(val == '1'){
                                    return '是'
                                }else{
                                    return '否'
                                }
                            }
                        }

                }
                )
                this.$http('Post','identity/role/list',false).then((data)=>{
                    this.formColumns.filter(item=>item.name === 'roleID')[0].options =data.map(item=>{return {label:item.name,value:item.id}})
                })
                this.$http('Post','identity/sysDistrict/list',false).then((data)=>{
                    this.formColumns.filter(item=>item.name === 'organizationId')[0].options =data.map(item=>{return {label:item.districtName,value:item.id}})
                })
            },

        },
        created(){
            this.changeCol();
        },
        components: {
            CommonCRUD
        }
    }
</script>

<style scoped>

</style>
