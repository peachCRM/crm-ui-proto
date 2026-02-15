import { setActivePinia, createPinia } from 'pinia';
// dotenv 제거: vitest.config.ts의 loadEnv로 대체
import { useAuthStore } from '@/modules/member/store/auth.store.ts';
import { usePlatformStore } from '@/modules/platform/store/platform.store.ts';
import { useUserStore } from '@/modules/member/store/user.store.ts';

class LocalStorageMock {
  private store: Record<string, string>;

  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key: any) {
    return this.store[key] || null;
  }

  setItem(key: any, value: any) {
    this.store[key] = String(value);
  }

  removeItem(key: any) {
    delete this.store[key];
  }
}

//global.localStorage = new LocalStorageMock();
(global as any).localStorage = new LocalStorageMock();
/*
// console.log를 호출한 파일명, 라인 번호를 출력합니다.
const originalConsoleLog = console.log;
// console.log 함수를 재정의합니다
global.console.log = (...args: any[]) => {
  if (args[0] === 'API-INFO') {
    originalConsoleLog('');
    originalConsoleLog('API-INFO');
    originalConsoleLog(args[1]);
    originalConsoleLog(args[2]);
    originalConsoleLog('');
    return;
  }

  const stack = new Error().stack;
  if (stack) {
    const stackLines = stack.split('\n');
    // 호출자의 스택 트레이스 라인을 가져옵니다 (보통 세 번째 라인)
    const callerLine = stackLines[2].trim();
    originalConsoleLog('console.log');
    originalConsoleLog(...args);
    originalConsoleLog(callerLine);
  } else {
    originalConsoleLog(...args);
  }
};
*/

export class VitestSetup {
  /**
   * 테스트 환경 초기화
   * - Pinia 활성화
   * - 환경변수는 vitest.config.ts의 loadEnv('localhost')로 자동 로드됨
   */
  static async initializeTestEnvironment() {
    setActivePinia(createPinia());
  }

  static async sign(
    userId: string = import.meta.env.TEST_LOGIN_ID,
    password: string = import.meta.env.TEST_LOGIN_PW,
    svcSeq?: number,
  ) {
    const authStore = useAuthStore();

    // 로그인
    await authStore.login(userId, password);

    // 명시적으로 플랫폼 선택 확인/설정
    const platformStore = usePlatformStore();

    if (svcSeq) {
      // 명시적으로 지정된 svcSeq로 플랫폼 선택
      await platformStore.platformChoice(svcSeq);
    } else if (platformStore.svcSeq === 0) {
      // 플랫폼 선택이 안됐으면 첫 번째 플랫폼 선택
      const userStore = useUserStore();
      if (userStore.platform?.svcSeq) {
        await platformStore.platformChoice(userStore.platform.svcSeq);
      }
    }

    console.log('✅ VitestSetup - Platform svcSeq:', platformStore.svcSeq);
  }
}
