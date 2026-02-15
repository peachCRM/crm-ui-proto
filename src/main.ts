import { createPinia } from 'pinia';
import { createApp } from 'vue';
import ui from '@nuxt/ui/vue-plugin';
import App from './App.vue';
import './assets/styles/tailwind.css';
import './assets/styles/layout-default.scss';
import 'vue3-perfect-scrollbar/style.css';
import 'vue3-easy-data-table/dist/style.css';
import EasyDataTable from 'vue3-easy-data-table';
import router from './router.ts';
import VueApexCharts from 'vue3-apexcharts';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { infiniteScroll } from '@/modules/_common/directives/v-infinite-scroll.directive.ts';

// 자주사용하는 컴포넌트
import WorkButtonComponent from '@/modules/_common/components/forms/p-button.vue';
import PInputBox from '@/modules/_common/components/forms/p-input-box.vue';
import PSelectBox from '@/modules/_common/components/forms/p-select-box.vue';
import PRadiobox from '@/modules/_common/components/forms/p-radiobox.vue';
import PCheckbox from '@/modules/_common/components/forms/p-checkbox.vue';
import PModalConfirm from '@/modules/_common/components/modal/p-modal-confirm.vue';

/**
 * 피치CRM Proto - Mock 모드 프론트엔드
 * Backend API 없이 독립 실행 가능한 프로토타이핑 환경
 */

const app = createApp(App);

// Pinia 상태관리
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);

// 디렉티브
app.use(infiniteScroll);

// 전역 컴포넌트 등록
app.component('EasyDataTable', EasyDataTable);
app.component('WorkButtonComponent', WorkButtonComponent);
app.component('WorkInputboxComponent', PInputBox);
app.component('WorkSelectboxComponent', PSelectBox);
app.component('WorkRadioboxComponent', PRadiobox);
app.component('WorkCheckboxComponent', PCheckbox);
app.component('ModalConfirm', PModalConfirm);

// 차트
app.use(VueApexCharts);
app.component('ApexCharts', VueApexCharts);

// 라우터
app.use(router);

// NuxtUI
app.use(ui);

// 앱 마운트
app.mount('#app');

console.log('🚀 피치CRM Proto 시작 - Mock 모드로 실행 중');
