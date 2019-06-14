<template>
    <section>
        <CommonCRUD :columns="columns" api-root="identity/positionInformation" :formColumns="formColumns" :queryFormColumns="queryColumns"></CommonCRUD>
    </section>
</template>

<script>
    export default {
        name: "PositionSituation",
        data(){
            return{
                columns:[],
                formColumns:{},
            }
        },
        methods: {

        },
        created(){
            this.columns = this.$store.state.classInfo.properties;
            this.formColumns =this.$store.state.classInfo.properties;
        }
    }
</script>

<style scoped>

</style>
