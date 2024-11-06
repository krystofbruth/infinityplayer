<script setup>
import { ref, watch } from "vue";
const playing = ref(false);

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
</script>

<template>
  <button v-if="playing" @click="playing = !playing">Pozastavit</button>
  <button v-else @click="playing = !playing">Přehrát</button>
</template>

<style scoped></style>
