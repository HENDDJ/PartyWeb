<template>
    <section>
        <CommonCRUD :columns="tableColumns" api-root="identity/projectInfo" :formColumns="formColumns"></CommonCRUD>
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    export default {
        name: "ProjectInfo",
        data() {
            return {
                tableColumns: [
                    {
                        name: 'name',
                        des: '工程名'
                    },
                    {
                        name: 'number',
                        des: '工程编号',
                        width: "120px"
                    },
                    {
                        name:'department',
                        des:'部门'
                    },
                    {
                        name:'responsibility',
                        des:'负责项目组'

                    },
                    // {
                    //     name:'address',
                    //     des:'地址'
                    // },
                    {
                        name:'investment',
                        des:'计划总投资'
                    },
                    {
                        name:'licenseNumber',
                        des:'立项批准文号'
                    },
                    {
                        name:'type',
                        des:'工程类别'
                    },
                    // {
                    //     name:'property',
                    //     des:'建设性质'
                    // },
                    // {
                    //     name:'size',
                    //     des:'工程规模'
                    // },
                    {
                        name:'license',
                        des:'建设用地许可证'
                    },
                    {
                        name:'sourcesFunds',
                        des:'资金来源'
                    },
                    // {
                    //     name:'isHazard',
                    //     des:'是否是可能存在重大危险源'
                    // },
                    // {
                    //     name:'isFormwork',
                    //     des:'是否是模板工程'
                    // },
                    // {
                    //     name:'isDeepExcavation',
                    //     des:'是否是深基坑'
                    // },
                    {
                        name:'startTime',
                        des:'开始时间',
                        formatter: (row, column, value) => {
                            return new Date(value).toLocaleDateString();
                        }
                    }
                ],
                formColumns: [
                    {
                        name: 'name',
                        des: '工程名',
                        type: 'string'
                    },
                    {
                        name: 'number',
                        des: '工程编号',
                        type: 'string',
                    },
                    {
                        name:'longitude',
                        des: '经度',
                        type: 'string'
                    },
                    {
                        name:'latitude',
                        des:'维度',
                        type: 'string'
                    },
                    {
                        name:'department',
                        des:'部门',
                        type: 'string'
                    },
                    {
                        name:' responsibility',
                        des:'负责项目组',
                        type: 'string',
                    },
                    {
                        name:'address',
                        des:'地址',
                        type: 'string'
                    },
                    {
                        name:'investment',
                        des:'计划总投资',
                        type: 'string'
                    },
                    {
                        name:'licenseNumber',
                        des:'立项批准文号',
                        type: 'string'
                    },
                    {
                        name:'type',
                        des:'工程类别',
                        type: 'string'
                    },
                    {
                        name:'property',
                        des:'建设性质',
                        type: 'string'
                    },
                    {
                        name:'size',
                        des:'工程规模',
                        type: 'string'
                    },
                    {
                        name:'license',
                        des:'建设用地许可证',
                        type: 'string'
                    },
                    {
                        name:'sourcesFunds',
                        des:'资金来源',
                        type: 'string'
                    },
                    {
                        name:'isHazard',
                        des:'是否是可能存在重大危险源',
                        type:'radio'
                    },
                    {
                        name:'isFormwork',
                        des:'是否是模板工程',
                        type:'radio'
                    },
                    {
                        name:'isDeepExcavation',
                        des:'是否是深基坑',
                        type:'radio'
                    },
                    {
                        name:'startTime',
                        des:'开始时间',
                        type: 'date'
                    }
                ]
            }
        },
        components: {
            CommonCRUD
        }
    }
</script>

<style scoped>

</style>
