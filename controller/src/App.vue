<script setup>
import { ref, watch } from "vue";
const playing = ref(false);
const volume = ref(0);

watch(playing, (newstate, oldstate) => {
  if (newstate) {
    app.cmd({
      cmd: "play",
    });
  } else {
    app.cmd({
      cmd: "pause",
    });
  }
});

watch(volume, () => {
  app.cmd({
    cmd: "volume",
    value: volume.value,
  });
});
</script>

<template>
  <button v-if="playing" @click="playing = !playing">Pozastavit</button>
  <button v-else @click="playing = !playing">Přehrát</button>

  <input type="range" v-model="volume" min="0" max="100" />
</template>

<style scoped></style>
