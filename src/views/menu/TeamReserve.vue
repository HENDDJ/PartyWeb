<template>
    <section>
        <CommonCRUD :columns="columns" api-root="identity/reserve" :formColumns="formColumns" :queryFormColumns="queryForm"></CommonCRUD>
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
                ]
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
