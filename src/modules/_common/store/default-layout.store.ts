import { defineStore } from 'pinia';

export enum MessageType {
  Alert = 'alert',
  Warning = 'warning',
  Confirm = 'confirm',
  Delete = 'Delete'
}

export const useDefaultLayoutStore = defineStore('default-layout', {
  state: () => ({
    isLoading: false,
    modalStates: {
      [MessageType.Alert]: false,
      [MessageType.Confirm]: false,
      [MessageType.Warning]: false,
      [MessageType.Delete]: false
    },
    AlertMessage: '',
    SubMessage: '',
    returnUrl: ''
  }),
  getters: {
    confirmKey(state) {
      return state.modalStates[MessageType.Confirm]
        ? 'confirm'
        : state.modalStates[MessageType.Delete]
          ? 'delete'
          : '';
    },
    alertKey(state) {
      return state.modalStates[MessageType.Alert]
        ? 'alert'
        : state.modalStates[MessageType.Warning]
          ? 'warning'
          : '';
    }
  },
  actions: {
    loading(isLoading: boolean, isUse: boolean = false) {
      if (isUse) {
        this.isLoading = isLoading;
        // 10초 후 로딩 닫기
        // setTimeout(() => (this.isLoading = false), 10000);
      }
    },

    modalMsg(
      messageType: MessageType,
      AlertMessage?: string,
      returnUrl?: string,
      SubMessage?: string
    ) {
      Object.keys(this.modalStates).forEach((key) => {
        this.modalStates[key as MessageType] = false;
      });

      this.modalStates[messageType] = true;

      this.AlertMessage = AlertMessage || '';
      this.SubMessage = SubMessage || '';

      if (returnUrl) {
        this.returnUrl = returnUrl || '';
      }
    }
  }
});
