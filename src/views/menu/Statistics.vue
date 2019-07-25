<template>
    <section>
        <div style="text-align: left">
            <el-date-picker
                size="medium"
                v-model="year"
                align="right"
                type="year"
                placeholder="选择年" @change="loadTables">
            </el-date-picker>
            <el-select v-model="districtId" placeholder="请选择" @change="loadTables" size="medium">
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
            <div style="overflow-x: auto; overflow-y: auto;text-align:left;width: 100%;">
                <h4 style="text-align: center">活动完成情况一览表</h4>
                <table style="width:100px;display: inline-block; vertical-align: top;text-align: center">
                    <tr>
                        <td valign="top" style="height: 100px;font-size: 16px">
                            <div class="tableline">
                                <p style="line-height: 50px; text-align: right;padding-right: 10px;">任务</p>
                                <p style="line-height: 50px; text-align: left;padding-left: 10px;">村名</p>
                            </div>
                        </td>
                    </tr>
                    <tr v-for="(value,key) in activityList" v-if="key!='title'">
                        <td style="background-color: #f3f3f3; width: 110px;font-family:' 黑体';font-weight:bold;line-height:25px;font-size: 12px;height: 25px;"  valign="top"> {{key}}</td>
                    </tr>
                </table>
               <table style="width: 61.4%; display: inline-block;overflow: scroll;text-align: center">
                   <tr>
                       <td v-for="item in activityList.title" style="background-color: #0dc9ce;"><button type="text" style="height: 100px;width: 100px;padding:3px 3px;border-radius:4px;background-color: #F4F4F4;font-size: 14px">{{item}}</button></td>
                   </tr>
                   <tr v-for="(value,key) in activityList"  v-if="key!='title'">
                       <td v-for="(index,item) in value" style="width: 100px;font-size: 12px;background-color: #39c667;color:white;height: 25px;"  v-if="index.status=='2'">
                           已完成
                       </td>
                       <td v-for="(index,item) in value"  style="width: 100px;font-size: 12px;background-color: #DC143C;color: white;height: 25px;"  v-if="index.status!='2'">
                          未完成
                       </td>
                   </tr>
               </table>
                <div style="width: 30%;border: 1px black solid;display: inline-block;vertical-align: top;height: 500px;">

                </div>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        name: "Statistics",
        data(){
            return{
                activityList:'',
                year:'',
                districtId:'01',
                districtList:[],
            }
        },

        methods:{
            loadTables(){
                if(!this.year){
                    this.year=new Date();
                }
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
                })
                console.log(this.districtList)
            }
        },
        created() {
            this.loadTables();
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
</style>
