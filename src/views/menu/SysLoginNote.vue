<template>
    <section>
        <CommonCRUD  :columns="columns"
                     apiRoot="/identity/sysLoginNote"
                     :sortColumns="sortColumns"
                     :addBtnVis=false
                     :editBtnVis=false
                     :lookBtnVis = false
                     :delBtnVis=false
        ></CommonCRUD>
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    export default {
        name: "SysLoginNote",
        data() {
            return {
                columns:[],
                sortColumns:[
                    {
                        name:'createdAt',
                        type:'desc'
                    }
                ]
            };
        },
        methods: {
        },
        components: {
            CommonCRUD
        },
        created() {
            this.columns = this.$store.state.classInfo.properties;
        }
    }
</script>

<style scoped>
</style>
