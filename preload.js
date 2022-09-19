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
          minWidth: 1920,
          maxWidth: 1920,
          minHeight: 1080,
          maxHeight: 1080,
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
