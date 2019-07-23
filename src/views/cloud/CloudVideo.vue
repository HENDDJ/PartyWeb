<template>
    <section class="content">
        <video :src="videoUrl" controls="controls" style="width: 532px;height: 208px"  id="v_video" ></video>
    </section>
</template>

<script>
    export default {
        name: "CloudVideo",
        data(){
            return {
               videoUrl: "http://172.16.1.140:9391/vod/JTEDU0245492022.mp4",
            }
        },
        mounted() {
            window.addEventListener("storage", function (e) {
                alert(e);
                $("#v_video").attr("src", e.newValue);//更新url
                console.log(this.videoUrl,"receive")
            });
        }
    }
</script>

<style scoped>
  .content{
      width: 532px;
      height: 208px;
  }
</style>
