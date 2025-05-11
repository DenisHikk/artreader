import { defineStore } from "pinia";
import { ref } from "vue";

// importan rules
// name for defineStore its "use"+CamelCase name id of defineStore

export const useSettingBook = defineStore("settingBook", () => {
    const scale = ref(0);

    return {
        scale
    }
})