<template>
  <button
    :disabled="isDisabled"
    :type="type"
    :class="[
      { 'rounded-full': isRound },
      { [`${color}`]: color },
      { 'opacity-50 cursor-not-allowed': isDisabled }
    ]"
    class="flex gap-1.5 items-center px-3 bg-white"
  >
    <!--    <font-awesome-icon v-if="icon" :icon="icon" class="" />-->
    <slot></slot>
  </button>
</template>
<script setup lang="ts">
import { defineComponent } from 'vue';

defineComponent({
  name: 'TaxiBtn'
});

defineProps({
  type: {
    type: String as () => 'button' | 'submit' | 'reset',
    default: 'button'
  },
  isRound: {
    type: Boolean,
    default: false
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: ''
  },
  color: {
    type: String as () =>
      | 'btn_outLine_modal_sm'
      | 'btn_outLine_default_sm'
      | 'btn_outLine_default_md'
      | 'btn_outLine_default_lg'
      | 'btn_primary_sm'
      | 'btn_primary_md'
      | 'btn_primary_lg'
      | 'btn_secondary_md'
      | 'btn_secondary_lg'
      | 'btn_tertiary_sm'
      | 'btn_tertiary_del_sm'
      | 'btn_tertiary_md'
      | 'btn_tertiary_lg'
      | 'btn_outLine_primary_md'
      | 'btn_outLine_primary_lg'
      | 'btn_search_md'
      | 'btn_search_detail_md'
      | 'btn_delete_sm'
      | 'btn_delete_md'
      | 'btn_update_sm'
      | 'btn_update_md'
      | 'btn_insert_sm'
      | 'btn_insert_md'
      | 'btn_confirm_sm_type1'
      | 'btn_confirm_sm_type2'
      | 'btn_confirm_sm_type3'
      | 'btn_confirm_sm_type4'
      | 'btn_confirm_sm_type5'
      | 'btn_excel_md',
    validator: (value: string) =>
      [
        'btn_outLine_modal_sm',
        'btn_outLine_default_sm',
        'btn_outLine_default_md',
        'btn_outLine_default_lg',
        'btn_primary_sm',
        'btn_primary_md',
        'btn_primary_lg',
        'btn_secondary_md',
        'btn_secondary_lg',
        'btn_tertiary_sm',
        'btn_tertiary_del_sm',
        'btn_tertiary_md',
        'btn_tertiary_lg',
        'btn_outLine_primary_md',
        'btn_outLine_primary_lg',
        'btn_search_md',
        'btn_search_detail_md',
        'btn_delete_sm',
        'btn_delete_md',
        'btn_update_sm',
        'btn_update_md',
        'btn_insert_sm',
        'btn_insert_md',
        'btn_confirm_sm_type1',
        'btn_confirm_sm_type2',
        'btn_confirm_sm_type3',
        'btn_confirm_sm_type4',
        'btn_confirm_sm_type5',
        'btn_excel_md'
      ].includes(value),
    default: 'btn_outLine_default_lg'
  }
});
</script>

<style scoped lang="scss"></style>
