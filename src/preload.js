const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    startAutoclick: (data) => ipcRenderer.invoke('start-autoclick', data),
    stopAutoclick: () => ipcRenderer.invoke('stop-autoclick'),
});