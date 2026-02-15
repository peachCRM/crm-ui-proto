<template>
  <div
    v-if="isFullScreenPopupOpen"
    :class="hasTestNtClass ? 'show-left-nav' : 'hidden-left-nav'"
    class="full-screen-popup"
  >
    <!-- <span class="spinner-border spinner-border-lg submit-spinner" role="status"></span> -->
    <div class="flex items-center justify-center">
      <button
        type="button"
        class="inline-flex items-center px-10 py-8 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150 cursor-not-allowed w-[250px]"
      >
        <svg
          class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        잠시만 기다려주세요...
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
defineComponent({
  name: 'FullLoding'
});
defineProps({
  isFullScreenPopupOpen: {
    type: Boolean,
    default: false,
    required: true
  }
});

const hasTestNtClass = ref(true);

const observerCallback = (mutations: any) => {
  mutations.forEach((mutation: any) => {
    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
      const hasSideBar = document.body.classList.contains('toggle-sidebar');
      hasTestNtClass.value = !hasSideBar;
      if (window.innerWidth <= 1200) checkScreenWidth();
    }
  });
};

const observer = new MutationObserver(observerCallback);
onMounted(() => {
  // observer.observe(document.body, { attributes: true });
  window.addEventListener('resize', () => {
    checkScreenWidth();
  });
  checkScreenWidth();
});

const route = useRoute();

const checkScreenWidth = () => {
  if (route.meta.fullPage === true) {
    // full 페이지 일 경우
    hasTestNtClass.value = false;
  } else {
    hasTestNtClass.value = window.innerWidth >= 1200;
  }
};

onUnmounted(() => {
  observer.disconnect();
});
</script>

<style scoped lang="scss">
.show-left-nav {
  //left: 240px;
  //width: calc(100vw - 240px);
  width: 100vw;
}
.hidden-left-nav {
  left: 0;
  width: 100vw;
}
.full-screen-popup {
  position: fixed;
  top: 0;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
}
</style>
