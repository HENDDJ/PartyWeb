<template>
    <CommonCRUD :columns="columns" apiRoot="/identity/parMember" :formColumns="formColumns"
                :queryFormColumns="queryForm">
        <template slot="query" slot-scope="slotProps" v-if="userAuthority!=3">
            <label style="font-size: 14px;width: 75px">所属组织</label>
            <el-cascader :props="propsOne" v-if="userAuthority === 1" placeholder="选择镇名" size="mini"
                         style="margin-right: -28px;" @change="selValue" clearable></el-cascader>
            <el-cascader :props="propsTwo" v-if="userAuthority === 2" placeholder="选择村名" size="mini"
                         style="margin-right: -28px;" @change="selValueCun" clearable></el-cascader>
        </template>
    </CommonCRUD>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';

    export default {
        name: "ParMember",
        data() {
            return {
                columns: [],
                formColumns: [],
                self: this,
                searchCascader:'',
                propsOne: {
                    lazy: true,
                    lazyLoad: (node, resolve) => {
                        if (node.level == 0) {
                            let nodes = []
                            this.$http('GET', `/identity/sysDistrict/01tree`, false).then((data) => {
                                data.forEach(item => {
                                    nodes.push({label: item.label, value: item.id, leaf: item.leaf})
                                })
                                resolve(nodes);
                            })

                        } else {
                            let nodes = []
                            this.$http('GET', `/identity/sysDistrict/${node.value}tree`, false).then((data) => {
                                data.forEach(item => {
                                    nodes.push({label: item.label, value: item.id, leaf: item.leaf})
                                })
                                resolve(nodes);
                            })
                        }

                    }
                },
                propsTwo: {
                    lazy: true,
                    lazyLoad: (node, resolve) => {
                        if (node.level == 0) {
                            let nodes = []
                            let userId = JSON.parse(sessionStorage.getItem('userInfo')).districtId
                            this.$http('GET', `/identity/sysDistrict/${userId}tree`, false).then((data) => {
                                data.forEach(item => {
                                    nodes.push({label: item.label, value: item.id, leaf: item.leaf})
                                })
                                resolve(nodes);
                            })

                        }
                    }
                },

                userAuthority: 1,
                queryForm: [
                    {
                        des: '姓名',
                        name: 'name',
                        type: 'string',
                        value: '',
                        visible: true,
                    },
                    {
                        des: '组织',
                        name: 'nativePlace',
                        type: 'string',
                        value: '',
                        visible: false,
                    },
                ],
            }
        },
        methods: {
            getNodeData(val) {
                this.$http('GET', `/identity/sysDistrict/${val}tree`, false).then((data) => {
                    return data
                })
            },
            selValue(val){
                this.queryForm[1].value = val[1]
            },
            selValueCun(val){
                this.queryForm[1].value = val[0]

            }
        },
        components: {
            CommonCRUD
        },
        mounted() {
            this.columns = this.$store.state.classInfo.properties;
            this.formColumns = this.$store.state.classInfo.properties;
            this.columns.forEach(item => {
                if (item.name == "birth" || item.name == "graduationTime" || item.name == "workTime") {
                    item.formatter = (row, column, value) => {
                        return new Date(value).Format("yyyy-MM-dd");
                    }
                }
            })
        },
        created() {
            let user = JSON.parse(sessionStorage.getItem('userInfo'));
            if (user.sysDistrict.districtLevel == 3) {
                this.userAuthority = 3
            } else if (user.sysDistrict.districtLevel == 2) {
                this.userAuthority = 2
            } else {
                this.userAuthority = 1
            }
        }
    }
</script>

<style>
    .el-cascader--small {
        width: 178px !important;
    }
</style>
<style scoped>

</style>
