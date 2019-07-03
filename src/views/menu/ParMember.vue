<template>
    <CommonCRUD :columns="columns" apiRoot="/identity/parMember" :formColumns="formColumns"></CommonCRUD>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    export default {
        name: "ParMember",
        data(){
            return {
                columns:[],
                formColumns:[],
            }
        },
        methods: {

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

<style scoped>

</style>
