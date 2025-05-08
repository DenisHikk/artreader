<template>
    <PDFRaderView :file="filePath" v-if="filePath" />
</template>


<script setup lang="ts">
import log from "electron-log/renderer"
import { onMounted, ref } from "vue";

import PDFRaderView from "../views/PDFReaderView.vue";

import { PluginsManagerRender } from "../models/plugins/PluginsManagerRender";
import { EPUBReader } from "../models/plugins/EPUBReader";
import { PDFReader } from "../models/plugins/PDFReader";


const filePath = ref<string | null>("");

// remove after create pdf and epub work onlu for develop
PluginsManagerRender.getInstance().registryReader(new PDFReader());
PluginsManagerRender.getInstance().registryReader(new EPUBReader());

onMounted(async () => {
    filePath.value = await window.api.getFilePath();
});

</script>


<style lang="scss">
body {
    background-color: #333333;
}

</style>

