<template>
  <section id="contact" class="section-light w-full py-24 px-4 relative overflow-hidden">
    <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

    <div class="max-w-5xl mx-auto relative z-10">
      <div class="text-center mb-14">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200/60 mb-6">
          <span class="w-2 h-2 rounded-full bg-[#287dff]"></span>
          <span class="text-sm text-blue-700 font-medium">무료 상담</span>
        </div>
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-semibold mb-5 text-slate-800 tracking-tight">
          지금 바로 상담받으세요
        </h2>
        <p class="text-lg text-slate-500">
          전문 상담사가 비즈니스에 맞는 최적의 CRM을 제안해드립니다
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        <!-- 상담 폼 -->
        <div>
          <div class="contact-form-card-light">
            <form class="space-y-5">
              <div class="space-y-1">
                <label class="text-sm text-slate-600 font-medium">이름</label>
                <UInput v-model="contactForm.name" placeholder="홍길동" size="lg" class="contact-input-light" icon="lucide:user" />
              </div>
              <div class="space-y-1">
                <label class="text-sm text-slate-600 font-medium">연락처</label>
                <UInput v-model="contactForm.phone" placeholder="010-1234-5678" size="lg" class="contact-input-light" icon="lucide:phone" />
              </div>
              <div class="space-y-1">
                <label class="text-sm text-slate-600 font-medium">문의 내용</label>
                <UTextarea v-model="contactForm.message" placeholder="궁금한 점이나 요청 사항을 자유롭게 작성해주세요" :rows="4" class="contact-textarea-light w-full" />
              </div>
              <button type="button" class="contact-submit-btn group" @click.prevent="submitContact">
                <span class="relative z-10 flex items-center justify-center gap-2">
                  <span>상담 신청하기</span>
                  <svg class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </button>
            </form>
          </div>
        </div>

        <!-- 연락처 정보 -->
        <div>
          <div class="contact-info-card-light">
            <h3 class="text-xl font-semibold mb-8 text-slate-800">연락처 정보</h3>
            <div class="space-y-6">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                  <UIcon name="lucide:phone" class="text-[#287dff] w-5 h-5" />
                </div>
                <div>
                  <p class="text-slate-400 text-sm mb-1">전화</p>
                  <p class="font-medium text-slate-800">1588-1234</p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                  <UIcon name="lucide:mail" class="text-emerald-600 w-5 h-5" />
                </div>
                <div>
                  <p class="text-slate-400 text-sm mb-1">이메일</p>
                  <p class="font-medium text-slate-800">contact@peachcrm.com</p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                  <UIcon name="lucide:clock" class="text-amber-600 w-5 h-5" />
                </div>
                <div>
                  <p class="text-slate-400 text-sm mb-1">상담 가능 시간</p>
                  <p class="font-medium text-slate-800">평일 09:00 - 18:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const contactForm = reactive({ name: '', phone: '', message: '' });

const submitContact = () => {
  console.log('상담 신청:', contactForm);
};
</script>

<style scoped>
.section-light { background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%); }
.contact-form-card-light {
  padding: 32px; background: white; border: 1px solid #e2e8f0; border-radius: 24px;
  box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.08);
}
.contact-input-light :deep(input) { background: #f8fafc !important; border: 1px solid #e2e8f0 !important; color: #1e293b !important; border-radius: 12px !important; }
.contact-input-light :deep(input):focus { border-color: #287dff !important; box-shadow: 0 0 0 3px rgba(40, 125, 255, 0.15) !important; background: white !important; }
.contact-textarea-light :deep(textarea) { background: #f8fafc !important; border: 1px solid #e2e8f0 !important; color: #1e293b !important; border-radius: 12px !important; resize: none; }
.contact-textarea-light :deep(textarea):focus { border-color: #287dff !important; box-shadow: 0 0 0 3px rgba(40, 125, 255, 0.15) !important; background: white !important; }
.contact-submit-btn {
  width: 100%; position: relative; padding: 16px 32px; font-size: 1rem; font-weight: 600;
  color: white; background: #287dff; border-radius: 12px;
  transition: all 0.3s ease; box-shadow: 0 4px 20px rgba(40, 125, 255, 0.3);
}
.contact-submit-btn:hover { background: #1a6ae6; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(40, 125, 255, 0.4); }
.contact-info-card-light {
  padding: 32px; background: linear-gradient(145deg, #eff6ff 0%, #e0f2fe 100%);
  border: 1px solid #93c5fd; border-radius: 24px; height: 100%;
}
@media (max-width: 768px) { .contact-form-card-light, .contact-info-card-light { padding: 24px; } }
</style>
