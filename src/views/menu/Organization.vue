<template>
    <section>
        <CommonCRUD :columns="$store.state.classInfo.properties" apiRoot="/identity/organization"
                    :formColumns="$store.state.classInfo.properties">
        </CommonCRUD>
        <!--<CommonCRUD :columns="$store.state.classInfo.properties" apiRoot="/identity/sysClass" :formColumns="$store.state.classInfo.properties"></CommonCRUD>-->
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    export default {
        name: 'Organization',
        data() {
            return {

            }
        },
        components: {
            CommonCRUD
        }
    }
</script>

<style scoped>

</style>
