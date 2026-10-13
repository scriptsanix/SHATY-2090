
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("playerWindow", {
  minimizar: () => ipcRenderer.send("janela:minimizar"),
  fechar: () => ipcRenderer.send("janela:fechar"),
  arrastar: (x, y) => ipcRenderer.send("janela:arrastar", { x, y })
});
