<template>
    <section>
        <CommonCRUD :columns="columns" apiRoot="/identity/authorizationToken" :formColumns="formColumns">
            <template slot="Handle" slot-scope="scope">
                <el-tag v-if="scope.row.isUse==='1'" close-transition  type="success"  effect="dark">可以访问</el-tag>
                <el-tag v-else close-transition type="danger"  effect="dark">不可访问</el-tag>
            </template>
        </CommonCRUD>
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    export default {
        name: "authorization-token",
        data() {
            return {
                formColumns: [],
                columns:[]
            }
        },
        methods: {},
        components: {
            CommonCRUD
        },
        created() {
            let columnTemp = JSON.parse(JSON.stringify(this.$store.state.classInfo.properties));
            let formTemp = JSON.parse(JSON.stringify(this.$store.state.classInfo.properties));
            this.formColumns = formTemp;
            this.columns = columnTemp;
            this.columns.push({slot: true, name: 'isUse', des: '是否使用', slotName: 'Handle'});
        }
    }
</script>

<style scoped>

</style>
