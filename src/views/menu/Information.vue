<template>
    <div class="common-crud">
        <div class="handler-btn">
            <el-button type="primary" plain @click="add()" class="self-btn">新增</el-button>
        </div>
        <el-table :data="informationList" v-loading="loading" border align="center" stripe
                  :header-cell-style="{'background-color': '#fafafa','color': 'rgb(80, 80, 80)','border-bottom': '1px solid #dee2e6'}">
            <el-table-column prop="name" label="发布组织" align="center" ></el-table-column>
            <el-table-column prop="title" label="标题" align="center" ></el-table-column>
            <el-table-column prop="description" label="内容" align="center"></el-table-column>
            <el-table-column  label="操作" align="center" width="200">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
                    <el-button  type="text" size="small" @click="look(scope.row)">查看</el-button>
                    <el-button  type="text" size="small" @click="del(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="text-align: right;margin-top: 20px;"
                       background
                       :total="pageable.total" :current-page.sync="pageable.currentPage" :page-size.sync="pageable.pageSize"
                       @current-change="currentChange" @size-change="sizeChange" layout="total, sizes, prev, pager, next">
        </el-pagination>
        <el-dialog
            v-if="dialogVisible"
            :title="title"
            :visible.sync="dialogVisible"
            width="60%"
            align="left"
            :modal-append-to-body='false'
            :append-to-body="true"
            :before-close="handleClose">
            <el-form :inline="true" :model="form"  ref="form" class="demo-form-inline" label-width="100px">
                <el-form-item label="标题">
                    <el-input v-model="form.title" :disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item label="内容">
                    <el-input v-model="form.description" :disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item label="发布对象">
                    <el-tree
                        :props="props"
                        ref="tree"
                        :load="loadNode"
                        lazy
                        show-checkbox
                        @check = "handleId">
                    </el-tree>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="submitLoading" @click="submit(form)">确 认</el-button>
                <el-button @click="handleClose">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Information",
        data() {
            return {
                informationList:[],
                pageable: {
                    total: 0,
                    currentPage: 1,
                    pageSize: 10
                },
                form:{},
                dialogVisible: false,
                loading: false,
                title:'',
                disabled: false,
                submitLoading: false,

                props: {
                    id: 'id',
                    label: 'label',
                    children: 'children',
                    isLeaf: 'leaf'
                },
            };
        },
        methods: {
            //树节点数据
            loadNode(node, resolve) {
                if (node.level === 0) {
                    return resolve([{ id: '01', label: '句容市委', children: [] }]);
                }
                this.$http('GET',`/identity/sysDistrict/${node.data.id}tree`,false).then((data)=>{
                    return resolve(data);
                })
            },
            handleId(){
              //  let ids = {sid:[],zid:[],cid:[]}
                let ids = [ ];
                this.$refs.tree.getCheckedNodes().forEach(item=>{
                   // console.log(item.id)
                    /*if(item.id.length == 2){
                        ids.sid.push(item.id)
                    }
                    if(item.id.length == 4){
                        ids.zid.push(item.id)
                    }
                    if(item.id.length == 6){
                        ids.cid.push(item.id)
                    }*/
                    ids.push(item.id);
                })
                this.form.districtIdList = ids;
              //  this.form.districtID = '01';
            },

            currentChange(currentPage){
                this.pageable.currentPage = currentPage;
                this.showInformationList();
            },
            sizeChange(size){
                this.pageable.pageSize = size;
                this.showInformationList();
            },
            showInformationList(){
                this.loading = true;
                this.$http('POST',`/identity/information/page?page=${this.pageable.currentPage-1}&size=${this.pageable.pageSize}`,false).then(data => {
                    this.informationList = data.content;
                    this.pageable.total= data.totalElements;
                    this.loading = false;
                });
            },
            add(){
                this.title = "新增";
                this.dialogVisible = true;
                this.disabled = false;
            },
            edit(row){
                this.title = "编辑";
                this.dialogVisible = true;
                this.disabled = false;
                this.form = row;
            },
            look(row){
                this.title = "查看";
                this.dialogVisible = true;
                this.disabled = true;
                this.form = row;
            },
            del(row){
                this.$confirm('确认删除？')
                    .then(_ => {
                        this.$http(`DELETE`, `identity/information/${row.id}id`).then(_ => {
                            this.showInformationList();
                        });
                    })
                    .catch(_ => {});
            },
            submit (form) {
                this.submitLoading = true;
                //新增
                if(form.id==null){
                    form.releaseTime = form.createdAt;
                    form.districtID = JSON.parse(sessionStorage.getItem("userInfo")).sysDistrict.districtId;
                    this.$http('POST',`identity/information/`,form).then(() => {
                        this.submitLoading = false;
                        this.dialogVisible = false;
                        this.showInformationList();
                        this.form ={};
                    });
                }
                //编辑
                if((form.id!=null)&&(this.disabled===false)){
                    this.$http('PUT', `identity/information/${form.id}id`,form).then(() =>{
                        this.submitLoading = false;
                        this.dialogVisible = false;
                        this.showInformationList();
                        this.form={};
                    });
                }else{//查看
                    this.submitLoading = false;
                    this.dialogVisible = false;
                    this.form={};
                }
            },
            //关闭确认dialog
            handleClose (done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        this.from = {};
                        this.$refs['form'].resetFields();
                        this.disabled = false;
                        this.dialogVisible = false;
                        done();
                    })
                    .catch(_ => {});
            },
        },
        created() {
            this.showInformationList();
            console.log(JSON.parse(sessionStorage.getItem("userInfo")).sysDistrict.districtId);
        }
    }
</script>

<style scoped>
    .common-crud {
        width: 95%;
        padding: 2%;
        background-color: rgba(255, 255, 255, .9);
    }
    .el-pagination__sizes .el-input--mini .el-input__inner {
        width: 120px !important;
    }
    .el-pagination__sizes .el-select {
        width: 120px !important;
    }
    .handler-btn {
        float: left;
        margin-bottom: 12px;
    }
    .self-btn {
        width: 56px !important;
        height: 28px !important;
        border-radius: 5px !important;
    }
    .footer-position {
        margin-right: 84px;
    }
    .filter-tree {
        font-size: 14px;
    }
</style>
