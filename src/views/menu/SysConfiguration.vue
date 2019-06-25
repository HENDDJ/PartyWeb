<template>
    <section>
        <div><span style="float: left;font-size: 14px;">{{testUser.name}}</span>
            <el-switch
                v-model="testUser.codeValue"
                active-text="可用"
                inactive-text="不可用"
                active-value="0"
                inactive-value="1"
                @change="handleTestUser()">
            </el-switch>
        </div>
        <div><span style="float: left;font-size: 14px;">{{shotScreen.name}}</span>
            <vs-input-number @click="updateShotTime()" color="success" v-model="shotScreen.codeValue"/>
        </div>
    </section>

</template>

<script>
    export default {
        name: "SysConfiguration",
        data(){
            return {
                testUser:{},
                shotScreen:{
                    id:'',
                    name:'',
                    code:'',
                    codeValue:''
                }
            }
        },
        methods:{
            showConfigList(){
                this.$http("POST",`identity/sysConfiguration/list`,false).then( data => {
                    data.forEach( item => {
                        if(item.code==='USE_TEST_ACCOUNT'){
                            this.testUser = item;
                        }
                        if(item.code==='SCREEN_CAPTURE_TIME'){
                            this.shotScreen = item;
                        }
                    })
                })
            },

            handleTestUser(){
                this.$http("PUT", `identity/sysConfiguration/${this.testUser.id}isDelete`,this.testUser, false).then(() => {
                    this.showConfigList();
                })
            },
            updateShotTime(){
                this.$http("PUT",`identity/sysConfiguration/${this.shotScreen.id}id`,this.shotScreen,false).then( ()=> {
                    this.showConfigList();
                })
            }

        },
        watch: {
            'shotScreen.codeValue': {
                handler(newNumber, oldNumber) {
                    this.updateShotTime();
                },
            }
        },
        created(){
            this.showConfigList();
        }
    }
</script>

<style scoped>
    .vs-input-number{
        background: transparent;
    }
</style>
