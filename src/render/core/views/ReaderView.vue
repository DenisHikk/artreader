<template>
    <div class="readerContainer" ref="container">
        <!-- <div class="textLayer" ref="textLayerRef"></div>
        <canvas class="canvas" ref="canvasRef"></canvas> -->
    </div>
</template>


<script setup lang="ts">
import { PDFRenderService } from "@/render/service/PDFRenderService";
import log from "electron-log/renderer"
import { onMounted, ref } from "vue";

const canvasRef = ref<HTMLCanvasElement | null>(null);
const textLayerRef = ref<HTMLDivElement | null>(null);
const pdfRenderService = new PDFRenderService();
const container = ref<HTMLDivElement | null>(null);
let page = ref(1);
onMounted(async () => {
    const filePath = await window.api.getFilePath();
    const file = await window.api.openFile(filePath);
    await pdfRenderService.readFile(file);

    const numPages = pdfRenderService.getPageCount();

    const ratio = window.devicePixelRatio || 1;

    for (let i = 1; i <= numPages; i++) {
        await pdfRenderService.getPage(i);
        const baseViewport = pdfRenderService.getViewport(1.0, 0, false);
        const availableWidth = window.innerWidth;
        const scale = availableWidth / baseViewport.width;
        const viewport = pdfRenderService.getViewport(scale, 0, false);

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = viewport.width * ratio;
        canvas.height = viewport.height * ratio;
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        if(!container || !container.value || !ctx) {
            return;
        }

        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

        container.value.appendChild(canvas);
        await pdfRenderService.render(ctx, viewport);
    }
});
</script>



<style lang="scss">
body {
    background-color: #aeaeae;
}

.canvas {
    margin: 0 auto;
}

.readerContainer {
  width: 100%;
  padding: 0;
  margin: 0;
}
canvas {
  display: block;
  margin: 20px auto;
}

</style>

