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
│   │   ├── VCompanyEntity.vue
│   │   ├── VUserEntity.vue
│   ├── composables
│   │   └── useGetFetchSuggestions.ts
│   ├── utils
│   │   └── debounce.ts
│   │   └── clickOutside.ts
│   ├── types
│   │   └── index.ts
│   ├── App.vue
│   └── main.ts
├── public
│   └── assets
│       └── images
│            └── noPhoto.png
│       └── styles
│            └── style.css
│            └── suggestItemStyle.css
├── package.json
└── README.md
```

## 🔧 Компоненты

### 0. **App.vue**
Стартовый компонент
```vue
<template>
    <VSuggest :inputLabel="'Пользователь или компания'" 
      :tagAmount="1" 
      :placeholderSuggest="'Введите логин'" 
      :apiUrl="'https://habr.com/kek/v2/publication/suggest-mention'"   
      />
</template>
```
#### 🔑 Ключевые возможности:
- Возможность настройки количества сущностей допустимых для выбора
- Возможность настройки placeholder и label 
- Возможность передачи других URl, но с идентичной структурой

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
### 2. VSuggestItem.vue
Компонент для отображения списка предложений.

#### 🛠️ Свойства:
responseData: массив предложений из API.

#### 🎯 События:
@selectedItem: отправляет выбранное предложение обратно в родительский компонент.

### 3. VLoader.vue
Простой компонент, отображающий индикатор загрузки.

### 4. VTag.vue
Компонент для отображения выбранных тегов с возможностью их удаления.

### 4. VCompanyEntity.vue
Компонент для отображения данных когда тип = компания

### 4. VUserEntity.vue
Компонент для отображения данных когда тип != компания

## 📜 Composables
### useGetFetchSuggestions.ts
Composable для взаимодействия с API.

#### 🔧 Параметры:
``` typescript
interface FetchSuggestionsOptions<T> {
  apiUrl: string; // URL API
  transformResponse?: (data: any) => T[]; // Логика трансформации данных
  validateQueryParams?: (query: string) => boolean; // Логика проверки запроса
}
```

####  🛠️ Возвращаемые данные:
``` typescript
{
  isLoading: Ref<boolean>,
  error: Ref<string | null>,
  responseData: Ref<T[]>,
  fetchSuggestions: (query: string) => void
}
```
Пример использования:

``` typescript
const { isLoading, error, responseData, fetchSuggestions } = useGetFetchSuggestions({
  apiUrl: "https://api.example.com/suggestions",
  transformResponse: (data) => data.items,
  validateQueryParams: (query) => query.length >= 3,
});
```

## ⚙️ Утилиты
### debounce.ts
Функция для задержки выполнения запросов.

Пример кода:
```typescript

export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  let timeout: ReturnType<typeof setTimeout>;

  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  }) as T;
}
```

## 🎨 Стили
### Пример адаптивного дизайна:

```css
.suggest-container {
  width: clamp(20%, 35%, 80%);
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em,
              rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em,
              rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;
  overflow-y: auto;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .suggest-container {
    width: 80%;
  }
}
```

## 📡 Работа с API
### Конфигурация API:

```typescript

const { isLoading, error, responseData, fetchSuggestions } = useGetFetchSuggestions({
  apiUrl: "https://habr.com/kek/v2/publication/suggest-mention",
  transformResponse: (data) => data.data,
  validateQueryParams: (query) => query.trim().length >= 3,
});
```
### Обработка ошибок:
400 Error: Отображает сообщение "Некорректный запрос. Повторите попытку."
500 Error: Отображает сообщение "Ошибка сервера. Повторите позже."


## 🛠 Установка проекта
### Клонируйте репозиторий:

``` bash
git clone https://github.com/eldenhard/suggest.git
```
### Установите зависимости:

```bash
npm install
```

### Запустите сервер разработки:

``` bash
npm run dev
```

