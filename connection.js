const { Peer } = require("peerjs");
const { mouse, Point, Button, keyboard, Key } = require("@nut-tree/nut-js");
const { ipcRenderer } = require("electron");

mouse.config.autoDelayMs = 0;
keyboard.config.autoDelayMs = 0;

var peerId = "SD-RD-440";
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

let screenHeight;
let screenWidth;
// listen for screen size from main.js
ipcRenderer.on("GET_SCREEN_SIZE", (event, message) => {
  screenHeight = message.height;
  screenWidth = message.width;
});

// listen for desktop capturer from main.js
ipcRenderer.on("SET_SOURCE", async (event, sourceId) => {
  try {
    let stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: sourceId,
          minWidth: 1920,
          maxWidth: 1920,
          minHeight: 1080,
          maxHeight: 1080,
        },
      },
    });
    setStream(stream);
  } catch (e) {
    console.log(e);
  }
});

let localStream;
const setStream = (screenStream) => {
  console.log(screenStream);
  const video = document.getElementById("remoteVideo");
  video.srcObject = screenStream;
  video.onloadedmetadata = (e) => video.play();
  localStream = screenStream;
};

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
      remoteVideoContainer.style.display = "block";
      call.answer(localStream); // Answer the call with an A/V stream.
    })
    .catch(function (err) {
      console.log("ERROR: " + err);
    });
  peerCall = call; // export to a global variable
});
