const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    startAutoclick: (data) => ipcRenderer.invoke('start-autoclick', data),
    stopAutoclick: () => ipcRenderer.invoke('stop-autoclick'),
    alwaysOnTopHandler: (data) => ipcRenderer.invoke('always-on-top-handler', data),
    onAutoclickStopped: (callback) => ipcRenderer.on('autoclick-stopped', (event, data) => callback(data)),
    backgroundHotkeys: (callback) => ipcRenderer.on('background-hotkeys', (event, data) => callback(data)),

    optionsHandler: (data) => ipcRenderer.invoke('options-handler', data),

    databaseHandler: (data) => ipcRenderer.invoke('database-handler', data),

    updateProfile: (data) => ipcRenderer.invoke('update-profile', data),

    frameHandler: (data) => ipcRenderer.invoke('frame-handler', data),
});
