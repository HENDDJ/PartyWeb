<template>
    <section style="background:#494949;width:100%;height:100%;">
        <div class="head404"></div>
        <div class="txtbg404">
            <div class="txtbox">
            <p>对不起，您请求的页面不存在、或已被删除、或暂时不可用</p>
            <p class="paddingbox">请点击以下链接继续浏览网页</p>
            <p>》<a style="cursor:pointer" onclick="history.back()">返回上一页面</a></p>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.head404{
    width:580px;
    height:234px;
    margin:0 auto 0 auto;
}
.txtbg404 {
    width:499px;
    height:169px;
    margin:10px auto 0 auto;
    .txtbox {
        width:390px;
        position:relative;
        top:30px; left:60px;
        color:#eee;
        font-size:13px;
        .paddingbox {
            padding-top:15px;
        }
        p {
           margin:5px 0;
           line-height:18px;
        }
        a {
           color:#eee;
           text-decoration:none;
        }
        a:hover {
            color:#FC9D1D;
            text-decoration:underline;
        }
    }
}
</style>
