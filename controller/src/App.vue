<script setup>
import { ref, watch } from "vue";
const playing = ref(false);

watch(playing, () => {
  app.cmd({
    cmd: "start",
    timestamp: 0,
  });
});
</script>

<template>
  <button @click="playing = !playing">Spustit</button>
</template>

<style scoped></style>
