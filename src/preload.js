const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    startAutoclick: () => ipcRenderer.invoke('start-autoclick'),
    stopAutoclick: () => ipcRenderer.invoke('stop-autoclick'),
});