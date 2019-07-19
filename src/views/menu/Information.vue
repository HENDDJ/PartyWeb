<template>
    <section class="common-crud">
        <div class="handler-btn">
            <el-button type="primary" v-if="authorityControl" plain @click="add()" class="self-add self-btn">&nbsp;
            </el-button>
            <el-button type="success" v-if="authorityControl" plain class="self-btn self-edit" @click="edit()">&nbsp;
            </el-button>
            <el-button type="success" plain class="self-btn self-look" @click="look()">&nbsp;</el-button>
            <el-button type="danger" v-if="authorityControl" plain @click="del()" class="self-del self-btn">&nbsp;
            </el-button>
        </div>
        <div class="common-query">
            <el-form :inline="true" class="demo-form-inline" label-width="75px">
                <el-form-item label="标题">
                    <el-input v-model="queryTitle"></el-input>
                </el-form-item>
                <el-button @click="query" type="primary" size="mini" icon="el-icon-search">搜索</el-button>
            </el-form>
        </div>
        <el-table :data="informationList" v-loading="loading" border align="center" stripe
                  @selection-change="handleSelectionChange"
                  :header-cell-style="{'background-color': '#fafafa','color': 'rgb(80, 80, 80)','border-bottom': '1px solid #dee2e6'}">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="name" label="发布组织" align="center"></el-table-column>
            <el-table-column prop="title" label="标题" align="center"></el-table-column>
            <el-table-column prop="description" label="内容" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="发布时间" align="center">
                <template slot-scope="scope">
                    {{scope.row.createdAt|dateServer}}
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="text-align: right;margin-top: 20px;"
                       background
                       :total="pageable.total" :current-page.sync="pageable.currentPage"
                       :page-size.sync="pageable.pageSize"
                       @current-change="currentChange" @size-change="sizeChange"
                       layout="total, sizes, prev, pager, next">
        </el-pagination>
        <el-dialog
            v-if="dialogVisible"
            :title="title"
            :visible.sync="dialogVisible"
            width="880px"
            align="left"
            :modal-append-to-body='false'
            :append-to-body="true"
            :before-close="handleClose">
            <el-form :inline="true" :model="form" ref="form" class="demo-form-inline" label-width="170px">
                <el-form-item label="标题">
                    <el-input v-model="form.title" :disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item label="内容">
                    <Tinymce type="rich-editor" v-model="form.description"></Tinymce>
                </el-form-item>
                <el-form-item label="发布对象" v-if="acceptPerson">
                    <el-tree
                        :data="idList"
                        :props="props"
                        ref="tree"
                        show-checkbox
                        @check="handleId">
                    </el-tree>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="submitLoading" @click="submit(form)">确 认</el-button>
                <el-button @click="handleClose">取 消</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import Tinymce from '@/components/Tinymce';

    export default {
        name: "Information",
        data() {
            return {
                informationList: [],
                pageable: {
                    total: 0,
                    currentPage: 1,
                    pageSize: 10
                },
                form: {},
                dialogVisible: false,
                loading: false,
                title: '',
                disabled: false,
                submitLoading: false,
                selected: [],
                props: {
                    id: 'id',
                    label: 'label',
                    children: 'children',
                    isLeaf: 'leaf'
                },
                //按钮权限控制
                authorityControl: true,
                //发布的对象只有新增时可以看到，编辑查看都不能看到
                acceptPerson: true,
                queryTitle: '',
                idList: [],
            };
        },
        methods: {
            //树节点数据
            loadNode() {
                this.$http('GET', `/identity/sysDistrict/01alltree`, false).then((data) => {
                    this.idList = data;
                })
            },
            handleId() {
                let ids = [];
                this.$refs.tree.getCheckedNodes().forEach(item => {
                    ids.push(item.id);
                })
                this.form.districtIdList = ids;
            },
            currentChange(currentPage) {
                this.pageable.currentPage = currentPage;
                this.showInformationList();
            },
            sizeChange(size) {
                this.pageable.pageSize = size;
                this.showInformationList();
            },
            showInformationList() {
                this.loading = true;
                let currentUser = JSON.parse(sessionStorage.getItem("userInfo")).sysDistrict.districtId;
                if (currentUser === '01') {
                    this.authorityControl = true;
                    this.$http('POST', `/identity/information/page?page=${this.pageable.currentPage - 1}&size=${this.pageable.pageSize}&sort=createdAt,desc`, false).then(data => {
                        this.informationList = data.content;
                        this.pageable.total = data.totalElements;
                        this.loading = false;
                    });
                } else {
                    this.authorityControl = false;
                    this.$http('POST', `/identity/acceptInformation/page?page=${this.pageable.currentPage - 1}&size=${this.pageable.pageSize}`, {objs: currentUser}, false).then(data => {
                        this.informationList = data.content;
                        this.pageable.total = data.totalElements;
                        this.loading = false;
                    });
                }

            },
            add() {
                this.title = "新增";
                this.dialogVisible = true;
                this.disabled = false;
                this.acceptPerson = true;
            },
            edit() {
                this.title = "编辑";
                if (this.validateRows()) {
                    this.dialogVisible = true;
                    this.disabled = false;
                    this.acceptPerson = false;
                    this.form = Object.assign({}, this.selected[0]);
                }
            },
            look() {
                this.title = "查看";
                if (this.validateRows()) {
                    this.dialogVisible = true;
                    this.disabled = true;
                    this.acceptPerson = false;
                    this.form = Object.assign({}, this.selected[0]);
                    let currentUser = JSON.parse(sessionStorage.getItem("userInfo")).sysDistrict.districtId;
                    //处理接收公告
                    if (currentUser != '01') {
                        this.form.status = "1";
                        this.$http('PUT', `identity/acceptInformation/${this.form.id}id`, this.form, false).then(() => {
                        });
                    }
                }

            },
            del() {
                if (!this.validateRows()) {
                    return;
                }
                this.$confirm('确认删除？')
                    .then(_ => {
                        this.$http(`DELETE`, `identity/information/${this.selected[0].id}id`).then(_ => {
                            this.showInformationList();
                        });
                    })
                    .catch(_ => {
                    });
            },
            submit() {
                this.submitLoading = true;
                //新增
                if (this.form.id == null) {
                    this.form.releaseTime = this.form.createdAt;
                    this.form.districtID = JSON.parse(sessionStorage.getItem("userInfo")).sysDistrict.districtId;
                    this.$http('POST', `identity/information/`, this.form).then(() => {
                        this.submitLoading = false;
                        this.dialogVisible = false;
                        this.showInformationList();
                        this.form = {};
                    });
                }
                //编辑
                if ((this.form.id != null) && (this.disabled === false)) {
                    this.$http('PUT', `identity/information/${this.form.id}id`, this.form).then(() => {
                        this.submitLoading = false;
                        this.dialogVisible = false;
                        this.showInformationList();
                        this.form = {};
                    });
                } else {//查看
                    this.submitLoading = false;
                    this.dialogVisible = false;
                    this.form = {};
                }
            },
            //关闭确认dialog
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        this.from = {};
                        this.$refs['form'].resetFields();
                        this.disabled = false;
                        this.dialogVisible = false;
                        done();
                    })
                    .catch(_ => {
                    });
            },
            handleSelectionChange(val) {
                this.selected = val;
            },
            validateRows() {
                if (this.selected.length !== 1) {
                    this.$message({
                        type: 'warning',
                        message: this.selected.length > 1 ? '仅能选择一行记录' : '请选择一行记录'
                    });
                    return false;
                }
                return true;
            },
            query() {
                this.pageable.currentPage = 1;
                this.pageable.pageSize = 10;
                let currentUser = JSON.parse(sessionStorage.getItem("userInfo")).sysDistrict.districtId;
                if (currentUser === '01') {
                    this.$http('POST', `/identity/information/page?page=${this.pageable.currentPage - 1}&size=${this.pageable.pageSize}&sort=createdAt,desc`, {title: this.queryTitle}, false).then(data => {
                        this.informationList = data.content;
                        this.pageable.total = data.totalElements;
                        this.loading = false;
                    });
                } else {
                    this.$http('POST', `/identity/acceptInformation/page?page=${this.pageable.currentPage - 1}&size=${this.pageable.pageSize}`, {
                        objs: currentUser,
                        title: this.queryTitle
                    }, false).then(data => {
                        this.informationList = data.content;
                        this.pageable.total = data.totalElements;
                        this.loading = false;
                    });
                }
            },
        },
        components: {
            Tinymce,
        },
        // 声明一个本地的过滤器
        filters: {
            timer: function (value) {
                return value.replace(/T/, " ").split('.')[0]
            },

        },
        created() {
            this.showInformationList();
            this.loadNode();
        }
    }
</script>

<style scoped>
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

    .self-add {
        background: url('../../../static/img/add.png') !important;
        background-size: cover !important;
    }

    .self-del {
        background: url('../../../static/img/del.png') !important;
        background-size: cover !important;
    }

    .self-edit {
        background: url('../../../static/img/edit.png') !important;
        background-size: cover !important;
    }

    .self-look {
        background: url('../../../static/img/look.png') !important;
        background-size: cover !important;
    }

    .common-query {
        float: right;
    }

    .common-crud {
        width: calc(100% - 10px);
    }
</style>
