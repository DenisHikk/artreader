<template>
    <q-page class="q-pa-md">
        <q-card class="q-mb-md">
            <q-btn label="Назад" icon="arrow_back" color="primary" @click="goBack" />
            <q-card-section>
                <div class="text-h6">{{ selectedBook.title }}</div>
                <div class="text-subtitle2">Автор: {{ selectedBook.author }}</div>
            </q-card-section>
            <q-card-section>
                <div class="text-body1">{{ selectedBook.description }}</div>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script setup>
const props = defineProps({
  selectedBook: Object
});

</script>

<style lang="sass" scoped>
.q-card {
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.q-card-section {
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 6px;
}
  </style>