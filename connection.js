const { Peer } = require("peerjs");

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
var shareLink = document.getElementById("shareLink");
var copyShareLinkBtn = document.getElementById("copyShareLinkBtn");
copyShareLinkBtn.disabled = true;
var copyShareLinkBtnText = document.getElementById("copyShareLinkBtnText");
var url = new URL(document.location);
var queryId;
var hasQueryId = false;
var startCallBtn = document.getElementById("startCallBtn");
var remoteIdInput = document.getElementById("remoteIdInput");

// Parse url for a potential ID
let params = new URL(document.location).searchParams;
queryId = params.get("id");
if (queryId) {
  hasQueryId = true;
  console.log("Query (remote) ID is: " + queryId);
} else {
  hasQueryId = false;
}

// Initialize peer
peer.on("open", function () {
  console.log("Local ID is: " + peerId);
  document.getElementById("connectionId").innerHTML = peerId;
  // create share link if no id is found in the url
  hasQueryId ? startByQuery() : createShareableLink(peerId); // ternary operator
  return peerId;
});

const createShareableLink = (localId) => {
  url.searchParams.append("id", localId);
  copyShareLinkBtn.disabled = false;
};

const startByQuery = () => {
  remoteId = queryId;
  openConnection();
};

const copyToClipboard = (data) => {
  console.log(data);
  navigator.clipboard.writeText(data);
};

copyShareLinkBtn.addEventListener("click", function () {
  copyToClipboard(url);
  copyShareLinkBtnText.innerHTML = "Link Copied!";
}); // callback function

// Start call when button is pressed
const startCall = async () => {
  console.log("Remote ID is: " + remoteIdInput.value);
  remoteId = remoteIdInput.value;
  openConnection();
};

async function screenShare(displayMediaOptions) {
  try {
    let screenShareStream = await navigator.mediaDevices.getDisplayMedia(
      displayMediaOptions
    );

    // replace the other person's stream with your screen share
    peerCall.peerConnection
      .getSenders()[1]
      .replaceTrack(screenShareStream.getVideoTracks()[0]);

    peerCall.peerConnection
      .getSenders()[0]
      .replaceTrack(screenShareStream.getAudioTracks()[0]);

    console.log("Screen share started!");
  } catch (err) {
    console.log("Screenshare error: " + err);
  }
}

// Open a new data connection
const openConnection = () => {
  conn = peer.connect(remoteId);
  conn.on("open", function () {
    console.log("Connection successful!");
    conn.send("Hey bro"); // Send message
    startVideoCall();
  });
};

// Receive messages
peer.on("connection", function (conn) {
  conn.on("data", function (data) {
    console.log(data);
  });
});

// Remote client
const startVideoCall = async () => {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then(function (stream) {
      var call = peer.call(remoteId, stream);
      call.on("stream", function (remoteStream) {
        document.getElementById("connectionContainer").style.display = "none";
        remoteVideoContainer.style.display = "block";
        remoteVideo.srcObject = remoteStream;
        peerCall = call; // export to a global variable
      });
    })
    .catch(function (err) {
      console.log("ERROR: " + err);
    });
};

//  Local client
peer.on("call", function (call) {
  // Answer the call, providing our mediaStream
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then(function (stream) {
      document.getElementById("connectionContainer").style.display = "none";
      remoteVideoContainer.style.display = "block";
      call.answer(stream); // Answer the call with an A/V stream.
      call.on("stream", function (remoteStream) {
        remoteVideo.srcObject = remoteStream;
      });
    })
    .catch(function (err) {
      console.log("ERROR: " + err);
    });
  peerCall = call; // export to a global variable
});
