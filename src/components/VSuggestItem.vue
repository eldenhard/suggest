<script setup lang="ts">
  import { ref, defineProps,  onMounted, onUnmounted, nextTick } from "vue";

  import VUserEntity from "./VUserEntity.vue";
  import VCompanyEntity from "./VCompanyEntity.vue";
  import type { SuggestItem } from "../types/index";


  const props = defineProps<{
      responseData: SuggestItem[] | any
    }>();

  const emit = defineEmits<{
    selectedItem: [alias: string];
  }>();

  const activeIndex = ref<number>(-1);
  const suggestListRef = ref<HTMLUListElement | null>(null);

  const selectedItem = (alias: string) => emit("selectedItem", alias);

  const handleKeydown = async (event: KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      activeIndex.value = (activeIndex.value + 1) % props.responseData.length;
      await nextTick();
      scrollToActiveItem();
    } else if (event.key === "ArrowUp") {
      activeIndex.value = (activeIndex.value - 1 + props.responseData.length) % props.responseData.length;
      await nextTick();
      scrollToActiveItem();
    } else if (event.key === "Enter" && activeIndex.value >= 0) {
      selectedItem(props.responseData[activeIndex.value].alias);
    }
  };

  const scrollToActiveItem = () => {
    const activeElement = suggestListRef.value?.querySelector(`.suggest-item:nth-child(${activeIndex.value + 1})`);
    activeElement?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  };
  onMounted(() => {
    document.addEventListener("keydown", handleKeydown);
  });

  onUnmounted(() => {
    document.removeEventListener("keydown", handleKeydown);
  });
</script>

<template>
  <div class="suggest-container">
    <ul class="suggest-list" ref="suggestListRef">
      <li v-for="(item, index) in responseData" :key="JSON.stringify(item)" :class="['suggest-item', { active: index === activeIndex }]" @click="selectedItem(item.alias)">
        <component :is="item.type === 'company' ? VCompanyEntity : VUserEntity" :item="item" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
  @import url(../assets/styles/suggestItemStyle.css);
  .suggest-item.active {
    background-color: #eeeeee;
    outline: none;
    cursor: pointer;
  }
</style>
