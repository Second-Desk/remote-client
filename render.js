// unused file

const { desktopCapturer } = require("electron");
var screenSource;

async function getVideoSources() {
  desktopCapturer
    .getSources({ types: ["window", "screen"] })
    .then(async (sources) => {
      for (const source of sources) {
        if (source.name === "Entire Screen") {
          screenSource = source;
        }
      }
    });
}

let mediaRecorder; // MediaRecorder instance to capture footage
const recordedChunks = [];

// Change the videoSource window to record
// async function selectSource(screenSource) {
//   constraints = {
//     audio: false,
//     video: {
//       mandatory: {
//         chromeMediaSource: "desktop",
//         chromeMediaSourceId: screenSource.id,
//       },
//     },
//   };
// }

module.exports = async function createStream() {
  getVideoSources();
  const stream = await navigator.mediaDevices.getUserMedia(
    (constraints = {
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: screenSource.id,
        },
      },
    })
  );
  console.log("Stream created!");
  return stream;
};
