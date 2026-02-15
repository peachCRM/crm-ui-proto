/**
 * 색상 관리 유틸리티
 * Quill 에디터의 색상 팔레트와 관련된 유틸리티 함수들
 */

// 기본 글자 색상 팔레트
export const TEXT_COLORS = [
  // 기본 색상
  '#ffffff',
  '#000000',
  '#374151',
  '#6B7280',
  '#9CA3AF',
  // 블루 계열
  '#1E40AF',
  '#2563EB',
  '#3B82F6',
  '#60A5FA',
  // 인디고 계열
  '#3730A3',
  '#4F46E5',
  '#6366F1',
  '#8B5CF6',
  // 그린 계열
  '#059669',
  '#10B981',
  '#34D399',
  '#6EE7B7',
  // 레드 계열
  '#DC2626',
  '#EF4444',
  '#F87171',
  '#FCA5A5',
  // 오렌지 계열
  '#D97706',
  '#F59E0B',
  '#FBBF24',
  '#FCD34D',
  // 핑크 계열
  '#BE185D',
  '#EC4899',
  '#F472B6'
] as const;

// 기본 배경 색상 팔레트
export const BACKGROUND_COLORS = [
  // 라이트 그레이 계열
  '#F9FAFB',
  '#F3F4F6',
  '#E5E7EB',
  '#D1D5DB',
  // 라이트 블루 계열
  '#EFF6FF',
  '#DBEAFE',
  '#BFDBFE',
  '#93C5FD',
  // 라이트 인디고 계열
  '#EEF2FF',
  '#E0E7FF',
  '#C7D2FE',
  '#A5B4FC',
  // 라이트 그린 계열
  '#ECFDF5',
  '#D1FAE5',
  '#A7F3D0',
  '#6EE7B7',
  // 라이트 레드 계열
  '#FEF2F2',
  '#FEE2E2',
  '#FECACA',
  '#FCA5A5',
  // 라이트 오렌지 계열
  '#FFFBEB',
  '#FEF3C7',
  '#FDE68A',
  '#FCD34D',
  // 라이트 핑크 계열
  '#FDF2F8',
  '#FCE7F3',
  '#FBCFE8',
  '#F9A8D4'
] as const;

// 색상 그룹 타입
export interface ColorGroup {
  name: string;
  colors: readonly string[];
}

// 색상 그룹 정의
export const COLOR_GROUPS: Record<string, ColorGroup> = {
  BASIC: {
    name: '기본',
    colors: ['#ffffff', '#000000', '#374151', '#6B7280', '#9CA3AF']
  },
  BLUE: {
    name: '블루',
    colors: ['#1E40AF', '#2563EB', '#3B82F6', '#60A5FA']
  },
  INDIGO: {
    name: '인디고',
    colors: ['#3730A3', '#4F46E5', '#6366F1', '#8B5CF6']
  },
  GREEN: {
    name: '그린',
    colors: ['#059669', '#10B981', '#34D399', '#6EE7B7']
  },
  RED: {
    name: '레드',
    colors: ['#DC2626', '#EF4444', '#F87171', '#FCA5A5']
  },
  ORANGE: {
    name: '오렌지',
    colors: ['#D97706', '#F59E0B', '#FBBF24', '#FCD34D']
  },
  PINK: {
    name: '핑크',
    colors: ['#BE185D', '#EC4899', '#F472B6']
  }
} as const;

// 색상 유틸리티 함수들
export const colorUtils = {
  /**
   * 헥스 색상 코드가 유효한지 확인
   */
  isValidHex(color: string): boolean {
    return /^#([0-9A-F]{3}){1,2}$/i.test(color);
  },

  /**
   * RGB 값을 헥스 색상 코드로 변환
   */
  rgbToHex(r: number, g: number, b: number): string {
    const toHex = (c: number) => {
      const hex = Math.round(c).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  },

  /**
   * 헥스 색상 코드를 RGB 값으로 변환
   */
  hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  },

  /**
   * 색상의 밝기를 계산 (0-255)
   */
  getBrightness(hex: string): number {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return 0;
    return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  },

  /**
   * 색상이 어두운 색상인지 판단
   */
  isDarkColor(hex: string): boolean {
    return this.getBrightness(hex) < 128;
  },

  /**
   * 색상의 대비되는 색상을 반환 (텍스트 색상 결정에 유용)
   */
  getContrastColor(hex: string): string {
    return this.isDarkColor(hex) ? '#ffffff' : '#000000';
  },

  /**
   * 색상을 RGBA 형태로 변환
   */
  hexToRgba(hex: string, alpha: number = 1): string {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return 'rgba(0, 0, 0, 1)';
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
  },

  /**
   * 색상을 더 밝게 만들기
   */
  lighten(hex: string, percent: number): string {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return hex;

    const factor = percent / 100;
    const newR = Math.round(rgb.r + (255 - rgb.r) * factor);
    const newG = Math.round(rgb.g + (255 - rgb.g) * factor);
    const newB = Math.round(rgb.b + (255 - rgb.b) * factor);

    return this.rgbToHex(newR, newG, newB);
  },

  /**
   * 색상을 더 어둡게 만들기
   */
  darken(hex: string, percent: number): string {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return hex;

    const factor = 1 - percent / 100;
    const newR = Math.round(rgb.r * factor);
    const newG = Math.round(rgb.g * factor);
    const newB = Math.round(rgb.b * factor);

    return this.rgbToHex(newR, newG, newB);
  }
};

// 색상 팔레트 설정 인터페이스
export interface ColorPaletteOptions {
  textColors?: string[];
  backgroundColors?: string[];
  customGroups?: Record<string, ColorGroup>;
}

// 색상 팔레트 생성 함수
export function createColorPalette(options: ColorPaletteOptions = {}): {
  textColors: string[];
  backgroundColors: string[];
  groups: Record<string, ColorGroup>;
} {
  return {
    textColors: options.textColors || [...TEXT_COLORS],
    backgroundColors: options.backgroundColors || [...BACKGROUND_COLORS],
    groups: options.customGroups || COLOR_GROUPS
  };
}

// 색상 검색 함수
export function searchColors(query: string, colors: string[]): string[] {
  const normalizedQuery = query.toLowerCase();
  return colors.filter(
    (color) =>
      color.toLowerCase().includes(normalizedQuery) ||
      Object.values(COLOR_GROUPS).some(
        (group) =>
          group.colors.includes(color as any) && group.name.toLowerCase().includes(normalizedQuery)
      )
  );
}

// 색상 카테고리 찾기
export function findColorCategory(color: string): string | null {
  for (const [key, group] of Object.entries(COLOR_GROUPS)) {
    if (group.colors.includes(color as any)) {
      return key;
    }
  }
  return null;
}

// 기본 색상 팔레트 반환 함수 (하위 호환성을 위해)
export function getDefaultTextColors(): string[] {
  return [...TEXT_COLORS];
}

export function getDefaultBackgroundColors(): string[] {
  return [...BACKGROUND_COLORS];
}

// 타입 정의
export type TextColor = (typeof TEXT_COLORS)[number];
export type BackgroundColor = (typeof BACKGROUND_COLORS)[number];
export type ColorType = 'text' | 'background';

// 색상 팔레트 상수 export (하위 호환성을 위해)
export const DEFAULT_TEXT_COLORS = TEXT_COLORS;
export const DEFAULT_BACKGROUND_COLORS = BACKGROUND_COLORS;
