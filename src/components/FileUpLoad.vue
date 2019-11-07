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
            value: {
                immediate: true,
                handler: function () {
                    if (!this.value) {
                        this.files = [];
                        return;
                    }
                    this.files = [];
                    this.value.split(',').forEach(item => {
                        if (!item.split("&")[1]) {
                            this.files.push({name: item, path: `http://122.97.218.162:18006/JRPartyService/Upload/Activity/${item}`, res: `http://122.97.218.162:18006/JRPartyService/Upload/Activity/${item}`, active: false})
                        } else {
                            this.files.push({name: item.split("&")[1],path: item.split("&")[0], res: item.split("&")[0], active: false});
                        }
                    })
                }
            },
            disabled() {
                if (!this.disabled) {
                    document.getElementsByClassName('el-upload--text')[0].style.display = 'inline-block';
                } else {
                    document.getElementsByClassName('el-upload--text')[0].style.display = 'none';
                }
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
                this.$http('POST', '/zuul/identity/accessory/', formData, false).then(
                    res => {
                        this.files.push({name: res.name, path: res.path, active: false});
                        let value = this.files.map(item => {return item.path + '&' +item.name}).join(",");
                        this.$emit('getValue', value);
                    }
                );
            },
            remove(file, files) {
                let str = files.map(item => item.path + '&' +item.name).join(',');
                this.$emit('getValue', str || null);
            },
            downLoad(file){
                window.open(file.res,'_self');
            }
        },
        mounted() {
            if (this.disabled) {
                document.getElementsByClassName('el-upload--text')[0].style.display = 'none';
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
