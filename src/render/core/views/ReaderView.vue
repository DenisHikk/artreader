<template>
    <div class="reader-container" ref="container">
        <div class="page-container" ref="pageContainer"></div>
    </div>
</template>


<script setup lang="ts">
import log from "electron-log/renderer"
import { getDocument } from "pdfjs-dist";
import { onMounted, ref } from "vue";

import { Reader } from "../service/Reader";
import { PluginsManagerRender } from "../models/plugins/PluginsManagerRender";
import { EPUBReader } from "../models/plugins/EPUBReader";
import { PDFReader } from "../models/plugins/PDFReader";

const reader = new Reader();
const container = ref<HTMLDivElement | null>(null);
PluginsManagerRender.getInstance().registryReader(new PDFReader());
PluginsManagerRender.getInstance().registryReader(new EPUBReader());
onMounted(async () => {
    const filePath = await window.api.getFilePath();
    await reader.load(filePath);
    if(!container.value) {
        throw new Error("I can't find container");
    }
    await reader.render(container.value);
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

.page-container {
    position: relative;
    width: 100%;
    padding: 0;
    margin: 0;
    height: auto;
}
</style>

