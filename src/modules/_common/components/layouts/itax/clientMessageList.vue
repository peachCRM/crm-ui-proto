<template>
  <div class="w-[340px] pr-3 bg-white rounded-custom8 dark:bg-black141414">
    <!-- S : SEARCH -->
    <div class="font-semibold text-fontsize18 leading-line32 dark:text-grayd9d9d9">발신 정보</div>
    <div class="flex flex-wrap border-t border-customGrayE4E dark:border-gray424242 mb-2">
      <div
        class="grow flex flex-row items-center w-full text-fontsize14 leading-[22px] border-b border-customGrayE4E dark:border-gray424242"
      >
        <div
          class="shrink-0 flex items-center w-[110px] h-full p-2 text-customGray595 bg-[#F5F5F5] dark:text-graya6a6a6 dark:bg-black141414"
        >
          발신 번호
        </div>
        <div class="flex-grow flex flex-col gap-2 p-2 text-customGray1f1">
          <div class="flex flex-row gap-1.5 items-center w-[200px]">
            <WorkSelectboxComponent
              v-model="useMessaging.senderNumberSelected"
              :options="senderNumberOptions"
            />
          </div>
        </div>
      </div>
      <div
        class="grow flex flex-row items-center w-full text-fontsize14 leading-[22px] border-b border-customGrayE4E dark:border-gray424242"
      >
        <div
          class="shrink-0 flex items-center w-[110px] h-full p-2 text-customGray595 bg-[#F5F5F5] dark:text-graya6a6a6 dark:bg-black141414"
        >
          발신 수단
        </div>
        <div class="flex-grow flex flex-col gap-2 p-2 text-customGray1f1">
          <div class="flex flex-row gap-1.5 items-center w-[200px]">
            <WorkCheckboxComponent
              v-model="useMessaging.checkedList.sms"
              label="문자"
              value="sms"
              class="pr-1"
            />
            <WorkCheckboxComponent
              v-model="useMessaging.checkedList.at"
              label="알림톡"
              value="at"
            />
          </div>
        </div>
      </div>
      <div
        class="grow flex flex-row items-center w-full text-fontsize14 leading-[22px] border-b border-customGrayE4E dark:border-gray424242"
      >
        <div
          class="shrink-0 flex items-center w-[110px] h-full p-2 text-customGray595 bg-[#F5F5F5] dark:text-graya6a6a6 dark:bg-black141414"
        >
          템플릿
        </div>
        <div class="flex-grow flex flex-col gap-2 p-2 text-customGray1f1">
          <div class="flex flex-row gap-1.5 items-center w-[200px]">
            <WorkSelectboxComponent
              v-model="selectedTemplate"
              :options="templateOptions"
              @change="changeTemplate"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-if="sendProps === null" class="mb-2">
      <WorkButtonComponent
        color="btn_search_md"
        class="w-full flex justify-center items-center"
        @click="modalClientList"
      >
        <img src="../../../../../assets/images/workspace/inc/button_add.svg" />
        수신 수임업체 추가
      </WorkButtonComponent>
    </div>
    <!-- E : SEARCH -->

    <!-- S : TABLE -->
    <div class="font-semibold text-fontsize18 leading-line32 dark:text-grayd9d9d9">
      수신 대상
      <span class="text-fontsize12 leading-line20 text-customgray8c8 dark:text-gray727272">
        수임업체를 선택하여 내용을 편집할 수 있습니다.
      </span>
    </div>

    <div
      class="table_work flex flex-col gap-4 min-w-[328px] h-[395px] overflow-y-auto scrollbar-thin"
    >
      <table class="relative w-full">
        <colgroup>
          <col style="width: 45px" />
          <col style="width: auto" />
          <col style="width: 45px" />
        </colgroup>
        <thead>
          <tr>
            <th class="sticky top-0">구분</th>
            <th class="sticky top-0">수임업체</th>
            <th class="sticky top-0">삭제</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="useMessaging.sendSelectList.length > 0">
            <tr
              v-for="item in useMessaging.sendSelectList"
              :key="item.clientSeq"
              :class="{ trSelect: item.clientSeq === useMessaging.selectOnly.clientSeq }"
              style="cursor: pointer"
              @click="selectOnly(item)"
            >
              <td><TaxiBizType v-if="item.bizType" :biz-type="item.bizType" /></td>
              <td class="text-left">
                <CommonBtnType
                  v-if="item.addrs.length === 0"
                  btn-type="status"
                  code="Y"
                  text="미등록"
                  class="mr-1"
                />
                <span :class="{ 'text-grayd9d9d9': !item.addrs.length }">{{
                  item.clientName
                }}</span>
              </td>
              <td>
                <IconTrash
                  class="cursor-pointer"
                  color="#FF6F6F"
                  size="22px"
                  @click.stop.prevent="removeItem(item)"
                />
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td colspan="3" class="text-center">
                <div class="flex flex-col gap-4 justify-center items-center h-[100px]">
                  <div class="text-fontsize14 text-customgray8c8 leading-line22 text-center">
                    수신 수임업체를 추가해주세요.
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <!-- E : TABLE -->
  </div>

  <PModal
    v-model="isOpenInsert"
    :title="title"
    :box-width="boxWidth"
    :current-comp="currentComp"
    :btn-close="btnClose"
    :btn-save="btnSave"
    :modal-props="modalProps"
    :btn-save-text="btnSaveText"
    @fn-save-load="clientSelectItem"
  >
  </PModal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, shallowRef } from 'vue';
import modalClientListComponent from './modal.clientMessageList.vue';
import { useMessagingPopbillStore } from '@/modules/common/store/messagingPopbill.store.ts';
import { usePlatformStore } from '@/modules/platform/store/platform.store.ts';
import TaxiBizType from '@/modules/_common/components/layouts/itax/bizType.vue';
import PModal from '@/modules/_common/components/modal/p-modal.vue';
import { kakaoTemplate } from '@/modules/common/services/useSendMessage.ts';

import { Utils } from '@/utils/utils.ts';

const props = defineProps<{
  sendProps: any;
}>();

const platformStore = usePlatformStore();

// 발신번호 리스트
const useMessaging = useMessagingPopbillStore();
const senderNumberList = ref<any[]>(useMessaging.senderNumberList);
const senderNumberOptions = computed(() => {
  const options = senderNumberList.value.map((item) => ({
    text: Utils.formatHyphen(item.number),
    value: item.number
  }));
  return [...options];
});

// 대표 발신번호 선택
useMessaging.senderNumberSelected = ref(
  senderNumberList.value.length === 1
    ? senderNumberList.value[0].number
    : senderNumberList.value.find((item) => item.representYN === true)?.number ||
        senderNumberList.value[0]?.number
);

// 발송 항목 체크
useMessaging.checkedList = {
  at: ref('at'),
  sms: ref('')
};

// 템플릿 목록
const templateOptions = ref([
  { text: '미사용 (문자만 사용가능)', value: '' },
  { text: '업무 안내', value: '업무전달안내' },
  { text: '자료전달 안내', value: '자료전달안내' }
]);

// 발송 템플릿 선택
const selectedTemplate = ref('업무전달안내');
const changeTemplate = async () => {
  if (selectedTemplate.value === '') {
    useMessaging.objTemplate.messageTitle = '';
    useMessaging.objTemplate.selectedTemplate = '';
    useMessaging.objTemplate.selectedTemplateCode = '';
    return;
  }

  // 템플릿 목록 가져오기
  const kakaoTemplateList = await kakaoTemplate(
    useMessaging.connectPopbillData.corpNum,
    useMessaging.connectPopbillData.userID
  );

  // 템플릿이 없을 경우
  if (kakaoTemplateList.length === 0) {
    selectedTemplate.value = '';
    useMessaging.checkedList = {
      at: ref(''),
      sms: ref('sms')
    };

    templateOptions.value = templateOptions.value.filter(
      (option) => option.value !== '업무전달안내' && option.value !== '자료전달안내'
    );
  } else {
    const selectTemplate = kakaoTemplateList.find(
      (item) => item.templateName === selectedTemplate.value
    );

    const message = selectTemplate?.template;
    useMessaging.objTemplate.selectedTemplate = selectedTemplate.value;
    useMessaging.objTemplate.selectedTemplateCode = selectTemplate?.templateCode || '';
    useMessaging.objTemplate.oriMessageTitle = message || '';

    const index = message?.indexOf('드립니다.');
    if (index !== undefined && index !== -1) {
      useMessaging.objTemplate.messageTitle =
        message
          ?.substring(0, index + '드립니다.'.length)
          .replace(/\n/g, '<br>')
          .replace('#{고객명}', `담당자명(${useMessaging.selectOnly.clientName || '업체명'})`)
          .replace('#{세무사}', platformStore.platFormInfo?.bizNm || '') || '';
    }
  }
};

onMounted(() => {
  if (props.sendProps !== null) {
    if (props.sendProps.length === 0) return;

    selectedTemplate.value = props.sendProps[0].selectedTemplate;
  }
  changeTemplate();
});

const clientSelectItem = () => {
  if (useMessaging.sendSelectList.length !== 0) {
    useMessaging.selectOnly = useMessaging.sendSelectList[0];
  } else {
    useMessaging.selectOnly = {
      messageContent: '',
      chk: false,
      addrs: []
    };
  }

  changeTemplate();
};

const selectOnly = (item: any) => {
  useMessaging.selectOnly = item; // 선택된 템플릿

  changeTemplate();
};

// 선택된 항목을 제거
const removeItem = (item: any) => {
  useMessaging.sendSelectList = useMessaging.sendSelectList.filter(
    (selectedItem: any) => selectedItem.clientSeq !== item.clientSeq
  );

  if (useMessaging.selectOnly.clientSeq === item.clientSeq) {
    useMessaging.selectOnly = {
      messageContent: '',
      chk: false,
      addrs: []
    };

    changeTemplate();
  }
};

/**
 * 모달창 열기 제어
 */
const isOpenInsert = ref(false); // 모달창 열기
const title = ref('수임업체 조회');
const boxWidth = ref('700');
const currentComp = shallowRef();
const btnSave = ref(true);
const btnClose = ref(true);
const modalProps = ref<any>();
const btnSaveText = ref('선택완료');

const modalClientList = () => {
  useMessaging.selectList = [...useMessaging.sendSelectList];

  currentComp.value = modalClientListComponent;
  isOpenInsert.value = true;
};
</script>

<style scoped lang="scss">
.trSelect > td {
  background-color: #e6f4ff;
}
</style>
