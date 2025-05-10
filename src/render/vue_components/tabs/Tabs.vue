<template>
  <div>
    <!-- Tabs -->
    <q-tabs
      class="bg-secondary text-white"
      v-model="activeTab"
      :key="tabs.length"
      align="left"
    >
      <q-tab
        v-for="(tab, index) in tabs" :key="tab.id" :name="tab.id"
        @dragstart="onDragStart($event, index)"
        @dragover.prevent
        @drop="onDrop($event, index)"
        draggable="true"
      >
        <div>
          <span>
            {{ tab.name }} {{ tab.id }}
          </span>
          <q-btn 
            @click.stop="deleteTab(tab.id)"
            @mousedown.stop
            dense
            size="sm"
            icon="delete" 
            color="primary" 
          />
        </div>
      </q-tab>
      <q-btn @click="addTab()" round label="+" color="primary" />
    </q-tabs>
  </div>
  <div 
    class="q-mt-md"
  >
    <div 
      v-if="tabs.length !== 0"
    >
      <div>
        Содержимое: {{ activeTab }}; Количество вкладок: {{ tabs.length }};
        Индекс текущей вкладки: 
          {{ tabs.findIndex(tab => tab.id === activeTab) }}
        Файл текущей вкладки:
          {{ tabs[tabs.findIndex(tab => tab.id === activeTab)].filepath }}
      </div>
      
      <div 
        v-if="tabs[tabs.findIndex(tab => tab.id == activeTab)].filepath == 'none'"
      >
        <q-btn label="Open File" @click="openFile"/>
      </div>
      <div 
        v-if="tabs[tabs.findIndex(tab => tab.id == activeTab)].filepath !== 'none'"
      >
        <div>
          <PDFReaderView :file="tabs[tabs.findIndex(tab => tab.id == activeTab)].filepath" />
        </div>
        
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import useTabs from './tabs';
import PDFReaderView from "../../core/views/PDFReaderView.vue";
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