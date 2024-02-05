const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    startAutoclick: (data) => ipcRenderer.invoke('start-autoclick', data),
    stopAutoclick: () => ipcRenderer.invoke('stop-autoclick'),

    onAutoclickStopped: (callback) => ipcRenderer.on('autoclick-stopped', (event, data) => callback(data)),
});
