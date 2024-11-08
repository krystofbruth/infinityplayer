<script setup>
import { ref, watch } from "vue";
import MediaList from "./components/MediaList.vue";
const playing = ref(false);
const volume = ref(100);
const autostart = ref(false);
const repeat = ref(false);
const medialist = ref([]);
const currentTime = ref(0);
const timeProgress = ref(0);
const currentFile = ref(null);
let timeInteraction = false;

const handleAdvertisement = (advertisementObj) => {
  switch (advertisementObj.adv) {
    case "end":
      handleVideoEnd();
      break;
    case "timeupdate":
      if (!timeInteraction) {
        handleTimeUpdate(advertisementObj.value);
      }
      break;
    default:
      console.error("Advertisement not defined " + advertisementObj);
      break;
  }
};

window.app.adv(handleAdvertisement);

function handleTimeUpdate(timestamp) {
  currentTime.value = timestamp;
  timeProgress.value = (100 * timestamp) / parseInt(currentFile.value.duration);
}

function handleTimeInteraction() {
  if (currentFile.value === null) {
    return;
  }
  window.app.cmd({
    cmd: "pause",
  });
  window.addEventListener(
    "mouseup",
    () => {
      timeInteraction = false;
      if (playing.value) {
        window.app.cmd({
          cmd: "play",
        });
      }
    },
    { once: true }
  );
  timeInteraction = true;
}

function handleVideoEnd() {
  if (repeat.value) {
    window.app.cmd({
      cmd: "play",
    });
    return;
  }

  handleNextMediaItem();

  if (autostart.value && currentFile.value !== null) {
    playing.value = true;
    window.app.cmd({
      cmd: "play",
    });
  }
}

function handleSkip() {
  handleNextMediaItem();
  if (currentFile.value !== null) {
    playing.value = true;
    window.app.cmd({
      cmd: "play",
    });
  }
}

function handleNextMediaItem() {
  medialist.value.shift();
  playing.value = false;
  timeProgress.value = 0;

  if (medialist.value.length === 0) {
    window.app.cmd({
      cmd: "file",
      value: null,
    });
    currentFile.value = null;
    return;
  }

  currentFile.value = medialist.value[0];
  window.app.cmd({
    cmd: "file",
    value: currentFile.value.filePath,
  });
}

watch(playing, () => {
  if (currentFile.value === null) {
    playing.value = false;
  }

  if (playing.value) {
    window.app.cmd({
      cmd: "play",
    });
  } else {
    window.app.cmd({
      cmd: "pause",
    });
  }
});

watch(volume, () => {
  window.app.cmd({
    cmd: "volume",
    value: volume.value,
  });
});

watch(
  medialist,
  () => {
    if (medialist.value.length === 0) {
      window.app.cmd({
        cmd: "file",
        value: null,
      });
    } else if (currentFile.value === null) {
      currentFile.value = medialist.value[0];
      window.app.cmd({
        cmd: "file",
        value: currentFile.value.filePath,
      });
    }
  },
  { deep: true }
);

watch(timeProgress, () => {
  if (timeInteraction) {
    const newTimestamp =
      (timeProgress.value * currentFile.value.duration) / 100;
    window.app.cmd({
      cmd: "seek",
      value: newTimestamp,
    });
  }
});
</script>

<template>
  <div class="controls">
    <button v-if="playing" @click="playing = !playing">Pozastavit</button>
    <button v-else @click="playing = !playing" :class="{ disabled: endOfList }">
      Přehrát
    </button>

    <input type="range" v-model="volume" min="0" max="100" />

    <button
      @click="autostart = !autostart"
      :class="{ active: autostart, inactive: !autostart }"
    >
      Automatic play after new file
    </button>

    <button
      @click="repeat = !repeat"
      :class="{ active: repeat, inactive: !repeat }"
    >
      Repeat
    </button>
    <button @click="handleSkip">Skip</button>

    <input
      type="range"
      v-model="timeProgress"
      @mousedown="handleTimeInteraction"
      min="0"
      max="100"
      :disabled="currentFile === null"
    />
    <p v-if="currentFile !== null">
      {{ Math.round(currentTime / 60) }}:{{ Math.round(currentTime % 60) }} /
      {{ Math.round(currentFile.duration / 60) }}:{{
        Math.round(currentFile.duration % 60)
      }}
    </p>
    <p v-else>00:00/00:00</p>
  </div>
  <MediaList v-model="medialist" />
</template>

<style scoped>
.active {
  background-color: green;
}

.inactive {
  background-color: red;
}

.disabled {
  cursor: not-allowed;
}
</style>
