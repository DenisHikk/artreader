// Tab component logic

// Imports
import { ref } from 'vue';

export default function useTabs() {
    // Vars
    const tabs = ref<{id:number, title:string, filepath:string}[]>([
        {id:0, title:"Первая вкладка", filepath:"none"},
        {id:1, title:"Вторая вкладка", filepath:"none"}
    ]);

    return {
        tabs
    };
}