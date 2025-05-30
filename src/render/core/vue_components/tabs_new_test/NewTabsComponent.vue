<!-- Tabs component
    This component implements: tabs with a reader, which can be absolutely any; 
    store, open, close function; drag and drop function; opening tabs in a new 
    window. 
-->
<template>
    <q-tabs
        align="left"
    >
        <q-tab
            v-for="tab in tabs" 
            :key="tab.id"
        >
            {{tab.title}}
        </q-tab>
    </q-tabs>
</template>

<script setup lang="ts">
    import useTabs from "./tabs_new";

    const {
        tabs
    } = useTabs();
</script>

<style scoped lang="scss">
</style>