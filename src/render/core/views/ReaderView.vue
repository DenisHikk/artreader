<template>
    <div class="q-pa-md">
        <q-card class="my-card">
            <q-parallax src="https://cdn.quasar.dev/img/parallax1.jpg" :height="150" />

            <q-card-section>
                <div class="text-h6">{{ readerState.msg }}</div>
                <div class="text-subtitle2"><q-icon name="copyright"/> {{ readerState.name }}</div>
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const readerState = reactive({
    msg: "Один раз в сутки, суп должен быть в желудке",
    name: "Джейсон Стетхем"
})

</script>

<style scoped lang="scss">
</style>
