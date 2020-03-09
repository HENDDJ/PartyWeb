export default {
    columns: [
        {
            name: "townName",
            type:'string',
            des: "所属镇",
        },
        {
            name: "villageName",
            type:'string',
            des: "所属村",
        },
        {
            name: "cadresId",
            type:'string',
            aliasName:'cadresName',
            des: "姓名",
        },
        {
            name: "age",
            type:'string',
            des: "年龄",
        },
        {
            name: "education",
            type:'string',
            des: "学历",
        },
        {
            name: "workDuration",
            type: 'string',
            des: "担任村书记时长",
        },
        {
            name: "abilityJudgement",
            type: 'string',
            des: "能力研判",
        },
        {
            name: "lastGrade",
            type: 'string',
            notShow:'true',
            des: "上年度专职村书记考核等次",
        },
        {
            name: "gradeTimes",
            type: 'string',
            notShow:'true',
            des: "年度考核获得“称职”及以上等次的累计次数",
        },
        {
            name: "gradeLastTimes",
            type: 'string',
            notShow:'true',
            des: "年度考核获得“称职”及以上等次连续次数",
        },
        {
            name: "agradeLastTimes",
            type: 'string',
            notShow:'true',
            des: "年度考核获得“优秀”等次连续次数",
        },

        {
            name: "agradeTimes",
            type: 'string',
            notShow:'true',
            des: "年度考核获得“优秀”等次的累计次数",
        },
        {
            name: "topTenGradeLastTimes",
            type: 'string',
            notShow:'true',
            des: "年度考核获得前10连续次数",
        },
        {
            name: "topFiveGradeLastTimes",
            type: 'string',
            notShow:'true',
            des: "年度考核获得前5连续次数",
        },
        {
            name: "topThreeGradeLastTimes",
            type: 'string',
            notShow:'true',
            des: "年度考核获得前3连续次数",
        },
        {
            name: "honoursType",
            type: 'string',
            notShow:'true',
            des: "获得表彰类型",
        },

    ]
}
