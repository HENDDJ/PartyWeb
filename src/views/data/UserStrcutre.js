export default {
    columns: [
        {
            name: "name",
            type: 'string',
            des: "用户名",
        },
        {
            name: "userName",
            type: 'string',
            des: "登录名",
        },
        {
            name: "roleID",
            type: 'select',
            des: "角色",
            aliasName: "roleName"
        },
        {
            name: "enable",
            type: 'string',
            des: "是否可用",
        },
        {
            name: "lastTime",
            type: 'datetime',
            des: "最近登录时间",
        },
        {
            name: "organizationId",
            type: 'select',
            des: "组织名称",
            aliasName: "organizationName"

        },
        {
            name: "phone",
            type: 'string',
            des: "手机号",
        },
    ]
}
