const { Peer } = require("peerjs");
const { mouse, Point, Button, keyboard, Key } = require("@nut-tree/nut-js");

let screenHeight;
let screenWidth;
require("electron").ipcRenderer.on("ping", (event, message) => {
  console.log(message); // Prints screen size
  screenHeight = message.height;
  screenWidth = message.width;
});

mouse.config.autoDelayMs = 0;
keyboard.config.autoDelayMs = 0;

var peerId = "SD-Remote-Desktop-440";
var peer = new Peer(peerId, {
  debug: 2,
});
var remoteId = "";
var conn = null;
var peerCall;
var localScreenSize = null;
var remoteVideo = document.getElementById("remoteVideo");
var remoteVideoContainer = document.getElementById("remoteVideoContainer");
remoteVideoContainer.style.display = "none";
var startCallBtn = document.getElementById("startCallBtn");
document.getElementById("connectionContainer").style.display = "none";
remoteVideoContainer.style.display = "block";

// Initialize peer
peer.on("open", function () {
  console.log("Local ID is: " + peerId);
  document.getElementById("connectionId").innerHTML = peerId;
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then(function (stream) {
      // remoteVideo.srcObject = stream;
    });
  return peerId;
});

// Receive messages
peer.on("connection", function (conn) {
  conn.on("data", function (data) {
    // console.log(data);
    remoteController(data);
  });
});

// Data handler for remote actions
const remoteController = (data) => {
  switch (data.name) {
    case "mousePosition":
      let mouseXOffset = data.width;
      let mouseYOffset = data.height;
      let mouseXScaleFactor = screenWidth / mouseXOffset;
      let mouseYScaleFactor = screenHeight / mouseYOffset;
      const target = new Point(
        data.mouseX * mouseXScaleFactor,
        data.mouseY * mouseYScaleFactor
      );
      mouse.setPosition(target);
      console.log("New Y pos: " + data.mouseY * mouseYScaleFactor);
      break;
    case "mouseAction":
      console.log(data);
      if (data.action == "mouseDown") {
        mouse.pressButton(Button.LEFT);
      } else {
        mouse.releaseButton(Button.LEFT);
      }
      break;
    case "keyboardAction":
      console.log(data);
      let remoteKeyboardInput = data.keyInput;
      if (remoteKeyboardInput.includes("Key")) {
        remoteKeyboardInput = remoteKeyboardInput.replace("Key", "");
      }
      console.log(remoteKeyboardInput);
      keyboard.type(Key[remoteKeyboardInput]);
      break;
    default:
  }
};

//  Local client
peer.on("call", function (call) {
  console.log("Call successful!");
  // Answer the call, providing our mediaStream
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then(function (stream) {
      document.getElementById("connectionContainer").style.display = "none";
      remoteVideoContainer.style.display = "block";
      var videoStream = remoteVideo.captureStream(30);
      console.log("My stream: " + videoStream);
      call.answer(videoStream); // Answer the call with an A/V stream.
    })
    .catch(function (err) {
      console.log("ERROR: " + err);
    });
  peerCall = call; // export to a global variable
});
