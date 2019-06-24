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
            return this.$store.state.tagsView.cachedViews;
        },
        key() {
            return this.$route.fullPath;
        }
    }
}
</script>
<style>
    .app-main {
        padding: 15px 0;
        width: 100%;
        height: calc(100% - 35px);
        overflow-x: hidden;
        overflow-y: auto;
    }

    *::-webkit-scrollbar-track {
        border-radius: 10px;
        background-color: rgba(255, 255, 255, .5);
    }

    *::-webkit-scrollbar {
        width: 5px;
        height: 10px;
        border-radius: 10px;
    }

    *::-webkit-scrollbar-thumb {
        background-color: #005affad;
        border-radius: 10px;
        background-image: -webkit-linear-gradient(150deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);
    }
</style>
