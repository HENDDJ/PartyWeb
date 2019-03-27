<template>
    <el-scrollbar wrapClass="scrollbar-wrapper" viewClass="scrollbar_view">
        <el-menu background-color="#363C42" text-color="#fff" active-text-color="#409EFF" router  unique-opened  class="el-menu-personal">
            <div v-for="item in routes" :key="item.name">
                <!-- 有子菜单 -->
                <el-submenu :index="item.path" v-if="item.children&&item.children.length">
                    <template slot="title">
                        <icon :name="item.meta.icon" scale="1.5"></icon>
                        <span slot="title">{{item.meta && item.meta.title}}</span>
                    </template>
                    <el-menu-item :index="item.path+'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
                        <icon :name="subItem.meta.icon" scale="1.5"></icon>
                        <span slot="title">{{subItem.meta && subItem.meta.title}}</span>
                    </el-menu-item>
                </el-submenu>
                <!-- 没有子菜单 -->
                <el-menu-item :index="item.path" v-else>
                    <icon :name="item.meta.icon" scale="1.5"></icon>
                    <span slot="title">{{item.meta && item.meta.title}}</span>
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
    }
    svg {
        margin: 0 5px 0 20px;
    }
</style>

