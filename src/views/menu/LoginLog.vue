<template>
    <section>
        <CommonCRUD :queryFormColumns="queryColumns" :addBtnVis="false" :editBtnVis="false" :delBtnVis="false":columns="$store.state.classInfo.properties" apiRoot="/identity/sysLoginLog"
                    :formColumns="formColumns" :sortColumns="sortColumns">
        </CommonCRUD>
        <!--<CommonCRUD :columns="$store.state.classInfo.properties" apiRoot="/identity/sysClass" :formColumns="$store.state.classInfo.properties"></CommonCRUD>-->
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    export default {
        name: 'SysLoginLog',
        data() {
            return {
                formColumns: [],
                queryColumns:[
                    {
                        des: '姓名',
                        name: 'userName',
                        type: 'string'
                    },
                    {
                        des: '开始时间',
                        name: 'startTime',
                        type: 'datetime'
                    },
                    {
                        des: '结束时间',
                        name: 'endTime',
                        type: 'datetime'
                    }
                ],
                sortColumns: [
                    {
                        name: 'loginTime',
                        type: 'desc'
                    }
                ]
            }
        },
        methods: {

        },
        components: {
            CommonCRUD
        },
        created() {
            this.formColumns = this.$store.state.classInfo.properties;


        }
    }
</script>

<style scoped>

</style>
