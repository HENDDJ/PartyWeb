<template>
    <section>
        <CommonCRUD  :columns="columns" apiRoot="/identity/workLedger" :formColumns="formColumns" :queryFormColumns="queryForm">
            <template slot="handle" slot-scope="scope" >
                <div class="encStyle" @click="downLoad(scope.row)">
                    {{(scope.row.enclosure) ? scope.row.enclosure.split("&")[1] : ' ' }}
                </div>
            </template>
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
        name: "WorkLedger",
        data(){
            return {
                columns:[],
                formColumns:[],
                queryForm:[
                    {
                        des: '标题',
                        name: 'title',
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
                userAuthority: 1,
            }
        },
        methods: {
            handleEnc(){
                this.columns = [];
                this.columns.length = 0;
                let temp = JSON.parse(JSON.stringify(this.$store.state.classInfo.properties));
                this.columns = temp;
                var columsItems = {slot:true,name:'enclosure',des:'附件',slotName:'handle'};
                this.columns.push(columsItems);
            },
            downLoad(row){
                window.open(row.enclosure.split("&")[0],'_self')
            },
            selValue(val){
                if(val.length>0){
                    this.queryForm[1].value = val[val.length-1];
                }else{
                    this.queryForm[1].value = this.user.districtId;
                }
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
            },
            handleForm(){
                this.formColumns.filter(item => item.name==='districtId')[0].value = this.user.districtId;
            }

        },
        components: {
            CommonCRUD
        },
        created(){
            this.user = JSON.parse(sessionStorage.getItem('userInfo'));
            this.columns = this.$store.state.classInfo.properties;
            this.formColumns = this.$store.state.classInfo.properties;
            this.handleAuthority();
            this.handleEnc();
            this.columns.forEach(item => {
                if (item.name == "workTime") {
                    item.formatter=(row, column, value) => {
                        return new Date(value).Format("yyyy-MM-dd");
                    }
                }
            });
            this.handleForm();
        }
    }
</script>

<style scoped>
    .encStyle{
        color: blue;
        text-decoration: none;
        cursor: pointer;
    }

    .encStyle:hover{
        text-decoration: underline;
        cursor: pointer;
    }
</style>
