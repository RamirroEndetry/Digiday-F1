// Most mezi stránkou a hlavním procesem: žebříček se ukládá do souboru na disku
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('boardStore', {
  load: () => ipcRenderer.sendSync('board:load'),
  save: (board) => ipcRenderer.sendSync('board:save', board),
});

contextBridge.exposeInMainWorld('appConfig', {
  getConfig: () => ipcRenderer.invoke('app:get-config'),
});
