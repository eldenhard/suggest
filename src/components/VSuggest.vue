<script setup lang="ts">
  import { ref, watch, onMounted, defineProps, onBeforeUnmount } from "vue";
  import { debounce } from "../utils/debounce";
  import { useGetFetchSuggestions } from "../composables/useGetFetchSuggestions";

  import VSuggestItem from "./VSuggestItem.vue";
  import VTag from "./VTag.vue";
  import VLoader from "./VLoader.vue";

  const listItem = ref<string[]>([]);
  const query = ref<string>("");
  const flagActiveList = ref<boolean>(false);
  const inputUserValue = ref<HTMLInputElement | null>(null);
  const isVisibleMobileSuggest = ref<boolean>(window.innerWidth <= 1200);
  const excludedElements = ref<HTMLElement[]>([]);

  const props = withDefaults(
    defineProps<{
      inputLabel: string;
      tagAmount: number;
      placeholderSuggest: string;
      apiUrl: string;
    }>(),
    {
      apiUrl: "https://habr.com/kek/v2/publication/suggest-mention",
      inputLabel: "Пользователь или компания",
      placeholderSuggest: "Введите логин",
      tagAmount: 1,
    }
  );

  const { isLoading, error, responseData, fetchSuggestions } = useGetFetchSuggestions({
    apiUrl: props.apiUrl,
    transformResponse: (data) => data.data,
    validateQueryParams: (query) => query.trim().length >= 3,
  });

  const debouncedFetchSuggestions = debounce(() => {
    fetchSuggestions(query.value).then(() => {
      flagActiveList.value = !error.value && responseData.value.length > 0;
    });
  }, 1000);

  // Управление тегами
  const addItemToList = (val: string) => {
    if (val.trim() && listItem.value.length < props.tagAmount) {
      listItem.value.push(val.trim());
      query.value = "";
      flagActiveList.value = false;
      inputUserValue.value?.focus();
    }
  };

  const removeItem = (index: number) => {
    listItem.value.splice(index, 1);
  };

  const handleOutsideClick = () => {
    flagActiveList.value = false;
  };

  const handleInputClick = () => {
    if (responseData.value.length > 0 && query.value.trim()) {
      flagActiveList.value = true;
    }
  };

  const updateIsMobile = () => {
    isVisibleMobileSuggest.value = window.innerWidth <= 1000;
  };

  // Слежение за изменением запроса
  watch(query, () => {
    error.value = null;
    flagActiveList.value = false;
  });


  onMounted(() => {
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", updateIsMobile);
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
        <VTag @removeItem="removeItem" :listItem="listItem" v-if="isVisibleMobileSuggest" class="v_tag_class" />

        <div class="input_block">
          <VTag @removeItem="removeItem" :listItem="listItem" v-if="!isVisibleMobileSuggest" />

          <input
            ref="inputUserValue"
            v-model="query"
            :disabled="listItem.length >= tagAmount"
            :placeholder="listItem.length >= tagAmount ? `Кол-вол сущностей не более ${tagAmount} шт.` : 'Введите логин'"
            @input="debouncedFetchSuggestions"
            @click="handleInputClick"
            @keydown.enter="handleInputClick"
            id="suggest"
            type="text"
            aria-autocomplete="list"
            aria-controls="suggest-list"
            aria-activedescendant="suggest-item-{{ activeIndex }}"
            autocomplete="off"
            class="input-field"
          />
          <VLoader v-if="isLoading" class="loader" />
        </div>
        <p v-if="error" class="error-message">{{ error }}</p>
      </div>
      <div v-if="flagActiveList" class="suggest_left">
        <VSuggestItem v-click-outside:[excludedElements]="handleOutsideClick" :responseData="responseData" @selectedItem="addItemToList" role="listbox" />
      </div>
    </section>
  </main>
</template>

<style scoped>
  .main-container {
    height: auto;
    width: 100vw;
  }

  .section-container {
    margin-top: 20%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
    width: 100%;
  }

  .form-group,
  .suggest_left {
    display: flex;
    flex-direction: column;
    width: 60vw;
  }

  .label_description {
    font-weight: bold;
    padding: 4px 0;
    font-size: 1.1em;
  }

  .required-star {
    color: red;
  }

  .input_block {
    width: 100%;
    height: 6vh;
    border: 1px solid #ccc;
    padding: 8px;
    border-radius: 8px;
    display: flex;
    align-items: center;
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
    background: transparent;
  }

  .input-field:disabled {
    cursor: not-allowed;
    background: transparent;
  }

  .error-message {
    color: red;
  }
  .v_tag_class {
    margin: 0 auto 4px 0;
  }
  @media screen and (max-width: 1000px) {
    .label_description {
      font-size: 0.9em;
    }

    .form-group,
    .suggest_left {
      width: 80vw;
    }
  }
</style>
