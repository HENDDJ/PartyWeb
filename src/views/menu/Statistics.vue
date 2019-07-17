<template>
    <section>
        <el-tabs type="border-card">
            <el-tab-pane>
            <span slot="label"><icon name="email" scale=" 2"></icon>党员统计</span>
            我的行程
            </el-tab-pane>
            <el-tab-pane>
                <span slot="label"><i class="el-icon-date"></i> 党代表统计</span>
                我的行程
            </el-tab-pane>
            <el-tab-pane>
                <span slot="label"><i class="el-icon-date"></i> 村干部统计</span>
                我的行程
            </el-tab-pane>
            <el-tab-pane>
                <span slot="label"><i class="el-icon-date"></i> 后备人才统计</span>
                我的行程
            </el-tab-pane>
            <el-tab-pane>
                <span slot="label"><i class="el-icon-date"></i> 台账统计</span>
                我的行程
            </el-tab-pane>
            <el-tab-pane>
                <span slot="label"><i class="el-icon-date"></i> 阵地统计</span>
                我的行程
            </el-tab-pane>
        </el-tabs>
    </section>
</template>

<script>
    export default {
        name: "Statistics",
        data(){
            return{
                colorx:''
            }
        }
    }
</script>

<style scoped>

</style>
