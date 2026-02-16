<template>
  <section class="section-cream w-full py-24 px-4 relative overflow-hidden">
    <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

    <div class="max-w-5xl mx-auto relative z-10">
      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
          <span class="text-sm text-slate-500 font-medium">간편한 시작</span>
        </div>
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-semibold mb-5 text-slate-800 tracking-tight">
          시작하는 방법
        </h2>
        <p class="text-lg text-slate-500">
          간단한 3단계로 피치CRM을 시작하세요
        </p>
      </div>

      <div class="flex flex-col md:flex-row items-stretch justify-center gap-6 md:gap-4">
        <!-- 1단계: 스페이스 생성 -->
        <div class="step-card-light flex-1">
          <div class="step-number-light">
            <span class="text-gradient-blue font-bold text-2xl">01</span>
          </div>
          <h3 class="text-lg font-semibold mb-2 text-slate-800">스페이스 생성</h3>
          <p class="text-slate-500 text-sm leading-relaxed">
            업종을 선택하고 워크스페이스를 생성하세요. 기본, 필라테스, 부동산 중 선택
          </p>
        </div>

        <!-- 커넥터 -->
        <div class="hidden md:flex items-center justify-center">
          <div class="w-12 h-px bg-gradient-to-r from-[#287dff] to-blue-200"></div>
        </div>
        <div class="md:hidden flex justify-center py-2">
          <div class="w-px h-8 bg-gradient-to-b from-[#287dff] to-blue-200"></div>
        </div>

        <!-- 2단계: 고객 등록 -->
        <div class="step-card-light flex-1">
          <div class="step-number-light">
            <span class="text-gradient-blue font-bold text-2xl">02</span>
          </div>
          <h3 class="text-lg font-semibold mb-2 text-slate-800">고객 등록</h3>
          <p class="text-slate-500 text-sm leading-relaxed">
            고객 정보를 등록하고 업종별 맞춤 필드를 활용하세요
          </p>
        </div>

        <!-- 커넥터 -->
        <div class="hidden md:flex items-center justify-center">
          <div class="w-12 h-px bg-gradient-to-r from-[#287dff] to-blue-200"></div>
        </div>
        <div class="md:hidden flex justify-center py-2">
          <div class="w-px h-8 bg-gradient-to-b from-[#287dff] to-blue-200"></div>
        </div>

        <!-- 3단계: CRM 시작 -->
        <div class="step-card-light flex-1">
          <div class="step-number-light">
            <span class="text-gradient-blue font-bold text-2xl">03</span>
          </div>
          <h3 class="text-lg font-semibold mb-2 text-slate-800">CRM 시작</h3>
          <p class="text-slate-500 text-sm leading-relaxed">
            상담, 메시징, 통계 등 모든 CRM 기능을 바로 활용하세요
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.section-cream { background: linear-gradient(180deg, #eff6ff 0%, #dbeafe 30%, #e0f2fe 100%); }
.text-gradient-blue {
  background: linear-gradient(135deg, #287dff 0%, #1a6ae6 50%, #1259cc 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.step-card-light {
  display: flex; flex-direction: column; align-items: center; text-align: center;
  padding: 32px 24px; background: white; border: 1px solid #e2e8f0; border-radius: 20px;
  transition: all 0.3s ease; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03);
}
.step-card-light:hover {
  border-color: #287dff;
  box-shadow: 0 20px 25px -5px rgba(40, 125, 255, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
  transform: translateY(-4px);
}
.step-number-light {
  width: 56px; height: 56px; display: flex; align-items: center; justify-content: center;
  background: linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%);
  border: 1px solid #93c5fd; border-radius: 16px; margin-bottom: 20px;
}
@media (max-width: 768px) { .step-card-light { padding: 24px 20px; } }
</style>
