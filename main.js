const { app, BrowserWindow } = require("electron");
const path = require("path");

const express = require("express");
const expressApp = express();
const http = require("http");
const server = http.createServer(expressApp);
const { Socket } = require("socket.io");
const io = new http.Server(server);
const port = process.env.PORT || 3000;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: "favicon.ico",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
};

app.whenReady().then(() => {
  createWindow();
});

expressApp.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

io.on("connection", (socket) => {
  console.log("A user connected!");
  socket.emit("welcome", { message: "Welcome!", id: socket.id });
});

server.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
