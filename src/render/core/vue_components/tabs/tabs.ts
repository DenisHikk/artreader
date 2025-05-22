import { ref, onMounted } from 'vue';
import { UidGenerator } from './SimpleUidGenerator';

interface Tab {
    id: number;
    name: string;
    filepath: string;
}

export default function useTabs() {
    /// Vars
    const uidGenerator:UidGenerator = new UidGenerator();
    const tabs = ref<Tab[]>([]);
    const activeTab = ref();
    const filePath = ref();
    let dropSuccess = false;

    /// Functions
    const getFileName = (filePath: string) => {
        const parts = filePath.split(/[/\\]/);
        return parts[parts.length - 1];
    }

    // New tab
    const addTab = () => {
        const newId = uidGenerator.getUid();
        tabs.value.push({ id: newId, name: "New Tab", filepath: "none" });
        activeTab.value = newId;
    };

    // Delete tab
    const deleteTab = (idToRemove: number) => {
        if (tabs.value.length !== 1) {

            const currentActiveId = activeTab.value;

            tabs.value = tabs.value.filter(tab => tab.id !== idToRemove);

            if (currentActiveId === idToRemove) {
                activeTab.value = tabs.value[0]?.id ?? null;
            }

            uidGenerator.removeId(idToRemove);
        } else {
            tabs.value[0].name = "New Tab";
            tabs.value[0].filepath = "none";
        }
    };

    // Get file path
    const openFile = async () => {
        filePath.value = await window.api.dialogOpenFile();
        if (filePath.value) {
           tabs.value[tabs.value.findIndex(tab => tab.id == activeTab.value)]
                .filepath = filePath.value;
            tabs.value[tabs.value.findIndex(tab => tab.id == activeTab.value)]
                .name = getFileName(filePath.value);
        }
    }

    // Drag
    const onDragStart = (event:DragEvent, index:number) => {
        if (event.dataTransfer) {
           event.dataTransfer.setData('text/plain', index.toString()); 
        } else {
            throw new Error("Some kind of problem with drag and drop. " + 
                            "The dataTransfer not found when dragging started");
                            
        }
        
    };
  
    // Drop
    const onDrop = (event:DragEvent, index:number) => {
        if (event.dataTransfer) {
            let draggedIndex:string;
            draggedIndex = event.dataTransfer.getData('text/plain');
            if (draggedIndex !== index.toString()) {
                dropSuccess = true;
                const draggedTab = tabs.value[parseInt(draggedIndex)];
                tabs.value.splice(parseInt(draggedIndex), 1);
                tabs.value.splice(index, 0, draggedTab);
            }
        } else {
            throw new Error("Some kind of problem with drag and drop. " + 
                            "DataTransfer object not found when drag ends");
        } 
    };

    // Drag end
    const onDragEnd = (event:DragEvent, index:number) => {
        if (!dropSuccess)
        {
            const filepath = tabs.value[index].filepath
            if (!filepath || filepath !== "none"){
                window.api.openReaderWindow(tabs.value[index].filepath);
                deleteTab(tabs.value[index].id);
            }
        }
        dropSuccess = false;
    };

    // Open reader if the path to the document was obtained during the mount
    onMounted( async () => {
        const filePath = await window.api.getFilePath();
        tabs.value[0].name = getFileName(filePath);
        tabs.value[0].filepath = filePath;
    });
    
    /// init
    addTab();

    return {
        tabs,
        activeTab,
  
        addTab,
        deleteTab,
        openFile,
        onDragStart,
        onDrop,
        onDragEnd
    }
}