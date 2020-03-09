<template>
    <section class="secretaryManagement">
        <el-tabs>
            <el-tab-pane>
                <span slot="label"><i class="el-icon-date"></i> 基本信息</span>
                <SecretaryDetail v-if="secretaryDetailVis"
                                 :isReview="secretaryDetailReview"
                                 :isLook="!secretaryDetailReview"
                                 :isFromList="isFromList"
                                 @back="() => {this.secretaryDetailVis = false;
                                 this.secretaryDetailReview = false;
                                 this.isFromList = false}"
                                 @reviewFinish="() => {this.secretaryDetailReview = false}"
                                 :districtId="currentDetailDistrictId"></SecretaryDetail>
                <SecretaryList v-else @handleReview="handleReview"></SecretaryList>
            </el-tab-pane>
            <el-tab-pane label="考核详情">考核详情</el-tab-pane>
            <el-tab-pane label="员额详情">
                <RankDetails></RankDetails>
            </el-tab-pane>
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
    import RankDetails from "@/components/RankDetails";
    export default {
        name: "SecretaryManagement",
        data(){
            return{
                columns: StandardStrcutre.columns,
                secretaryDetailVis: true,
                secretaryDetailReview: false,
                currentDetailDistrictId: '',
                isFromList: false,
                user: {},
            }
        },
        methods:{
            handleReview(data) {
                this.currentDetailDistrictId = data.districtId;
                this.secretaryDetailReview = data.type === 'review';
                this.isFromList = true;
                this.secretaryDetailVis = true;
            }
        },
        components:{
            SecretaryDetail,
            SecretaryList,
            CommonCRUD,
            RankDetails
        },
        created() {
            this.user = this.$store.state.userInfo;
            this.secretaryDetailVis = this.user.roleCode === 'COUNTRY_SIDE_ACTOR';
            if (this.user.roleCode === 'COUNTRY_SIDE_ACTOR') {
                this.currentDetailDistrictId = this.user.districtId;
            }
        }
    }
</script>

<style scoped>

</style>
