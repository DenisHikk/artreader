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
    </div>
    <div>
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

<style scoped lang="scss">
    .tab-title {
        min-width: 90px;
        max-width: 150px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>
