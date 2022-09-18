const { app, BrowserWindow } = require("electron");
const path = require("path");
// const robot = require("robotjs");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: "favicon.ico",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.webContents.openDevTools();

  win.removeMenu();
  win.loadFile("index.html");
};

app.whenReady().then(() => {
  createWindow();
});
