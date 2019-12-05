<template>
    <section>
        <el-row :gutter="12">
            <el-col :span="6">
                <el-card shadow="hover">
                   <img src="@/svg/testuser.svg" class="image"/>
                    <div class="labelPosiotn">{{testUser.name}}<br/><br/>
                        <el-switch
                            v-model="testUser.codeValue"
                            active-text="可用"
                            inactive-text="不可用"
                            active-value="0"
                            inactive-value="1"
                            @change="handleTestUser()"
                        style="height: 27px;">
                        </el-switch>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover">
                    <img src="@/svg/time2.svg" class="image"/>
                    <div class="labelPosiotn">{{shotScreen.name}}<br/><br/>
                        <vs-input-number @click="updateShotTime()" color="success" v-model="shotScreen.codeValue"/>
                    </div>
                </el-card>
            </el-col>
        </el-row>
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
                    newNumber = Number(newNumber);
                    oldNumber = Number(oldNumber);
                    if(newNumber!==oldNumber &&oldNumber!==0){
                        this.updateShotTime();
                    }
                },
            },
        },
    }
</script>

<style scoped>
    .vs-input-number{
        background: transparent;
    }
    .el-card{
        width: 350px;
        height: 160px;
    }
    .image{
        float: left;
        width: 150px;
        height: 120px;
    }
    .labelPosiotn{
        font-size: 14px;
        text-align: left;
        margin: 32px 12px;
    }
    .vs-input-number {
        justify-content: left;
        padding-left: 10px;
        margin: 0;
    }
</style>
