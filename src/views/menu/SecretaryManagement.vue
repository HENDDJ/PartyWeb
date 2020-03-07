<template>
    <section class="secretaryManagement">
        <el-tabs>
            <el-tab-pane>
                <span slot="label"><i class="el-icon-date"></i> 基本信息</span>
                <SecretaryDetail v-if="$store.state.userInfo.roleCode === 'COUNTRY_SIDE_ACTOR'"></SecretaryDetail>
                <SecretaryList v-else></SecretaryList>
            </el-tab-pane>
            <el-tab-pane label="考核详情">考核详情</el-tab-pane>
            <el-tab-pane label="员额详情">员额详情</el-tab-pane>
            <el-tab-pane label="评级标准">
                <CommonCRUD :columns="columns" api-root="identity/ratingStandard" :formColumns="columns" >

                </CommonCRUD>
            </el-tab-pane>
        </el-tabs>
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    import StandardStrcutre from '../data/StandardStrcutre';
    import SecretaryDetail from "@/components/SecretaryDetail";
    import SecretaryList from "@/components/SecretaryList";
    export default {
        name: "SecretaryManagement",
        data(){
            return{
                columns:StandardStrcutre.columns,
            }
        },
        methods:{
        },
        components:{
            SecretaryDetail,
            SecretaryList,
            CommonCRUD
        },
        created() {
        }
    }
</script>

<style scoped>

</style>
