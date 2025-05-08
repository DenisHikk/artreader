<template>
    <q-layout view="hHh lpR fFf">

        <q-header elevated class="bg-primary text-white">
            <q-toolbar>
                <q-toolbar-title>
                    <q-btn-toggle v-model="renderMode" class="" no-caps rounded unelevated toggle-color="secondary"
                        color="white" text-color="primary" :options="[
                                { label: 'Одиночная', value: RenderMode.SINGLE },
                                { label: 'Все страницы', value: RenderMode.ALL_PAGES }
                            ]" />
                </q-toolbar-title>
            </q-toolbar>
        </q-header>

        <q-page-container>
            <div>
                <div ref="containerAllPages" v-if="renderMode === RenderMode.ALL_PAGES">
                    <div v-for="page in totalPages" :key="page" class="container-pdf">
                        <canvas></canvas>
                        <div class="text_layer"></div>
                    </div>
                </div>
                <div v-else ref="containerSinglePage" class="container-pdf">
                    <canvas></canvas>
                    <div class="text_layer"></div>
                </div>
            </div>
        </q-page-container>
        <q-footer class="bg-grey-2 text-black" v-if="renderMode === RenderMode.SINGLE">
            <q-toolbar class="justify-between">
                <q-btn flat icon="chevron_left" label="Назад" @click="prevPage" :disable="currentPage === 1" />
                <div class="q-mx-auto">Страница {{ currentPage }} из {{ totalPages }}</div>
                <q-btn flat @click="nextPage" :disable="currentPage === totalPages">
                    <span>Дальше</span>
                    <q-icon name="chevron_right" />
                </q-btn>
            </q-toolbar>
        </q-footer>
    </q-layout>
</template>

<script setup lang="ts">
import log from "electron-log/renderer";

import { nextTick, onBeforeMount, onMounted, onUpdated, ref, watch } from "vue";
import { PDFReader } from "../models/plugins/PDFReader";
import { RenderMode } from "../models/plugins/RenderMode";

const props = defineProps<{file: string}>();

const totalPages = ref<number>(0);
const currentPage = ref(1);

const containerAllPages = ref<HTMLDivElement | null>(null);
const containerSinglePage = ref<HTMLDivElement | null>(null);

const pdfReader = new PDFReader();

const renderMode = ref(RenderMode.ALL_PAGES);

const leftDrawerOpen = ref(false)
const rightDrawerOpen = ref(false)

watch(renderMode, async (mode) => {
    await nextTick();
    await renderPDF();
})

onMounted(async () => {
    await pdfReader.load(props.file);
    totalPages.value = pdfReader.getTotalPages();
    // wait render all div
    await nextTick();
    await renderPDF();
});

async function renderPDF() {
    if(renderMode.value === RenderMode.ALL_PAGES) {
        const container = containerAllPages.value;
        if(!container) return;

        const pageDivs = container.querySelectorAll(".container-pdf");
        for(const [index, pageDiv] of Array.from(pageDivs).entries()) {
            await pdfReader.render(pageDiv as HTMLDivElement, index + 1);
        }
    } else {
        const container = containerSinglePage.value;
        if (!container) return;
        await pdfReader.render(container, currentPage.value);
    }
}

async function nextPage() {
    currentPage.value++;
    await renderPDF();
}

async function prevPage() {
    currentPage.value--;
    await renderPDF();
}

</script>


<style scoped lang="scss">
canvas {
    z-index: 0;
    display: block;
    position: relative;
}
.container-pdf {
    position: relative;
    margin: 10px auto;
    animation: fadeIn 0.5s forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.text_layer {
    position: absolute;
    top: 0;
    left: 0;
    text-align: initial;
    inset: 0;
    overflow: hidden;
    opacity: 1;
    line-height: 1;
    z-index: 1;
    transform-origin: 0 0;
    width: 100%;
    padding: 0;
    margin: 0;
    margin: 0px auto;
}


</style>

<style lang="scss">
.text_layer>span {
    position: absolute;
    white-space: pre;
    color: transparent;
}

.text_layer>span::selection {
    color: transparent;
    background: rgba(0 0 255 / 0.25);
}
</style>