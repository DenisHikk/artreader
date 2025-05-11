<template>
    <q-toolbar class="sticky-toolbar_top bg-primary">
        <q-toolbar-title>
            <q-btn @click="toggleRenderMode" :icon="renderMode === RenderMode.ALL_PAGES ? 'article' : 'view_sidebar'"
                flat round />
        </q-toolbar-title>
    </q-toolbar>
    <div class="container-reader">
        <div ref="containerAllPages" v-if="renderMode === RenderMode.ALL_PAGES">
            <div v-for="page in totalPages" :key="page" :id="'page-' + page" class="container-pdf">
                <canvas></canvas>
                <div class="text_layer"></div>
            </div>
        </div>
        <div v-else ref="containerSinglePage" class="container-pdf">
            <canvas></canvas>
            <div class="text_layer"></div>
        </div>
    </div>
    <q-toolbar v-if="renderMode === RenderMode.SINGLE" class="justify-between sticky-toolbar_bottom bg-primary">
        <q-btn flat icon="chevron_left" label="Назад" @click="prevPage" :disable="currentPage === 1" />
        <div class="q-mx-auto">Страница {{ currentPage }} из {{ totalPages }}</div>
        <q-btn flat @click="nextPage" :disable="currentPage === totalPages">
            <span>Дальше</span>
            <q-icon name="chevron_right" />
        </q-btn>
    </q-toolbar>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { PDFReader } from '../models/plugins/PDFReader'
import { RenderMode } from '../models/plugins/RenderMode'
import { useSettingBook } from '../store/Book'
import log from "electron-log/renderer"

const settingBook = useSettingBook();

const props = defineProps<{ file: string }>()

const renderMode = ref(RenderMode.ALL_PAGES)
const totalPages = ref(0)
const currentPage = ref(1)
const scale = ref(1.0);

const containerAllPages = ref<HTMLDivElement | null>(null)
const containerSinglePage = ref<HTMLDivElement | null>(null)

const pdfReader = new PDFReader()
const renderedPages = new Set<number>()
let observer: IntersectionObserver | null = null

onMounted(async () => {
    await pdfReader.load(props.file)
    totalPages.value = pdfReader.getTotalPages()
    await nextTick()
    await renderPDF()
    window.addEventListener('wheel', onWheelZoom, { passive: false });
})

onBeforeUnmount(async () => {
    await pdfReader.destroy()
    cleanupObserver()
    renderedPages.clear()
    window.removeEventListener('wheel', onWheelZoom)
})

watch(renderMode, async () => {
    await nextTick()
    await renderPDF()
})

async function onWheelZoom(event: WheelEvent) {
    if (!event.ctrlKey) return;
    const zoomStep = 0.1;
    if (event.deltaY < 0) {
        scale.value = Math.min(scale.value + zoomStep, 1.5);
    } else {
        scale.value = Math.max(scale.value - zoomStep, 0.5);
    }
    await renderPDF();
}

function toggleRenderMode() {
    renderMode.value =
        renderMode.value === RenderMode.ALL_PAGES
            ? RenderMode.SINGLE
            : RenderMode.ALL_PAGES
}

async function nextPage() {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
        await renderPDF()
    }
}

async function prevPage() {
    if (currentPage.value > 1) {
        currentPage.value--
        await renderPDF()
    }
}

async function renderPDF() {
    cleanupObserver()
    renderedPages.clear()
    pdfReader.setScale(settingBook.scale);
    if (renderMode.value === RenderMode.ALL_PAGES) {
        setupPages()
        setupIntersectionObserver()
    } else {
        const container = containerSinglePage.value
        if (container) {
            await pdfReader.render(container, currentPage.value)
        }
    }
}

function setupPages() {
    const container = containerAllPages.value
    if (!container) return

    const pageDivs = container.querySelectorAll('.container-pdf')

    pageDivs.forEach(async (page, index) => {
        const pageNumber = index + 1
        const pagePDF = await pdfReader.getPage(pageNumber)
        const viewport = pdfReader.getViewport(pagePDF)
        const div = page as HTMLElement
        div.style.width = `${viewport.width}px`
        div.style.height = `${viewport.height}px`
    })
}

function setupIntersectionObserver() {
    const container = containerAllPages.value
    if (!container) return

    observer = new IntersectionObserver(onIntersect, {
        root: null,
        threshold: 0.2
    })

    const pages = container.querySelectorAll('.container-pdf')
    pages.forEach(page => observer?.observe(page))
}

function onIntersect(entries: IntersectionObserverEntry[]) {
    entries.forEach(async entry => {
        if (entry.isIntersecting) {
            const target = entry.target as HTMLElement
            const id = target.id
            const pageNum = Number(id.split('-').pop())
            if (!isNaN(pageNum)) {
                await renderVisiblePage(target, pageNum)
            }
        }
    })
}

async function renderVisiblePage(elem: HTMLElement, pageNum: number) {
    if (renderedPages.has(pageNum)) return
    await pdfReader.render(elem, pageNum)
    renderedPages.add(pageNum)
}

function cleanupObserver() {
    if (observer) {
        observer.disconnect()
        observer = null
    }
}
</script>


<style scoped lang="scss">
.container-pdf {
    background-color: #ffffff;
    position: relative;
    margin: 10px auto;
    animation: fadeIn 0.5s forwards;
}

canvas {
    z-index: 0;
    display: block;
    position: relative;
}

.container-reader,
.reader {
    width: 100%;
    height: 100%;
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
    margin: 0 auto;
}

.sticky-toolbar_top {
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
}

.sticky-toolbar_bottom {
    position: relative;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
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
    background: rgba(0, 0, 255, 0.25);
}
</style>