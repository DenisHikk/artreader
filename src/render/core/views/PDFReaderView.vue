<template>
    <div ref="containerPdf">
        <div
            v-for="page in totalPages"
            :key="page"
            ref="pageContainers"
            class="container-pdf">
            <canvas></canvas>
            <div class="text_layer"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import log from "electron-log/renderer";

import { nextTick, onBeforeMount, onMounted, onUpdated, ref } from "vue";
import { PDFReader } from "../models/plugins/PDFReader";

const props = defineProps<{file: string}>();

const totalPages = ref<number>(0);

const containerPdf = ref<HTMLDivElement | null>(null);
const pageContainers = ref<HTMLElement[]>([]);

const pdfReader = new PDFReader();

onBeforeMount(async () => {

});

onMounted(async () => {
    await pdfReader.load(props.file);
    totalPages.value = pdfReader.getTotalPages();
    if(!pageContainers.value) {
        throw new Error(`Can't find pageContainer: ${pageContainers}, ${pageContainers.value}`);
    }
    // wait render all div
    await nextTick();
    for(const page in pageContainers.value) {
        await pdfReader.render(pageContainers.value[page], Number.parseInt(page) + 1); // because page are counted from 1
    }
});

onUpdated(async () => {

})

</script>


<style scoped lang="scss">
canvas {
    z-index: 0;
    display: block;
    position: relative;
}
.container-pdf {
    position: relative;
    margin: 10px auto;
}
.text_layer {
    position: absolute;
    top: 0;
    left: 0;
    text-align: initial;
    inset: 0;
    overflow: hidden;
    opacity: 1;
    line-height: 1;
    z-index: 1;
    transform-origin: 0 0;
    width: 100%;
    padding: 0;
    margin: 0;
    margin: 0px auto;
}


</style>

<style lang="scss">
.text_layer>span {
    position: absolute;
    white-space: pre;
    color: transparent;
}

.text_layer>span::selection {
    color: transparent;
    background: rgba(0 0 255 / 0.25);
}
</style>