const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("app", {
  cmd: (handleCmd) => ipcRenderer.on("cmd", (event, cmd) => handleCmd(cmd)),
});
