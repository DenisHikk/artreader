<template>
    <p>You open {{state.path}}</p>
    <button @click="openFile">Open file</button>
    <div class="pdf-container" ref="pdfContainer">
        <canvas ref="refCanvas" width="500" height="500"></canvas>
        <div ref="textLayer" class="text-layer" ></div>
    </div>
</template>

<style scoped>
    canvas {
        border: 1px solid #aeaeae;
    }
    .text-layer {
        position: absolute;
        line-height: 1;
    }

    .text-layer span {
        position: absolute;
        color: transparent;
        pointer-events: all;
        cursor: text;
    }
</style>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { PDFRenderService } from './service/PDFRenderService';
import { PageViewport, TextLayer } from 'pdfjs-dist';
import log from "electron-log/renderer"

let pdfDoc: any = null;
let file: string;
let pdf: ArrayBuffer;

const refCanvas = ref<HTMLCanvasElement | null>();
const pdfContainer = ref<HTMLElement | null>();
const textLayer = ref<HTMLElement | null>();

interface AppState {
    path: string,
    currentPage: number,
    totalPage: number,
    scale: number,
}

const state = reactive<AppState>({
    path: "No selected file",
    currentPage: 1,
    totalPage: 0,
    scale: 1.0,
});

async function openFile() {
    file = await window.api.dialogOpenFile();
    pdf = await window.api.openFile(file)
    state.path = `You open ${file.split("/")[file.split("/").length - 1]}`;
    render();
}

onMounted(() => {
    if (!refCanvas) return;
});

async function render() {
    const pdfRender = new PDFRenderService();
    await pdfRender.readFile(pdf);
    const page = await pdfRender.getPage(state.currentPage);
    const ctx = refCanvas.value?.getContext("2d");
    if (!refCanvas || !refCanvas.value || !page) {
        return;
    };
    const viewport = page.getViewport({scale: state.scale});
    refCanvas.value.width = viewport.width;
    refCanvas.value.height = viewport.height;
    const taskRender = page?.render({
        canvasContext: ctx as CanvasRenderingContext2D,
        viewport: viewport as PageViewport,
        isEditing: true,
    });

    const textContent = await page.getTextContent();
    textLayer.value!.innerHTML = "";
    const textLayerRender = new TextLayer({
        textContentSource: textContent,
        viewport: viewport,
        container: textLayer.value as HTMLElement,
        
    })
    textLayerRender.render();
    
}  


</script>