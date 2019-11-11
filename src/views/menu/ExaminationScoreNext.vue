<template>
    <div>
        <div class="blockData">
            <div style="text-align: left">
                <span style="display:inline-block;margin-left: 10px">年份：</span>
                <vs-select style="display: inline-block;margin-left: -5px" label="" v-model="chooseYear" width="120px" @change="selectYear">
                    <vs-select-item :key="index" :value="item.value" :text="item.text" v-for="item,index in yearOptions"/>
                </vs-select>
                <span style="display: inline-block;margin-left: 50px" v-if="regionOptionsShow">区域：</span>
                <vs-select v-if="regionOptionsShow" style="display: inline-block;margin-left: -5px" label="" v-model="chooseRegion" width="120px" @change="selectRegion">
                    <vs-select-item :key="index" :value="item.value" :text="item.text" v-for="item,index in regionOptions"/>
                </vs-select>
                <el-radio-group v-model="radioName" size="medium" style="display: inline-block;margin-left: 50px"  @change="handleRadioGroup" v-if="regionOptionsShow">
                    <el-radio-button label="农村"></el-radio-button>
                    <el-radio-button label="机关" ></el-radio-button>
                </el-radio-group>
            </div>

            <div v-for="item in examList" class="blockZhen">
                <div class="blockZhenItem">
                    <div class="itemUp">{{item.town}}</div>
                    <div class="itemDown">
                        <a>{{item.townExam}}分
                            <span v-if="item.townScore<0.1" style="color:red;font-size: 17px">({{item.townScore|percent}}%)</span>
                            <span v-else-if="item.townScore<0.5" style="color:rgb(237, 156, 5);font-size: 17px">({{item.townScore|percent}}%)</span>
                            <span v-else-if="item.townScore<0.8" style="color:rgba(78,103,179,0.7);font-size: 17px">({{item.townScore|percent}}%)</span>
                            <span v-else style="color:#1bc821;font-size: 17px">({{item.townScore|percent}}%)</span>
                            </a>
                    </div>
                </div>
                <div class="blockCunList">
                    <template v-for="sub in item.children">
                        <div class="blockCunItem" @click="showDialog(sub.town)">
                            <div class="itemUp">{{sub.town}}</div>
                            <div class="itemDown">
                                <a>{{sub.townExam}}分
                                    <span v-if="sub.townScore<0.1" style="color:red;font-size: 17px">({{sub.townScore|percent}}%)</span>
                                    <span v-else-if="sub.townScore<0.5" style="color:rgb(237, 156, 5);font-size: 17px">({{sub.townScore|percent}}%)</span>
                                    <span v-else-if="sub.townScore<0.8" style="color:rgba(78,103,179,0.7);font-size: 17px">({{sub.townScore|percent}}%)</span>
                                    <span v-else style="color:#1bc821;font-size: 17px">({{sub.townScore|percent}}%)</span>
                                </a>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>

        <el-dialog title="完成情况" width="880px" :visible.sync="diaShow" align="left" :append-to-body="true">
            <vs-list class="esStyle">
                <vs-list-header icon="offline_pin" title="已完成" style="font-size: 20px"></vs-list-header>
                <vs-list-item>
                    <div style="margin-left: 0px" v-for="item in detailOk">
                        <vs-chip style="display:flex;flex-wrap: wrap;margin-left: 5px" color="#24c1a0">{{item.title}}</vs-chip>
                    </div>
                </vs-list-item>
            </vs-list>
            <vs-list class="esStyle">
                <vs-list-header icon="hourglass_full" title="待审核" style="font-size: 20px;color: #fabe49"></vs-list-header>
                <vs-list-item>
                    <div style="margin-left: 0px" v-for="item in detailWait">
                        <vs-chip style="display:flex;flex-wrap: wrap;margin-left: 5px" color="rgb(173, 159, 92)">{{item.title}}</vs-chip>
                    </div>
                </vs-list-item>
            </vs-list>
            <vs-list class="esStyle">
                <vs-list-header icon="info" title="未完成" style="font-size: 20px;color: #b94a48"></vs-list-header>
                <vs-list-item>
                    <div style="margin-left: 0px" v-for="item in detailNot">
                        <vs-chip style="display:flex;flex-wrap: wrap;margin-left: 5px" color="rgb(199, 89, 47)">{{item.title}}</vs-chip>
                    </div>
                </vs-list-item>
            </vs-list>
        </el-dialog>
    </div>

</template>

<script>
    import Layout from "@/layout/Layout";
    export default {
        name: "ExaminationScoreNext",
        components: {Layout},
        data() {
            return {
                yearOptions: [],
                regionOptions: [],
                chooseYear: 2019,
                chooseRegion: '',
                regionOptionsShow: true,
                diaShow:false,
                detailNot:[],
                detailOk:[],
                detailWait:[],
                user:{},
                radioName:'农村',
                radioValue:'Party',
                examList:[],
            }
        },
        methods: {
            selectYear(val) {
                this.chooseYear = val;
                this.getStaticsData();
            },
            selectRegion(val) {
                this.chooseRegion = val;
                this.getStaticsData();
            },
            authority() {
                this.user = JSON.parse(sessionStorage.getItem('userInfo'));
                if (this.user.sysDistrict.districtLevel === 1) {
                    this.chooseRegion = '';
                    this.regionOptionsShow = true
                } else {
                    this.chooseRegion = this.user.organizationName;
                    this.regionOptionsShow = false
                }
            },

            //取得参数数据
            getStaticsData() {
                let path = `identity/exaScore/examScoreAll?page=0&size=1000&search=${this.chooseRegion}&year=${this.chooseYear}&districtType=${this.radioValue}`;
                return this.$http('Post', path, false).then((data) => {
                    this.examList = data;
                })
            },
            showDialog(val){
               this.$http('Post','identity/parActivityObject/examScoreDetail?districtName='+val+"&year="+this.chooseYear).then((data)=>{
                   this.detailOk = [];
                   this.detailWait = [];
                   this.detailNot = [];
                   data.forEach(item=>{
                       if(item.sta === 2){
                           this.detailOk.push(item)
                       }else if(item.sta === 1){
                           this.detailWait.push(item)
                       }else {
                           this.detailNot.push(item)
                       }
                   })
               });
                this.diaShow = true
            },
            handleRadioGroup(value) {
                this.chooseRegion = '';
                if (value === '农村') {
                    this.radioName = '农村';
                    this.radioValue = 'Party' ;
                    this.loadList(this.radioValue);
                } else if (value=== '机关') {
                    this.radioName = '机关';
                    this.radioValue = 'Office' ;
                    this.loadList(this.radioValue);
                } else {
                    console.log('类型错误')
                }
            },
            loadList(value){
                let nowYear = new Date().Format('yyyy');
                let interval = Number(nowYear) - 2017;
                for (let i = 0; i <= interval; i++) {
                    this.yearOptions.push({text: i + 2017, value: i + 2017})
                }
                this.chooseYear = Number(nowYear);
                this.$http('Post', 'identity/sysDistrict/list', {attachTo: '01', districtLevel: 2, districtType: value, isDelete: 0}, false).then(
                    data => {
                        this.regionOptions = data.map(item => {
                            return {text: item.districtName, value: item.districtName}
                        });
                        this.regionOptions.splice(0, 0, {text: '全市', value: ''});
                        this.getStaticsData();
                    }
                )
            }
        },
        created() {
            this.authority();
            if(this.user.sysDistrict.districtLevel === 1){
                this.loadList('Party');
            }else{
                this.loadList();
            }


        },
        filters: {
            percent(val) {
                return (val * 100).toString().substring(0, 4)
            }
        }
    }
</script>

<style scoped>

</style>
<style>
    .blockData {
        width: 97%;
        margin: 10px auto auto;
    }

    .blockZhen {
        display: flex;
        margin-top: 10px;
        flex-direction:row
    }

    .blockZhenItem {
        margin-left: 10px;
        margin-right: 20px;
        height: 80px;
        border: 1px solid black;
        margin-top: 20px;
        border-radius: 4px;
        box-shadow: 0 4px 25px 0 rgba(0, 0, 0, .2);
        transition: all .3s ease;
    }
    .blockZhenItem:hover {
        box-shadow: 0 0 5px 0 rgba(0,0,0,.1);
    }

    .blockCunList {
        margin-left: 10px;
        display: flex;
        flex-wrap: wrap;
    }

    .blockCunItem {
        margin-left: 15px;
        width: 125px;
        height: 80px;
        border: 1px solid black;
        margin-top: 20px;
        border-radius: 4px;
        box-shadow: 0 3px 14px 0 rgba(0, 0, 0, .2);
        transition: all .3s ease;
    }
    .blockCunItem:hover{
        box-shadow: 0 0 5px 0 rgba(0,0,0,.1);
        cursor: pointer;
    }

    .itemUp {
        width: 101%;
        margin-left: -0.5px;
        height: 40%;
        background: #640064;
        background-image: linear-gradient(30deg,rgba(var(--vs-primary),1),rgba(var(--vs-primary),.5))!important;
        font-size: 17px;
        color: white;
        border-top-left-radius:4px;
        border-top-right-radius:4px;
        line-height: 32px;
    }

    .blockZhenItem .itemUp {
        width: 130px;
    }

    .itemDown {
        width: 100%;
        height: 50%;
        font-size: 20px;
        border-top-left-radius:4px;
        border-top-right-radius:4px;
        line-height: 40px;
        color:red;
    }

    .itemDown a {
        position: relative;
        vertical-align: middle;
        top: 3px;
    }
    .esStyle .vs-list--slot {
       margin-left: 15px;
        width:90%;
    }
</style>
