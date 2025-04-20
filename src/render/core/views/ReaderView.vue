<template>
    <div class="readerContainer">
        <div class="textLayer" ref="textLayerRef"></div>
        <canvas class="canvas" ref="canvasRef"></canvas>
    </div>
</template>


<script setup lang="ts">
import { PDFRenderService } from "@/render/service/PDFRenderService";
import log from "electron-log/renderer"
import { onMounted, ref } from "vue";

const canvasRef = ref<HTMLCanvasElement | null>(null);
const textLayerRef = ref<HTMLDivElement | null>(null);
const pdfRenderService = new PDFRenderService();
//TODO: fix canvas size and make page switching
onMounted(async () => {
    if (!canvasRef || !textLayerRef) {
        return;
    }

    const ctx = canvasRef.value?.getContext("2d");
    if (!ctx) {
        return;
    }

    try {
        const filePath = await window.api.getFilePath();
        const file = await window.api.openFile(filePath);
        await pdfRenderService.readFile(file)
        await pdfRenderService.getPage(2);
        const baseViewport = pdfRenderService.getViewport(1.0, 0, false);
        const ratio = window.devicePixelRatio || 1;

        const availableHeight = window.innerHeight;
        const scale = availableHeight / baseViewport.height;
        const pageViewport = pdfRenderService.getViewport(scale, 0, false)
        if (!canvasRef.value || !textLayerRef.value) {
            return;
        }

        canvasRef.value.width = pageViewport.width;
        canvasRef.value.height = pageViewport.height;

        canvasRef.value.style.width = `${pageViewport.width}`;
        canvasRef.value.style.height = `${pageViewport.height}`;

        textLayerRef.value.style.width = `${canvasRef.value.style.width}px`;
        textLayerRef.value.style.height = `${canvasRef.value.style.height}px`;

        ctx.setTransform(ratio, 0, 0, ratio, 0, 0)

        await pdfRenderService.render(ctx, pageViewport)
    } catch (err) {
        log.error(err);
    }
})

</script>

<style lang="scss">
body {
    background-color: #aeaeae;
}

.canvas {
    margin: 0 auto;
}

// .readerContainer {
//     width: 100vw;
//     height: 100vh;
//     overflow: hidden;
// }
</style>
