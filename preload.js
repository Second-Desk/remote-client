window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});

const { ipcRenderer } = require("electron");

var screenStream;

ipcRenderer.on("SET_SOURCE", async (event, sourceId) => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: sourceId,
          minWidth: 1280,
          maxWidth: 1280,
          minHeight: 720,
          maxHeight: 720,
        },
      },
    });
    screenStream = stream;
    console.log(screenStream);
    handleStream(stream);
  } catch (e) {
    handleError(e);
  }
});

module.exports = screenStream;

function handleStream(screenStream) {
  const video = document.getElementById("remoteVideo");
  video.srcObject = screenStream;
  video.onloadedmetadata = (e) => video.play();
}

function handleError(e) {
  console.log(e);
}
