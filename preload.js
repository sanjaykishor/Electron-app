const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    fileUpload: (filePath) =>  ipcRenderer.send('file-upload', filePath),
    uploadError: (callback) => ipcRenderer.on('upload-error', (_event, ...args) => callback(...args)),
    uploadSuccess: (callback) => ipcRenderer.on('upload-success', (_event, ...args) => callback(...args)),
    progressUpdate: (callback) => ipcRenderer.on('progress-update', (_event, ...args) => callback(...args)),
    startFlashing: () => ipcRenderer.send('start-flashing'),
    flashingError: (callback) => ipcRenderer.on('flashing-error', (_event, ...args) => callback(...args)),
    flashingSuccess: (callback) => ipcRenderer.on('flashing-success', (_event, ...args) => callback(...args))
})