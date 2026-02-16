<template>
  <section class="hero-section w-full relative overflow-hidden">
    <!-- 배경 -->
    <div class="hero-bg absolute inset-0">
      <div class="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30"></div>
      <div class="absolute inset-0 hero-grid opacity-[0.4]"></div>
    </div>

    <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-16 lg:py-20 relative z-10">
      <div class="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

        <!-- 왼쪽: 콘텐츠 -->
        <div class="w-full lg:w-1/2 relative">
          <!-- 액센트 라인 -->
          <div class="w-16 h-[2px] bg-[#287dff] mb-8"></div>

          <!-- 배지 -->
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200/60 mb-8">
            <span class="w-2 h-2 rounded-full bg-[#287dff]"></span>
            <span class="text-sm text-blue-700 font-medium tracking-wide">업종별 특화 CRM SaaS</span>
          </div>

          <!-- 타이틀 -->
          <h1 class="mb-8">
            <span class="block text-5xl md:text-6xl lg:text-7xl font-light text-slate-800 tracking-tight leading-[1.1]">
              고객 관계를
            </span>
            <span class="block text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1] mt-2">
              <span class="hero-gradient-text">스마트하게</span>
            </span>
          </h1>

          <!-- 설명 -->
          <p class="text-lg md:text-xl text-slate-500 leading-relaxed max-w-xl mb-12 font-light">
            고객 관리, 상담, 업종별 특화 기능을 하나의 플랫폼에서.<br class="hidden sm:block" />
            필라테스, 부동산 등 업종에 맞는 CRM을 시작하세요.
          </p>

          <!-- CTA 버튼 -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <router-link to="/space" class="hero-cta-primary group">
              <span class="relative z-10 flex items-center gap-3">
                <span>지금 시작하기</span>
                <svg class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </router-link>

            <button class="hero-cta-secondary group" @click.prevent="$emit('scrollTo', 'features')">
              <span class="flex items-center gap-2">
                <span>자세히 알아보기</span>
                <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </span>
            </button>
          </div>

          <!-- 통계 -->
          <div class="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-slate-200">
            <div class="stat-item">
              <span class="stat-number">3+</span>
              <span class="stat-label">업종 특화</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">올인원</span>
              <span class="stat-label">CRM 플랫폼</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">AI</span>
              <span class="stat-label">분석 지원</span>
            </div>
          </div>
        </div>

        <!-- 오른쪽: 비주얼 -->
        <div class="w-full lg:w-1/2 relative">
          <div class="hero-visual-wrapper">
            <!-- 메인 카드 -->
            <div class="hero-dashboard-card relative">
              <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div class="flex items-center gap-3">
                  <div class="w-3 h-3 rounded-full bg-rose-400"></div>
                  <div class="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div class="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <span class="text-xs text-slate-400 font-mono">피치CRM Dashboard</span>
              </div>
              <div class="p-6">
                <!-- CRM 대시보드 미리보기 -->
                <div class="space-y-4">
                  <div class="grid grid-cols-3 gap-3">
                    <div class="p-3 bg-blue-50 rounded-lg">
                      <p class="text-xs text-blue-500">신규 고객</p>
                      <p class="text-lg font-bold text-blue-700">128</p>
                    </div>
                    <div class="p-3 bg-emerald-50 rounded-lg">
                      <p class="text-xs text-emerald-500">상담 완료</p>
                      <p class="text-lg font-bold text-emerald-700">89</p>
                    </div>
                    <div class="p-3 bg-amber-50 rounded-lg">
                      <p class="text-xs text-amber-500">예약 현황</p>
                      <p class="text-lg font-bold text-amber-700">42</p>
                    </div>
                  </div>
                  <div class="h-32 bg-slate-50 rounded-lg flex items-center justify-center">
                    <span class="text-sm text-slate-400">고객 분석 차트</span>
                  </div>
                  <div class="space-y-2">
                    <div class="h-3 bg-slate-100 rounded w-full"></div>
                    <div class="h-3 bg-slate-100 rounded w-4/5"></div>
                    <div class="h-3 bg-slate-100 rounded w-3/5"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 플로팅 카드 -->
            <div class="floating-card floating-card-1">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[#287dff] flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-slate-400">고객 증가율</p>
                  <p class="text-lg font-semibold text-slate-800">+24.5%</p>
                </div>
              </div>
            </div>

            <div class="floating-card floating-card-2">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-slate-400">상담 전환율</p>
                  <p class="text-lg font-semibold text-slate-800">87%</p>
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
defineEmits<{
  scrollTo: [id: string]
}>();
</script>

<style scoped>
.hero-section { min-height: auto; display: flex; align-items: center; }
.hero-grid {
  background-image: linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px);
  background-size: 60px 60px;
}
.hero-gradient-text {
  background: linear-gradient(135deg, #287dff 0%, #1a6ae6 50%, #1259cc 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.hero-cta-primary {
  position: relative; padding: 16px 32px; font-size: 1rem; font-weight: 600;
  color: white; background: #287dff; border-radius: 12px;
  transition: all 0.3s ease; box-shadow: 0 4px 20px rgba(40, 125, 255, 0.3);
}
.hero-cta-primary:hover { background: #1a6ae6; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(40, 125, 255, 0.4); }
.hero-cta-secondary {
  padding: 16px 24px; font-size: 0.95rem; font-weight: 500;
  color: #64748b; background: transparent; border: 1px solid #e2e8f0; border-radius: 12px;
  transition: all 0.3s ease;
}
.hero-cta-secondary:hover { color: #334155; background: #f8fafc; border-color: #cbd5e1; }
.stat-item { display: flex; flex-direction: column; gap: 4px; }
.stat-number { font-size: 1.75rem; font-weight: 600; color: #1e293b; letter-spacing: -0.02em; }
.stat-label { font-size: 0.875rem; color: #94a3b8; font-weight: 400; }
.hero-visual-wrapper { position: relative; }
.hero-dashboard-card {
  background: white; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
}
.floating-card {
  position: absolute; padding: 16px 20px; background: white;
  border: 1px solid #e2e8f0; border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08), 0 8px 16px rgba(0, 0, 0, 0.04);
}
.floating-card-1 { top: 15%; right: -20px; animation: float-card-1 6s ease-in-out infinite; }
.floating-card-2 { bottom: 20%; left: -30px; animation: float-card-2 7s ease-in-out infinite; animation-delay: -2s; }
@keyframes float-card-1 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
@keyframes float-card-2 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
@media (max-width: 1024px) { .floating-card-1, .floating-card-2 { display: none; } }
@media (max-width: 640px) {
  .stat-number { font-size: 1.5rem; }
  .hero-cta-primary, .hero-cta-secondary { width: 100%; justify-content: center; text-align: center; }
}
</style>
