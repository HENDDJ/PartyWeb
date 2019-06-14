export default {
    columns: [
        {
            name: "image",
            type: 'image',
            des: "头像",
            notShow:'true',
            limit:1
        },
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
            type: 'radio',
            des: "是否可用",
            options:[
                {
                    label:'是',
                    value: 1
                },
                {
                    label:'否',
                    value: 0
                }
            ]
        },
        {
            name: "lastTime",
            type: 'datetime',
            des: "最近登录时间",
            formShow: 'false'
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
        {
            name: "introduction",
            type: 'textarea',
            des: "组织简介",
            notShow:'true'
        },
    ]
}
