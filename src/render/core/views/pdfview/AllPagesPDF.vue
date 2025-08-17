<template>
    <div ref="containerAllPages">
        <div v-for="page in totalPages" :key="page" :id="'page-' + page" class="container-pdf">
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, nextTick } from 'vue';
import { PDFReader } from '../../models/plugins/PDFReader';
import { debounce, DebouncedFunction, throttle } from '../../utils/timingUtils';
import log from "electron-log/renderer"

// FIXME: Leak memory for long time in use 
const props = defineProps<{pdfReader: PDFReader}>();
const totalPages = ref(0)
const containerAllPages = ref<HTMLElement | null>(null);
const observer = ref<IntersectionObserver | null>(null);
const renderedPages = new Set<number>();
const VISIBLE_PAGE = 2;
const activityPages = new Set<number>();
const debouncedMap = new Map<number, () => void>();
const isScroll = ref(false);

const debounceRender = debounce(async (target: HTMLElement, pageNum: number) => {
    await renderVisiblePage(target, pageNum);
}, 10);

onMounted(async () => {
    log.debug(`Start ${props.pdfReader}`);
    totalPages.value = props.pdfReader.getTotalPages();
    log.debug(`total ${totalPages.value}`)
    await nextTick();
    await resizeContainerPdf();
    setupIntersectionObserver();
    // window.addEventListener("scroll", throttledOnScroll);
});

onBeforeUnmount(async () => {
    cleanupObserver();
    // window.removeEventListener("scroll", throttledOnScroll);
});

function setupIntersectionObserver() {
    const container = containerAllPages.value
    if (!container) return

    observer.value = new IntersectionObserver(handleIntersect, {
        root: null,
        threshold: 0.1
    })

    const pages = container.querySelectorAll('.container-pdf')
    pages.forEach(page => observer.value!.observe(page))
}

function handleIntersect(entries: IntersectionObserverEntry[]) {
    entries.forEach(async entry => {
        if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const id = target.id;
            const pageNum = Number(id.split('-').pop());
            if (!Number.isNaN(pageNum)) {
                debounceRender(target, pageNum);
            }
        } else {
            const target = entry.target as HTMLElement;
            const id = target.id;
            const pageNum = Number(id.split("-").pop());
            if(!Number.isNaN(pageNum)) {
                clearPage(target, pageNum);
            }
        }
    })
}

function createPage(container: HTMLElement) {
    if(container.querySelector("canvas")) return;
    container.innerHTML = "";
    const canvas = document.createElement("canvas");
    const textLayer = document.createElement("div");
    textLayer.className = "text_layer"
    container.appendChild(canvas);
    container.appendChild(textLayer);
}

function clearPage(target: HTMLElement, pageNum: number) {
    const canvas = target.querySelector("canvas");
    const textLayer = target.querySelector(".text_layer");
    renderedPages.delete(pageNum);
    canvas?.remove();
    textLayer?.remove();
}

async function renderVisiblePage(elem: HTMLElement, pageNum: number) {
    if (renderedPages.has(pageNum)) return;
    createPage(elem);
    log.debug("Render process");
    await props.pdfReader.render(elem, pageNum)
    renderedPages.add(pageNum)
}

function cleanupObserver() {
    if (!observer.value) {
        return;
    }
    observer.value.disconnect()
    observer.value = null
}

async function resizeContainerPdf() {
    const container = containerAllPages.value;
    log.debug(`containerAllPages ${container}`);
    if(!container) return;
    const pages = container.querySelectorAll('.container-pdf');
    await props.pdfReader.resizeContainersPdf(pages);
}

function clearAllCanvases() {
    const container = containerAllPages.value;
    const canvases = container?.querySelectorAll("canvas");
    const textLayers = container?.querySelectorAll(".text_layer");
    renderedPages.clear();
    canvases?.forEach(canvas => {
        const ctx = canvas.getContext("2d");
        if(ctx) ctx.clearRect(0,0,canvas.width,canvas.height);
    })
    textLayers?.forEach(textLayer => {
        textLayer.innerHTML = "";
    })
}

</script>

<style lang="scss">
</style>