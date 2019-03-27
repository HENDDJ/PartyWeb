/**
 * @desc
 * @author asher
 * @date 2018-10-26
 */
/**
 * 为了能复用以下方法，组件数据缓存需要满足一下约定：
 * 1.每个组件仅定义一个总的缓存对象且名字为 cacheObject
 * 2.缓存对象结构应满足一下结构，以此类类推。
 *      cacheObject: {
 *          child1List: [], 子表一需要缓存新增、修改的对象的集合 >>>>>>>>>>>>>>>> cacheList
 *          child1DeleteList: [], 子表一需要缓存删除对象的id的集合 >>>>>>>>>>>>>>>> deleteIdList
 *          child2List: [], 子表二需要缓存新增、修改的对象的集合
 *          child2DeleteList: [], 子表二需要缓存删除对象的id的集合
 *          .......
 *      }
 * 3.以下函数参数所对应组件的数据变量，以上图所表示。
 * 4.以下函数如有更改、改进请详细注释
 *
 */

/**
 * 生成UUID，唯一标识符
 * @return {string}
 */
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0;
        let v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    })
}

/**
 * 新增编辑模态框处理
 * @param cacheList 需要缓存的数组变量
 * @param tableList 列表绑定的数组变量
 * @param form 模态框所绑定的表单变量
 */
let handleCache = function(cacheList, tableList, form) {
    let id = form.id;
    let fakeId = form.fakeId;
    // 已存库数据编辑处理
    if (id) {
        let index = cacheList.findIndex(item => item.id === id);
        if (index !== -1) {
            Object.assign(cacheList[index], form);
        } else {
            cacheList.push(form);
        }
        index = tableList.findIndex(item => item.id === id);
        this.$set(tableList, index, form);
    } else if (fakeId) {
        // 新增未存库数据编辑处理
        let index = cacheList.findIndex(item => item.fakeId === fakeId);
        Object.assign(cacheList[index], form);
        index = tableList.findIndex(item => item.fakeId === fakeId);
        this.$set(tableList, index, form);
    } else {
        // 纯新增处理
        form.fakeId = guid();
        tableList.push(form);
        cacheList.push(form);
    }
}

/**
 * 提交前过滤掉更新、新增缓存中要被删除的记录（仅针对已存库的数据）
 * @param cacheList 更新新增缓存的数据变量
 * @param deleteIdList 需要删除的数据id集合
 * @return {*}
 */
let cacheFilter = (cacheList, deleteIdList) => {
    return cacheList.filter(item => deleteIdList.indexOf(item.id) === -1);
}

/**
 * 显示模态框
 * @param form 模态框绑定的数据对象
 * @param row 列表当前行
 * @param conObj 界面显示隐藏控制变量
 */
let showHandle = function(form, row, conObj) {
    Object.assign(form, row);
    this[conObj] = true;
}

/**
 * 关闭模态框的操作、可以扩展
 * @param form
 */
let handleClose = function(form) {
    this[form] = {};
}

/**
 * 处理删除操作
 * @param id 当前行id
 * @param index 当前行索引
 * @param tableList 当前列表绑定的对象
 * @param deleteIdList 缓存需要删除的对象id集合
 * @param cacheListName 缓存的新增 修改的变量名 变量名！！
 */
let handleDelete = function(id, index, tableList, deleteIdList, cacheListName) {
    let delObj = tableList.splice(index, 1)[0];
    let cacheList = this.cacheObject[cacheListName];
    if (id) {
        deleteIdList.push(id);
    } else {
        this.cacheObject[cacheListName] = cacheList.filter(item => item.fakeId !== delObj.fakeId);
    }
}

/**
 * 模拟初始化数据的、可删 后期
 * @param t
 */
let initData = (t) => {
    t.handleForm = {'attendanceList': [], 'name': '123', 'mobileNumbers': '123', 'licenseNumbers': '1'};
    t.attendanceList.push({'id': '66666', 'cause': '原因', 'driversId': '司机id'});
}

export default {
    handleCache,
    cacheFilter,
    showHandle,
    handleClose,
    handleDelete,
    initData
}

