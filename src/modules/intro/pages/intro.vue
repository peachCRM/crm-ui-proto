<template>
  <div class="w-full min-w-0 overflow-x-hidden">
    <!-- 히어로 섹션 -->
    <intro-hero-section @scroll-to="scrollToSection" />

    <!-- 기능 소개 섹션 -->
    <intro-features-section />

    <!-- 사용법 섹션 -->
    <intro-how-it-works-section />

    <!-- 상담 문의 섹션 -->
    <intro-contact-section />
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import IntroHeroSection from '../components/intro-hero-section.vue';
import IntroFeaturesSection from '../components/intro-features-section.vue';
import IntroHowItWorksSection from '../components/intro-how-it-works-section.vue';
import IntroContactSection from '../components/intro-contact-section.vue';

const route = useRoute();

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

onMounted(async () => {
  const scrollTo = route.query.scrollTo as string;
  if (scrollTo) {
    await nextTick();
    setTimeout(() => {
      scrollToSection(scrollTo);
    }, 300);
  }
});
</script>
