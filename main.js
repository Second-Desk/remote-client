"use strict";

const { app, BrowserWindow, desktopCapturer } = require("electron");
const path = require("path");
const electronReload = require("electron-reload");

// create app window
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
          const { screen } = require("electron");
          const primaryDisplay = screen.getPrimaryDisplay();
          win.webContents.send("SET_SOURCE", source.id, primaryDisplay.size);
          return;
        }
      }
    });

  // get dimensions of screen and send to preload.js
  const { screen } = require("electron");
  const primaryDisplay = screen.getPrimaryDisplay();
  win.webContents.send("GET_SCREEN_SIZE", primaryDisplay.size);


  win.webContents.openDevTools();

  win.removeMenu();
  win.loadFile("index.html");
};

app.whenReady().then(() => {
  createWindow();
});
