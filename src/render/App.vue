<template>
    <q-layout view="hHh lpR fFf">

        <q-header elevated class="bg-primary text-white">
            <q-toolbar>
                <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

                <q-toolbar-title>
                    <q-avatar>
                        <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
                    </q-avatar>
                    ArtReader
                </q-toolbar-title>
            </q-toolbar>
        </q-header>

        <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
            
        </q-drawer>

        <q-page-container>
            <q-btn @click="openFile" label="Open File"></q-btn>
        </q-page-container>

    </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(false);
const toggleLeftDrawer = () => {
    leftDrawerOpen.value = !leftDrawerOpen.value
}


const openFile = () => {
    window.api.dialogOpenFile(); //return path to file *.pdf
}

</script>

<style lang="scss">
</style>