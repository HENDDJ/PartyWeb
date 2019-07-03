import Vue from 'vue';
import Vuex from 'vuex';
import tagsView from './tagsView';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        tagsView
    },
    state: {
        menuList: [],
        classInfo: {},
        //跳入扬尘界面默认工程
        projectId: '',
        projectName: '',
        routeIndex:''
    },
    mutations: {
        getMenu(state, data) {
            state.menuList = data;
        },
        getClassInfo(state, data) {
            state.classInfo = data;
        },
        getProjectId(state, data) {
            state.projectId = data;
        },
        getProjectName(state, data) {
            state.projectName = data;
        },
        getRouterIndex(state,data){
            state.routeIndex = data;
        }

    }
})
