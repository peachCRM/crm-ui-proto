import type { Component } from 'vue';

interface IconOptions {
  type: 'component' | 'image';
  // component type인 경우 Vue 컴포넌트, image type인 경우 이미지 URL
  source: Component | string;
  // 이미지일 경우 대체 텍스트
  alt?: string;
}

export interface DropdownItem {
  id: string | number;
  label: string;
  icon?: IconOptions;
  disabled?: boolean;
  value?: any;
}

export interface DropdownProps {
  items: DropdownItem[];
  maxWidth?: number;
  multiLine?: boolean;
  selected?: string | number;
}
