const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const ffprobe = require("ffprobe");
const ffprobeStatic = require("ffprobe-static");
const path = require("path");

async function handleFileOpen() {
  const openDialog = await dialog.showOpenDialog();
  const { canceled, filePaths } = openDialog;
  if (!canceled) {
    const filePath = filePaths[0];

    try {
      const metadata = await ffprobe(filePath, { path: ffprobeStatic.path });
      return { filePath, ...metadata };
    } catch (err) {
      console.error(err);
      return null;
    }
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
