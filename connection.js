const { Peer } = require("peerjs");
const stream2 = require("./preload.js");

var peerId = "Mac-Mini-440";
var peer = new Peer(peerId, {
  debug: 2,
});
var remoteId = "";
var conn = null;
var peerCall;
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
    console.log(data);
  });
});

//  Local client
peer.on("call", function (call) {
  console.log("Call successful!");
  // Answer the call, providing our mediaStream
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then(function (stream) {
      document.getElementById("connectionContainer").style.display = "none";
      remoteVideoContainer.style.display = "block";
      var videoStream = remoteVideo.captureStream(25);
      console.log("My stream: " + videoStream);
      call.answer(videoStream); // Answer the call with an A/V stream.
      call.on("stream", function (remoteStream) {
        remoteVideo.srcObject = remoteStream;
      });
    })
    .catch(function (err) {
      console.log("ERROR: " + err);
    });
  peerCall = call; // export to a global variable
});

// peer.on("call", function (call) {
//   console.log("Call successful!");
//   // Answer the call, providing our mediaStream
//   navigator.mediaDevices
//     .getUserMedia({ video: true, audio: true })
//     .then(function (stream) {
//       document.getElementById("connectionContainer").style.display = "none";
//       remoteVideoContainer.style.display = "block";
//       call.answer(stream); // Answer the call with an A/V stream.
//       call.on("stream", function (remoteStream) {
//         remoteVideo.srcObject = remoteStream;
//       });
//     })
//     .catch(function (err) {
//       console.log("ERROR: " + err);
//     });
//   peerCall = call; // export to a global variable
// });
