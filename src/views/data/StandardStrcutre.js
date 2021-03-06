import LookUp from '@/lookup';
export default {
    columns: [
        {
            name: "name",
            type:'string',
            des: "标准等级",
        },
        {
            name: "workDuration",
            type: 'string',
            des: "担任村书记时长",
        },
        {
            name: "abilityJudgement",
            type: 'select',
            des: "能力研判",
            transferType:"lookup",
            lookupKey:"AbilityJudgement"
        },
        {
            name: "lastGrade",
            type: 'select',
            des: "上年度专职村书记考核等次",
            transferType:"lookup",
            lookupKey:"CheckGrade"
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
            type: 'select',
            notShow:'true',
            des: "获得表彰类型",
            transferType:"lookup",
            lookupKey:"HonoursType"
        },

    ]
}
