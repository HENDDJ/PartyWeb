<template>
    <section class="rankList">
        <CommonCRUD
            ref="father" :columns="columns" api-root="identity/ratingStandard"
            :queryFormColumns="queryForm"
            :addBtnVis="false" :editBtnVis="false" :delBtnVis="false" :lookBtnVis="false">
            <template slot="header-btn" slot-scope="slotProps" >
                <el-button type="success" plain class="self-btn self-look" @click="look(slotProps.selected)">&nbsp;</el-button>
            </template>
        </CommonCRUD>
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    import RankListColumns from "@/views/data/RankListColumns";
    export default {
        name: "RankList",
        data(){
            return {
                columns:RankListColumns.columns,
                districtList:[],
                queryForm:[
                    {
                        des: '姓名',
                        name: 'name',
                        type: 'string',
                        value: '',
                        visible: true,
                    },
                    {
                        des: '所属组织',
                        name: 'districtId',
                        type: 'select',
                        value: '',
                        visible: false,
                    },
                    {
                        des: '是否是标准',
                        name: 'isStandard',
                        type: 'string',
                        value: '0',
                        visible: false,
                    },
                ],
                user:JSON.parse(sessionStorage.getItem("userInfo")),
                currentRow: {},
            }
        },
        methods:{
            look(selected) {
                if (selected.length !== 1) {
                    this.$message({
                        type: 'warning',
                        message: selected.length > 1 ? '仅能选择一行记录' : '请选择一行记录'
                    });
                    return false;
                }else {
                    this.currentRow = selected[0];
                    this.$emit('handleRank', this.currentRow)
                }
            },
            handelOrg(){
                if(this.user.sysDistrict.districtLevel==1){
                    this.queryForm.filter(item => item.name==='districtId')[0].visible = true;
                    this.$http('POST',`identity/sysDistrict/list`,{districtLevel:2,districtType: 'Party'},false).then(data => {
                        data.forEach( item => {
                            this.districtList.push( {value:item.districtId , label:item.districtName});
                        });
                        console.log(data)
                        this.$nextTick(()=>{
                            this.queryForm.filter(item => item.name==='districtId')[0].options = this.districtList;
                        })
                    })
                }else{
                    this.queryForm.filter(item => item.name==='districtId')[0].visible = false;
                    this.queryForm.filter(item => item.name==='districtId')[0].value = this.user.districtId;
                }
            }
        },
        components: {
            CommonCRUD,
        },
        created () {
          //  this.handelOrg();
        }
    }
</script>

<style>

</style>
