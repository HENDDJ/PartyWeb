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
import '@/utils/DateFormatter.js'
import DynamicRoutes from '@/utils/dynamic-routes';
import Vuesax from 'vuesax'
import 'material-icons/iconfont/material-icons.css';

import 'vuesax/dist/vuesax.css' //Vuesax styles
Vue.use(Vuesax)

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

function initTouristScreen() {
    Vue.prototype.$touristScreenWid = () => {
        let screenWidth = document.documentElement.clientWidth ;
        return screenWidth/1920;
    };
    Vue.prototype.$touristScreenHei = () => {
        let screenHeight = document.documentElement.clientHeight ;
        return screenHeight/1080;
    };
}
initTouristScreen();

getRouter(router);

DynamicRoutes.flushHandler(router, store);

Vue.prototype.$screen = () => {
    let screenWidth = window.screen.width;
    return screenWidth/1920;
};

new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
});
