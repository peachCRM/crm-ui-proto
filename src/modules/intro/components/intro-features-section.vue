<template>
  <section id="features" class="section-light w-full py-24 px-4 relative overflow-hidden">
    <div class="max-w-6xl mx-auto relative z-10">
      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200/60 mb-6">
          <span class="text-sm text-blue-700 font-medium">핵심 기능</span>
        </div>
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-semibold mb-5 text-slate-800 tracking-tight">
          왜 <span class="text-gradient-blue">피치CRM</span>인가요?
        </h2>
        <p class="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          업종별 특화 기능으로 고객 관리의 새로운 기준을 제시합니다
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        <!-- 고객 관리 -->
        <div class="feature-card group">
          <div class="feature-card-inner">
            <div class="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <UIcon name="lucide:users" class="text-[#287dff] w-7 h-7" />
            </div>
            <h3 class="text-xl font-semibold mb-3 text-slate-800">통합 고객 관리</h3>
            <p class="text-slate-500 leading-relaxed">
              고객 등록부터 히스토리 추적까지, 모든 고객 정보를 한 곳에서 관리하세요
            </p>
          </div>
        </div>

        <!-- 상담 & 메시징 -->
        <div class="feature-card group">
          <div class="feature-card-inner">
            <div class="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <UIcon name="lucide:message-circle" class="text-emerald-600 w-7 h-7" />
            </div>
            <h3 class="text-xl font-semibold mb-3 text-slate-800">상담 & 메시징</h3>
            <p class="text-slate-500 leading-relaxed">
              카카오 알림톡, SMS, 이메일로 고객과 소통하고 상담 이력을 체계적으로 관리합니다
            </p>
          </div>
        </div>

        <!-- 업종 특화 -->
        <div class="feature-card group">
          <div class="feature-card-inner">
            <div class="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <UIcon name="lucide:building-2" class="text-amber-600 w-7 h-7" />
            </div>
            <h3 class="text-xl font-semibold mb-3 text-slate-800">업종별 특화 기능</h3>
            <p class="text-slate-500 leading-relaxed">
              필라테스 수업 관리, 부동산 매물 매칭 등 업종에 맞는 전용 기능을 제공합니다
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.section-light { background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%); }
.text-gradient-blue {
  background: linear-gradient(135deg, #287dff 0%, #1a6ae6 50%, #1259cc 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.feature-card { position: relative; border-radius: 20px; overflow: hidden; }
.feature-card-inner {
  position: relative; z-index: 10; padding: 32px;
  background: white; border: 1px solid #e2e8f0; border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); height: 100%;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}
.feature-card:hover .feature-card-inner {
  border-color: #cbd5e1;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
  transform: translateY(-4px);
}
@media (max-width: 768px) { .feature-card-inner { padding: 24px; } }
</style>
