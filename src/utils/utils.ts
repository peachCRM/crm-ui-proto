// @ts-ignore
import * as forge from 'node-forge';
import type { CommonFile } from '@/modules/common/type/common-file.type.ts';
import { useApi } from '@/modules/_common/services/api.service.ts';

export class Utils {
  static formatBytes = (bytes: any) => {
    if (!bytes) return '';
    if (typeof bytes !== 'number') bytes = Number(bytes);
    if (bytes === 0) return '0 Bytes';

    const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB'];
    const i: number = Math.floor(Math.log(bytes) / Math.log(1024));
    const result: number = bytes / Math.pow(1024, i);
    const fixedResult: string = result.toFixed(2); // 결과를 소수점 두 자리까지 표시

    // 소수점 아래가 00이면 소수점을 제거
    if (fixedResult.endsWith('.00')) {
      return `${Math.round(result)}${sizes[i]}`;
    } else {
      return `${fixedResult}${sizes[i]}`;
    }
  };

  static autoHyphen(event: any) {
    const target: any = event.target;
    let phoneNumber = target.value.replace(/[^0-9]/g, ''); // 숫자 이외의 문자 제거
    if (phoneNumber.length > 2 && phoneNumber.length <= 6) {
      // 중간에 "-" 추가 (예: 010-123)
      phoneNumber = phoneNumber.replace(/(\d{3})(\d{1,3})/, '$1-$2');
    } else if (phoneNumber.length >= 7) {
      // 중간에 "-" 추가 (예: 010-1234-5678)
      phoneNumber = phoneNumber.replace(/(\d{3})(\d{4})(\d{0,4})/, '$1-$2-$3');
    }
    target.value = phoneNumber;
  }

  static formatHyphen(data: any) {
    let phoneNumber = data.replace(/[^0-9]/g, ''); // 숫자 이외의 문자 제거
    if (phoneNumber.length > 2 && phoneNumber.length <= 8) {
      phoneNumber = phoneNumber.replace(/(\d{4})(\d{1,4})/, '$1-$2');
    } else if (phoneNumber.length >= 7) {
      if (phoneNumber.length === 9) {
        phoneNumber = phoneNumber.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
      } else if (phoneNumber.length === 10) {
        phoneNumber = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
      } else if (phoneNumber.length === 11) {
        phoneNumber = phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
      }
    }
    return phoneNumber;
  }

  /**
   * 메뉴 데이터를 트리 구조에서 리스트 구조로 변환합니다.(가장 하위 노드의 메뉴를 리스트 합니다.)
   * @param menuItems
   * @param parentName
   * @param parentNumbers
   */
  static flattenMenuData(menuItems: any[], parentName: string = '', parentNumbers: any[] = []) {
    if (!menuItems || menuItems.length === 0) {
      return [];
    }
    const flattenedList = [];

    for (const menuItem of menuItems) {
      // 부모 이름과 하이픈으로 연결한 이름 생성
      const menuItemName = `${parentName}${parentName ? '-' : ''}${menuItem.name}`;
      // 하위 children이 있는 경우 재귀 호출
      if (menuItem.children && menuItem.children.length > 0) {
        const childrenList: any = this.flattenMenuData(menuItem.children, menuItemName, [
          ...parentNumbers,
          menuItem.menuNumber
        ]);
        flattenedList.push(...childrenList);
      } else {
        // 하위 children이 없는 경우 현재 항목을 리스트에 추가
        flattenedList.push({
          ...menuItem,
          name: menuItemName,
          parentNumbers,
          canRead: menuItem.canRead ? menuItem.canRead > 0 : false,
          canWrite: menuItem.canWrite ? menuItem.canWrite > 0 : false
        });
      }
    }

    return flattenedList;
  }

  // fileUuid를 이용한 파일 다운로드 URL 생성 TODO common 모듈 제거 하면서 함께 삭제 예정
  static downUrl = (commonFile: CommonFile): string => {
    if (commonFile.fileAuth === 'PRIVATE')
      throw new Error('private file cannot be downloaded directly');
    if (commonFile.storageType === 'S3') {
      return `${import.meta.env.VITE_CF_ORIGIN_URL}/${commonFile.filePath}`;
    } else {
      if (import.meta.env.MODE === 'localhost') {
        // 로컬 환경에서는 백엔드 API에서 처리
        return `${import.meta.env.VITE_API}/common-file-local/download/${commonFile.fileUuid}`;
      } else {
        // 개발, 운영 환경에서는 host 환경변수를 이용하여 파일 다운로드 URL 생성
        return `${import.meta.env.VITE_FILE_HOST}/${commonFile.filePath}`;
      }
    }
  };

  // S3 파일 다운로드 URL 생성(timeout 값이 있음) TODO common 모듈 제거 하면서 함께 삭제 예정
  static downUrlPrivate = (commonFile: CommonFile): Promise<string> => {
    if (commonFile.storageType !== 'S3') throw new Error('Only S3 file can be downloaded');
    if (commonFile.fileAuth !== 'PRIVATE')
      throw new Error('File auth is required for private download');
    return useApi().get<string>(`/common-file-s3/download-url/${commonFile.fileUuid}`);
  };

  static buildSelectOptions(names: { [key: string]: string }, defaultOptionText?: string) {
    const options = defaultOptionText ? [{ text: defaultOptionText, value: '' }] : [];
    return [
      ...options,
      ...Object.entries(names).map(([key, value]) => ({
        text: value,
        value: key
      }))
    ];
  }

  static buildSelectOptionsPlatform(
    items: any[],
    textField: string,
    valueField: string,
    defaultOptionText?: string,
    defaultOptionValue: string = ''
  ): { text: string; value: string }[] {
    if (!Array.isArray(items)) {
      // value가 배열이 아니면 빈 배열을 반환합니다.
      return [{ text: defaultOptionText ?? '', value: defaultOptionValue }];
    }
    const options = defaultOptionText
      ? [{ text: defaultOptionText, value: defaultOptionValue }]
      : [];
    return [
      ...options,
      ...items.map((item) => ({
        text: item[textField],
        value: String(item[valueField])
      }))
    ];
  }

  static generatePassword = (length = 16) => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';
    const charsetLength = charset.length;

    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = forge.random.getBytesSync(1).charCodeAt(0) % charsetLength;
      password += charset[randomIndex];
    }

    return password;
  };

  /**
   * 팝업 닫기 정보를 쿠키에 저장합니다.
   * 상위 도메인 쿠키를 사용하여 서브도메인 간 공유합니다.
   * @param key 팝업 키 (예: `popup_1`)
   * @param obj 저장할 객체 (예: `{ date: '2024-01-01' }`)
   */
  static savePopupCookie(key: string, obj: object) {
    if (typeof window === 'undefined') return;

    const jsonString = JSON.stringify(obj);
    const cookieKey = `backoffice-${key}`;
    const cookieValue = encodeURIComponent(jsonString);

    // 만료일 계산 (객체에 date 필드가 있는 경우)
    let expires = '';
    if ('date' in obj && typeof obj.date === 'string') {
      const expireDate = new Date(obj.date);
      expireDate.setHours(23, 59, 59, 999); // 해당 날짜의 마지막 시간으로 설정
      expires = `; expires=${expireDate.toUTCString()}`;
    }

    // 도메인 설정: localhost가 아닌 경우에만 상위 도메인 설정
    const domain = window.location.hostname === 'localhost' ? '' : '; domain=.ctaplatform.com';

    // 쿠키 설정
    document.cookie = `${cookieKey}=${cookieValue}${expires}${domain}; path=/`;
  }

  /**
   * 쿠키에서 팝업 닫기 정보를 읽어옵니다.
   * @param key 팝업 키 (예: `popup_1`)
   * @returns 저장된 객체 또는 null
   */
  static getPopupCookie(key: string): { date?: string } | null {
    if (typeof window === 'undefined') return null;

    const cookieKey = `backoffice-${key}`;
    const cookies = document.cookie.split(';');

    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split('=');
      if (cookieName === cookieKey && cookieValue) {
        try {
          return JSON.parse(decodeURIComponent(cookieValue));
        } catch {
          return null;
        }
      }
    }

    return null;
  }
}
