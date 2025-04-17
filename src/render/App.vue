<template>
    <q-layout view="lHh Lpr lFf">
        <q-header elevated>
            <q-toolbar>
                <q-toolbar-title>Выбор книги</q-toolbar-title>
            </q-toolbar>
        </q-header>

        <q-page-container>
            <book-list :selectBook="selectBook" v-if="!selectedBook" />
            <book-details :selectedBook="selectedBook" v-if="selectedBook" />
        </q-page-container>
    </q-layout>
</template>

<script>
import BookList from './core/components/BookList.vue'
import BookDetails from './core/components/BookDetails.vue'

export default {
    name: 'App',
    components: {
        BookList,
        BookDetails
    },
    data() {
        return {
            selectedBook: null
        };
    },
    methods: {
        selectBook(book) {
            this.selectedBook = book;
        }
    }
};
</script>

<style lang="scss">
body {
    font-family: 'Roboto', sans-serif;
    background-color: #f1f1f1;
}
</style>