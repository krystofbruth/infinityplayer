const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

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

  controller.on("closed", () => {
    app.quit();
  });
});

app.on("window-all-closed", function () {
  app.quit();
});
