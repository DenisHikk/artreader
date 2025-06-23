import { ref, onMounted } from 'vue';
import { TabUidGenerator } from './tabUidGenerator';

export default function useTabs() {
    /// Vars
    const uidGenerator:TabUidGenerator = new TabUidGenerator();
    const tabs = ref<{id: number, name: string, filepath: string}[]>([]);
    const activeTab = ref();
    const filePath = ref();
    let dropSuccess = false;
    const channel = new BroadcastChannel('tab-dnd');
    let windowType = 0;

    /// Functions
    const getFileName = (filePath: string) => {
        const parts = filePath.split(/[/\\]/);
        return parts[parts.length - 1];
    }

    // New tab
    const addTab = ():number => {
        const newId = uidGenerator.getUid();
        tabs.value.push({ id: newId, name: "New Tab", filepath: "none" });
        activeTab.value = newId;
        return newId;
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
        } else if (tabs.value.length == 1 && windowType == 1) {
            window.api.closeWindow();
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
    };

    const notifyDropSuccess = (tabId: string) => {
        channel.postMessage({ type: 'tab-drop-success', tabId });
    };

    const onDropSuccess = (callback: (tabId: string) => void) => {
        channel.onmessage = (e) => {
            if (e.data?.type === 'tab-drop-success') {
                callback(e.data.tabId);
            }
        };
    }

    // Drag start - save data
    const onDragStart = (event:DragEvent,
                         tab:{id: number, name: string, filepath: string}) =>
    {
        if (event.dataTransfer) {
            event.dataTransfer.setData('tab', tab.id.toString() + ";" +
                                              tab.name + ";" +
                                              tab.filepath);
        } else {
            throw new Error("Some kind of problem with drag and drop. " + 
                            "The dataTransfer not found when dragging started");
        }
    };
  
    // Drop
    const onDrop = (event:DragEvent,
                    tab:{id: number, name: string, filepath: string}) =>
    {
        if (event.dataTransfer) {
            const transferData: string[] = event.dataTransfer.getData("tab")
                                                             .split(";");
            const transferTab:{id: number, name: string, filepath: string} = {
                id:parseInt(transferData[0]),
                name: transferData[1],
                filepath: transferData[2]
            }
            
            if (tabs.value.findIndex(e => transferTab.id === e.id) !== -1) {
                const tabIndex = tabs.value.findIndex(e => tab.id === e.id);
                const draggedTabIndex = tabs.value.findIndex(e => 
                                                    transferTab.id === e.id);
                if(tabIndex != draggedTabIndex) {
                    tabs.value.splice(draggedTabIndex, 1);
                    tabs.value.splice(tabIndex, 0, transferTab);
                    dropSuccess = true;
                }
            } else {
                const idNewTab = addTab();
                const newTab = tabs.value.find(e => e.id === idNewTab);
                if (newTab)
                {
                    newTab.filepath = transferTab.filepath;
                    newTab.name = transferTab.name;
                    notifyDropSuccess(newTab.id.toString());
                }
            }
        }
    }

    // Drag end
    const onDragEnd = (tab:{id: number, name: string, filepath: string}) => {
        setTimeout(() => {
            if (!dropSuccess) {
                if(tab.filepath) {
                    window.api.openReaderWindow(tab.filepath);
                    deleteTab(tab.id); 
                }
            } else {
                deleteTab(tab.id);
            }
            dropSuccess = false;
        }, 50);
    };
    
    // Init
    addTab();

    onDropSuccess((tabId) => {dropSuccess = true;});

    // Open reader if the path to the document was obtained during the mount
    onMounted( async () => 
    {
        const filePath = await window.api.getFilePath();
        if (filePath && filePath !== "none") {
            tabs.value[0].name = getFileName(filePath);
            tabs.value[0].filepath = filePath;
        }
        windowType = 1;
    });

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