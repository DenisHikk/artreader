<template>
    <q-layout view="lHh lpR fFf">
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
    </q-layout>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import TabsComponent from '@/render/core/vue_components/tabs/TabsComponent.vue'

    const leftDrawerOpen = ref(false);
    const toggleLeftDrawer = () => {
        leftDrawerOpen.value = !leftDrawerOpen.value
    }

</script>