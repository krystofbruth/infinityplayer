const videoElement = document.querySelector("#viewport");

const handleCmd = (cmdobj) => {
  if (cmdobj.cmd === "start") {
    videoElement.play();
  }
};

app.cmd(handleCmd);
