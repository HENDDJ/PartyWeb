// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
// import '@/utils/browser-polyfill.min.js';
import '@/utils/proxy-poyfill';
import '@/utils/sessionStorage'
import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './style/index.scss';
import Icon from 'vue-svg-icon/Icon.vue';
import { generate, common, getRouter ,ht } from '@/api';
import store from '@/store';
import DynamicRoutes from '@/utils/dynamic-routes';

Vue.config.productionTip = false;

Vue.use(ElementUI, {size: 'mini'});
Vue.use(store);
Vue.component('icon', Icon);

Vue.prototype.$http = common.http;
Vue.prototype.$genHttp = generate;
Vue.prototype.$copy = (target) => Object.assign({}, target);
Vue.prototype.$validate = (selected) => {
    if (selected.length !== 1) {
        ElementUI.Message({
            type: 'warning',
            message: selected.length > 1 ? '仅能选择一行记录' : '请选择一行记录'
        });
        return false;
    }
    return true;
};

Vue.prototype.$screen = () => {
    let screenWidth = window.screen.width;
    return screenWidth/1920;
};

getRouter(router);

DynamicRoutes.flushHandler(router, store);

new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
});
