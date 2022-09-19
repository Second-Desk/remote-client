"use strict";

const { app, BrowserWindow, desktopCapturer } = require("electron");
const path = require("path");
const electronReload = require("electron-reload");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    icon: "favicon.ico",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  desktopCapturer
    .getSources({ types: ["window", "screen"] })
    .then(async (sources) => {
      for (const source of sources) {
        if (source.name === "Entire screen") {
          // console.log(source);
          win.webContents.send("SET_SOURCE", source.id);
          return;
        }
      }
    });

  win.webContents.openDevTools();

  win.removeMenu();
  win.loadFile("index.html");
};

app.whenReady().then(() => {
  createWindow();
});
