<template>
    <p>You open {{state.path}}</p>
    <button @click="openFile">Open file</button>
    <div class="pdf-container" ref="pdfContainer">
        <div ref="textLayer" class="textLayer" ></div>
        <canvas ref="refCanvas" width="500" height="500"></canvas>
    </div>
</template>

<style scoped>
.pdf-container {
  position: relative;
}

canvas {
  border: 1px solid #aeaeae;
  position: relative;
  z-index: 1;
  pointer-events: none;
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
    log.debug("Start render");
    if(!pdfContainer.value || !refCanvas.value || !textLayer.value) {
        return;
    }
    const pdfRender = new PDFRenderService();
    await pdfRender.readFile(pdf);
    const page = await pdfRender.getPage(state.currentPage);
    const ctx = refCanvas.value?.getContext("2d");
    const pixelRatio = window.devicePixelRatio || 1;
    const viewport = page!.getViewport({
        scale: state.scale * pixelRatio,
        rotation: 0,
        dontFlip: false
    });
    
    pdfContainer.value.style.width = `${viewport.width / pixelRatio}px`;
    pdfContainer.value.style.height = `${viewport.height / pixelRatio}px`;

    refCanvas.value.width = viewport.width;
    refCanvas.value.height = viewport.height;

    textLayer.value.style.width = `${viewport.width / pixelRatio}px`;
    textLayer.value.style.height = `${viewport.height / pixelRatio}px`;
    textLayer.value!.style.setProperty('--scale', state.scale.toString());

    const taskRender = page?.render({
        canvasContext: ctx as CanvasRenderingContext2D,
        viewport: viewport as PageViewport,
        isEditing: true,
        transform: [pixelRatio, 0, 0, pixelRatio, 0, 0]
    });

    const textContent = await page!.getTextContent();
    textLayer.value!.innerHTML = "";
    const textLayerRender = new TextLayer({
        textContentSource: textContent,
        viewport: viewport,
        container: textLayer.value as HTMLElement,
    });
    textLayer.value.style.transform = `scale(${state.scale})`
    textLayerRender.render();

    Array.from(textLayer.value.children).forEach((span, i) => {
        const item = textContent.items[i];
        
        if ('transform' in item && item.transform) {
            const transform = item.transform;
            (span as HTMLElement).style.transform = `matrix(${transform.join(',')})`;
        }
        
        else if ('markedContent' in item) {
            console.log('Marked content:', item);
        }
    });
    
}  


</script>