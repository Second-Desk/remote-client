const { app, BrowserWindow } = require("electron");
const path = require("path");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: "favicon.ico",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  // win.webContents.openDevTools();

  win.loadFile("index.html");
};

app.whenReady().then(() => {
  createWindow();
});
