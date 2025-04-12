<template>
    <h1>{{state.msg}}</h1>
    <p>You open {{state.path}}</p>
    <button @click="openFile">Open file</button>
    <canvas ref="refCanvas" width="500" height="500"></canvas>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { PDFRenderService } from './service/PDFRenderService';
import { getDocument, PageViewport } from 'pdfjs-dist';
import logger from './utils/Logger';

let pdfDoc: any = null;
let file: string;
let pdf: ArrayBuffer;

const refCanvas = ref<HTMLCanvasElement | null>();

interface AppState {
    msg: string,
    path: string,
    currentPage: number,
    totalPage: number,
    scale: number,
}

const state = reactive<AppState>({
    msg: "Hello from Electron and Vue app",
    path: "No selected file",
    currentPage: 1,
    totalPage: 0,
    scale: 1.0,
});

async function openFile() {
    file = await window.api.dialogOpenFile();
    logger.debug(`file is ${file}`);
    pdf = await window.api.openFile(file)
    state.path = file.split("/")[file.split("/").length - 1];
    logger.debug(`pdf: ${pdf}`);
    render();
}

onMounted(() => {
    if (!refCanvas) return;
});

async function render() {
    logger.debug(`canvas: ${refCanvas}`)
    const pdfRender = new PDFRenderService();
    await pdfRender.readFile(pdf);
    const page = await pdfRender.getPage(state.currentPage);
    const ctx = refCanvas.value?.getContext("2d");
    if (!refCanvas || !refCanvas.value || !page) {
        logger.error(`Something wrong ${page}`);
        return;
    };
    const viewport = page.getViewport({scale: state.scale});
    refCanvas.value.width = viewport.width;
    refCanvas.value.height = viewport.height;
    logger.info(`page ${page}`);
    const taskRender = page?.render({
        canvasContext: ctx as CanvasRenderingContext2D,
        viewport: viewport as PageViewport,
    });
    logger.info(taskRender.promise);

}


</script>