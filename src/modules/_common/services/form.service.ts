import { validateSync } from 'class-validator';
import { useDefaultLayoutStore, MessageType } from '../store/default-layout.store.ts';
import { useToastStore } from '../store/toast.ts';
import type { FormErrorEvent } from '@nuxt/ui';
import * as yup from 'yup';

type ValidatorClass = new () => any;

interface ValidationResult {
  isSuccess: boolean;
  name?: string;
  message?: string;
  property?: string;
}

export class FormService {
  static async loading(callback: any, isUse: boolean = true): Promise<void> {
    const defaultLayoutStore = useDefaultLayoutStore();
    try {
      defaultLayoutStore.loading(true, isUse);
      await callback();
      // eslint-disable-next-line no-useless-catch
    } catch (error) {
      // console.error('An error occurred during the async operation:', error);
      throw error; // Optional: Re-throw the error if you want it to propagate
    } finally {
      defaultLayoutStore.loading(false, isUse);
    }
  }

  static async validateForm<T>(
    data: T,
    validator: yup.ObjectSchema<any>,
    errors: { [key: string]: string } = {}
  ): Promise<boolean> {
    try {
      // yup으로 유효성 검사 실행
      await validator.validate(data, { abortEarly: false });
      return true; // 유효성 검사 통과
    } catch (validationError) {
      // 에러 메시지 초기화
      if (errors) {
        Object.keys(errors).forEach((key) => {
          errors[key] = '';
        });
      }

      // yup 유효성 검사 에러 처리
      if (validationError instanceof yup.ValidationError) {
        validationError.inner.forEach((err) => {
          if (err.path && errors && err.path in errors) {
            console.log('err.path', err.path);
            errors[err.path] = err.message;
          }
        });
      }

      return false; // 유효성 검사 실패
    }
  }

  static validate(checkData: any, validatorClass: ValidatorClass, formName: string) {
    const defaultLayoutStore = useDefaultLayoutStore();
    const valid: ValidationResult = this.#validator(checkData, validatorClass);
    if (!valid.isSuccess) {
      // alert(valid.message);
      defaultLayoutStore.modalMsg(MessageType.Warning, valid.message);

      const unsubscribe = defaultLayoutStore.$subscribe((_, state) => {
        if (state.AlertMessage === valid.message) {
          this.#focusAndHighlightElement(formName, valid.property);
          unsubscribe();
        }
      });
    }
    return valid.isSuccess;
  }

  static toastMessage(message: string, msgType: 'success' | 'error' | 'info' = 'info') {
    const toastStore = useToastStore();
    toastStore.showToast(message, msgType);
  }

  static onError(event: FormErrorEvent) {
    const defaultLayoutStore = useDefaultLayoutStore();
    const errorItem = event.errors[0];

    if (errorItem) {
      defaultLayoutStore.modalMsg(MessageType.Warning, errorItem.message);
    }

    let element = null;

    // id로 먼저 시도, 실패하면 name으로 시도
    if (errorItem.id) {
      element = document.getElementById(errorItem.id);
    }

    if (!element && errorItem.name) {
      element = document.querySelector(`[name="${errorItem.name}"]`);
    }

    // 포커스 및 스크롤
    if (element) {
      (element as HTMLElement).focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      console.warn(
        `Could not find element for error field: ${errorItem.name} (id: ${errorItem.id})`
      );
    }
  }

  static #validator(params: any, Validator: any) {
    const validateObj = new Validator();
    Object.keys(validateObj).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined) {
        validateObj[key] = params[key];
      }
    });
    const errs = validateSync(validateObj);
    if (errs && errs.length && errs[0].constraints) {
      const errors = errs[0].constraints;
      const key = Object.keys(errors)[0];
      return { isSuccess: false, name: key, message: errors[key], property: errs[0].property };
    }
    return { isSuccess: true };
  }

  static #focusAndHighlightElement(formName: string, elementName: string | undefined) {
    const form: HTMLFormElement | null = document.querySelector(`form[name="${formName}"]`);
    if (!form || !elementName) return;
    form?.querySelectorAll(`[name="${elementName}"]`).forEach((element: Element) => {
      if (element.tagName === 'INPUT' && (element as HTMLInputElement).type === 'checkbox') {
        this.#focusAndHighlightElementBorder(element.parentElement, true);
      } else if (element.tagName === 'INPUT' && (element as HTMLInputElement).type === 'radio') {
        this.#focusAndHighlightElementBorder(element.parentElement, true);
      } else {
        this.#focusAndHighlightElementBorder(element as HTMLElement);
      }
    });
  }

  static #focusAndHighlightElementBorder(
    element: HTMLElement | null,
    isBorderSetting: boolean = false
  ) {
    if (element === null) return;

    // Focus the element
    element.focus();

    // Select the element if it supports the select method
    if ('select' in element) {
      (element as HTMLInputElement).select();
    }

    // Highlight the border
    element.style.borderColor = 'red';
    if (isBorderSetting) {
      element.style.borderWidth = '1px';
      element.style.borderStyle = 'solid';
    }

    setTimeout(() => {
      element.style.borderColor = '';
      if (isBorderSetting) {
        element.style.borderWidth = '0';
        element.style.borderStyle = 'none';
      }
    }, 500);
  }
}
