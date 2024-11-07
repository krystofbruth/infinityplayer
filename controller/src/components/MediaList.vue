<script setup>
const list = defineModel();

async function handleFileOpen() {
  const filePath = await window.app.openFile();
  return filePath;
}

async function handleAddItem() {
  const newPath = await handleFileOpen();

  if (newPath === null) {
    console.warn("No file selected!");
    return;
  }

  list.value.push(newPath);
}
</script>

<template>
  <div>
    <div class="list">
      <article v-for="item in list">
        <p>{{ item }}</p>
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
