<script setup lang="ts">
  import { ref, defineProps, defineEmits } from "vue";
  import noPhoto from "../assets/images/noPhoto.png";
  import type { SuggestItem } from "../types/index";
  const listItemRef = ref<HTMLElement | null>(null);

  defineProps<{
    responseData: SuggestItem[];
  }>();

  const emit = defineEmits<{
    selectedItem: [alias: string];
  }>();
  const selectedItem = (alias: string) => emit("selectedItem", alias);

</script>

<template>
  <div class="suggest-container">
    <ul class="suggest-list">
      <li v-for="item in responseData" :key="JSON.stringify(item)" class="suggest-item" @click="selectedItem(item.alias)" ref="listItemRef">
        <div class="item-content">
          <div class="avatar-block">
            <img :src="item.avatar || noPhoto" alt="avatar" class="avatar" />
          </div>
          <div class="info-block">
            <div class="name-line">
              {{ item.name || item.alias }}
            </div>
            <div class="additional-line">
              <span v-if="item.type === 'company'" class="name-line">компания</span>
              <span v-else>@{{ item.alias }}</span>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
  .suggest-container {
    width: clamp(20%, 35%, 100%);
    border-radius: 4px;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;
    overflow-y: auto;
  }

  @media (max-width: 768px) {
    .suggest-container {
      width: 80%;
    }
  }

  .suggest-list {
    padding: 0;
    margin: 0;
    height: auto;
    max-height: 35vh;
    overflow: auto;
  }

  .suggest-item {
    list-style: none;
    padding: 10px;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  .suggest-item:hover {
    background: #f0f0f0;
  }

  .item-content {
    display: flex;
    align-items: center;
    height: 7vh;
  }

  .avatar-block {
    width: 50px; 
    aspect-ratio: 1 / 1; 
    flex-shrink: 0; 
    margin-right: 10px;
    position: relative; 
  }

  .avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }

  .info-block {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
  }

  .name-line {
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .additional-line {
    display: flex;
    justify-content: space-between;
    font-size: 0.8em;
    color: #666;
  }
</style>
