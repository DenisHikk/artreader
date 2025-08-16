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
}, 40);

onMounted(async () => {
    log.debug(`Start ${props.pdfReader}`);
    totalPages.value = props.pdfReader.getTotalPages();
    log.debug(`total ${totalPages.value}`)
    await nextTick();
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

function handleScroll(event: Event) {
    
}

function handleIntersect(entries: IntersectionObserverEntry[]) {
    entries.forEach(async entry => {
        if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const id = target.id;
            const pageNum = Number(id.split('-').pop());
            if (!isNaN(pageNum)) {
                debounceRender(target, pageNum);
            }
        } else {
            const target = entry.target as HTMLElement;
            const id = target.id;
            const pageNum = Number(id.split("-").pop());
            if(!isNaN(pageNum)) {
                clearPage(target, pageNum);
            }
        }
    })
}


// FIXME: Fix leak memory
// //terrible function
// function handleIntersect(entries: IntersectionObserverEntry[]) {
//     const visiblePageNums: number[] = [];
//     // take all entry in intersection
//     entries.forEach(async (entry: IntersectionObserverEntry) => {
//         if(entry.isIntersecting) {
//             const target = entry.target as HTMLElement;
//             const pageNum = Number(target.id.split("-").pop());
//             if(!isNaN(pageNum)) {
//                 visiblePageNums.push(pageNum);
//             }
//         }
//   });

//     if(visiblePageNums.length === 0) return;
//     const min = Math.min(...visiblePageNums);
//     const max = Math.max(...visiblePageNums);

//     // add all page to activity pages
//     const newActivityPages = new Set<number>();
//     for(let pages = min - VISIBLE_PAGE; pages <= max + VISIBLE_PAGE; pages++) {
//         if(pages > 0) {
//             newActivityPages.add(pages);
//         }
//     }

//     // render all pages
//     for(const pageNum of newActivityPages) {
//         if(activityPages.has(pageNum)) continue;
//         const target = document.getElementById(`page-${pageNum}`);
//         if(target) {
//             const debouncePage = debounce (async () => {
//                 await renderVisiblePage(target, pageNum);
//             }, 40);
//             debouncedMap.set(pageNum, debouncePage);
//         }
//         const debounceFN = debouncedMap.get(pageNum);
//         if(debounceFN) {
//             debounceFN();
//         }
        
//     }

//     // remove old pages
//     for(const pageNum of activityPages) {
//         if(!newActivityPages.has(pageNum)) {
//             const target = document.getElementById(`page-${pageNum}`);
//             if(target) {
//                 const debounceFN = debouncedMap.get(pageNum) as DebouncedFunction<(target: HTMLElement) => void>;
//                 if(debounceFN) {
//                     debounceFN.cancel();
//                     debouncedMap.delete(pageNum);
//                 }
//                 clearPage(target, pageNum);
//             }
//         }
//     } 

//     // clear all data
//     activityPages.clear();
//     newActivityPages.forEach(p => activityPages.add(p));
// }

function createPage(container: HTMLElement) {
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