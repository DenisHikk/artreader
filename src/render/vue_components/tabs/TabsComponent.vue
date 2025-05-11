<!-- Tabs -->
<template>
    <div>
        <q-tabs 
            class="bg-secondary text-white" 
            v-model="activeTab" 
            :key="tabs.length" 
            align="left">
            <q-tab 
                v-for="(tab, index) in tabs" 
                :key="tab.id" 
                :name="tab.id" 
                @dragstart="onDragStart($event, index)"
                @dragover.prevent 
                @drop="onDrop($event, index)" 
                draggable="true">
                    <span> {{ tab.name }} {{ tab.id }} </span>
                    <q-btn 
                        @click.stop="deleteTab(tab.id)" 
                        @mousedown.stop 
                        dense 
                        size="sm" 
                        icon="delete"
                        color="primary" 
                    />
            </q-tab>
            <q-btn 
                @click="addTab()" 
                round 
                label="+" 
                color="primary"
            />
        </q-tabs>
    </div>
    <div class="q-mt-md">
        <div v-if="tabs.length !== 0">
            <div v-if="tabs[tabs.findIndex(tab => tab.id == activeTab)].filepath == 'none'">
                <q-btn label="Open File" @click="openFile" />
            </div>
            <div v-else>
                <ReaderView 
                    :key="activeTab"
                    :filePath="tabs[tabs.findIndex(tab => tab.id == activeTab)].filepath" 
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import useTabs from './tabs';
    import ReaderView from '@/render/core/views/ReaderView.vue';
    const {
        leftDrawerOpen,
        tabs,
        activeTab,

        toggleLeftDrawer,
        addTab,
        deleteTab,
        openFile,
        onDragStart,
        onDrop
    } = useTabs();
</script>