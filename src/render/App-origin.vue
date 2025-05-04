<template>
    <q-layout view="hHh lpR fFf">
        <q-header elevated class="bg-primary text-white">
            <q-toolbar>

                <!-- Menu button
                <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />            
                -->
                <q-toolbar-title>
                    <q-avatar>
                        <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
                    </q-avatar>
                    ArtReader
                </q-toolbar-title>

            </q-toolbar>
        </q-header>
        
        <!-- Left panel
        <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered />
        -->

        <q-page-container>

            <q-btn @click="openFile" label="Open File" />

            <tabs/>

        </q-page-container>
    </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { tabs } from './components/tabs.vue'



// const leftDrawerOpen = ref(false);
//const toggleLeftDrawer = () => {
//    leftDrawerOpen.value = !leftDrawerOpen.value
//}


//const openFile = async () => {
//    const filePath = await window.api.dialogOpenFile();
//    window.api.openReaderWindow(filePath);
//}
</script>

<style scoped lang="sass">
</style>