const { app, BrowserWindow, ipcMain } = require("electron");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
// const robot = require("robotjs");

var socket = require("socket.io-client")("http://localhost:3000");
var interval;

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

  // socket.on("mouse-move", function (data) {
  //   var obj = JSON.parse(data);
  //   var x = obj.x;
  //   var y = obj.y;

  //   robot.moveMouse(x, y);
  // });

  // socket.on("mouse-click", function (data) {
  //   robot.mouseClick();
  // });

  // socket.on("type", function (data) {
  //   var obj = JSON.parse(data);
  //   var key = obj.key;

  //   robot.keyTap(key);
  // });
};

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("start-share", function (event, arg) {
  let uuid = "Mac Mini 440";
  socket.emit("join-message", uuid);
  event.reply("uuid", uuid);
});
