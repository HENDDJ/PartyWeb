<template>
    <section class="nav-bar">
        <div :class="$route.name === 'DashboardRoot' ? 'menu-bar isDashboard' : 'menu-bar'">
            <icon name="home" scale="2" style="display: inline-block;"></icon>
            <el-breadcrumb separator="/"  style="display: inline-block;">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item v-for="item in breadList" :key="item.path">
                    {{item.meta.title}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
    </section>
</template>

<script>
export default {
    data() {
        return {
            msgVisible: false,
            user: {},
            msgList: [{
                url: '/component/test?id=12-123-sda&status=Handle',
                msg: '新增组件测试'
            }, {
                url: '/component/test?id=12-123-sda&status=List',
                msg: '列表组件测试'
            }]
        }
    },
    computed: {
        breadList() {
            let arr = [];
            // 如果有重定向，则是由于没有子菜单(因此过滤掉)
            let matched = this.$route.matched.filter(route => !route.redirect)
            this.$store.state.menuList.map(item => {
                if(item.name === matched[0].name) {
                    arr.push(item);
                }
                item.children.map(subItem => {
                    if (matched[1] && subItem.name === matched[1].name) {
                        arr.push(subItem);
                    }
                })
            });
            return arr;
        }
    },
    methods: {
        // 改变左侧菜单收缩
        changeCollapse() {
            this.$store.commit('SET_COLLAPSE', !this.$store.state.collapse)
        },
        // 我的消息
        myMessage() {
            this.msgVisible = true
        },
        // 跳转到我的消息
        goMsg(url) {
            this.$router.push(url);
            this.msgVisible = false
        },
        // 退出登录
        logOut() {
            sessionStorage.removeItem('menu');
            sessionStorage.removeItem('token');
            location.reload();
        }
    },
    mounted() {
        this.user = sessionStorage.getItem('user');
    }
}
</script>

<style lang="scss">
.isDashboard {
    border-bottom: 1px solid #fff !important;
    color: #fff;
    span.el-breadcrumb__inner {
        color: white !important;
    }
    .el-breadcrumb__separator {
        color: #fff;
    }
}
.menu-bar {
    overflow: hidden;
    padding-bottom: 4px;
    text-align: left;
    border-bottom: 1px solid #dcdfe6;
    svg {
        margin: 0 6px 0 0 !important;
    }
    .fl {
        float: left;
        vertical-align: center;
    }
    .fa {
        color: #363c42;
        cursor: pointer;
        transition: all 0.4s;
    }
    .fa-arrows-alt {
        line-height: 50px;
        font-size: 20px;
    }
    .menu-right {
        height: 50px;
        margin-right: 20px;
    }
    .person-img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin: 5px 10px;
        border: 1px solid #888888;
        box-shadow: 1px 1px 1px #999;
    }
    .person-name {
        cursor: pointer;
        line-height: 18px;
    }
}
</style>
