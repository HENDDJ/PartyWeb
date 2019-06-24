<template>
    <section>
        <CommonCRUD :columns="columns" api-root="identity/sysConfiguration" :formColumns="formColumns"></CommonCRUD>
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    export default {
        name: "SysConfiguration",
        data(){
            return {
                columns:[],
                formColumns:{},
            }
        },
        components: {
            CommonCRUD
        },
        methods:{
          handleTestAccount(){
              this.$http("POST",`identity/sysConfiguration/list`,{code:'USE_TEST_ACCOUNT'},false).then( data=>{
                  let isUse = Number(data[0].codeValue);
                  console.log(isUse)
                /*  this.$http("PUT",`identity/sysUser/${"6a97c2d9-ae44-402e-b117-2a1b55ded4d8"}id`,{isDelete:isUse});
                  this.$http("PUT",`identity/sysUser/${"6bc3aad9-78cb-4a79-9154-fdf02dec1fe4"}id`,{isDelete:isUse});*/
              })
          }

        },
        created(){
            this.columns = this.$store.state.classInfo.properties;
            this.formColumns =this.$store.state.classInfo.properties;
            this.handleTestAccount();
        }
    }
</script>

<style scoped>

</style>
