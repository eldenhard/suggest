<script setup lang="ts">
  import { ref, watch, onMounted, defineProps } from "vue";
  import { debounce } from "../utils/debounce";
  import { useGetFetchSuggestions } from "../composables/useGetFetchSuggestions";

  import VSuggestItem from "./VSuggestItem.vue";
  import VTag from "./VTag.vue";
  import VLoader from "./VLoader.vue";

  const listItem = ref<string[]>([]);
  const query = ref<string>("");
  const flagActiveList = ref<boolean>(false);
  const inputUserValue = ref<HTMLInputElement | null>(null);

  const props = withDefaults(
    defineProps<{
      inputLabel: string;
      tagAmount: number;
      placeholderSuggest: string;
    }>(),
    {
      inputLabel: "Пользователь или компания",
      placeholderSuggest: "Введите логин",
      tagAmount: 1,
    }
  );

  const { isLoading, error, responseData, fetchSuggestions } = useGetFetchSuggestions({
    apiUrl: "https://habr.com/kek/v2/publication/suggest-mention",
    transformResponse: (data) => data.data,
    validateQueryParams: (query) => query.trim().length >= 3,
  });

  const debouncedFetchSuggestions = debounce(() => {
    fetchSuggestions(query.value).then(() => {
      flagActiveList.value = !error.value && responseData.value.length > 0;
    });
  }, 1000);

  const addItemToList = (val: string) => {
    if (val.trim() && props.tagAmount >= listItem.value.length) {
      listItem.value.push(String(val.trim()));
      query.value = "";
      flagActiveList.value = false;
    }
  };
  const removeItem = (index: number) => {
    listItem.value.splice(index, 1);
  };

  watch(query, (oldVal, newVal) => {
    if (oldVal !== newVal) flagActiveList.value = false;
  });
  onMounted(() => {
    inputUserValue.value?.focus();
  });
</script>

<template>
  <main class="main-container">
    <section class="section-container">
      <div class="form-group">
        <label for="suggest" class="label_description">
          <span class="required-star">*</span>
          {{ inputLabel }}
        </label>

        <div class="input_block">
          <VTag @removeItem="removeItem" :listItem="listItem" />

          <input
            ref="inputUserValue"
            v-model="query"
            :disabled="listItem.length >= tagAmount"
            :placeholder="listItem.length >= tagAmount ? '' : 'Введите логин'"
            @keydown.enter.prevent="addItemToList(query)"
            @input="debouncedFetchSuggestions"
            id="suggest"
            type="text"
            aria-autocomplete="list"
            aria-expanded="true"
            class="input-field"
          />
          <VLoader v-if="isLoading" class="loader" />
        </div>
        <p v-if="error" class="error-message">{{ error }}</p>
      </div>
      <VSuggestItem :responseData="responseData" @selectedItem="addItemToList" v-if="flagActiveList" />
    </section>
  </main>
</template>

<style scoped>
  .main-container {
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    /* background: rgb(243, 193, 193); */
  }

  .section-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    /* background: lightgreen; */
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  .label_description {
    font-weight: bold;
    padding: 4px 0;
    font-size: 1em;
  }

  .required-star {
    color: red;
  }

  .input_block {
    width: 60vw;
    height: 6vh;
    border: 1px solid #ccc;
    padding: 8px;
    border-radius: 8px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .input-field {
    border: none;
    flex: 1;
    outline: none;
    padding: 4px;
    font-size: 1rem;
  }

  .input-field:disabled {
    cursor: not-allowed;
    background: transparent;
  }

  .error-message {
    color: red; /* Добавьте стиль для сообщения об ошибке */
  }

  @media screen and (max-width: 1000px) {
    .input_block {
      width: 80vw;
    }
    .label_description {
      font-size: 0.8em;
    }
  }
</style>
