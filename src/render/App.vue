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
          ArtReader
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    
    <!-- Left Drawer -->
    <q-drawer v-model="leftDrawerOpen" side="left" bordered>
      <div>
        Pages
      </div>
    </q-drawer>

    <!-- Page -->
    <q-page-container>
      
      <!-- Tabs -->
      <TabsComponent />


    </q-page-container>
    
    <!-- Footer -->
    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div>
            Pu-pu-puuuu... 
            I hope there will be something here, for example, tools.
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template> 

<script setup lang="ts">
import { ref } from 'vue'
import TabsComponent from "./vue_components/tabs/TabsComponent.vue"

const leftDrawerOpen = ref(false);
const toggleLeftDrawer = () => {
    leftDrawerOpen.value = !leftDrawerOpen.value
}

</script>