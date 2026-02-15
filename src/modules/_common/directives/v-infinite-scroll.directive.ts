import type { DirectiveBinding, ObjectDirective, Plugin, App } from 'vue';

interface InfiniteScrollOptions {
  onScrollEnd: () => void;
  elementId?: string | null;
  threshold?: number;
  throttleDelay?: number;
}

interface ExtendedHTMLElement extends HTMLElement {
  _handleScroll?: ((event: Event) => void) | undefined;
  _checkContent?: (() => void) | undefined;
}

function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => ReturnType<T> {
  let lastFunc: ReturnType<typeof setTimeout>;
  let lastRan: number;

  return function (this: any, ...args: Parameters<T>): ReturnType<T> {
    if (!lastRan) {
      const result = func.apply(this, args);
      lastRan = Date.now();
      return result;
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(
        () => {
          if (Date.now() - lastRan >= limit) {
            const result = func.apply(this, args);
            lastRan = Date.now();
            return result;
          }
        },
        limit - (Date.now() - lastRan)
      );
      return func.apply(this, args);
    }
  };
}

const infiniteScrollDirective: ObjectDirective<ExtendedHTMLElement, InfiniteScrollOptions> = {
  mounted(el: ExtendedHTMLElement, binding: DirectiveBinding<InfiniteScrollOptions>) {
    const options = {
      threshold: 0,
      throttleDelay: 500,
      ...binding.value
    };

    const getScrollContainer = (): HTMLElement | null => {
      if (options.elementId) {
        const element = document.getElementById(options.elementId);
        if (!element) {
          // console.warn(`[v-infinite-scroll] Element with id "${options.elementId}" not found`);
        }
        return element;
      }
      return document.querySelector('.app > main');
    };

    const handleScroll = () => {
      const container = getScrollContainer() || el;
      const { scrollTop, clientHeight, scrollHeight } = container;

      if (scrollTop + clientHeight >= scrollHeight - options.threshold) {
        options.onScrollEnd();
      }
    };

    // 컨텐츠 크기 체크 함수
    const checkContent = () => {
      const container = getScrollContainer() || el;
      const { clientHeight, scrollHeight } = container;

      // 컨테이너가 컨텐츠보다 크거나 같으면 더 많은 컨텐츠가 필요
      if (clientHeight >= scrollHeight - options.threshold) {
        options.onScrollEnd();
      }
    };

    // throttle 적용
    el._handleScroll = throttle(handleScroll, options.throttleDelay) as (event: Event) => void;
    el._checkContent = checkContent;

    // 스크롤 이벤트 리스너 등록
    const container = getScrollContainer() || el;
    if (el._handleScroll) {
      container.addEventListener('scroll', el._handleScroll);
    }

    // 초기 마운트 시 컨텐츠 체크
    // Vue의 다음 틱에서 실행하여 초기 렌더링이 완료된 후 체크
    setTimeout(() => {
      if (el._checkContent) {
        el._checkContent();
      }
    }, 0);
  },

  unmounted(el: ExtendedHTMLElement, binding: DirectiveBinding<InfiniteScrollOptions>) {
    if (el._handleScroll) {
      const container =
        document.getElementById(binding.value?.elementId || '') ||
        document.querySelector('.app > main') ||
        el;
      container.removeEventListener('scroll', el._handleScroll);
    }
  },

  updated(el: ExtendedHTMLElement, binding: DirectiveBinding<InfiniteScrollOptions>) {
    // elementId가 변경되었을 때 이벤트 리스너 재설정
    if (binding.oldValue?.elementId !== binding.value.elementId) {
      if (el._handleScroll) {
        const oldContainer =
          document.getElementById(binding.oldValue?.elementId || '') ||
          document.querySelector('.app > main') ||
          el;
        oldContainer.removeEventListener('scroll', el._handleScroll);

        const newContainer =
          document.getElementById(binding.value.elementId || '') ||
          document.querySelector('.app > main') ||
          el;
        newContainer.addEventListener('scroll', el._handleScroll);
      }
    }

    // 업데이트 시 컨텐츠 크기 체크
    if (el._checkContent) {
      el._checkContent();
    }
  }
};

export const infiniteScroll: Plugin = {
  install(Vue: App) {
    Vue.directive('infinite-scroll', infiniteScrollDirective);
  }
};
