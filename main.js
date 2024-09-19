const { app, BrowserWindow } = require("electron");

const createWindow = function () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  win.loadFile("./html/player.html");
};

app.whenReady().then(function () {
  createWindow();
});

app.on("window-all-closed", function () {
  app.quit();
});
