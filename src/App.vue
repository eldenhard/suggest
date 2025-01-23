<script setup lang="ts">
  import VSuggest from './components/VSuggest.vue';
</script>

<template>
    <VSuggest :inputLabel="'Пользователь или компания'" 
      :maxAmountTags="1" 
      :placeholderSuggest="'Введите логин'" 
      :apiUrl="'https://habr.com/kek/v2/publication/suggest-mention'"   
      />
</template>



