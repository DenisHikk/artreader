<template>
    <div ref="containerSinglePage" class="container-pdf">
        <canvas></canvas>
        <div class="text_layer"></div>
    </div>
    <q-toolbar class="justify-between sticky-toolbar_bottom bg-primary">
        <q-btn flat icon="chevron_left" label="Назад" @click="prevPage" :disable="currentPage === 1" />
        <div class="q-mx-auto">Страница {{ currentPage }} из {{ totalPages }}</div>
        <q-btn flat @click="nextPage" :disable="currentPage === totalPages">
            <span>Дальше</span>
            <q-icon name="chevron_right" />
        </q-btn>
    </q-toolbar>
</template>

<script setup lang="ts">
import { PDFReader } from '../../models/plugins/PDFReader';
import { onMounted, ref } from 'vue';
import log from "electron-log/renderer";

const props = defineProps<{ pdfReader: PDFReader }>();
const currentPage = ref(1);
const totalPages = ref(0);
const containerSinglePage = ref<HTMLElement | null>(null);

onMounted(async () => {
    totalPages.value = props.pdfReader.getTotalPages();
    renderSinglePage(containerSinglePage.value as HTMLElement, currentPage.value);
});

async function nextPage() {
    if(currentPage.value >= totalPages.value) return;
    currentPage.value++;
    renderSinglePage(containerSinglePage.value as HTMLElement, currentPage.value);
}

async function prevPage() {
    if(currentPage.value <= 1) return;
    currentPage.value--;
    renderSinglePage(containerSinglePage.value as HTMLElement, currentPage.value);
}


// FIXME: Add throttle for render
async function renderSinglePage(elem: HTMLElement, numPage: number) {
    await props.pdfReader.render(elem, numPage);
}

</script>

<style lang="scss"></style>