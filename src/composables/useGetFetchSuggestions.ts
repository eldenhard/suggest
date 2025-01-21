import { ref } from "vue";

/**
 * Функция для загрузки данных из API
 *
 * @param {fetchConfig} - Объект с настройками
 * @param {string} fetchConfig.apiUrl - Базовый URL API
 * @param {function} [fetchConfig.transformResponse] - Функция для обработки ответа
 * @param {function} [fetchConfig.validateQueryParams] - Функция для валидации запроса
 *
 * @returns {object} - Объект со свойствами:
 *   isLoading - состояние загрузки,
 *   error - ошибка,
 *   responseData - полученные данные,
 *   fetchSuggestions - функция для загрузки данных
 */
interface FetchSuggestionsOptions<T> {
  apiUrl: string;
  transformResponse?: (data: any) => T[];
  validateQueryParams?: (query: string) => boolean;
} 
export function useGetFetchSuggestions<T = unknown>(
  fetchConfig: FetchSuggestionsOptions<T>
) {
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const responseData = ref<T[]>([]);
  
  const fetchSuggestions = async (query: string) => {
    if (fetchConfig.validateQueryParams && !fetchConfig.validateQueryParams(query)) {
      responseData.value = [];
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${fetchConfig.apiUrl}?q=${encodeURIComponent(query)}`, {
        method: "GET",
      });

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error("Некорректный запрос. Проверьте введенные данные.");
        } else if (response.status === 500) {
          throw new Error("Ошибка сервера. Попробуйте позже.");
        } else {
          throw new Error(`Ошибка: ${response.statusText}`);
        }
      }

      const data = await response.json();
      responseData.value = fetchConfig.transformResponse
        ? fetchConfig.transformResponse(data)
        : data;

      if (responseData.value.length === 0) {
        error.value = "Упс... По вашему запросу ничего не нашлось.";
      }
    } catch (err) {
      error.value = (err as Error).message || "Произошла неизвестная ошибка.";
      responseData.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    error,
    responseData,
    fetchSuggestions,
  };
}