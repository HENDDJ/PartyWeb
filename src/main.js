// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
// import '@/utils/browser-polyfill.min.js';
import '@/utils/proxy-poyfill';
import '@/utils/sessionStorage'
import Vue from 'vue';
import App from './App';
import store from '@/store';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/base.css';
import './style/index.scss';
import 'material-icons/iconfont/material-icons.css';
import 'vuesax/dist/vuesax.css' //Vuesax styles
import Icon from 'vue-svg-icon/Icon.vue';
import { generate, common, getRouter, ht } from '@/api';
import '@/utils/DateFormatter.js'
import DynamicRoutes from '@/utils/dynamic-routes';
import Vuesax from 'vuesax';
import Spinner from 'vue-spinkit';
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import Vue2OrgTree from 'vue2-org-tree';
import * as custom from './common/filters/custome.js'
Object.keys(custom).forEach(key => {
    Vue.filter(key, custom[key])
})
Vue.use(Vue2OrgTree)
Vue.use(Viewer)
Viewer.setDefaults({
    Options: { zIndex:99999,'inline': true, 'button': true, 'navbar': true, 'title': true, 'toolbar': true, 'tooltip': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, 'url': 'data-source' }
})
Vue.use(Vuesax);
Vue.component('Spinner', Spinner);

Vue.config.productionTip = false;

Vue.use(ElementUI, {size: 'mini'});
Vue.use(store);
Vue.component('icon', Icon);

Vue.prototype.$http = common.http;
let token = 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJBVVRIX1NVR0FSX1RPS0VOIiwiaWF0IjoxNTc5MTU1MjE0LCJpc3MiOiJ3d3cuY2xvdWRrZWVwZXIuY29tIiwic3ViIjoic2VydmljZUBjbG91ZGtlZXBlci5jbiIsImV4cCI6MTU3OTE5MTIxNH0.i3AKV_VPP4_Iko1VOD1PUNKfHfWftVevNFcWKiFOaTY';
let headerAuth = {authorization: token};
Vue.prototype.$httpCloud = (method, url, data, showMessage) => common.http(method, url, data, headerAuth, showMessage);
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
    Vue.prototype.$touristScreenWid = (() => {
        let screenWidth = document.body.clientWidth ;
        return screenWidth/1920;
    })();
    Vue.prototype.$touristScreenHei = (() => {
        let screenHeight = document.body.clientHeight ;
        return screenHeight/1080;
    })();
}
initTouristScreen();

getRouter(router);

DynamicRoutes.flushHandler(router, store);

Vue.prototype.$screen = () => {
    let screenWidth = window.screen.width;
    return screenWidth/1920;
};

Vue.prototype.resetSetItem = function (key, newVal) {
    if (key === 'cloudPicture') {
        // 创建一个StorageEvent事件
        let newStorageEvent = document.createEvent('StorageEvent');
        const storage = {
            setItem: function (k, val) {
                localStorage.setItem(k, val);
                // 初始化创建的事件
                newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);
                // 派发对象
                window.dispatchEvent(newStorageEvent)
            }
        };
        return storage.setItem(key, newVal);
    }
};

new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
});
