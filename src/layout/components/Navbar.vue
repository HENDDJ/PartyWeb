<template>
    <section class="nav-bar">
        <div class="menu-bar">
            <div class="fl">
                <!-- 面包屑导航 -->
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/' }"><icon name="list" scale="2.3" style="margin: 0 8px -5px 2px"></icon> 首页</el-breadcrumb-item>
                    <transition-group name="breadcrumb">
                        <el-breadcrumb-item v-for="item in breadList" :key="item.path">
                            <span style="margin-top: 4px;display: inline-block;font-weight: 400;transition: none">{{item.meta.title}}</span>
                        </el-breadcrumb-item>
                    </transition-group>
                </el-breadcrumb>
           </div>

            <!-- 右侧菜单项 -->
            <div class="fr menu-right">

                <el-dropdown trigger="click">
                    <span class="el-dropdown-link">
                        <img class="person-img fl"  alt="" src="../../assets/logo.png">
                        <i class="person-name fl">{{user}}</i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="myMessage">我的消息</el-dropdown-item>
                        <el-dropdown-item>设置</el-dropdown-item>
                        <el-dropdown-item divided @click.native="logOut">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>

        </div>
        <!-- 我的消息 -->
        <el-dialog :visible.sync="msgVisible">
            <el-table :data="msgList">
                <el-table-column label="消息" prop="msg"></el-table-column>
                <el-table-column>
                    <template slot-scope="scope">
                        <el-button type="primary" @click="goMsg(scope.row.url)">确认</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
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
            console.log("123",this.$store.state.menuList,this.$route.matched)
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

<style lang="scss" scoped>
.nav-bar {
    box-shadow: 0 1px 3px 0 rgba(0,0,0,.15);
}

.menu-bar {
    height: 50px;
    line-height: 50px;
    overflow: hidden;
    padding: 0 12px;
    .fl {
        float: left;
        margin-top: 16px;
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
