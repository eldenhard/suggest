/**
 * @description  
 *   Оборачивает входящую функцию в debounce, так что она вызывается только после определенного времени после последнего вызова.  
 *   Это полезно для API, так как мы уменьшаем нагрузку на сервер частыми запросами
 * @param {Function} fn Функция, над которой будет debounce
 * @param {number} delay Время (в мс), которое нужно подождать перед вызовом debounce 
 * @returns {Function} debounce функция 
 * @example  
 *   const debouncedFetch = debounce(fetch, 500);  
 *   window.addEventListener('scroll', debouncedFetch);
 */

export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): T {
  
    let timeout: ReturnType<typeof setTimeout>;
  
    return ((...args: Parameters<T>): ReturnType<T> | void => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    }) as T;
  }
  
  