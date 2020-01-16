<template>
    <section>
        <div>
            <el-card shadow="hover">
                <el-row>
                    <el-col :span="12">
                        <img src="@/svg/testuser.svg" class="image"/>
                    </el-col>
                    <el-col :span="12">
                        <div class="labelPosiotn">{{testUser.name}}</div>
                        <div style="text-align: left">
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
                    </el-col>
                </el-row>
            </el-card>
            <el-card shadow="hover">
                <el-row>
                    <el-col :span="12">
                        <img src="@/svg/time2.svg" class="image"/>
                    </el-col>
                    <el-col :span="12">
                        <div class="labelPosiotn">{{shotScreen.name}}</div>
                        <div style="text-align: left">
                            <vs-input-number @click="updateShotTime()" color="success" v-model="shotScreen.codeValue"/>
                        </div>
                    </el-col>
                </el-row>


            </el-card>
            <el-card shadow="hover" v-for= "item in authTokenList" :key="item.id">
                <el-row>
                    <el-col :span="12">
                        <img src="@/svg/auth.svg" class="image"/>
                    </el-col>
                    <el-col :span="12">
                        <div class="labelPosiotn"><b>{{item.name}}</b></div>
                        <div style="text-align: left">
                            <el-switch
                                v-model="item.isUse"
                                active-text="可访问"
                                inactive-text="不可访问"
                                active-value="1"
                                inactive-value="0"
                                @change="handleAuthToken(item)"
                                style="height: 27px;">
                            </el-switch>
                        </div>
                    </el-col>
                </el-row>
            </el-card>
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
                },
                authTokenList:[],
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
                this.$http("PUT", `identity/sysConfiguration/${this.testUser.id}isDelete`,this.testUser).then(() => {
                    this.showConfigList();
                })
            },
            updateShotTime(){
                this.$http("PUT",`identity/sysConfiguration/${this.shotScreen.id}id`,this.shotScreen).then( ()=> {
                    this.showConfigList();
                })
            },
            showAuthTokenList(){
                this.$http("POST",`/identity/authorizationToken/list`,false).then( (data)=> {
                    this.authTokenList = data;
                })
            },
            handleAuthToken(item){
                this.$http("POST", `/identity/authorizationToken/updateRedis/${item.id}id/${item.isUse}`).then(() => {
                    this.showAuthTokenList();
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
        created(){
            this.showConfigList();
            this.showAuthTokenList();
        }
    }
</script>

<style scoped>
    .vs-input-number{
        background: transparent;
    }
    .el-card{
        width: 360px;
        height: 160px;
        float: left;
        margin: 20px;
    }
    .image{
        float: left;
        width: 150px;
        height: 120px;
    }
    .labelPosiotn{
        font-size: 14px;
        text-align: left;
        margin-top: 32px;
        margin-bottom: 5px;
    }
    .vs-input-number {
        justify-content: left;
        padding-left: 10px;
        margin: 0;
    }
</style>
