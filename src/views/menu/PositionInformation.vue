<template>
    <section>
        <CommonCRUD :columns="columns" api-root="identity/positionInformation" :formColumns="formColumns" ></CommonCRUD>
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    import LookUp from '@/lookup';
    import { tansfer } from "../../lookup/transfer";
    export default {
        name: "PositionInformation",
        data(){
            return {
                columns:[],
                formColumns:{},
                districtList:[],
            }
        },
        methods: {
            handleSelectOptions() {
                let  items = [
                    ['type', 'PositionType'],
                ].forEach(item => {
                    this.formColumns.filter(sub => sub.name === item[0])[0].options = LookUp[item[1]]
                })
            },
            showAllOrg(){
                this.$http('POST',`identity/sysDistrict/list?districtLevel=3` ,false).then(data => {
                   data.forEach(item => {
                       this.districtList.push( {label:item.districtName,value:item.districtId})
                    });
                    this.formColumns.filter(sub => sub.name === 'districtId')[0].options= this.districtList;
                });

            }
        },
        components: {
            CommonCRUD
        },
        created(){
            this.columns = this.$store.state.classInfo.properties;
            this.formColumns =this.$store.state.classInfo.properties;
            this.showAllOrg();
            this.handleSelectOptions();
            tansfer(this.columns);


        }
    }
</script>

<style scoped>

</style>

