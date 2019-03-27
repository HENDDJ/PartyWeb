<template>
    <el-upload
        class="upload-demo"
        action="/api/identity/accessory/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :limit="3"
        :headers="headers"
        :on-exceed="handleExceed"
        :http-request="uploadFile"
        :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
</template>
<script>
    export default {
        data() {
            return {
                fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]
            };
        },
        computed: {
            headers() {
                let token = sessionStorage.getItem('token');
                return {
                    'authorization': token
                }
            }
        },
        methods: {
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            uploadFile(e) {
                let formData = new FormData();
                formData.append(e.filename,e.file);
                formData.append('name', 'pph');
                formData.append('masterObject', 'p1');
                formData.append('masterTableId', 'ppp2');
                formData.append('type', 'pph111');
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                };
                let path = `/identity/accessory/`;
                this.$http("POST",path,formData,config).then( res => {
                })
            },
        }
    }
</script>
