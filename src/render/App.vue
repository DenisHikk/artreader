<template>
    <h1>{{state.msg}}</h1>
    <p>You open {{state.path}}</p>
    <button @click="openFile">Open file</button>
    <canvas ref="read" width="500" height="500"></canvas>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { PDFRenderService } from './service/PDFRenderService';

const canvas = ref<HTMLCanvasElement | null>(null);
let pdfDoc: any = null;
let file: string;
let pdf: ArrayBuffer;

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
    console.log(`file is ${file}`);
    pdf = await window.api.openFile(file)
    state.msg = file.split("/")[file.split("/").length - 1];
    render();
}

onMounted(() => {
    if(!canvas.value) return;
    const context = canvas.value.getContext("2d");
});

function render() {
    const pdfRender = new PDFRenderService(pdf);
    
}


</script>