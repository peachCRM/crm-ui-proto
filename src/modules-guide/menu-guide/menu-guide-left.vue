<template>
  <div class="flex flex-col items-center overflow-hidden">
    <!-- 패턴 선택 버튼 -->
    <div class="flex flex-wrap justify-center gap-1 mb-3.5">
      <button
        v-for="(m, i) in leftMenus"
        :key="i"
        @click="lIdx = i"
        :class="[
          'px-2.5 py-0.5 text-[10px] rounded-xl cursor-pointer',
          lIdx === i
            ? m.pick
              ? 'bg-[#287dff] text-white border-none'
              : 'bg-gray-600 text-white border-none'
            : m.pick
              ? 'bg-white text-[#287dff] border-2 border-[#287dff] font-bold'
              : 'bg-white text-gray-500 border border-gray-300'
        ]"
      >
        {{ m.pick ? '⭐ ' : '' }}{{ m.n }}
      </button>
    </div>

    <!-- LFrame 공통: bg-gray-100 rounded-lg border overflow-hidden h-[420px] flex flex-col -->
    <!-- 패턴 0: Notion 스타일 (PICK) -->
    <div
      v-if="lIdx === 0"
      class="w-full bg-gray-100 rounded-lg border-2 border-[#287dff] overflow-hidden h-[420px] flex flex-col shadow-[0_2px_12px_rgba(40,125,255,0.15)]"
    >
      <div class="h-[34px] bg-[#287dff] flex items-center px-3 shrink-0">
        <span class="text-white font-bold text-[11px]">피치CRM</span>
        <span class="text-white/50 text-[8px] ml-1.5">Notion 스타일 ⭐ PICK</span>
      </div>
      <div class="flex-1 flex overflow-hidden">
        <div class="w-[210px] bg-[#fbfbfa] border-r border-[#e8e8e5] overflow-y-auto shrink-0 py-[5px]">
          <template v-for="sec in menuData" :key="sec.id">
            <div
              @click="toggleArr(lp, 'e1', sec.id)"
              class="px-2.5 py-1 text-[11px] cursor-pointer flex items-center gap-1 text-[#91918e]"
            >
              <span
                class="text-[8px] w-3.5 text-center inline-block transition-transform duration-150"
                :style="{ transform: lp.e1.includes(sec.id) ? 'rotate(90deg)' : 'rotate(0)' }"
              >▶</span>
              <span class="font-semibold">{{ sec.title }}</span>
            </div>
            <template v-if="lp.e1.includes(sec.id)">
              <template v-for="m in sec.menus" :key="m.id">
                <div
                  @click="m.children?.length ? toggleArr(lp, 'e2', m.id) : (lp.active = m.name)"
                  class="pl-[22px] pr-2.5 py-1 text-[11px] cursor-pointer flex items-center gap-1 text-[#37352f] rounded-[3px]"
                >
                  <span
                    v-if="m.children?.length"
                    class="text-[8px] w-3.5 text-center inline-block transition-transform duration-150"
                    :style="{ transform: lp.e2.includes(m.id) ? 'rotate(90deg)' : 'rotate(0)' }"
                  >▶</span>
                  <span v-else class="w-3.5" />
                  <span>{{ m.icon }} {{ m.name }}</span>
                </div>
                <template v-if="lp.e2.includes(m.id)">
                  <div
                    v-for="c in m.children"
                    :key="c.id"
                    @click="lp.active = c.name"
                    class="pl-12 pr-2.5 py-1 text-[11px] cursor-pointer rounded-[3px] mx-1"
                    :class="lp.active === c.name ? 'text-[#287dff] bg-[#f0f0ef]' : 'text-[#37352f]'"
                  >
                    {{ c.name }}
                  </div>
                </template>
              </template>
            </template>
          </template>
        </div>
        <div class="flex-1 bg-white p-3.5 text-[11px] text-gray-400">
          {{ lp.active ? `✓ ${lp.active}` : '메뉴 선택' }}
        </div>
      </div>
    </div>

    <!-- 패턴 1: 클래식 아코디언 -->
    <div
      v-if="lIdx === 1"
      class="w-full bg-gray-100 rounded-lg border border-gray-200 overflow-hidden h-[420px] flex flex-col"
    >
      <div class="h-[34px] bg-[#287dff] flex items-center px-3 shrink-0">
        <span class="text-white font-bold text-[11px]">피치CRM</span>
        <span class="text-white/50 text-[8px] ml-1.5">클래식 아코디언</span>
      </div>
      <div class="flex-1 flex overflow-hidden">
        <div class="w-[180px] bg-gray-50 border-r border-gray-200 overflow-y-auto shrink-0">
          <template v-for="s in menuData" :key="s.id">
            <div class="px-2.5 py-[7px] text-[9px] text-gray-400 font-bold">{{ s.title }}</div>
            <template v-for="m in s.menus" :key="m.id">
              <div
                @click="m.children?.length ? toggleArr(lc, 'exp', m.id) : (lc.active = m.name)"
                class="px-2.5 py-1.5 text-[11px] cursor-pointer flex justify-between text-gray-600"
                :class="lc.exp.includes(m.id) ? 'bg-[#f0f4ff]' : ''"
              >
                <span>{{ m.icon }} {{ m.name }}</span>
                <span v-if="m.children?.length" class="text-[7px]">{{ lc.exp.includes(m.id) ? '▲' : '▼' }}</span>
              </div>
              <template v-if="lc.exp.includes(m.id)">
                <div
                  v-for="c in m.children"
                  :key="c.id"
                  @click="lc.active = c.name"
                  class="pl-7 pr-2.5 py-[5px] text-[10px] cursor-pointer"
                  :class="lc.active === c.name ? 'text-[#287dff] border-l-2 border-[#287dff]' : 'text-gray-600 border-l-2 border-transparent'"
                >
                  {{ c.name }}
                </div>
              </template>
            </template>
          </template>
        </div>
        <div class="flex-1 bg-white p-3.5 text-[11px] text-gray-400">
          {{ lc.active ? `✓ ${lc.active}` : '메뉴 선택' }}
        </div>
      </div>
    </div>

    <!-- 패턴 2: 듀얼 패널 -->
    <div
      v-if="lIdx === 2"
      class="w-full bg-gray-100 rounded-lg border border-gray-200 overflow-hidden h-[420px] flex flex-col"
    >
      <div class="h-[34px] bg-[#287dff] flex items-center px-3 shrink-0">
        <span class="text-white font-bold text-[11px]">피치CRM</span>
        <span class="text-white/50 text-[8px] ml-1.5">듀얼 패널</span>
      </div>
      <div class="flex-1 flex overflow-hidden">
        <div class="w-12 bg-gray-100 border-r border-gray-200 flex flex-col items-center pt-1 shrink-0">
          <div
            v-for="(x, i) in menuData"
            :key="x.id"
            @click="ld.sel = i"
            class="w-9 h-9 flex items-center justify-center rounded-md cursor-pointer mb-[3px] text-sm"
            :class="ld.sel === i ? 'bg-[#287dff] text-white' : ''"
          >
            {{ x.icon }}
          </div>
        </div>
        <div class="w-[150px] bg-white border-r border-gray-200 overflow-y-auto shrink-0 py-1.5">
          <div class="px-2.5 py-[3px] text-[11px] font-bold text-[#287dff] mb-[3px]">
            {{ menuData[ld.sel]?.title }}
          </div>
          <template v-for="m in menuData[ld.sel]?.menus" :key="m.id">
            <div class="px-2.5 py-[2px] text-[9px] text-gray-400 font-semibold mt-[3px]">{{ m.name }}</div>
            <template v-if="m.children?.length">
              <div
                v-for="c in m.children"
                :key="c.id"
                @click="ld.active = c.name"
                class="pl-4 pr-2.5 py-1 text-[10px] cursor-pointer"
                :class="ld.active === c.name ? 'text-[#287dff]' : 'text-gray-500'"
              >
                • {{ c.name }}
              </div>
            </template>
            <div v-else @click="ld.active = m.name" class="pl-4 pr-2.5 py-1 text-[10px] cursor-pointer">
              {{ m.name }}
            </div>
          </template>
        </div>
        <div class="flex-1 bg-white p-3.5 text-[11px] text-gray-400">
          {{ ld.active ? `✓ ${ld.active}` : '메뉴 선택' }}
        </div>
      </div>
    </div>

    <!-- 패턴 3: 접이식 (LeftCollapse) -->
    <div
      v-if="lIdx === 3"
      class="w-full bg-gray-100 rounded-lg border border-gray-200 overflow-hidden h-[420px] flex flex-col"
    >
      <div class="h-[34px] bg-[#287dff] flex items-center px-3 shrink-0">
        <span class="text-white font-bold text-[11px]">피치CRM</span>
        <span class="text-white/50 text-[8px] ml-1.5">접이식 그룹</span>
      </div>
      <div class="flex-1 flex overflow-hidden">
        <div class="w-[190px] bg-white border-r border-gray-200 overflow-y-auto shrink-0">
          <template v-for="s in menuData" :key="s.id">
            <div
              @click="toggleArr(lcol, 'exp', s.id)"
              class="px-2.5 py-2 text-[11px] font-bold cursor-pointer bg-gray-50 border-b border-gray-200 flex justify-between"
              :class="lcol.exp.includes(s.id) ? 'text-[#287dff]' : 'text-gray-700'"
            >
              <span>{{ s.icon }} {{ s.title }}</span>
              <span
                class="text-xs inline-block transition-transform duration-150"
                :class="lcol.exp.includes(s.id) ? 'rotate-180' : ''"
              >
                ⌄
              </span>
            </div>
            <template v-if="lcol.exp.includes(s.id)">
              <template v-for="m in s.menus" :key="m.id">
                <template v-if="m.children?.length">
                  <div class="px-2.5 pt-[3px] pb-px text-[8px] text-gray-400 font-semibold">{{ m.name }}</div>
                  <div
                    v-for="c in m.children"
                    :key="c.id"
                    @click="lcol.active = c.name"
                    class="pl-[18px] pr-2.5 py-[5px] text-[10px] cursor-pointer"
                    :class="lcol.active === c.name ? 'text-[#287dff] bg-[#eef4ff]' : 'text-gray-500'"
                  >
                    {{ c.name }}
                  </div>
                </template>
                <div
                  v-else
                  @click="lcol.active = m.name"
                  class="pl-3.5 pr-2.5 py-1.5 text-[10px] cursor-pointer"
                >
                  {{ m.icon }} {{ m.name }}
                </div>
              </template>
            </template>
          </template>
        </div>
        <div class="flex-1 bg-white p-3.5 text-[11px] text-gray-400">
          {{ lcol.active ? `✓ ${lcol.active}` : '메뉴 선택' }}
        </div>
      </div>
    </div>

    <!-- 패턴 4: 컴팩트 (LeftCompact) - 아이콘바 + hover 플로팅 패널 -->
    <div
      v-if="lIdx === 4"
      class="w-full bg-gray-100 rounded-lg border border-gray-200 overflow-hidden h-[420px] flex flex-col relative"
    >
      <div class="h-[34px] bg-[#287dff] flex items-center px-3 shrink-0">
        <span class="text-white font-bold text-[11px]">피치CRM</span>
        <span class="text-white/50 text-[8px] ml-1.5">컴팩트 플로팅</span>
      </div>
      <div class="flex-1 flex overflow-hidden">
        <div
          class="w-14 bg-[#1e293b] flex flex-col items-center pt-1.5 shrink-0"
        >
          <div
            v-for="m in flatMenus"
            :key="m.id"
            @mouseenter="lcompEnter(m.id)"
            @mouseleave="lcompLeave"
            class="w-10 h-10 flex flex-col items-center justify-center cursor-pointer rounded-md mb-[3px] transition-colors"
            :class="lcomp.hover === m.id ? 'bg-[#334155]' : ''"
          >
            <span class="text-sm">{{ m.icon }}</span>
            <span class="text-[6px] text-[#94a3b8]">{{ m.name.slice(0, 3) }}</span>
          </div>
        </div>
        <!-- hover 플로팅 패널 -->
        <div
          v-if="lcomp.hover && lcompMenu"
          @mouseenter="lcompKeep"
          @mouseleave="lcompLeave"
          class="absolute left-14 top-[34px] bg-white min-w-[140px] shadow-[2px_2px_10px_rgba(0,0,0,0.1)] rounded-r-md z-20 py-1.5"
        >
          <div class="px-2.5 py-[3px] text-[10px] font-bold text-[#287dff]">{{ lcompMenu.name }}</div>
          <template v-if="lcompMenu.children?.length">
            <div
              v-for="c in lcompMenu.children"
              :key="c.id"
              @click="lcomp.active = c.name"
              class="px-2.5 py-1.5 text-[11px] cursor-pointer"
              :class="lcomp.active === c.name ? 'text-[#287dff]' : 'text-gray-500'"
            >
              {{ c.name }}
            </div>
          </template>
          <div
            v-else
            @click="lcomp.active = lcompMenu.name"
            class="px-2.5 py-1.5 text-[11px] cursor-pointer"
          >
            바로가기
          </div>
        </div>
        <div class="flex-1 bg-white p-3.5 text-[11px] text-gray-400">
          {{ lcomp.active ? `✓ ${lcomp.active}` : '메뉴 선택' }}
        </div>
      </div>
    </div>

    <!-- 패턴 5: 트리뷰 (LeftTree) - 다크 테마 -->
    <div
      v-if="lIdx === 5"
      class="w-full bg-gray-100 rounded-lg border border-gray-200 overflow-hidden h-[420px] flex flex-col"
    >
      <div class="h-[34px] bg-[#287dff] flex items-center px-3 shrink-0">
        <span class="text-white font-bold text-[11px]">피치CRM</span>
        <span class="text-white/50 text-[8px] ml-1.5">트리뷰</span>
      </div>
      <div class="flex-1 flex overflow-hidden">
        <div class="w-[190px] bg-[#1e1e2e] overflow-y-auto shrink-0 py-[3px]">
          <template v-for="s in menuData" :key="s.id">
            <div
              @click="toggleArr(ltree, 'e1', s.id)"
              class="px-1.5 py-1 text-[10px] text-[#cdd6f4] cursor-pointer flex items-center gap-[3px]"
            >
              <span class="text-[7px] w-[11px] text-center">{{ ltree.e1.includes(s.id) ? '▾' : '▸' }}</span>
              <span class="font-semibold">{{ s.title }}</span>
            </div>
            <template v-if="ltree.e1.includes(s.id)">
              <template v-for="m in s.menus" :key="m.id">
                <div
                  @click="m.children?.length ? toggleArr(ltree, 'e2', m.id) : (ltree.active = m.name)"
                  class="pl-[18px] pr-1.5 py-[3px] text-[10px] text-[#a6adc8] cursor-pointer flex items-center gap-[3px]"
                >
                  <span class="text-[7px] w-[11px] text-center">
                    {{ m.children?.length ? (ltree.e2.includes(m.id) ? '▾' : '▸') : ' ' }}
                  </span>
                  <span>{{ m.icon }} {{ m.name }}</span>
                </div>
                <template v-if="ltree.e2.includes(m.id)">
                  <div
                    v-for="c in m.children"
                    :key="c.id"
                    @click="ltree.active = c.name"
                    class="pl-9 pr-1.5 py-0.5 text-[10px] cursor-pointer"
                    :class="ltree.active === c.name ? 'text-[#89b4fa] bg-[#89b4fa]/10' : 'text-[#7f849c]'"
                  >
                    {{ c.name }}
                  </div>
                </template>
              </template>
            </template>
          </template>
        </div>
        <div class="flex-1 bg-white p-3.5 text-[11px] text-gray-400">
          {{ ltree.active ? `✓ ${ltree.active}` : '메뉴 선택' }}
        </div>
      </div>
    </div>

    <!-- 패턴 6: 미니↔확장 (LeftToggle) -->
    <div
      v-if="lIdx === 6"
      class="w-full bg-gray-100 rounded-lg border border-gray-200 overflow-hidden h-[420px] flex flex-col"
    >
      <div class="h-[34px] bg-[#287dff] flex items-center px-3 shrink-0">
        <span class="text-white font-bold text-[11px]">피치CRM</span>
        <span class="text-white/50 text-[8px] ml-1.5">미니↔확장</span>
      </div>
      <div class="flex-1 flex overflow-hidden">
        <div
          class="bg-gray-50 border-r border-gray-200 overflow-y-auto overflow-x-hidden shrink-0 relative transition-[width] duration-200"
          :class="ltog.wide ? 'w-[180px]' : 'w-14'"
        >
          <div
            @click="ltog.wide = !ltog.wide"
            class="py-1.5 text-center cursor-pointer text-xs border-b border-gray-200"
          >
            {{ ltog.wide ? '◁' : '▷' }}
          </div>
          <!-- 확장 모드 -->
          <template v-if="ltog.wide">
            <template v-for="s in menuData" :key="s.id">
              <div class="px-2 py-1.5 text-[8px] text-gray-400 font-bold">{{ s.title }}</div>
              <template v-for="m in s.menus" :key="m.id">
                <div
                  @click="m.children?.length ? toggleArr(ltog, 'exp', m.id) : (ltog.active = m.name)"
                  class="px-2 py-1.5 text-[10px] cursor-pointer flex justify-between text-gray-700"
                >
                  <span>{{ m.icon }} {{ m.name }}</span>
                  <span v-if="m.children?.length" class="text-[7px]">{{ ltog.exp.includes(m.id) ? '▲' : '▼' }}</span>
                </div>
                <template v-if="ltog.exp.includes(m.id)">
                  <div
                    v-for="c in m.children"
                    :key="c.id"
                    @click="ltog.active = c.name"
                    class="pl-[26px] pr-2 py-1 text-[10px] cursor-pointer"
                    :class="ltog.active === c.name ? 'text-[#287dff]' : 'text-gray-600'"
                  >
                    {{ c.name }}
                  </div>
                </template>
              </template>
            </template>
          </template>
          <!-- 미니 모드: 아이콘 + hover 플로팅 -->
          <template v-else>
            <div
              v-for="m in flatMenus"
              :key="m.id"
              @mouseenter="ltogEnter(m.id)"
              @mouseleave="ltogLeave"
              class="py-2 text-center cursor-pointer relative"
            >
              <span class="text-sm">{{ m.icon }}</span>
              <div
                v-if="ltog.hover === m.id && ltogMenu"
                @mouseenter="ltogKeep"
                @mouseleave="ltogLeave"
                class="absolute left-14 top-0 bg-white min-w-[130px] shadow-[2px_2px_8px_rgba(0,0,0,0.1)] rounded-md z-20 py-1"
              >
                <div class="px-2 py-0.5 text-[9px] font-bold text-[#287dff]">{{ ltogMenu.name }}</div>
                <template v-if="ltogMenu.children?.length">
                  <div
                    v-for="c in ltogMenu.children"
                    :key="c.id"
                    @click="ltog.active = c.name"
                    class="px-2 py-1 text-[10px] cursor-pointer"
                    :class="ltog.active === c.name ? 'text-[#287dff]' : 'text-gray-500'"
                  >
                    {{ c.name }}
                  </div>
                </template>
                <div
                  v-else
                  @click="ltog.active = ltogMenu.name"
                  class="px-2 py-1 text-[10px] cursor-pointer"
                >
                  바로가기
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="flex-1 bg-white p-3.5 text-[11px] text-gray-400">
          {{ ltog.active ? `✓ ${ltog.active}` : '메뉴 선택' }}
        </div>
      </div>
    </div>

    <!-- 패턴 7: 플랫 (LeftFlat) - 필터 + 플랫 리스트 -->
    <div
      v-if="lIdx === 7"
      class="w-full bg-gray-100 rounded-lg border border-gray-200 overflow-hidden h-[420px] flex flex-col"
    >
      <div class="h-[34px] bg-[#287dff] flex items-center px-3 shrink-0">
        <span class="text-white font-bold text-[11px]">피치CRM</span>
        <span class="text-white/50 text-[8px] ml-1.5">플랫 + 필터</span>
      </div>
      <div class="flex-1 flex overflow-hidden">
        <div class="w-[190px] bg-white border-r border-gray-200 flex flex-col shrink-0">
          <div class="flex gap-0.5 p-1.5 flex-wrap border-b border-gray-100">
            <div
              @click="lflat.filter = null"
              class="px-1.5 py-0.5 text-[8px] rounded-md cursor-pointer"
              :class="!lflat.filter ? 'bg-[#287dff] text-white' : 'bg-gray-100 text-gray-500'"
            >
              전체
            </div>
            <div
              v-for="s in menuData"
              :key="s.id"
              @click="lflat.filter = s.id"
              class="px-1.5 py-0.5 text-[8px] rounded-md cursor-pointer"
              :class="lflat.filter === s.id ? 'bg-[#287dff] text-white' : 'bg-gray-100 text-gray-500'"
            >
              {{ s.icon }}
            </div>
          </div>
          <div class="flex-1 overflow-y-auto">
            <template v-for="item in flatFilteredItems" :key="item.key">
              <div
                v-if="item.type === 'child'"
                @click="lflat.active = item.name"
                class="px-2.5 py-1.5 text-[10px] cursor-pointer border-b border-gray-50"
                :class="lflat.active === item.name ? 'text-[#287dff]' : 'text-gray-700'"
              >
                <span class="text-[8px] text-gray-300">{{ item.sectionTitle }}›</span> {{ item.name }}
              </div>
              <div
                v-else
                @click="lflat.active = item.name"
                class="px-2.5 py-1.5 text-[10px] cursor-pointer border-b border-gray-50"
              >
                <span class="text-[8px] text-gray-300">{{ item.sectionTitle }}›</span> {{ item.name }}
              </div>
            </template>
          </div>
        </div>
        <div class="flex-1 bg-white p-3.5 text-[11px] text-gray-400">
          {{ lflat.active ? `✓ ${lflat.active}` : '메뉴 선택' }}
        </div>
      </div>
    </div>

    <!-- 패턴 8: 카드 (LeftCard) -->
    <div
      v-if="lIdx === 8"
      class="w-full bg-gray-100 rounded-lg border border-gray-200 overflow-hidden h-[420px] flex flex-col"
    >
      <div class="h-[34px] bg-[#287dff] flex items-center px-3 shrink-0">
        <span class="text-white font-bold text-[11px]">피치CRM</span>
        <span class="text-white/50 text-[8px] ml-1.5">카드 네비</span>
      </div>
      <div class="flex-1 flex overflow-hidden">
        <div class="w-[200px] bg-[#f8fafc] border-r border-gray-200 overflow-y-auto shrink-0 p-1.5">
          <!-- 그리드 뷰: 섹션 카드 -->
          <template v-if="!lcard.sel">
            <div class="grid grid-cols-2 gap-1.5">
              <div
                v-for="x in menuData"
                :key="x.id"
                @click="lcard.sel = x"
                class="bg-white rounded-md p-2.5 text-center cursor-pointer border border-gray-200"
              >
                <div class="text-lg">{{ x.icon }}</div>
                <div class="text-[9px] text-gray-600 mt-0.5">{{ x.title }}</div>
              </div>
            </div>
          </template>
          <!-- 상세 뷰: 선택된 섹션의 메뉴 -->
          <template v-else>
            <div
              @click="lcard.sel = null"
              class="text-[10px] text-[#287dff] cursor-pointer mb-1.5 py-[3px]"
            >
              ‹ 전체
            </div>
            <div class="text-xs font-bold mb-1.5 px-[3px]">{{ lcard.sel.icon }} {{ lcard.sel.title }}</div>
            <template v-for="m in lcard.sel.menus" :key="m.id">
              <div
                class="bg-white rounded-md mb-1.5 border border-gray-200 overflow-hidden"
              >
                <div class="px-2 py-1.5 text-[9px] font-semibold text-[#64748b] bg-gray-100">
                  {{ m.name }}
                </div>
                <template v-if="m.children?.length">
                  <div
                    v-for="c in m.children"
                    :key="c.id"
                    @click="lcard.active = c.name"
                    class="px-2 py-1.5 text-[10px] cursor-pointer border-t border-gray-100"
                    :class="lcard.active === c.name ? 'text-[#287dff]' : 'text-gray-600'"
                  >
                    {{ c.name }}
                  </div>
                </template>
                <div
                  v-else
                  @click="lcard.active = m.name"
                  class="px-2 py-1.5 text-[10px] cursor-pointer border-t border-gray-100"
                >
                  {{ m.name }} →
                </div>
              </div>
            </template>
          </template>
        </div>
        <div class="flex-1 bg-white p-3.5 text-[11px] text-gray-400">
          {{ lcard.active ? `✓ ${lcard.active}` : '메뉴 선택' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { menuData, toggleArr } from './menu-data';

// ── 좌측 메뉴 패턴 메타 ──
const leftMenus = [
  { n: 'Notion', pick: true },
  { n: '아코디언' },
  { n: '듀얼' },
  { n: '접이식' },
  { n: '컴팩트' },
  { n: '트리뷰' },
  { n: '미니↔확장' },
  { n: '플랫' },
  { n: '카드' },
];

// ── 내부 state: 선택된 패턴 인덱스 ──
const lIdx = ref(0);

// ── 플랫 메뉴 목록 (컴팩트, 미니 모드용) ──
const flatMenus = computed(() => menuData.flatMap(s => s.menus));

// ── 패턴별 reactive state ──
// 0: Notion
const lp = reactive({ e1: [1, 2] as number[], e2: [11] as number[], active: null as string | null });

// 1: 클래식 아코디언
const lc = reactive({ exp: [11] as number[], active: null as string | null });

// 2: 듀얼
const ld = reactive({ sel: 0, active: null as string | null });

// 3: 접이식
const lcol = reactive({ exp: [1] as number[], active: null as string | null });

// 4: 컴팩트 (호버 타이머)
const lcomp = reactive({ hover: null as number | null, active: null as string | null });
let lcompTimer: ReturnType<typeof setTimeout> | null = null;
const lcompMenu = computed(() => flatMenus.value.find(m => m.id === lcomp.hover));
function lcompEnter(id: number) {
  if (lcompTimer) clearTimeout(lcompTimer);
  lcomp.hover = id;
}
function lcompKeep() {
  if (lcompTimer) clearTimeout(lcompTimer);
}
function lcompLeave() {
  lcompTimer = setTimeout(() => { lcomp.hover = null; }, 150);
}

// 5: 트리뷰
const ltree = reactive({ e1: [1, 3] as number[], e2: [11] as number[], active: null as string | null });

// 6: 미니↔확장 (호버 타이머)
const ltog = reactive({
  wide: true,
  exp: [11] as number[],
  active: null as string | null,
  hover: null as number | null,
});
let ltogTimer: ReturnType<typeof setTimeout> | null = null;
const ltogMenu = computed(() => flatMenus.value.find(m => m.id === ltog.hover));
function ltogEnter(id: number) {
  if (ltogTimer) clearTimeout(ltogTimer);
  ltog.hover = id;
}
function ltogKeep() {
  if (ltogTimer) clearTimeout(ltogTimer);
}
function ltogLeave() {
  ltogTimer = setTimeout(() => { ltog.hover = null; }, 150);
}

// 7: 플랫
const lflat = reactive({ filter: null as number | null, active: null as string | null });
const flatFilteredItems = computed(() => {
  const sections = lflat.filter ? menuData.filter(s => s.id === lflat.filter) : menuData;
  const items: { key: string; name: string; sectionTitle: string; type: 'child' | 'menu' }[] = [];
  sections.forEach(s => {
    s.menus.forEach(m => {
      if (m.children?.length) {
        m.children.forEach(c => {
          items.push({ key: `c-${c.id}`, name: c.name, sectionTitle: s.title, type: 'child' });
        });
      } else {
        items.push({ key: `m-${m.id}`, name: m.name, sectionTitle: s.title, type: 'menu' });
      }
    });
  });
  return items;
});

// 8: 카드
const lcard = reactive({ sel: null as (typeof menuData)[0] | null, active: null as string | null });
</script>
