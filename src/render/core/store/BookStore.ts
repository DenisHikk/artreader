import { defineStore } from "pinia";
import { ref } from "vue";

// importan rules
// name for variables defineStore its "use"+UpperCamelCase name id of defineStore

export const useSettingBook = defineStore("settingBook", () => {
    const scale = ref(0);

    return {
        scale
    }
})