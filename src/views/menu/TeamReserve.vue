<template>
    <section>
        <CommonCRUD :columns="columns" api-root="identity/reserve" :formColumns="formColumns" :queryFormColumns="queryForm">
            <template slot="query" slot-scope="slotProps" v-if="userAuthority!=3">
                <el-form-item label="所属组织">
                    <el-cascader :props="propsOne"  placeholder="请选择组织" size="mini"
                                 style="margin-right: -28px;" @change="selValue" clearable></el-cascader>
                </el-form-item>
            </template>
        </CommonCRUD>
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    export default {
        name: "TeamReserve",
        data(){
            return {
                columns:[],
                formColumns:[],
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
                        des: '组织',
                        name: 'districtId',
                        type: 'string',
                        value: '',
                        visible: false,
                    },
                ],
                user:{},
                propsOne: {
                    lazy: true,
                    checkStrictly:true,
                    lazyLoad:(node, resolve)=>{
                        if(this.userAuthority ==1){
                            if(node.level==0){
                                let nodes = [];
                                this.$http('GET', `/identity/sysDistrict/01tree`, false).then((data) => {
                                    data.forEach(item=>{
                                        nodes.push({label:item.label,value:item.id,leaf:item.leaf})
                                    });
                                    resolve(nodes);
                                })
                            }else {
                                let nodes = [];
                                this.$http('GET', `/identity/sysDistrict/${node.value}tree`, false).then((data) => {
                                    data.forEach(item=>{
                                        nodes.push({label:item.label,value:item.id,leaf:item.leaf})
                                    });
                                    resolve(nodes);
                                })
                            }
                        }
                        if(this.userAuthority==2){
                            if(node.level==0){
                                let nodes = [];
                                this.$http('GET', `/identity/sysDistrict/${this.user.districtId}tree`, false).then((data) => {
                                    data.forEach(item=>{
                                        nodes.push({label:item.label,value:item.id,leaf:item.leaf})
                                    });
                                    resolve(nodes);
                                })
                            }
                        }
                    }
                },
                userAuthority:1
            }
        },
        methods:{
            selValue(val){
                console.log(val)
                if(val.length>0){
                    this.queryForm[1].value = val[val.length-1];
                }else{
                    this.queryForm[1].value = this.user.districtId;
                }
            },
            handelOrg(){
                //层级组织请求
                this.$http('GET',`identity/sysDistrict/${this.user.districtId}alltree`,false).then( data => {
                    this.districtList = data[0].children;
                    this.handleOrgLeaf(this.districtList);
                    this.formColumns.filter(item => item.name === 'districtId')[0].options = this.districtList;
                    this.queryForm[1].options =  this.districtList;
                    if(this.userAuthority == 3){
                        this.formColumns.filter(item => item.name === 'districtId')[0].options = [{label:this.user.organizationName,leaf:true,value:this.user.districtId}]
                    }
                });
            },
            //处理村级组织children为空的情况
            handleOrgLeaf(districtList){
                districtList.forEach(item => {
                    if( this.userAuthority == 2){
                        delete item.children;
                    }else{
                        item.children.forEach(subitem => {
                            delete subitem.children;
                        })
                    }
                })
            },
            handleAuthority(){
                this.queryForm[1].value = this.user.districtId;
                if(this.user.sysDistrict.districtLevel == 3){
                    this.userAuthority = 3;
                }else  if(this.user.sysDistrict.districtLevel == 2){
                    this.userAuthority = 2;
                }else{
                    this.userAuthority = 1;
                }
            }
        },
        components: {
            CommonCRUD
        },
        created(){
            this.user = JSON.parse(sessionStorage.getItem('userInfo'));
            this.columns = this.$store.state.classInfo.properties;
            this.formColumns =this.$store.state.classInfo.properties;
            this.handleAuthority();
            this.handelOrg();
        }
    }
</script>

<style scoped>

</style>
