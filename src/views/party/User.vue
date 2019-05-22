<template>
    <CommonCRUD :columns="columns" apiRoot="/identity/sysUser"></CommonCRUD>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    import UserStrcutre from '../data/UserStrcutre';
    export default {
        name: "User",
        data() {
            return {
                columns: UserStrcutre.columns
            }
        },
        methods: {

        },
        components: {
            CommonCRUD
        }
    }
</script>

<style scoped>

</style>
