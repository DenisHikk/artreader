<template>
    <component :is="selectedComponent" :file="filePath" v-if="selectedComponent && filePath" />
</template>


<script setup lang="ts">
import log from "electron-log/renderer"
import { computed, onMounted, ref, watch } from "vue";
import type { Component } from "vue";

import PDFRaderView from "../views/PDFReaderView.vue";

import { PluginsManagerRender } from "../models/plugins/PluginsManagerRender";
import { EPUBReader } from "../models/plugins/EPUBReader";
import { PDFReader } from "../models/plugins/PDFReader";
import EPUBReaderView from "./EPUBReaderView.vue";
import CustomView from "./CustomView.vue";


const filePath = ref<string | null>("");

// remove after create pdf and epub work onlu for develop
PluginsManagerRender.getInstance().registryReader(new PDFReader());
PluginsManagerRender.getInstance().registryReader(new EPUBReader());

onMounted(async () => {
    filePath.value = props.filePath;
});

const getFileType = (filePath: string) => {
    const ext = filePath.split(".").pop();
    log.debug(`Ext ${ext}`)
    if(ext === "pdf") return "pdf";
    if(ext === "epub") return "epub";
    return "custom";
}

const selectedComponent = computed((): Component | undefined => {
    if(!filePath.value) {
        return;
    }
    const fileType = getFileType(filePath.value);
    return componentMap.has(fileType) ? componentMap.get(fileType) : CustomView;
});



</script>


<style lang="scss">
body {
    background-color: #333333;
}

</style>

