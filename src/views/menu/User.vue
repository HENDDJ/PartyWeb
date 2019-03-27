<template>
    <section>
        <CommonCRUD :columns="$store.state.classInfo.properties" apiRoot="/identity/principal"
                    :formColumns="formColumns">
        </CommonCRUD>
        <!--<CommonCRUD :columns="$store.state.classInfo.properties" apiRoot="/identity/sysClass" :formColumns="$store.state.classInfo.properties"></CommonCRUD>-->
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    export default {
        name: 'User',
        data() {
            return {
                formColumns: []
            }
        },
        methods: {
            loadDepartmentOptions() {
                this.$http('POST', 'identity/organization/list', false).then(
                    data => {
                        this.formColumns.filter( item => item.name === 'organizationId')[0].options = data.map(item => { return {value: item.id, label: item.name}});
                    }
                )
                this.$http('POST', 'identity/role/list', false).then(
                    data => {
                        this.formColumns.filter( item => item.name === 'roleId')[0].options = data.map(item => { return {value: item.id, label: item.name}});
                    }
                )
            }
        },
        components: {
            CommonCRUD
        },
        created() {
            this.formColumns = this.$store.state.classInfo.properties;
            this.loadDepartmentOptions();
        }
    }
</script>

<style scoped>

</style>
