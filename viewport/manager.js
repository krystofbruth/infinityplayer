const videoElement = document.querySelector("video.viewport");
const imgElement = document.querySelector("img.viewport");

const handleCmd = (cmdobj) => {
  switch (cmdobj.cmd) {
    case "play":
      videoElement.play();
      break;
    case "pause":
      videoElement.pause();
      break;
    case "volume":
      videoElement.volume = cmdobj.value / 100;
      break;
    case "file":
      console.log(cmdobj);

      videoElement.pause();
      if (cmdobj.value === null) {
        videoElement.removeAttribute("src");
        imgElement.removeAttribute("src");
      } else {
        handleSrcChange(cmdobj.type, cmdobj.value);
      }
      break;
    case "seek":
      videoElement.currentTime = cmdobj.value;
      break;
    default:
      console.error("Command not defined: " + cmdobj.cmd);
      break;
  }
};

function handleSrcChange(type, src) {
  if (type === "img") {
    videoElement.removeAttribute("src");
    imgElement.setAttribute("src", src);
  } else if (type === "video" || !type) {
    imgElement.removeAttribute("src");
    videoElement.setAttribute("src", src);
  }
}

window.app.cmd(handleCmd);

function advertise(adv) {
  window.app.adv(adv);
}

videoElement.addEventListener("ended", () => advertise({ adv: "end" }));

videoElement.addEventListener("timeupdate", () =>
  advertise({ adv: "timeupdate", value: videoElement.currentTime })
);
