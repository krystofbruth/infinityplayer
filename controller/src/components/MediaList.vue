<script setup>
import {
  img as imgFormats,
  video as videoFormats,
} from "../assets/extensionMappings.js";
const list = defineModel();

async function handleFileOpen() {
  const file = await window.app.openFile();
  return file;
}

async function handleAddItem() {
  const newMedia = await handleFileOpen();

  if (newMedia === null) {
    console.warn("No file selected!");
    return;
  }

  if (imgFormats.includes(newMedia.extension)) {
    newMedia.type = "img";
  } else if (videoFormats.includes(newMedia.extension)) {
    newMedia.type = "video";
  } else {
    console.error("Couldn't autodetect file type, defaulting to video");
    newMedia.type = "video";
  }

  list.value.push(newMedia);
}
</script>

<template>
  <div>
    <div class="list">
      <article v-for="item in list">
        <p>{{ item.filePath }}</p>
      </article>
    </div>
    <button @click="handleAddItem">Add an item</button>
  </div>
</template>

<style scoped>
div.list {
  display: flex;
  flex-direction: column;
}
</style>
