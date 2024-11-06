<script setup>
import { ref, watch } from "vue";
const playing = ref(false);
const volume = ref(0);
const file = ref(null);
const autostart = ref(false);

async function handleFileOpen() {
  const filePath = await window.app.openFile();
  if (filePath === null) {
    console.warn("No file selected!");
    return;
  }

  file.value = filePath;
}

watch(file, (newFile, oldFile) => {
  window.app.cmd({
    cmd: "file",
    value: newFile,
    autostart: autostart.value,
  });
});

watch(playing, (newstate, oldstate) => {
  if (newstate) {
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
</script>

<template>
  <button v-if="playing" @click="playing = !playing">Pozastavit</button>
  <button v-else @click="playing = !playing">Přehrát</button>

  <input type="range" v-model="volume" min="0" max="100" />

  <button @click="handleFileOpen">Choose file</button>

  <button
    @click="autostart = !autostart"
    :class="{ active: autostart, inactive: !autostart }"
  >
    Automatic play after new file
  </button>
</template>

<style scoped>
.active {
  background-color: green;
}

.inactive {
  background-color: red;
}
</style>
