<template>
    <q-page class="flex flex-center">
        <q-list bordered class="book-list">
            <q-item-label class="text-h5">Выберите книгу</q-item-label>
            <q-item v-for="book in books" :key="book.id" clickable @click="selectBook(book)" class="book-item">
                <q-item-section>{{ book.title }}</q-item-section>
            </q-item>
        </q-list>
    </q-page>
</template>

<script>
export default {
    name: 'BookList',
    props: {
        selectBook: Function
    },
    data() {
        return {
            books: [
                { id: 1, title: '1984', author: 'Джордж Оруэлл', description: 'Антиутопия, в которой государство следит за каждым человеком.' },
                { id: 2, title: 'Властелин колец', author: 'Дж. Р. Р. Толкин', description: 'Эпическая история о борьбе добра и зла в Средиземье.' },
                { id: 3, title: 'Убить пересмешника', author: 'Харпер Ли', description: 'Роман о расовых предрассудках в Америке 1930-х годов.' }
            ]
        };
    }
};
</script>

<style lang="scss" scoped>
.book-list {
    max-width: 500px;
    margin: 0 auto;
}
    
.book-item{
    padding: 10px 15px;
    margin-bottom: 8px;
    background-color: #f5f5f5;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
    &hover {
        background-color: #e0e0e0;
    }
}    
</style>