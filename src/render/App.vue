<template>
  <q-layout view="lHh lpR fFf">
    <q-header class="bg-primary text-white">
      <!--  Upper toolbar-->
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <!-- Title -->
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          Reader
        </q-toolbar-title>
      </q-toolbar>

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
          {{ tab.name }}
          <q-btn @click="deleteTab(tab.id)" round icon="delete" color="primary" />
        </q-tab>
        <q-btn @click="addTab()" round label="+" color="primary" />
      </q-tabs>
    </q-header>
    
    <!-- Left Drawer -->
    <q-drawer v-model="leftDrawerOpen" side="left" bordered>
      <div>
        Pages
      </div>
    </q-drawer>

    <!-- Page -->
    <q-page-container>
      <router-view />
      <div class="q-mt-md"
        v-for="(tab, index) in tabs" :key="tab.id" :name="tab.id"
      >
      {{ `Tab: ${tab.name} with id: ${tab.id}` }}
      </div>
    </q-page-container>
    
    <!-- Footer -->
    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div>Pu-pu-puuuu... I hope there will be something here, for example, tools.</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    /// vars
    const leftDrawerOpen = ref(false);
    const tabs = ref([{id: "1", name: "New Tab"}]);
    const activeTab = ref('1');
    const generatedIds = new Set([1]);

    /// functions
    // close/open left drawer
    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    // get new uid
    const getUID = () => {
      if (generatedIds.size > 100000)
      {
        //console.log("All unique IDs for tabs are used.");
        return -1;
      }
      let newId;
      do {
        newId = Math.floor(Math.random() * 100000) + 1;
      } while (generatedIds.has(newId));
      generatedIds.add(newId);
      return newId;
    };

    // add id to pool
    const addExistingId = (id) => {
      if (id < 1 || id > 100000) {
        //console.log("The ID is out of range.");
        return -1;
      }
      generatedIds.add(id);
    };

    // remove id
    const removeId = (id) => {
      generatedIds.delete(id);
    };

    // new tab
    const addTab = () => {
      const newId = getUID();
      tabs.value.push({ id: newId, name: `New Tab` });
      activeTab.value = newId;
    };

    // delete tab
    const deleteTab = (idToRemove) => {
      const index = tabs.value.findIndex(tab => tab.id === idToRemove);
      if (index !== -1) {
        tabs.value.splice(index, 1);
        removeId(idToRemove);
      }
      if (activeTab.value === tabs.value[index]?.id) {
        activeTab.value = tabs.value[0].id;
      }
    };

    // drag
    const onDragStart = (event, index) => {
      event.dataTransfer.setData('text/plain', index);
    };

    // drop
    const onDrop = (event, index) => {
      const draggedIndex = event.dataTransfer.getData('text/plain');
      if (draggedIndex !== index.toString()) {
        const draggedTab = tabs.value[draggedIndex];
        tabs.value.splice(draggedIndex, 1);
        tabs.value.splice(index, 0, draggedTab);
      }
    };

    return {
      leftDrawerOpen,
      tabs,

      toggleLeftDrawer,
      addTab,
      deleteTab,
      onDragStart,
      onDrop
    };
  }
};
</script>