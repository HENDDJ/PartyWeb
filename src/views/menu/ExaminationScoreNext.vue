<template>
    <div>
        <div class="blockData">
            <div style="text-align: left">
                <span style="display:inline-block;margin-left: 10px">年份：</span>
                <vs-select
                    class="selectExample"
                    style="display: inline-block;margin-left: -5px"
                    label=""
                    v-model="chooseYear"
                    width="120px"
                    @change="selectYear"
                >
                    <vs-select-item :key="index" :value="item.value" :text="item.text" v-for="item,index in yearOptions"/>
                </vs-select>

                <span style="display: inline-block;margin-left: 50px" v-if="regionOptionsShow">区域：</span>
                <vs-select
                    v-if="regionOptionsShow"
                    class="selectExample"
                    style="display: inline-block;margin-left: -5px"
                    label=""
                    v-model="chooseRegion"
                    width="120px"
                    @change="selectRegion"
                >
                    <vs-select-item :key="index" :value="item.value" :text="item.text" v-for="item,index in regionOptions"/>
                </vs-select>

            </div>

            <div v-for="item in arrangedData" class="blockZhen">
                <div class="blockZhenItem">
                    <div class="itemUp">{{item.town}}</div>
                    <div class="itemDown">
                        <a>{{item.cun[0].townExam}}分
                            <span v-if="item.cun[0].townScore<0.1" style="color:red;font-size: 15px">({{item.cun[0].townScore|percent}}%)</span>
                            <span v-else-if="item.cun[0].townScore<0.5" style="color:rgb(237, 156, 5);font-size: 15px">({{item.cun[0].townScore|percent}}%)</span>
                            <span v-else-if="item.cun[0].townScore<0.8" style="color:#bce423;font-size: 15px">({{item.cun[0].townScore|percent}}%)</span>
                            <span v-else style="color:#1bc821;font-size: 15px">({{item.cun[0].townScore|percent}}%)</span>
                            </a>
                    </div>
                </div>
                <div class="blockCunList">
                    <template v-for="(val,index) in item.cun">
                        <div class="blockCunItem">
                            <div class="itemUp">{{val.cun}}</div>
                            <div class="itemDown">
                                <a>{{val.exam}}分
                                    <span v-if="item.cun[0].townScore<0.1" style="color:red;font-size: 15px">({{val.score|percent}}%)</span>
                                    <span v-else-if="item.cun[0].townScore<0.5" style="color:rgb(237, 156, 5);font-size: 15px">({{val.score|percent}}%)</span>
                                    <span v-else-if="item.cun[0].townScore<0.8" style="color:#bce423;font-size: 15px">({{val.score|percent}}%)</span>
                                    <span v-else style="color:#1bc821;font-size: 15px">({{val.score|percent}}%)</span>
                                </a>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ExaminationScoreNext",
        data() {
            return {
                yearOptions: [],
                regionOptions: [],
                chooseYear: 2019,
                chooseRegion: '',
                regionOptionsShow: true,
                noRepeatTown: [],
                arrangedData: [],

            }
        },
        methods: {
            selectYear(val) {
                this.chooseYear = val
                this.getStaticsData();
            },
            selectRegion(val) {
                this.chooseRegion = val
                this.getStaticsData();
            },
            authority() {
                let user = JSON.parse(sessionStorage.getItem('userInfo'))
                if (user.sysDistrict.districtLevel == 1) {
                    this.chooseRegion = ''
                    this.regionOptionsShow = true
                } else {
                    this.chooseRegion = user.organizationName
                    this.regionOptionsShow = false
                }
            },
            //整理数据
            dataArrange(val) {
                this.noRepeatTown = []
                val.forEach(item => {
                    if (this.noRepeatTown.indexOf(item.town) == -1) {
                        this.noRepeatTown.push(item.town)
                    }
                })
            },
            //取得参数数据
            getStaticsData() {
                let path = `identity/exaScore/examScoreAll?page=0&size=1000&search=${this.chooseRegion}&year=${this.chooseYear}`
                return this.$http('Post', path, false).then((data) => {
                    this.dataArrange(data);
                    this.arrangedData = []
                    this.noRepeatTown.forEach(val => {
                        let list = {town: val, cun: []}
                        data.forEach(item => {
                            if (item.town == val) {
                                list.cun.push(item)
                            }
                        })
                        this.arrangedData.push(list)
                    })
                })
            }
        },
        created() {
            this.authority();

            let nowYear = new Date().Format('yyyy')
            let interval = Number(nowYear) - 2017
            for (let i = 0; i <= interval; i++) {
                this.yearOptions.push({text: i + 2017, value: i + 2017})
            }
            this.chooseYear = Number(nowYear)

            this.$http('Post', 'identity/sysDistrict/list', {
                attachTo: '01',
                districtLevel: 2,
                districtType: 'Party',
                isDelete: 0
            }, false).then(
                data => {
                    this.regionOptions = data.map(item => {
                        return {text: item.districtName, value: item.districtName}
                    })
                    this.regionOptions.splice(0, 0, {text: '全市', value: ''})
                    this.getStaticsData();
                }
            )
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
        height: 60px;
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
        width: 110px;
        height: 60px;
        border: 1px solid black;
        margin-top: 20px;
        border-radius: 4px;
        box-shadow: 0 3px 14px 0 rgba(0, 0, 0, .2);
        transition: all .3s ease;
    }
    .blockCunItem:hover{
        box-shadow: 0 0 5px 0 rgba(0,0,0,.1);
    }

    .itemUp {
        width: 101%;
        margin-left: -0.5px;
        height: 50%;
        background: #640064;
        background-image: linear-gradient(30deg,rgba(var(--vs-primary),1),rgba(var(--vs-primary),.5))!important;
        font-size: 17px;
        color: white;
        border-top-left-radius:4px;
        border-top-right-radius:4px;
    }

    .blockZhenItem .itemUp {
        width: 130px;
    }

    .itemDown {
        width: 100%;
        height: 50%;
        font-size: 16px;
        border-top-left-radius:4px;
        border-top-right-radius:4px;
    }

    .itemDown a {
        position: relative;
        vertical-align: middle;
        top: 3px;
    }
</style>
