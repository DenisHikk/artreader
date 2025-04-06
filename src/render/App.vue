<script lang="ts">
import { defineComponent } from 'vue';
import AppFooter from './components/AppFooter.vue';
import "@/render/styles/normalize.css"
console.log(`${window.api}`)
export default defineComponent({
    name: "App",
    components: { //регистрация компонента
        AppFooter
    },
    data() {
        return {
            msg: "Hello from Vue and Electron!",
            path: ""
        }
    },
    methods: {
        async openFile() {
            const filePath = await window.api.handleFileOpen();
            this.path = filePath;
        }
    }
});


</script>

<template>
    <div id="app">
        <p class="hello">{{ msg }}</p>
        <button @click="openFile">Open file</button>
        <p class="path">Выбран файл: {{ path }}</p>
    </div>
    <AppFooter />
</template>

<style scoped>
.hello {
    font-size: 5rem;
}
</style>
