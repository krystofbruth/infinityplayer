const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");

async function handleFileOpen() {
  const openDialog = await dialog.showOpenDialog();
  const { canceled, filePaths } = openDialog;
  if (!canceled) {
    return filePaths[0];
  } else {
    return null;
  }
}

const createWindows = function () {
  const viewport = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.resolve("preloads/viewport.js"),
    },
    autoHideMenuBar: true,
  });

  viewport.loadFile("./viewport/index.html");

  const controller = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.resolve("preloads/controller.js"),
    },
  });

  controller.loadFile("./controller/dist/index.html");

  return { controller, viewport };
};

app.whenReady().then(function () {
  const { controller, viewport } = createWindows();

  ipcMain.on("cmd", (event, cmd) => {
    viewport.webContents.send("cmd", cmd);
  });

  ipcMain.on("adv", (event, adv) => {
    controller.webContents.send("adv", adv);
  });

  ipcMain.handle("openFile", handleFileOpen);

  controller.on("closed", () => {
    app.quit();
  });
});

app.on("window-all-closed", function () {
  app.quit();
});
