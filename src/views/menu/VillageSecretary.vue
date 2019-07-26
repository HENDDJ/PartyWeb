<template>
    <section>
        <CommonCRUD :columns="columns" api-root="identity/villageCadres" :formColumns="formColumns" :queryFormColumns="queryForm">
            <template slot="query" slot-scope="slotProps" v-if="userAuthority!=3">
                <label style="font-size: 14px;width: 75px">所属组织</label>
                <el-cascader :props="propsOne" v-if="userAuthority === 1" placeholder="选择镇名" size="mini"
                             style="margin-right: -28px;" @change="selValue"></el-cascader>
                <el-cascader :props="propsTwo" v-if="userAuthority === 2" placeholder="选择村名" size="mini"
                             style="margin-right: -28px;" @change="selValueCun"></el-cascader>
            </template>
        </CommonCRUD>
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    export default {
        name: "VillageSecretary",
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
                        name: 'post',
                        type: 'string',
                        value: '',
                        visible: false
                    }
                ],
                propsOne: {
                    lazy: true,
                    lazyLoad:(node, resolve)=>{
                        if(node.level==0){
                            let nodes = []
                            this.$http('GET', `/identity/sysDistrict/01tree`, false).then((data) => {
                                data.forEach(item=>{
                                    nodes.push({label:item.label,value:item.id,leaf:item.leaf})
                                })
                                resolve(nodes);
                            })

                        }else {
                            let nodes = []
                            this.$http('GET', `/identity/sysDistrict/${node.value}tree`, false).then((data) => {
                                data.forEach(item=>{
                                    nodes.push({label:item.label,value:item.id,leaf:item.leaf})
                                })
                                resolve(nodes);
                            })
                        }

                    }
                },
                propsTwo: {
                    lazy: true,
                    lazyLoad:(node, resolve)=>{
                        if(node.level==0){
                            let nodes = []
                            let userId = JSON.parse(sessionStorage.getItem('userInfo')).districtId
                            this.$http('GET', `/identity/sysDistrict/${userId}tree`, false).then((data) => {
                                data.forEach(item=>{
                                    nodes.push({label:item.label,value:item.id,leaf:item.leaf})
                                })
                                resolve(nodes);
                            })

                        }
                    }
                },

                userAuthority:1
            }
        },
        methods:{
            handelOrg(){
                //层级组织请求
                this.$http('GET',`identity/sysDistrict/${'01'}alltree`,false).then( data => {
                    this.districtList = data[0].children;
                    this.handleOrgLeaf(this.districtList);
                    this.formColumns.filter(item => item.name === 'districtId')[0].options = this.districtList;
                });
            },
            //处理村级组织children为空的情况
            handleOrgLeaf(districtList){
                districtList.forEach(item => {
                    item.children.forEach(subitem => {
                        delete subitem.children;
                    })
                })
            },
            selValue(val){
               // this.queryForm[1].value = val[1]
            },
            selValueCun(val){
              //  this.queryForm[1].value = val[0]
            }
        },
        components: {
            CommonCRUD
        },
        created(){
            this.columns = this.$store.state.classInfo.properties;
            this.formColumns =this.$store.state.classInfo.properties;
            this.queryForm[1].value = 'SECRETARY';
            //登录用户Dis ID
            let user = JSON.parse(sessionStorage.getItem('userInfo'))
            if(user.sysDistrict.districtLevel == 3){
                this.userAuthority = 3
            }else  if(user.sysDistrict.districtLevel == 2){
                this.userAuthority = 2
            }else{
                this.userAuthority = 1
            }
            this.handelOrg();

        }
    }
</script>

<style scoped>

</style>
