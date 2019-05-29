<template>
    <section>
        <vs-tabs :color="colorx">
            <vs-tab @click="colorx = 'success'" label="村干部信息">
                <div class="con-tab-ejemplo">
                    <CommonCRUD :columns="cadreColumns" api-root="identity/villageCadres" :formColumns="cadreFormColumns"></CommonCRUD>
                </div>
            </vs-tab>
            <vs-tab @click="handleSelect()" label="岗位信息">
                <div class="con-tab-ejemplo">
                    <CommonCRUD :columns="positionColumns" api-root="identity/cadrePosition" :formColumns="positionFormColumns"></CommonCRUD>
                </div>
            </vs-tab>
        </vs-tabs>
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    export default {
        name: "VillageCadres",
        data(){
            return {
                colorx:'success',
                cadreColumns:[],//村干部列表
                cadreFormColumns:{},//村干部表单
                //岗位列表
                positionColumns:[
                    {
                        name: 'name',
                        des: '名称'
                    },
                    {
                        name: 'districtName',
                        des: '所属组织'
                    },
                    {
                        name: 'workPlace',
                        des: '工作地点'
                    },
                    {
                        name: 'duty',
                        des: '职责'
                    },
                    {
                        name: 'cadreName',
                        des: '任职干部'
                    }
                ],
                //岗位表单
                positionFormColumns:[
                    {
                        name: 'name',
                        des: '名称',
                        type: 'string'
                    },
                    {
                        name: 'districtId',
                        des: '所属组织',
                        type: 'select',
                        options: 'districtList',
                    },
                    {
                        name: 'workPlace',
                        des: '工作地点',
                        type: 'string'
                    },
                    {
                        name: 'cadreId',
                        des: '任职人员',
                        type: 'select',
                        options:'villageCadreList'
                    },
                    {
                        name: 'duty',
                        des: '职责',
                        type: 'rich-editor'
                    },
                ],
                distictList:[],//所属组织
                villageCadreList:[],//干部人员列表
            }
        },
        methods:{
            handleSelect(){
                this.colorx = 'danger';
                this.$http('POST',`identity/sysDistrict/list` ,false).then(data => {
                    this.distictList = data;
                    this.positionFormColumns.filter( item => item.name === 'districtId')[0].options = data.map(item => { return {value: item.districtId, label: item.districtName}});
                });
                this.$http('POST',`identity/villageCadres/list` ,false).then(data => {
                    this.villageCadreList = data;
                    this.positionFormColumns.filter( item => item.name === 'cadreId')[0].options = data.map(item => { return {value: item.id, label: item.name}});
                });
            },
        },
        components: {
            CommonCRUD
        },
        created(){
            this.cadreColumns = this.$store.state.classInfo.properties;
            this.cadreFormColumns =this.$store.state.classInfo.properties;
        }
    }
</script>

<style scoped>

</style>
