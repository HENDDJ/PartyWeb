<template>
    <el-scrollbar wrapClass="scrollbar-wrapper" viewClass="scrollbar_view">
        <el-menu background-color="rgb(0,0,0,0)" text-color="#fff" active-text-color="#409EFF" router  unique-opened  class="el-menu-personal" @select="changeActiveIndex">
            <div v-for="item in routes" v-if="item.visible === 1" :key="item.name">
                <!-- 有子菜单 -->
                <el-submenu :index="item.path" v-if="item.children&&item.children.length">
                    <template slot="title">
                        <div :class="`menu-item-detail${activeIndex === item.path ? '-active' : ''}`">
                            <div>
                                <img v-show="activeIndex === item.path" :src="`/static/menu/active/${item.meta.icon}.png`" alt="">
                                <img v-show="activeIndex !== item.path" :src="`/static/menu/${item.meta.icon}.png`" alt="">
                                &emsp;<span slot="title">{{item.meta && item.meta.title}}</span>
                            </div>
                        </div>
                    </template>
                    <el-menu-item :index="item.path+'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
                        <div :class="`menu-item-detail${activeIndex === (item.path+'/'+subItem.path) ? '-active' : ''}`">
                            <div>
                                <img v-show="activeIndex === (item.path+'/'+subItem.path)" :src="`/static/menu/active/${subItem.meta.icon}.png`" alt="">
                                <img v-show="activeIndex !== (item.path+'/'+subItem.path)"  :src="`/static/menu/${subItem.meta.icon}.png`" alt="">
                                &emsp;<span slot="title">{{subItem.meta && subItem.meta.title}}
                                <el-badge style="margin-left: 25px;margin-top: -6px" :value="5" v-if="subItem.meta.title=='活动审核'"/></span>
                            </div>
                        </div>
                    </el-menu-item>
                </el-submenu>
                <!-- 没有子菜单 -->
                <el-menu-item :index="item.path" v-else>
                    <div :class="`menu-item-detail${activeIndex === item.path ? '-active' : ''}`">
                        <div>
                            <img v-show="activeIndex === item.path" :src="`/static/menu/active/${item.meta.icon}.png`" alt="">
                            <img v-show="activeIndex !== item.path" :src="`/static/menu/${item.meta.icon}.png`" alt="">
                            &emsp;<span slot="title">{{item.meta && item.meta.title}}</span>
                        </div>
                    </div>
                </el-menu-item>
            </div>
        </el-menu>
    </el-scrollbar>
</template>
<script>
    export default {
        name: 'sidebar',
        data() {
            return {
                activeIndex: ''
            }
        },
        computed: {
            routes() {
                return this.$store.state.menuList;
            }
        },
        watch: {
            '$route.name' : function () {
                let matched = this.$route.matched;
                this.$store.commit("getClassInfo", matched[matched.length-1].meta.classInfo);
            }
        },
        methods: {
            changeActiveIndex(index) {
                this.activeIndex = index;
            }
        }
    }
</script>
<style>
    .scrollbar_view {
        height: 100%;
    }
    .el-scrollbar__wrap {
        overflow-x: hidden;
    }
    .el-menu-personal {
        height: 100%;
        text-align: left;
        background: url("/static/img/menu2.png");
        background-size: cover;
    }
    .el-menu-personal  .el-badge__content{
        background-color: #e6a23c;
        border: none;
    }
   .el-submenu__title:hover {
        outline: 0 !important;
        background-color: rgba(0,0,0,0.3)  !important;
    }

   .el-menu-item:hover{
        outline: 0 !important;
        background-color: rgba(0,0,0,0.3) !important;
    }
    .el-submenu .el-menu-item{
        padding: 0 0 0 45px;
    }
    svg {
        margin: 0 5px 0 20px;
    }
    .menu-item-detail > div,.menu-item-detail-active > div {
        transition: .3s;
    }
    .menu-item-detail > div > span,.menu-item-detail-active > div > span {
        transition: none;
    }
    .menu-item-detail-active {
        background: linear-gradient(118deg,rgba(var(--vs-menu),.9),rgba(var(--vs-menu),.6));
        font-weight: 400;
        -webkit-box-shadow: 0 0 10px 1px rgba(var(--vs-menu),.6);
        box-shadow: 0 0 10px 1px rgba(var(--vs-menu),.6);
        margin-left: -45px;
        padding: 0 45px;
    }
    .menu-item-detail:hover > div,.menu-item-detail-active:hover > div{
        transform: translateX(4px);
    }
    .el-menu-item {
        padding-right:0 !important;
    }
    /*.el-menu-item {*/
        /*background: url("/static/img/menu_item_bg.png") no-repeat center left;*/
        /*background-size: 75%;*/
        /*color: white;*/
    /*}*/
    /*.el-menu-item svg {*/
        /*margin: -7px 20px 0 -8px;*/
    /*}*/
    /*.el-menu-item span {*/
        /*position: relative;*/
        /*top: -3px;*/
        /*color: #1e6abc;*/
    /*}*/

    /*.el-submenu .el-menu-item {*/
        /*background: url("/static/img/menu_item_bg.png") no-repeat center center;*/
        /*background-size: 75%;*/
        /*color: white;*/
    /*}*/
    /*.el-submenu .el-menu-item svg {*/
        /*margin: -8px 20px 0 -2px;*/
    /*}*/
    /*.el-submenu .el-menu-item span {*/
        /*position: relative;*/
        /*top: -3px;*/
        /*color: #1e6abc;*/
    /*}*/
    /*.el-submenu__title {*/
        /*background: url("/static/img/menu_item_bg.png") no-repeat center left;*/
        /*background-size: 75%;*/
        /*color: white;*/
    /*}*/
    /*.el-submenu__title svg {*/
        /*margin: -7px 20px 0 -8px;*/
    /*}*/
    /*.el-submenu__title span {*/
        /*position: relative;*/
        /*top: -3px;*/
        /*color: #1e6abc;*/
    /*}*/
</style>

