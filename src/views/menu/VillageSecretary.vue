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
                formColumns:{},
                queryForm:[
                    /*{
                        name: '',
                        type: 'string',
                        value: '',
                        visible: false
                    },*/
                ]
            }
        },
        components: {
            CommonCRUD
        },
        created(){
            this.columns = this.$store.state.classInfo.properties;
            this.formColumns =this.$store.state.classInfo.properties;
          //  this.queryForm[0].value = ;
        }
    }
</script>

<style scoped>

</style>
