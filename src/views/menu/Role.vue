<template>
    <section>
        <CommonCRUD :columns="$store.state.classInfo.properties" apiRoot="/identity/role"
                    :formColumns="formColumns">
            <template slot="header-btn" slot-scope="slotProps">
                <el-button type="info" plain @click="authorizationConfig(slotProps.selected)">权限配置</el-button>
            </template>
        </CommonCRUD>
        <el-dialog
            title="权限资源配置"
            :visible.sync="dialogVisible"
            width="40%"
            align="left"
            :modal-append-to-body='false'>
            <el-tree
                class="filter-tree"
                ref="tree"
                :data="menu"
                node-key="id"
                v-loading="loading"
                :props="{children: 'children',label: labelHandler}"
                :default-checked-keys="menuIdList"
                check-strictly
                show-checkbox>
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sumbit">提 交</el-button>
                <el-button @click="dialogFormVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import CommonCRUD from '@/components/CommonCRUD';
    export default {
        name: 'Role',
        data() {
            return {
                formColumns: [],
                dialogVisible: false,
                menu: [],
                role: {},
                menuIdList: [],
                loading: false
            }
        },
        methods: {
            loadDepartmentOptions() {
                this.$http('POST', 'identity/organization/list', false).then(
                    data => {
                        this.formColumns.filter( item => item.name === 'organizationId')[0].options = data.map(item => { return {value: item.id, label: item.name}});
                    }
                )
            },
            loadAllMenu() {
                this.$http('POST', `/identity/sysRoutes/list`, false).then(data => {
                    this.menu = data;
                });
            },
            loadSelectedMenu() {
                this.loading = true;
                this.$http('GET', `identity/roleMenu/${this.role.id}roleId`, false).then(
                    data => {
                        this.menuIdList = data.map(item => item.sysRouteId);
                        this.$refs.tree.setCheckedKeys(this.menuIdList);
                        this.$nextTick(() => {
                            this.loading = false;
                        })
                    }
                )
            },
            labelHandler(data) {
                return data.meta.title;
            },
            authorizationConfig(selected) {
                if (!this.$validate(selected)) {
                    return;
                }
                this.role = selected[0];
                this.dialogVisible = true;
                this.$nextTick(()=> {
                    this.loadSelectedMenu();
                })
            },
            sumbit() {
                let tree = this.$refs.tree;
                this.$http('POST', `identity/roleMenu/${this.role.id}roleId`, tree.getCheckedKeys()).then(
                    data => {
                        this.dialogVisible = false;
                    }
                )
            }
        },
        components: {
            CommonCRUD
        },
        created() {
            this.formColumns = this.$store.state.classInfo.properties;
            this.loadDepartmentOptions();
            this.loadAllMenu();
        }
    }
</script>

<style scoped>

</style>
