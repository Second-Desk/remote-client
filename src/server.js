const express = require("express");
const expressApp = express();
const http = require("http");
const server = http.createServer(expressApp);
const { Socket } = require("socket.io");
const io = new http.Server(server);
const port = process.env.PORT || 3001;

expressApp.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

server.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
