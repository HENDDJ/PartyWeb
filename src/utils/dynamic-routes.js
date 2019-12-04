/**
 * 动态路由相关js（后台配置）
 */
export default {
    /**
     * 将路由component属性转成对应组件对象
     * */
     transfer(routers) {
         routers.forEach(item => {
            if (item.componentName === 'Home') {
                item.component = () => import(`@/layout/Layout.vue`);
            } else {
                item.component = () => import(`@/views/menu/${item.componentName}.vue`);
            }
            if (item.sysClass) {
                item.meta.classInfo = item.sysClass;
            }
            if (item.children) {
                this.transfer(item.children);
            }
         });
    },

    /**
     * 页面刷新Vue根实例重新生成，动态路由需要重新添加
     */
    flushHandler(router, store) {
        let menu = sessionStorage.getItem('menu');
        if (!menu) {
            return;
        }
        menu = JSON.parse(menu);
        this.transfer(menu);
        router.addRoutes(menu);
        store.commit("getMenu",menu);
        /**
         * 同步routes
         */
        menu.forEach(item => {
            router.options.routes.push({
                path: item.path,
                name: item.name,
                component: item.component,
                children: item.children
            })
        })
        /**
         * 重新获取菜单对应的class
         */
        let currentPath = window.location.href.split("#")[1].split("/");
        currentPath.shift();
        let classInfo = {};
        menu.forEach(item => {
            if (currentPath.length === 1 && item.path ==  ("/" + currentPath[0])) {
                classInfo = item.sysClass;
            } else {
                item.children.forEach(subItem => {
                    if (subItem.path === currentPath[1]) {
                        classInfo = subItem.sysClass;
                    }
                })
            }
        })
        store.commit("getClassInfo", classInfo);

        let isWorkingCommittee = sessionStorage.getItem("isWorkingCommittee") === 'true';
        store.commit("updateIsWorkingCommittee", isWorkingCommittee);
    }
}
