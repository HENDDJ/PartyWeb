<template>
    <section class="app-main">
        <transition name="fade" mode="out-in">
            <keep-alive :include="cachedViews">
                <router-view :key="key"></router-view>
            </keep-alive>
        </transition>
    </section>
</template>

<script>
export default {
    name: 'AppMain',
    computed: {
        cachedViews() {
            return this.$store.state.tagsView.cachedViews
        },
        key() {
            return this.$route.fullPath
        }
    }
}
</script>
<style>
    .app-main {
        background-color: white;
        padding: 20px 30px;
        height: calc(100% - 35px);
        overflow-x: hidden;
        overflow-y: auto;
    }

    .app-main::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        -moz-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        -o-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        background-color: #F5F5F5;
        border-radius: 10px;
    }

    .app-main::-webkit-scrollbar {
        width: 8px;
        height: 10px;
        border-radius: 10px;
    }

    .app-main::-webkit-scrollbar-thumb {
        background-color: #005affad;
        border-radius: 10px;
        background-image: -webkit-linear-gradient(150deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);
    }
</style>
