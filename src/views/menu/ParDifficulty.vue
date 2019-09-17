<template>
    <section>
        <CommonCRUD
            ref="table"  :formColumns="formColumns"  apiRoot="/identity/parDifficulty"  :columns="columns" :queryFormColumns="queryForm">
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
        name: "ParDifficulty",
        data() {
            return {
                columns: [],
                formColumns: [],
                partyMemberList: [],
                queryForm:[
                    {
                        des: '姓名',
                        name: 'memberName',
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
        methods: {
            selValue(val) {
                if (val.length > 0) {
                    this.queryForm[1].value = val[val.length - 1];
                } else {
                    this.queryForm[1].value = this.user.districtId;
                }
            },
            handleAuthority() {
                this.queryForm[1].value = this.user.districtId;
                if (this.user.sysDistrict.districtLevel == 3) {
                    this.userAuthority = 3;
                } else if (this.user.sysDistrict.districtLevel == 2) {
                    this.userAuthority = 2;
                } else {
                    this.userAuthority = 1;
                }
            },
            handleSelect() {
                this.$http('POST', `identity/parMember/list`, {districtId: this.user.districtId}, false).then(data => {
                    data.forEach(item=>{
                        this.partyMemberList.push({ value:item.id, label:item.name});
                    });
                });
                this.$nextTick(()=>{
                    console.log(this.partyMemberList);
                    this.formColumns.filter(sub => sub.name === 'partyMemberId' )[0].options=this.partyMemberList;
                })
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
            this.handleSelect();
        }
    }
</script>

<style scoped>

</style>
