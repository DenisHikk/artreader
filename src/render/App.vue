<template>
    <h1>{{state.msg}}</h1>
    <p>You open {{state.path}}</p>
    <button @click="openFile">Open file</button>
</template>

<script setup lang="ts">
import { PDFPageProxy } from 'pdfjs-dist/types/src/display/api';
import { reactive } from 'vue';

interface AppState {
    msg: string,
    path: string
}

const state = reactive<AppState>({
    msg: "Hello from Electron and Vue app",
    path: "No selected file",
});

async function openFile() {
    const result = await window.api.dialogOpenFile();
    state.msg = result;
    console.log(result);
}


</script>