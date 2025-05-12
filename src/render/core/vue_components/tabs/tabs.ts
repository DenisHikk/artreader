import { ref } from 'vue';

// class for generating uid's
class UidGenerator {
    generatedIds:Set<number> = new Set([1]);

    // generate new uid
    getUid(): number {
        if (this.generatedIds.size > 100000)
        {
            throw new Error("You're trying to open more than 100.000 tabs. " +
              " Are you sick? I can't give you another id. The pool is full.");
        }
        let newId:number;
        do {
            newId = Math.floor(Math.random() * 100000) + 1;
        } while (this.generatedIds.has(newId));
        this.generatedIds.add(newId);
        return newId;
    }

    // remove id
    removeId(id:number) {
        if (!this.generatedIds.has(id)) {
            throw new Error("The tab ID you are trying to remove from the " +
                "pool does not exist in this pool");
        }
        this.generatedIds.delete(id);
    }
}

function getFileName(filePath: string): string {
    const parts = filePath.split(/[/\\]/)
    return parts[parts.length - 1]
}

interface Tab {
    id: number;
    name: string;
    filepath: string;
}

export default function useTabs() {
    /// vars
    const uidGenerator:UidGenerator = new UidGenerator();
    const leftDrawerOpen = ref(false);
    const tabs = ref<Tab[]>([]);
    const activeTab = ref();
    const filePath = ref();

    /// functions
    // close/open left drawer
    const toggleLeftDrawer = () => {
        leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    // new tab
    const addTab = () => {
        const newId = uidGenerator.getUid();
        tabs.value.push({ id: newId, name: "New Tab", filepath: "none" });
        activeTab.value = newId;
    };

    // delete tab
    const deleteTab = (idToRemove: number) => {
        if (tabs.value.length !== 1) {

            const currentActiveId = activeTab.value;

            tabs.value = tabs.value.filter(tab => tab.id !== idToRemove);

            if (currentActiveId === idToRemove) {
                activeTab.value = tabs.value[0]?.id ?? null;
            }

            uidGenerator.removeId(idToRemove);
        }
    };

    // get file path
    const openFile = async () => {
        filePath.value = await window.api.dialogOpenFile();
        if (filePath.value) {
           tabs.value[tabs.value.findIndex(tab => tab.id == activeTab.value)]
                .filepath = filePath.value;
            tabs.value[tabs.value.findIndex(tab => tab.id == activeTab.value)]
                .name = getFileName(filePath.value);
        }
    }

    // drag
    const onDragStart = (event:any, index:number) => {
        event.dataTransfer.setData('text/plain', index);
    };
  
    // drop
    const onDrop = (event:any, index:number) => {
        const draggedIndex = event.dataTransfer.getData('text/plain');
        if (draggedIndex !== index.toString()) {
          const draggedTab = tabs.value[draggedIndex];
          tabs.value.splice(draggedIndex, 1);
          tabs.value.splice(index, 0, draggedTab);
        }
    };

    /// init
    addTab();

    return {
        leftDrawerOpen,
        tabs,
        activeTab,
  
        toggleLeftDrawer,
        addTab,
        deleteTab,
        openFile,
        onDragStart,
        onDrop
    }
}