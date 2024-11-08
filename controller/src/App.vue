<script setup>
import { ref, watch } from "vue";
import MediaList from "./components/MediaList.vue";
const playing = ref(false);
const volume = ref(100);
const autostart = ref(false);
const repeat = ref(false);
const medialist = ref([]);
const timeProgress = ref(0);
const currentFile = ref(null);
let currentTimestamp = 0;

const handleAdvertisement = (advertisementObj) => {
  switch (advertisementObj.adv) {
    case "end":
      handleVideoEnd();
      break;
    default:
      console.error("Advertisement not defined " + advertisementObj);
      break;
  }
};

window.app.adv(handleAdvertisement);

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
  if (currentFile.value === null) {
    playing.value = true;
    window.app.cmd({
      cmd: "play",
    });
  }
}

function handleNextMediaItem() {
  medialist.value.shift();
  playing.value = false;

  if (medialist.value.length === 0) {
    window.app.cmd({
      cmd: "file",
      value: null,
    });
    currentFile.value = true;
    return;
  }

  window.app.cmd({
    cmd: "file",
    value: medialist.value[0],
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

    <input type="range" v-model="timeProgress" min="0" max="100" />
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
