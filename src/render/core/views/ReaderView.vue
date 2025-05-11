<template>
    <div class="reader" v-if="selectedComponent && filePath">
        <component :is="selectedComponent" :file="filePath"  />
    </div>
</template>


<script setup lang="ts">
import log from "electron-log/renderer"
import { computed, onMounted, ref, watch } from "vue";
import type { Component } from "vue";

import PDFReaderView from "../views/PDFReaderView.vue";
import EPUBReaderView from "./EPUBReaderView.vue";
import CustomView from "./CustomView.vue";


const props = defineProps<{filePath: string}>();
const filePath = ref("");

const componentMap = new Map<string, Component>([
    ["pdf", PDFReaderView],
    ["epub", EPUBReaderView]
]);

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
    log.debug(`filePath: ${filePath.value} and ext: ${fileType}`);
    return componentMap.has(fileType.toLowerCase()) ? componentMap.get(fileType) : CustomView;
});
</script>


<style scoped lang="scss">
.reader {
    background-color: #333333;
    width: 100%;
    height: 100%;
    position: relative;
}

</style>

