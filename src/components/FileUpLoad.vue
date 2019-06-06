<template>
    <div class="file-upload">
        <el-upload
            class="avatar-uploader"
            action=""
            :file-list="files"
            :on-remove="remove"
            :on-preview="downLoad"
            :http-request="uploadFile"
            :disabled="disabled">
            <el-button v-if="!disabled" size="small" type="primary">点击上传</el-button>
        </el-upload>
    </div>
</template>

<script>
    export default {
        name: "FileUpLoad",
        props: {
            value: {
                //成功上传后的返回的文件地址
                type: String,
                default: ''
            },
            disabled: {
                type: Boolean,
                default: false
            },
        },
        watch: {
            value() {
                if (!this.value) {
                    this.files = [];
                    return;
                }
                this.files = [];
                this.value.split(',').forEach(item => {
                    console.log(item);
                    this.files.push({name: item.split("&")[1], res: item.split("&")[0], active: false})
                    //  this.files.push({name: item,  active: false})
                })
            }
        },
        data() {
            return {
                files:[],
                dialogUrl: '',
            };
        },
        methods: {
            uploadFile(http) {
                let file = http.file;
                let formData = new FormData();
                formData.append('file', file);
                this.$http('POST', '/identity/accessory/', formData, false).then(
                    res => {
                        this.files.push({name: res.name, path: res.path, active: false});
                        this.$emit('getValue', this.files.map(item => item.path + '&' +item.name).join(','));
                    }
                );
            },
            remove(file, files) {
                this.$emit('getValue', files.map(item => item.path + '&' +item.name).join(','));
            },
            downLoad(file){
                window.open(file.res,'_self');
            }
        }
    }
</script>

<style scoped>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 70px;
        height: 70px;
        line-height: 70px;
        text-align: center;
        display: inline-block;
        border: #b7b7b7 1px dashed;
        border-radius: 5px;
        vertical-align: top
    }
    .img-container {
        display: inline-block;
        vertical-align: top;
        width: 70px;
        height: 70px;
    }
    .ico-po-del {
        font-size: 22px;
        color: #565656;
        top: 16px;
        z-index: 999;
        position: relative;
    }
    .ico-po-zoom {
        font-size: 22px;
        z-index: 999;
        top: 16px;
        color: #565656;
        position: relative;
    }
    .ico-po-del:hover {
        color: #ff4522;
    }
    .ico-po-zoom:hover {
        color: #409EFF;
    }
    .img-pre {
        width: 70px;
        height: 70px;
        display: inline-block;
        border: #b7b7b7 1px dashed;
        border-radius: 5px;
    }
    .file-upload{
        width:500px;
    }
</style>
