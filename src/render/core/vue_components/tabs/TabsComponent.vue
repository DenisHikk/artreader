<!-- Tabs -->
<template>
    <q-layout view="hHh lpR fFf">
        <q-header class="bg-primary text-white" height-hint="98">
            <q-tabs 
                class="bg-secondary text-white"
                v-model="activeTab"
                :key="tabs.length"
                align="left"
            >
                <q-tab 
                    v-for="(tab) in tabs" 
                    :key="tab.id"
                    :name="tab.id"
                    @dragstart="onDragStart($event, tab)"
                    @dragover.prevent
                    @drop="onDrop($event, tab)"
                    @dragend="onDragEnd(tab)"
                    draggable="true"
                >
                    <div
                        class="tab-title"
                    >
                        <p
                            style="max-width: 110px; overflow: hidden; margin: 0;"
                        >
                            {{ tab.name }}
                        </p>
                        <q-btn
                            @click.stop="deleteTab(tab.id)"
                            @mousedown.stop
                            dense
                            size="sm"
                            icon="close"
                            color="primary"
                        />
                    </div>  
                </q-tab>
                <q-btn 
                    @click="addTab()"
                    size="lg"
                    flat
                    dense
                    icon="add_box"
                />
            </q-tabs>
        </q-header>
        <q-page-container>
            <router-view>
                <div v-if="tabs.length !== 0">
                    <div v-if="tabs[tabs.findIndex(tab => tab.id == activeTab)]
                                                                .filepath == 'none'">
                        <q-btn label="Open File" @click="openFile" />
                    </div>
                    <div v-else>
                        <ReaderView
                            :key="activeTab"
                            :filePath="tabs[tabs.findIndex(tab => tab.id == activeTab)]
                                                                            .filepath"
                        />
                    </div>
                </div>
            </router-view>
        </q-page-container>
    </q-layout>
</template>

<script setup lang="ts">
    import useTabs from './tabs';
    import ReaderView from '@/render/core/views/ReaderView.vue';
    const {
        tabs,
        activeTab,

        addTab,
        deleteTab,
        openFile,
        onDragStart,
        onDrop,
        onDragEnd
    } = useTabs();
</script>

<style scoped lang="scss">
    .tab-title {
        min-width: 90px;
        max-width: 150px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>