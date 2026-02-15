<template>
  <div class="flex items-start justify-center gap-1">
    <div class="flex gap-2.5 cursor-pointer">
      <img
        src="../../../../assets/images/inc/paging_arrow.svg"
        class="cursor-pointer"
        alt="이전"
        @click="prevPage"
      />
    </div>

    <div class="flex items-start justify-center gap-1">
      <template v-for="index in pageList" :key="index">
        <div
          class="cursor-pointer flex items-center justify-center min-w-6 h-6 px-1.5 font-light text-fontsize14 leading-[22px] text-customGray1f1 rounded-custom6 hover:border-customSkyBlue2 hover:text-colorPrimary dark:text-grayd9d9d9"
          :class="{
            'font-semibold text-customSkyBlue2 border border-customSkyBlue2 bg-white dark:board-customBlue167 dark:text-customVioletPrimary dark:bg-black141414':
              Number(currentPage) === index
          }"
          @click="movePage(index)"
        >
          {{ index }}
        </div>
      </template>
    </div>

    <div class="flex gap-2.5 cursor-pointer">
      <img
        src="../../../../assets/images/inc/paging_arrow.svg"
        class="cursor-pointer rotate-180"
        alt="다음"
        @click="nextPage"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineComponent } from 'vue';
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

defineComponent({
  name: 'PaginationWork'
});

const props = defineProps({
  customClass: {
    type: String,
    default: ''
  },
  currentPage: {
    type: [Number, String],
    default: 1
  },
  totalCount: {
    type: [Number, String],
    required: true
  },
  itemsPerPage: {
    type: [Number, String],
    default: 1
  },
  maximumVisiblePages: {
    type: Number,
    default: 5
  }
});

const getCurrentPage = computed(() => {
  const page = Number(props.currentPage);
  return isNaN(page) || page <= 0 ? 1 : page;
});

const getItemsPerPage = computed(() => {
  const items = Number(props.itemsPerPage);
  return isNaN(items) || items <= 0 ? 1 : items;
});

const getTotalCount = computed(() => {
  const count = Number(props.totalCount);
  return isNaN(count) || count <= 0 ? 1 : count;
});

const totalPage = computed(() => Math.ceil(getTotalCount.value / getItemsPerPage.value));
const pageList = computed(() => {
  const pageGroup = Math.ceil(getCurrentPage.value / props.maximumVisiblePages);
  const startPage = pageGroup * props.maximumVisiblePages - props.maximumVisiblePages;
  const lastPage = Math.min(startPage + props.maximumVisiblePages, totalPage.value);
  return new Array(lastPage - startPage).fill(0).map((_, i) => i + startPage + 1);
});

const emit = defineEmits<{ (event: 'move', value: number): void }>();

const movePage = (page: number) => emit('move', page);
// const firstPage = () => movePage(1);
const prevPage = () => {
  if (getCurrentPage.value === 1) return;
  movePage(getCurrentPage.value - 1);
};
const nextPage = () => {
  if (getCurrentPage.value === totalPage.value) return;
  movePage(getCurrentPage.value + 1);
};

// const lastPage = () => movePage(totalPage.value);
</script>

<style lang="scss" scoped></style>
