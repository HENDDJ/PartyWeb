<template>
    <section>
        <div style="text-align: left">
            <el-date-picker
                size="medium"
                v-model="year"
                align="right"
                type="year"
                placeholder="选择年" @change="loadTables()">
            </el-date-picker>
            <el-select v-model="districtId" placeholder="请选择" @change="loadTables()" size="medium">
                <el-option
                    v-for="item in districtList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-printer" size="small">打印</el-button>
        </div>
        <div border="1px grey solids">
            <div class="contentDiv" >
                <h3>{{toneName+"活动完成情况一览表"}}</h3>
                <table class="tableCol" >
                    <tr>
                        <td>
                            <div class="tableline">
                                <p style="line-height: 50px; text-align: right;padding-right: 10px;">任务</p>
                                <p style="line-height: 50px; text-align: left;padding-left: 10px;">村名</p>
                            </div>
                        </td>
                    </tr>
                    <tr v-for="(value,key) in activityList" v-if="key!='title'">
                        <td class="tableColContent"> {{key}}</td>
                    </tr>
                </table>
               <table class="tableContent">
                   <tr>
                       <td v-for="item in activityList.title" style="background-color: #0dc9ce;">
                           <button type="text" >{{item}}</button>
                       </td>
                   </tr>
                   <tr v-for="(value,key) in activityList"  v-if="key!='title'">
                       <td class="content" v-for="(index,item) in value" style="background-color: #39c667"v-if="index.status=='2'" >
                           <div @click="showPictures(index)">已完成</div>
                       </td>
                       <td class="content" v-for="(index,item) in value"  style="background-color: #DC143C;"  v-if="index.status!='2'">
                          未完成
                       </td>
                   </tr>
               </table>
                <div class="pictureshow" >
                    <h4>{{countryName+"活动执行截图"}}</h4><br/>
                    <div v-if="tipShow">请选择需要查看的任务记录！</div>
                    <div id="div-with-loading" class="vs-con-loading__container" v-show="!pictureShow"></div>
                    <PictureShot :picData="picQuery" v-if="pictureShow" ></PictureShot>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import PictureShot from '@/components/PictureShot';
    export default {
        name: "Statistics",
        data(){
            return{
                activityList:'',
                year:'',
                districtId:'01',
                districtList:[],
                organizationId: '',
                activityId: '',
                pictureShow:false,
                countryName:'',
                toneName:'句容市委',
                tipShow:true,
            }
        },
        methods:{
            loadTables(){
                if(!this.year){
                    this.year=new Date();
                }
                this.toneName = this.districtList.filter( item => item.value==this.districtId)[0].label;
                this.$http('post',`identity/parActivity/list/completion?year=${new Date(this.year).Format("yyyy")}&districtId=${this.districtId}`,false).then( data => {
                    this.activityList = data;
                });
            },
            //查询框下拉项
            showDistrictList(){
                //镇级组织
                this.$http('POST',`identity/sysDistrict/list`,{districtLevel:2},false).then(data => {
                    data.forEach( item => {
                        this.districtList.push( {value:item.districtId , label:item.districtName});
                    });
                    this.districtList.push({value:'01',label:'句容市委'});
                    this.loadTables();
                })

            },
            showPictures(item){
                this.tipShow = false;
                this.pictureShow=false;
                this.$vs.loading({
                    container: '#div-with-loading',
                    scale: 0.9
                })
                this.countryName = item.districtName;
                this.organizationId = item.organizationId;
                this.activityId = item.activityId;
                this.$nextTick( () => {
                    setTimeout( ()=> {
                        this.$vs.loading.close('#div-with-loading > .con-vs-loading')
                        this.pictureShow = true;
                    }, 1000);
                })

            }
        },
        components: {
            PictureShot
        },
        computed:{
            picQuery() {
                return {
                    districtId: this.organizationId,
                    activityId: this.activityId
                }
            }
        },
        created() {
            this.showDistrictList();

        }
    }
</script>

<style scoped>
    tr button {
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        font-size: 16px;
        font-weight: bold;
    }
    .tableline{
        position:relative;
        width:100px;
        height:100px;
        box-sizing:border-box;
        border:1px solid #333;
    }

    .tableline::before{
        content:"";
        position:absolute;
        left:0;
        top:0;
        width:100%;
        height:50px;
        box-sizing:border-box;
        border-bottom:1px solid deeppink;
        transform-origin:bottom center;
        transform:rotateZ(45deg) scale(1.414);
    }
    #div-with-loading{
        background-color: transparent!important;
        width: 200px;
        height: 200px;
        margin: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
    }
    .pictureshow{
        width: 30%;
        display: inline-block;
        vertical-align: top;
    }
    .contentDiv{
        overflow-x: auto;
        text-align:center;
        width: 100%;
    }
    .tableCol{
        width:100px;
        display: inline-block;
        vertical-align: top;
    }
    .tableCol td{
        height: 100px;
        font-size: 16px;
    }
    .tableColContent{
        background-color: #f3f3f3;
        width: 110px;
        font-family:' 黑体';
        font-weight:bold;
        line-height:25px;
        font-size: 12px!important;
        height: 25px!important;
    }
    .tableContent{
        width: 61.4%;
        display: inline-block;
        overflow: scroll;
        text-align: center;
    }

    .tableContent button{
        height: 100px;
        width: 100px;
        padding:3px 3px;
        border-radius:4px;
        background-color: #F4F4F4;
        font-size: 14px;
    }
    .tableContent .content{
        width: 100px;
        font-size: 12px;
        color: white;
        height: 25px;
    }
    .tableContent .content :hover{
        cursor: pointer;
    }
</style>
<style>
    .pictureshow .con-vs-loading{
        background: transparent!important;
    }
</style>
