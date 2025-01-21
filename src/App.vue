<script setup lang="ts">
  import VSuggest from './components/VSuggest.vue';
</script>

<template>
  <!-- TODO API URL TODO validator -->
    <VSuggest :inputLabel="'Пользователь или компания'" :tagAmount="4" :placeholderSuggest="'Введите логин'"/>
</template>



