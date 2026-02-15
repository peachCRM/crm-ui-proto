import { defineStore } from 'pinia';

interface ThemeState {
  isDarkMode: boolean;
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    isDarkMode: false
  }),

  actions: {
    // 다크모드로 전환하는 함수 (현재는 사용되지 않지만 향후 확장성을 위해 구현)
    setDarkMode() {
      this.isDarkMode = true;
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    },

    // 라이트모드로 전환하는 함수
    setLightMode() {
      this.isDarkMode = false;
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    },

    // 테마 초기화 함수
    initTheme() {
      // 시스템 기본 설정은 라이트 모드
      this.setLightMode();
    }
  }
});
