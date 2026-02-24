import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import vueParser from 'vue-eslint-parser';
import globals from 'globals';

// NuxtUI / Vue auto-import 전역 함수 목록
const nuxtUIAutoImports = {
  useToast: 'readonly',
  useFormField: 'readonly',
  useOverlay: 'readonly',
  useModal: 'readonly',
  useColorMode: 'readonly',
  ref: 'readonly',
  computed: 'readonly',
  reactive: 'readonly',
  watch: 'readonly',
  watchEffect: 'readonly',
  onMounted: 'readonly',
  onUnmounted: 'readonly',
  onBeforeMount: 'readonly',
  nextTick: 'readonly',
  defineProps: 'readonly',
  defineEmits: 'readonly',
  defineExpose: 'readonly',
  withDefaults: 'readonly',
};

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '*.d.ts',
      '.claude/**',
      '.cursor/**',
      'docs/**',
    ],
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  // JSX 파일
  {
    files: ['**/*.jsx'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
    },
  },
  {
    files: ['**/*.{vue,ts,tsx}'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
        ...nuxtUIAutoImports,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // TypeScript
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

      // Vue - 프로젝트 스타일에 맞게 완화
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      'vue/require-default-prop': 'off',
      'vue/html-self-closing': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/attributes-order': 'off',
      'vue/first-attribute-linebreak': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/html-indent': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/v-on-event-hyphenation': 'off',
      'vue/attribute-hyphenation': 'off',
      'vue/no-required-prop-with-default': 'off',

      // 일반
      'no-console': 'warn',
      'no-unused-vars': 'off',
      'no-undef': 'off', // TypeScript가 타입 체크 담당
    },
  },
  // JS 파일 (Node.js 환경 포함)
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      'no-undef': 'off',
      'no-console': 'warn',
    },
  },
];
