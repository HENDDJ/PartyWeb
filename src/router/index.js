import Vue from 'vue';
import Router from 'vue-router';
import NotFound from '@/layout/components/NotFound';
import Login from '@/views/menu/Login';
import NProgress from "nprogress";
import 'nprogress/nprogress.css';
import MainView from '@/layout/components/MainView';
import Cloud from '@/views/cloud/Cloud';
import Search from '@/views/search/Search';
import CloudRoot from '@/views/cloud/CloudRoot';
import CloudMap from '@/views/cloud/CloudMap';
import CloudVideo from '@/views/cloud/CloudVideo';
import CloudSwiper from '@/views/cloud/CloudSwiper';
import CloudPictures from '@/views/cloud/CloudPictures'
import ParActivityManage from '@/views/menu/ParActivityManage';

Vue.use(Router);

const router = new Router({
    mode: 'hash',
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/404',
            name: 'NotFound',
            component: NotFound
        },
        {
            path: '*',
            redirect: '/404'
        },
        {
            path: '/mainView',
            name: 'MainView',
            component: MainView
        },
        {
            path: '/dashboard',
            name: 'Dashboard',
            component: () => import('@/layout/Layout'),
            children: [{
                path: '/',
                name: 'DashboardRoot',
                component: () => import('@/views/menu/CentralConsole')
            }]
        },
        {
            path: '/parActivityManage',
            name: 'ParActivityManage',
            component: () => import('@/layout/Layout'),
            children: [{
                path: '/',
                name: 'ParActivityManage',
                component: ParActivityManage
            }]
        },
        {
            path: '/search',
            name: 'Search',
            component: () => import('@/layout/Layout'),
            children: [{
                path: '/',
                name: 'SearchRoot',
                component: Search
            }]
        },
        {
            path: '/gis',
            name: 'Gis',
            component: () => import('@/layout/Layout'),
            children: [{
                path: '/',
                name: 'GISmap',
                component: () => import('@/views/menu/GISmap')
            }]
        },
        {
            path: '/cloud',
            name: 'Cloud',
            component: Cloud
        },
        {
            path: '/cloudMap',
            name: 'CloudMap',
            component: CloudMap
        },
        {
            path: '/cloudRoot',
            name: 'CloudRoot',
            component: CloudRoot
        },
        {
            path: '/cloudVideo',
            name: 'CloudVideo',
            component: CloudVideo
        },
        {
            path: '/cloudPictures',
            name: 'CloudPictures',
            component: CloudPictures
        },
        {
            path: '/cloudSwiper',
            name: 'CloudSwiper',
            component: CloudSwiper
        }

    ]
});

router.beforeEach((to, from, next) => {

    // ** 跳转路由钱将对应的属性集合拿到Vuex中
    let matched = to.matched;
    router.app.$store.commit("getClassInfo", matched[matched.length-1].meta.classInfo);

    NProgress.start();
    if (to.path === '/login') {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("menu");
        next();
        return;
    }
    if(to.path === '/cloud'){
        next();
        return;
    }
    if(to.path === '/cloudMap'){
        next();
        return;
    }
    if(to.path === '/cloudVideo'){
        next();
        return;
    }
    if(to.path === '/cloudPictures'){
        next();
        return;
    }
    if(to.path === '/cloudSwiper'){
        next();
        return;
    }
    let token = sessionStorage.getItem("token");
    if (!token) {
        next('/login');
        return;
    }
    next();
});

router.afterEach(() => {
    NProgress.done();
});


export default router;
