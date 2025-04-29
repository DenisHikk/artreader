<template>
    <div class="reader-container" ref="container">
        <div class="page-container" ref="pageContainer"></div>
    </div>
</template>


<script setup lang="ts">
import log from "electron-log/renderer"
import { getDocument } from "pdfjs-dist";
import { onMounted, ref } from "vue";
document.documentElement.style.setProperty('--total-scale-factor', '1.2');



const container = ref<HTMLDivElement | null>(null);
onMounted(async () => {
    const filePath = await window.api.getFilePath();
});

</script>


<style lang="scss">
body {
    background-color: #333333;
}

canvas {
    display: block;
    margin: 10px auto 10px auto;
}

span {
    position: absolute;
}

.text-layer {
    position: absolute;
    top: 0;
    left: 0;
    text-align: initial;
    inset: 0;
    overflow: clip;
    opacity: 1;
    line-height: 1;
    text-size-adjust: none;
    forced-color-adjust: none;
    transform-origin: 0 0;
    caret-color: CanvasText;
    z-index: 20; //change to 0
}

.page-container {
    position: relative;
    width: 100%;
    padding: 0;
    margin: 0;
    height: auto;
}
</style>

