<template>
    <q-toolbar class="sticky-toolbar_top bg-primary">
        <q-toolbar-title>
            <q-btn @click="toggleRenderMode" :icon="renderMode === RenderMode.ALL_PAGES ? 'article' : 'view_sidebar'"
                flat round />
        </q-toolbar-title>
    </q-toolbar>
    <div ref="containerReader" class="container-reader">
        <AllPagesPDF v-if="renderMode == RenderMode.ALL_PAGES && pdfLoaded" :pdfReader="pdfReader"/>
        <SinglePagePDF v-else :pdfReader="pdfReader"/>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, onBeforeMount } from 'vue'
import { PDFReader } from '../../models/plugins/PDFReader'
import { RenderMode } from '../../models/plugins/RenderMode'
import { useSettingBook } from '../../store/BookStore'
import SinglePagePDF from './SinglePagePDF.vue';
import AllPagesPDF from "./AllPagesPDF.vue"
import { throttle } from '../../utils/timingUtils'
import log from "electron-log/renderer"

const settingBook = useSettingBook();

const props = defineProps<{ file: string }>()

const renderMode = ref(RenderMode.ALL_PAGES)
const scale = ref(1.0);

const containerReader = ref<HTMLElement | null>(null);

const pdfLoaded = ref(false);
const pdfReader = new PDFReader();

onMounted(async () => {
    await pdfReader.load(props.file);
    pdfLoaded.value = true;
    containerReader.value!.style.setProperty("--total-scale-factor", String(scale.value));
    window.addEventListener('wheel', onWheelZoom, { passive: false });
})

onBeforeUnmount(async () => {
    await pdfReader.destroy()
    window.removeEventListener('wheel', onWheelZoom)
})

async function onWheelZoom(event: WheelEvent) {
    if (!event.ctrlKey) return;
    event.preventDefault();
    const zoomStep = 0.1;

    const container = containerReader.value;
    if(!container) return;
    const scrollBeforeZoom = {
        top: container.scrollTop,
        left: container.scrollLeft,
        clientWidth: container?.clientWidth,
        clientHeight: container?.clientHeight
    }

    let newScale = scale.value;
    if (event.deltaY < 0) {
        newScale = Math.min(scale.value + zoomStep, 1.5);
    } else {
        newScale = Math.max(scale.value - zoomStep, 0.5);
    }
    if(newScale !== scale.value) {
        pdfReader.cancelAllRender();
        const scaleRatio = newScale / scale.value;
        scale.value = newScale;
        container.scrollTop = scrollBeforeZoom.top * scaleRatio;
        container.scrollLeft = scrollBeforeZoom.left * scaleRatio;
    }
}

function toggleRenderMode() {
    renderMode.value =
        renderMode.value === RenderMode.ALL_PAGES
            ? RenderMode.SINGLE
            : RenderMode.ALL_PAGES
}

</script>


<style lang="scss">
.plug {
    background-color: #ffffff;
    position: relative;
    margin: 10px;
    width: 595px;
    height: 842px;
}

.container-pdf {
    background-color: #ffffff;
    position: relative;
    margin: 10px auto;
    animation: fadeIn 0.5s forwards;
    width: calc(595px * var(--total-scale-factor));
    height: calc(842px * var(--total-scale-factor));
}

canvas {
    z-index: 0;
    display: block;
    position: relative;
}

.container-reader,
.reader,
.plug {
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

.text_layer>span {
    position: absolute;
    white-space: pre;
    color: transparent;
}

.text_layer>span::selection {
    color: transparent;
    background: rgba(0, 0, 255, 0.25);
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