<template>
    <div class="container" ref="container">
        <div ref="pageOne" class="page1"></div>
        <div ref="pageTwo" class="page2"></div>
    </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';

import log from "electron-log/renderer"
import { EPUBReader } from '../models/plugins/EPUBReader';

const container = ref<HTMLDivElement | null>(null);

const props = defineProps<{file: string}>();

const epubReader = new EPUBReader();

const pageOne = ref<HTMLElement | null>(null);
const pageTwo = ref<HTMLElement | null>(null);

onMounted(async () => {
    await epubReader.load(props.file);
    await nextTick();
    if(!pageOne.value || !pageTwo.value) {
        throw new Error("Can't create container");
    }
    await epubReader.render(pageOne.value);
})

window.addEventListener("keydown", async (event)=> {
    if(event.key === "ArrowLeft") {
        await epubReader.prevPage();
    }
    if(event.key === "ArrowRight") {
        await epubReader.nextPage();
    }
})

</script>

<style scoped lang="scss">
.container {
    width: 595px;
    height: 842px;
    overflow: auto;
    background-color: aqua;
}
</style>