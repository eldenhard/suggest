<script setup lang="ts">
  import { defineProps } from "vue";

  defineProps<{
    listItem: string[];
  }>();

  const emit = defineEmits<{
    removeItem: [index: number];
  }>();

  const removeItem = (index: number) => emit("removeItem", index);
</script>

<template>
  <ul class="tag_list">
    <li v-for="(item, index) in listItem" :key="index" class="tag"  :aria-label="`Удалить тег ${item}`">
      @{{ item }}
      <button class="remove-btn" @click="removeItem(index)" aria-label="Удалить">×</button>
    </li>
  </ul>
</template>

<style scoped>
  .tag_list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }

  .tag {
    background-color: #849fb1;
    color: #fcfcfc;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.875rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    font-weight: 500;
  }

  .remove-btn {
    background: none;
    border: none;
    color: #ffffff;
    cursor: pointer;
    font-size: 1.4rem;
  }

  .remove-btn:hover {
    color: #dc2626;
  }
</style>
