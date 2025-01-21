# Vue Suggestions Component with Debounce and API Integration

Этот проект реализует компонент на Vue 3 для отображения предложений из API, включая задержку запросов (debounce), адаптивный интерфейс, обработку ошибок и загрузок. Компонент предоставляет переиспользуемую архитектуру для API-взаимодействия и поддерживает динамическую настройку для разных источников данных.

---

## 📋 Особенности

- **Задержка запросов к API**: Уменьшает количество запросов, ожидая завершения ввода.
- **Использование composable**: Легко интегрируется в другие компоненты для работы с API.
- **Поддержка разных API**: Позволяет настраивать трансформацию данных и проверку параметров запроса.
- **Адаптивный интерфейс**: UI корректно отображается на всех устройствах.
- **Обработка ошибок**: Удобные сообщения для пользователей.
- **Состояние загрузки**: Показывает индикатор загрузки.
- **Переиспользуемость компонента**: возможность подстроить саджест под свои нужды

---

## 📁 Структура проекта

```plaintext
project
├── src
│   ├── components
│   │   ├── VSuggest.vue
│   │   ├── VSuggestItem.vue
│   │   ├── VTag.vue
│   │   ├── VLoader.vue
│   ├── composables
│   │   └── useGetFetchSuggestions.ts
│   ├── utils
│   │   └── debounce.ts
│   ├── types
│   │   └── index.ts
│   ├── App.vue
│   └── main.ts
├── public
│   └── assets
│       └── no-photo.png
├── package.json
└── README.md

# Vue Suggestions Component with Debounce and API Integration

Этот проект реализует компонент на Vue 3 для отображения предложений из API, включая задержку запросов (debounce), адаптивный интерфейс, обработку ошибок и загрузок. Компонент предоставляет переиспользуемую архитектуру для API-взаимодействия и поддерживает динамическую настройку для разных источников данных.

---

## 🔧 Компоненты

### 1. **VSuggest.vue**

Основной компонент, обрабатывающий ввод и отображающий список предложений.

#### 🔑 Ключевые возможности:
- Поле ввода с задержкой запросов (debounced fetchSuggestions).
- Интеграция с компонентами `VLoader` и `VSuggestItem`.
- Динамическая обработка ошибок и пустых состояний.

#### Пример кода:
```vue
<template>
  <main>
    <section>
      <div>
        <label for="suggest" class="label_description">
          <span>*</span>
          Пользователь или компания
        </label>
        <br />
        <div class="input_block">
          <VTag @removeItem="removeItem" :listItem="listItem" />

          <input
            id="suggest"
            type="text"
            ref="inputUserValue"
            v-model="query"
            @input="debouncedFetchSuggestions"
            :disabled="listItem.length >= 1"
            :placeholder="listItem.length >= 1 ? '' : 'Введите логин'"
            @keydown.enter.prevent="addItemToList(query)"
            aria-autocomplete="list"
            aria-expanded="true"
          />
          <VLoader v-if="isLoading" />
        </div>
        <p v-if="error" class="error-message">{{ error }}</p>
      </div>
      <VSuggestItem :responseData="responseData" @selectedItem="addItemToList" v-if="flagActiveList" />
    </section>
  </main>
</template>
```