<template>
    <h1>{{ msg }}</h1>
</template>

<script type="ts">
import { defineComponent } from 'vue';
export default defineComponent({
    name: "App",
    data() {
        msg: "Hello from Electron + Vue"
    }
});
</script>