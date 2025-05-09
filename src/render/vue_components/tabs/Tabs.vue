<template>
  <div>
    <!-- Tabs -->
    <q-tabs
      class="bg-secondary text-white"
      v-model="activeTab"
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
          {{ tab.name }} {{ tab.id }}
          <q-btn 
            @click="deleteTab(tab.id)" 
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
        Содержимое: {{ activeTab }}; Количество вкладок: {{ tabs.length }}
      </div>
      <q-btn label="Open File" />
    </div>
  </div>
</template>

<script setup lang="ts">
import useTabs from './tabs';
const {
    tabs,
    activeTab,
  
    addTab,
    deleteTab,
    onDragStart,
    onDrop
} = useTabs();
</script>