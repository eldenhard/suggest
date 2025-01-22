import type { Directive } from "vue";

const clickOutsideDirective: Directive = {
  beforeMount(el, binding) {
    el.clickOutsideHandler = (event: MouseEvent) => {
      const target = event.target as Node;

      // Игнорируем клики внутри элемента
      if (el === target || el.contains(target)) {
        return;
      }

      // Проверяем, если указан элемент-исключение
      const excludedElements = binding.arg as HTMLElement[] | undefined;
      if (excludedElements && excludedElements.some((excludedEl) => excludedEl.contains(target))) {
        return;
      }

      // Вызываем переданную функцию
      binding.value(event);
    };

    el.escKeyHandler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        binding.value(event);
      }
    };

    document.addEventListener("click", el.clickOutsideHandler);
    document.addEventListener("keydown", el.escKeyHandler);
  },
  unmounted(el) {
    document.removeEventListener("click", el.clickOutsideHandler);
    document.removeEventListener("keydown", el.escKeyHandler);
  },
};

export default clickOutsideDirective;
