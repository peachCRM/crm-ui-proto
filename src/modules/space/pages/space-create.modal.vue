<template>
  <u-modal
    v-model:open="isOpen"
    title="새 워크스페이스 생성"
    :ui="{ content: 'sm:max-w-lg w-full' }"
  >
    <template #body>
      <div class="space-y-4">
        <u-form-field label="스페이스 이름" required>
          <u-input
            v-model="formData.spaceName"
            placeholder="스페이스 이름을 입력하세요"
            class="w-full"
          />
        </u-form-field>

        <u-form-field label="CRM 유형" required>
          <div class="grid grid-cols-3 gap-3">
            <div
              v-for="type in spaceTypeOptions"
              :key="type.value"
              :class="[
                'p-4 rounded-xl border cursor-pointer text-center transition-all duration-200',
                formData.spaceType === type.value
                  ? 'border-[#287dff] bg-blue-50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              ]"
              @click="formData.spaceType = type.value"
            >
              <div class="text-2xl mb-2">{{ type.icon }}</div>
              <p class="text-sm font-medium text-gray-800">{{ type.label }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ type.desc }}</p>
            </div>
          </div>
        </u-form-field>

        <u-form-field label="설명">
          <u-textarea
            v-model="formData.description"
            placeholder="워크스페이스에 대한 설명 (선택)"
            :rows="3"
            class="w-full"
          />
        </u-form-field>
      </div>
    </template>

    <template #footer>
      <u-button color="neutral" variant="outline" @click="close">취소</u-button>
      <u-button color="primary" @click="register">생성</u-button>
    </template>
  </u-modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useSpaceStore } from '../store/space.store';
import type { SpaceInsertDto, SpaceType } from '../type/space.type';

interface Props {
  open: boolean;
}
const props = defineProps<Props>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  'create-ok': [];
}>();

const spaceStore = useSpaceStore();

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
});

const formData = ref<SpaceInsertDto>({
  spaceName: '',
  spaceType: 'basic',
  description: ''
});

const spaceTypeOptions: { value: SpaceType; label: string; icon: string; desc: string }[] = [
  { value: 'basic', label: '기본 CRM', icon: '💼', desc: '범용 고객 관리' },
  { value: 'pilates', label: '필라테스', icon: '🧘', desc: '수업/멤버십 관리' },
  { value: 'realestate', label: '부동산', icon: '🏢', desc: '매물/매칭 관리' }
];

const register = async () => {
  if (!formData.value.spaceName.trim()) return;
  await spaceStore.insert(formData.value);
  emit('create-ok');
  close();
};

const close = () => {
  isOpen.value = false;
};

watch(
  () => props.open,
  (newValue) => {
    if (newValue) {
      formData.value = { spaceName: '', spaceType: 'basic', description: '' };
    }
  }
);
</script>
