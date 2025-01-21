<script setup lang="ts">
import noPhoto from "../assets/images/noPhoto.png";
import type { SuggestItem } from "../types/index";

defineProps<{
  item: SuggestItem;
}>();
</script>

<template>
  <div class="item-content">
    <div class="avatar-block">
      <img :src="item.avatar || noPhoto" alt="avatar" class="avatar" />
    </div>
    <div class="info-block">
      <div class="name-line">
        {{ item.name || item.alias }}
      </div>
      <div class="additional-line">
        <span class="name-line">компания</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url(../assets/styles/suggestItemStyle.css);
</style>
