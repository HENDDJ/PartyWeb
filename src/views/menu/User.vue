<template>
    <CommonCRUD ref="table" :columns="columns" apiRoot="/identity/sysUser" :formColumns="formColumns"  :queryFormColumns="queryColumns">
        <template slot="header-btn" slot-scope="slotProps">
            <el-button type="primary" v-if="resetPsw" plain  @click="resetPassword(slotProps.selected)" >重置密码</el-button>
        </template>
    </CommonCRUD>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    import UserStrcutre from '../data/UserStrcutre';
    export default {
        name: "User",
        data() {
            return {
                columns: UserStrcutre.columns,
                formColumns: UserStrcutre.columns,
                resetPsw:true,//重置密码按钮
                queryColumns:[
                    {
                        des: '用户名',
                        name: 'name',
                        type: 'string',
                        value: '',
                        visible: true,
                    },
                    {
                        des: '所属组织',
                        name: 'districtId',
                        type: 'select',
                        visible: false,
                        options: '',
                    },
                ]
            }
        },
        methods: {
            changeCol() {
                this.columns.forEach(item=>{
                    if(item.name == 'enable'){
                        item.formatter = (row, cell,val,index)=>{
                            if(val == '1'){
                                return '是'
                            }else{
                                return '否'
                            }
                        }
                    }
                });
                this.$http('Post','identity/role/list',false).then((data)=>{
                    this.formColumns.filter(item=>item.name === 'roleID')[0].options =data.map(item=>{return {label:item.name,value:item.id}})
                })
                this.$http('Post','identity/sysDistrict/list',false).then((data)=>{
                    this.formColumns.filter(item=>item.name === 'districtId')[0].options =data.map(item=>{return {label:item.districtName,value:item.districtId}})
                    //查询下拉框（districtId）
                    this.queryColumns[1].options =data.map(item=>{return {label:item.districtName,value:item.districtId}})
                })
                //权限控制(districtId),句容市委显示组织查询条件
                if(JSON.parse(sessionStorage.getItem("userInfo")).sysDistrict.districtId=="01"){
                    this.queryColumns[1].value="";
                    this.queryColumns[1].visible = true;
                }else{
                    this.queryColumns[1].value = JSON.parse(sessionStorage.getItem("userInfo")).sysDistrict.districtId;
                }

            },
            resetPassword(data){
                if (data.length !== 1) {
                    this.$message({
                        type: 'warning',
                        message: data.length > 1 ? '仅能选择一行记录' : '请选择一行记录'
                    });
                    return;
                }
                if(data[0].id === JSON.parse(sessionStorage.getItem("userInfo")).id){
                    this.$message({
                        type: 'warning',
                        message: '不能重置当前用户密码'
                    });
                    return;
                }
                data[0].password = null;
                this.$http('PUT',`identity/sysUser/${data[0].id}id`,data[0],false).then( () => {
                    this.$message({
                        message: '密码重置成功',
                        type: 'success'
                    });
                    this.$refs.table.refreshTableData();
                })
            }
        },
        created(){
            this.changeCol();
            this.columns.forEach(item => {
                if (item.name == "lastTime") {
                    item.formatter=(row, column, value) => {
                        return new Date(value).Format("yyyy-MM-dd HH:mm:ss");
                    }
                }
            })
        },
        components: {
            CommonCRUD
        }
    }
</script>

<style scoped>

</style>
