<template>
	<div class="top_bar">
        <vs-navbar
            v-model="indexActive"
            :color="colorx"
            text-color="rgba(255,255,255,1)"
            active-text-color="#FCF42F"
            class="top_bar_content">
            <div slot="title">
                <vs-navbar-title>

                </vs-navbar-title>
            </div>

            <vs-navbar-item index="0" >
                <a href="#">个人中心</a>
            </vs-navbar-item>
            <vs-navbar-item index="1">
                <a href="#">消息中心</a>
            </vs-navbar-item>
            <vs-navbar-item index="2">
                <a href="#">退出</a>
            </vs-navbar-item>

            <vs-spacer></vs-spacer>
            <vs-button color-text="rgb(255, 255, 255)" color="rgba(255, 255, 255, 0.3)" type="flat" icon="more_horiz"></vs-button>
        </vs-navbar>
    </div>
</template>

<script>
    export default {
        name: "TopBar",
        data() {
            return {
                indexActive: ''
            }
        }
    }
</script>

<style scoped>
    .top_bar {
        background: url("/static/img/top_bg.png") no-repeat;
        background-size: 100% 100%;
        width: calc(1920 * 100vw/1920);
        height: calc(60 * 100vw/1920);
    }
    .top_bar_content {
        height: calc(60 * 100vw/1920);
        font-size: 16px !important;
    }
</style>
