<script setup>
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
