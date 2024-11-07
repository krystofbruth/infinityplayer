const videoElement = document.querySelector("#viewport");

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
      videoElement.pause();
      videoElement.setAttribute("src", cmdobj.value);
      if (cmdobj.autostart) {
        videoElement.play();
      }
      break;
    default:
      console.error("Command not defined: " + cmdobj.cmd);
      break;
  }
};

window.app.cmd(handleCmd);

function advertise(adv) {
  window.app.adv(adv);
}

videoElement.addEventListener("ended", () => advertise({ adv: "end" }));
