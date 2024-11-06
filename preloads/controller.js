const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("app", {
  cmd: (cmd) => {
    ipcRenderer.send("cmd", cmd);
  },
  openFile: () => ipcRenderer.invoke("openFile"),
});
