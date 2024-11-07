<script setup>
import { ref, watch } from "vue";
import MediaList from "./components/MediaList.vue";
const playing = ref(false);
const volume = ref(100);
const autostart = ref(false);
const repeat = ref(false);
const medialist = ref([]);
let endOfList = true;

const handleAdvertisement = (advertisementObj) => {
  switch (advertisementObj.adv) {
    case "end":
      handleVideoEnd();
      break;
    default:
      console.error("Advertisement not defined" + advertisement);
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

  if (autostart.value && !endOfList) {
    playing.value = true;
    window.app.cmd({
      cmd: "play",
    });
  }
}

function handleSkip() {
  handleNextMediaItem();
  if (!endOfList) {
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
    endOfList = true;
    return;
  }

  window.app.cmd({
    cmd: "file",
    value: medialist.value[0],
  });
}

watch(playing, () => {
  console.log(playing.value);

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
    if (endOfList) {
      window.app.cmd({
        cmd: "file",
        value: medialist.value[0],
      });
      endOfList = false;
    }
  },
  { deep: true }
);
</script>

<template>
  <div class="controls">
    <button v-if="playing" @click="playing = !playing">Pozastavit</button>
    <button v-else @click="playing = !playing">Přehrát</button>

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
</style>
