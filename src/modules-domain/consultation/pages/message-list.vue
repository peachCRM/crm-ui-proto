<template>
  <div class="mb-6">
    <p-bread-crumb
      :breadcrumbs="[{ title: '상담관리' }, { title: '알림톡/SMS' }]"
      title="알림톡/SMS"
    />
  </div>
  <div class="rounded-custom8 dark:bg-black141414 w-full bg-white">
    <!-- 검색 영역 -->
    <form @submit.prevent="listAction" class="space-y-3 p-6">
      <div class="flex w-full flex-col items-center gap-3 lg:flex-row">
        <div class="w-20 shrink-0 font-semibold text-gray-600">키워드</div>
        <div class="flex w-full items-center gap-2">
          <p-input-box
            v-model="listParams.keyword"
            placeholder="고객명, 내용 검색"
            class="w-full lg:w-[220px]"
          />
          <p-nuxt-select
            v-model="listParams.messageType"
            :options="messageTypeOptions"
            class="w-full lg:w-[120px]"
            @change="listAction"
          />
          <u-button type="submit" color="primary" class="whitespace-nowrap">검색</u-button>
          <u-button
            color="primary"
            variant="soft"
            icon="i-lucide-rotate-ccw"
            label="초기화"
            @click="resetAction"
          />
          <u-button
            color="primary"
            icon="i-lucide-plus"
            label="새 메시지 발송"
            @click="goSend"
          />
        </div>
      </div>
    </form>

    <!-- 테이블 영역 -->
    <div class="px-6 pb-6">
      <div class="flex items-center justify-between py-3">
        <p-nuxt-select
          v-model="listParams.row"
          :options="rowList"
          value-key="value"
          class="w-22"
          @change="listAction"
        />
      </div>

      <div v-if="messageListData.length > 0">
        <u-table
          :data="messageListData"
          :columns="columns"
          class="max-h-[600px] flex-1"
        />
      </div>

      <div v-else class="py-5 text-center">
        <u-card>
          <div class="mt-5 mb-5">조회된 내역이 없습니다.</div>
        </u-card>
      </div>

      <div v-if="messageListData.length > 0" class="flex justify-center py-3">
        <u-pagination
          v-model:page="listParams.page"
          :items-per-page="listParams.row"
          :total="messageTotalRow"
          @update:page="listMovePage"
        />
      </div>
    </div>
  </div>

  <!-- 메시지 발송 모달 -->
  <message-send-modal v-model:open="isOpenSend" @send-ok="listAction" />
</template>

<script setup lang="ts">
import { computed, h, ref, resolveComponent, watch } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { FormService } from '@/modules/_common/services/form.service.ts';
import { useConsultationStore } from '../store/consultation.store';
import type { ConsultationMessage, MessagePagingDto } from '../type/consultation.type';
import type { TableColumn } from '@nuxt/ui';
import PBreadCrumb from '@/modules/_common/components/layouts/p-bread-crumb.vue';
import PInputBox from '@/modules/_common/components/forms/p-input-box.vue';
import PNuxtSelect from '@/modules/_common/components/forms/p-nuxt-select.vue';
import MessageSendModal from './message-send.modal.vue';

const router = useRouter();
const consultationStore = useConsultationStore();

const listParams = ref<MessagePagingDto>({
  keyword: '',
  messageType: '',
  sortBy: 'insertDate',
  sortType: 'desc',
  sortData: 'insertDate,desc',
  row: 10,
  page: 1,
  time: ''
});

const isOpenSend = ref(false);

const messageListData = computed(() => consultationStore.messageListData);
const messageTotalRow = computed(() => consultationStore.messageTotalRow);

const messageTypeOptions = [
  { text: '전체', value: '' },
  { text: '알림톡', value: '알림톡' },
  { text: 'SMS', value: 'SMS' },
  { text: '이메일', value: '이메일' }
];

const rowList = [
  { text: '10개', value: 10 },
  { text: '20개', value: 20 },
  { text: '30개', value: 30 }
];

/** 발송상태별 UBadge 색상 */
const sendStatusColor = (status: string) => {
  const map: Record<string, string> = {
    대기: 'warning',
    발송: 'success',
    실패: 'error',
    취소: 'neutral'
  };
  return map[status] || 'neutral';
};

const columns: TableColumn<ConsultationMessage>[] = [
  {
    accessorKey: 'messageSeq',
    header: '번호',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } }
  },
  {
    accessorKey: 'customerName',
    header: '고객명',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } }
  },
  {
    accessorKey: 'messageType',
    header: '유형',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } }
  },
  {
    accessorKey: 'templateName',
    header: '템플릿',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } }
  },
  {
    accessorKey: 'content',
    header: '내용',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } },
    cell: ({ row }) => {
      const content = row.original.content;
      return content.length > 30 ? content.substring(0, 30) + '...' : content;
    }
  },
  {
    accessorKey: 'sendStatus',
    header: '발송상태',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } },
    cell: ({ row }) => {
      const UBadge = resolveComponent('UBadge');
      return h(
        UBadge,
        {
          color: sendStatusColor(row.original.sendStatus),
          variant: 'subtle',
          size: 'xs'
        },
        { default: () => row.original.sendStatus }
      );
    }
  },
  {
    accessorKey: 'sendDate',
    header: '발송일시',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } },
    cell: ({ row }) => row.original.sendDate || '-'
  }
];

const listAction = () => {
  listParams.value.time = dayjs().format('YYYYMMDDHHmmssSSS');
  router.push({ query: { ...router.currentRoute.value.query, ...listParams.value } });
};

const goSend = () => {
  isOpenSend.value = true;
};

const resetAction = () => {
  listParams.value = {
    keyword: '',
    messageType: '',
    sortBy: 'insertDate',
    sortType: 'desc',
    sortData: 'insertDate,desc',
    row: 10,
    page: 1,
    time: ''
  };
  listAction();
};

const listMovePage = (page: number) => {
  listParams.value.page = page;
  listAction();
};

const getList = async () => {
  await FormService.loading(async () => {
    await consultationStore.messageList(listParams.value);
  });
};

watch(
  () => router.currentRoute.value,
  (route) => {
    if (route.path === '/consultation/message') {
      const query = route.query;
      if (query && Object.keys(query).length > 0) {
        const { keyword, messageType, row, page, time } = query;
        Object.assign(listParams.value, {
          keyword: keyword || '',
          messageType: messageType || '',
          row: Number(row) || 10,
          page: Number(page) || 1,
          time: time || ''
        });
      }
      getList();
    }
  },
  { immediate: true, deep: true }
);
</script>
