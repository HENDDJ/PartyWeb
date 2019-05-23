import Vue from 'vue';
import Router from 'vue-router';
import NotFound from '@/layout/components/NotFound';
import Login from '@/views/menu/Login';
import NProgress from "nprogress";
import 'nprogress/nprogress.css';
import ParActivity from '@/views/party/ParActivity';
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
            path: '/ParActivity',
            name: 'ParActivity',
            component: ParActivity
        }
    ]
});

router.beforeEach((to, from, next) => {
    NProgress.start();
   /* if (to.path === '/login') {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("menu");
        next();
        return;
    }
    let token = sessionStorage.getItem("token");
    if (!token) {
        next('/login');
        return;
    }*/
    next();
});

router.afterEach(() => {
    NProgress.done();
});


export default router;
