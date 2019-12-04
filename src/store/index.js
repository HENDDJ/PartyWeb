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
        routeIndex:'',
        isCollapse: false,
        checkNumber:0,
        // 是否是机关工委的账号
        isWorkingCommittee: false
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
        },
        updateIsCollapse(state, data) {
            state.isCollapse = data;
            if (data) {
                document.getElementsByClassName('side-position')[0].style.width='63px';
            } else {
                document.getElementsByClassName('side-position')[0].style.width='220px';
            }
        },
        getCheckNumber(state,data){
            state.checkNumber = data;
        },
        updateIsWorkingCommittee(state, data) {
            state.isWorkingCommittee = data;
        }

    }
})
