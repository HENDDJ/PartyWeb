<template>
    <section>
        <CommonCRUD  :columns="columns" apiRoot="/identity/workLedger" :formColumns="formColumns" :queryFormColumns="queryForm">
            <template slot="handle" slot-scope="scope" >
                <div class="encStyle" @click="downLoad(scope.row)">
                    {{(scope.row.enclosure) ? scope.row.enclosure.split("&")[1] : ' ' }}
                </div>
            </template>
            <template slot="header-btn" slot-scope="slotProps">
                <el-cascader :props="props" placeholder="选择镇名" size="small"></el-cascader>
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
                ],
                props: {
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
                }
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
            }
        },
        components: {
            CommonCRUD
        },
        created(){
            this.columns = this.$store.state.classInfo.properties;
            this.formColumns = this.$store.state.classInfo.properties;
            this.handleEnc();
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
