<template>
  <div class="overflow-hidden">
    <!-- 패턴 선택 탭 버튼 -->
    <div class="flex flex-wrap justify-center gap-1 mb-3.5">
      <button
        v-for="(m, i) in mobileMenus"
        :key="i"
        @click="mIdx = i"
        :class="[
          'px-2.5 py-0.5 text-[10px] rounded-xl cursor-pointer',
          mIdx === i ? (m.pick ? 'bg-[#287dff] text-white border-none' : 'bg-gray-600 text-white border-none') : (m.pick ? 'bg-white text-[#287dff] border-2 border-[#287dff] font-bold' : 'bg-white text-gray-500 border border-gray-300')
        ]"
      >
        {{ m.pick ? '⭐ ' : '' }}{{ m.n }}
      </button>
    </div>

    <div class="flex justify-center">
      <!-- 모바일 0: 탭+패널 (PICK) -->
      <div v-if="mIdx === 0" class="flex flex-col items-center">
        <div class="text-[10px] font-bold text-[#287dff] mb-1">
          탭 + 패널 분리 <span class="inline-block px-1.5 py-px text-[9px] bg-[#ff6b35] text-white rounded-lg ml-1.5 font-bold align-middle">PICK</span>
        </div>
        <div class="w-[320px] h-[580px] rounded-[28px] border-[3px] border-[#287dff] bg-white overflow-hidden relative shadow-[0_4px_20px_rgba(40,125,255,0.2)]">
          <div class="h-6 bg-[#222] flex items-center justify-center"><div class="w-[50px] h-[5px] rounded-full bg-[#444]" /></div>
          <div class="h-[556px] overflow-hidden relative">
            <!-- MobBar -->
            <div class="h-11 bg-[#287dff] flex items-center justify-between px-3 text-white shrink-0">
              <button @click="mp.open = !mp.open" class="bg-transparent border-none text-white text-xl cursor-pointer p-1">☰</button>
              <span class="font-bold text-sm">피치CRM</span>
              <span class="w-7"></span>
            </div>
            <!-- 드로어 -->
            <template v-if="mp.open">
              <div class="absolute inset-0 top-11 z-10">
                <div @click="mp.open = false" class="absolute inset-0 bg-black/30" />
                <div class="absolute left-0 top-0 bottom-0 w-[280px] bg-white flex">
                  <!-- 좌측 아이콘 탭 -->
                  <div class="w-14 bg-gray-50 border-r border-gray-200 pt-1.5">
                    <div
                      v-for="(s, i) in menuData"
                      :key="s.id"
                      @click="mp.tab = i"
                      class="py-3 text-center cursor-pointer text-lg"
                      :style="{ background: mp.tab === i ? '#fff' : 'transparent', borderRight: mp.tab === i ? '2px solid #287dff' : '2px solid transparent' }"
                    >
                      <div>{{ s.icon }}</div>
                      <div class="text-[8px] mt-px" :class="mp.tab === i ? 'text-[#287dff]' : 'text-gray-400'">{{ s.title }}</div>
                    </div>
                  </div>
                  <!-- 우측 패널 -->
                  <div class="flex-1 overflow-y-auto py-1.5">
                    <div class="px-3 py-1.5 font-bold text-[13px] text-[#287dff]">{{ menuData[mp.tab]?.title }}</div>
                    <template v-for="m in menuData[mp.tab]?.menus" :key="m.id">
                      <div
                        @click="m.children?.length ? toggleArr(mp, 'exp', m.id) : (mp.active = m.name, mp.open = false)"
                        class="px-3 py-2.5 text-xs cursor-pointer flex justify-between"
                      >
                        <span>{{ m.name }}</span>
                        <span v-if="m.children?.length" class="text-[8px] text-gray-300">{{ mp.exp.includes(m.id) ? '▲' : '▼' }}</span>
                      </div>
                      <template v-if="mp.exp.includes(m.id)">
                        <div
                          v-for="c in m.children"
                          :key="c.id"
                          @click="mp.active = c.name; mp.open = false"
                          class="py-1.5 pl-[22px] pr-3 text-[11px] cursor-pointer"
                          :class="mp.active === c.name ? 'text-[#287dff]' : 'text-gray-500'"
                        >{{ c.name }}</div>
                      </template>
                    </template>
                  </div>
                </div>
              </div>
            </template>
            <div class="p-4 text-xs text-gray-400">{{ mp.active ? `✓ ${mp.active}` : '좌측 탭 + 우측 패널' }}</div>
          </div>
        </div>
      </div>

      <!-- 모바일 1: 클래식 아코디언 -->
      <div v-if="mIdx === 1" class="flex flex-col items-center">
        <div class="text-[10px] font-medium text-gray-400 mb-1">클래식 아코디언</div>
        <div class="w-[320px] h-[580px] rounded-[28px] border-2 border-gray-300 bg-white overflow-hidden relative shadow-sm">
          <div class="h-6 bg-[#222] flex items-center justify-center"><div class="w-[50px] h-[5px] rounded-full bg-[#444]" /></div>
          <div class="h-[556px] overflow-hidden relative">
            <div class="h-11 bg-[#287dff] flex items-center justify-between px-3 text-white shrink-0">
              <button @click="mc.open = !mc.open" class="bg-transparent border-none text-white text-xl cursor-pointer p-1">☰</button>
              <span class="font-bold text-sm">피치CRM</span><span class="w-7"></span>
            </div>
            <template v-if="mc.open">
              <div class="absolute inset-0 top-11 z-10">
                <div @click="mc.open = false" class="absolute inset-0 bg-black/30" />
                <div class="absolute left-0 top-0 bottom-0 w-[260px] bg-white overflow-y-auto">
                  <template v-for="s in menuData" :key="s.id">
                    <div @click="toggleArr(mc, 'e1', s.id)" class="px-3.5 py-2.5 text-xs font-semibold text-[#287dff] bg-[#f8faff] cursor-pointer flex justify-between">
                      <span>{{ s.icon }} {{ s.title }}</span><span class="text-[9px]">{{ mc.e1.includes(s.id) ? '▲' : '▼' }}</span>
                    </div>
                    <template v-if="mc.e1.includes(s.id)">
                      <template v-for="m in s.menus" :key="m.id">
                        <div @click="m.children?.length ? toggleArr(mc, 'e2', m.id) : (mc.active = m.name)" class="pl-7 pr-3.5 py-2 text-[11px] cursor-pointer flex justify-between">
                          <span>{{ m.name }}</span><span v-if="m.children?.length" class="text-[8px]">{{ mc.e2.includes(m.id) ? '▲' : '▼' }}</span>
                        </div>
                        <template v-if="mc.e2.includes(m.id)">
                          <div v-for="c in m.children" :key="c.id" @click="mc.active = c.name; mc.open = false" class="pl-[42px] pr-3.5 py-1.5 text-[11px] cursor-pointer" :class="mc.active === c.name ? 'text-[#287dff]' : 'text-gray-500'">{{ c.name }}</div>
                        </template>
                      </template>
                    </template>
                  </template>
                </div>
              </div>
            </template>
            <div class="p-4 text-xs text-gray-400">{{ mc.active || '좌측 드로어 아코디언' }}</div>
          </div>
        </div>
      </div>

      <!-- 모바일 2: 슬라이드 -->
      <div v-if="mIdx === 2" class="flex flex-col items-center">
        <div class="text-[10px] font-medium text-gray-400 mb-1">슬라이드 네비</div>
        <div class="w-[320px] h-[580px] rounded-[28px] border-2 border-gray-300 bg-white overflow-hidden relative shadow-sm">
          <div class="h-6 bg-[#222] flex items-center justify-center"><div class="w-[50px] h-[5px] rounded-full bg-[#444]" /></div>
          <div class="h-[556px] overflow-hidden relative">
            <div class="h-11 bg-[#287dff] flex items-center justify-between px-3 text-white shrink-0">
              <button @click="msl.open = true; msl.depth = 0" class="bg-transparent border-none text-white text-xl cursor-pointer p-1">☰</button>
              <span class="font-bold text-sm">피치CRM</span><span class="w-7"></span>
            </div>
            <template v-if="msl.open">
              <div class="absolute inset-0 top-11 z-10">
                <div @click="msl.open = false; msl.depth = 0" class="absolute inset-0 bg-black/30" />
                <div class="absolute right-0 top-0 bottom-0 w-[260px] bg-white overflow-hidden">
                  <div class="flex h-full" :style="{ transition: 'transform 0.2s', transform: `translateX(-${msl.depth * 260}px)`, width: '780px' }">
                    <!-- 1단 -->
                    <div class="w-[260px] shrink-0 overflow-y-auto">
                      <div class="px-3.5 py-3 font-bold border-b border-gray-200 flex justify-between"><span>메뉴</span><button @click="msl.open = false" class="bg-transparent border-none text-base cursor-pointer">✕</button></div>
                      <div v-for="s in menuData" :key="s.id" @click="msl.s1 = s; msl.depth = 1" class="px-3.5 py-3 border-b border-gray-100 cursor-pointer flex justify-between">
                        <span>{{ s.icon }} {{ s.title }}</span><span class="text-gray-300">›</span>
                      </div>
                    </div>
                    <!-- 2단 -->
                    <div class="w-[260px] shrink-0 overflow-y-auto">
                      <div @click="msl.depth = 0" class="px-3.5 py-3 font-bold border-b border-gray-200 cursor-pointer text-[#287dff]">‹ {{ msl.s1?.title }}</div>
                      <div v-for="m in msl.s1?.menus" :key="m.id" @click="m.children?.length ? (msl.s2 = m, msl.depth = 2) : (msl.active = m.name, msl.open = false, msl.depth = 0)" class="px-3.5 py-3 border-b border-gray-100 cursor-pointer flex justify-between">
                        <span>{{ m.name }}</span><span v-if="m.children?.length" class="text-gray-300">›</span>
                      </div>
                    </div>
                    <!-- 3단 -->
                    <div class="w-[260px] shrink-0 overflow-y-auto">
                      <div @click="msl.depth = 1" class="px-3.5 py-3 font-bold border-b border-gray-200 cursor-pointer text-[#287dff]">‹ {{ msl.s2?.name }}</div>
                      <div v-for="c in msl.s2?.children" :key="c.id" @click="msl.active = c.name; msl.open = false; msl.depth = 0" class="px-3.5 py-3 border-b border-gray-100 cursor-pointer" :class="msl.active === c.name ? 'text-[#287dff]' : 'text-gray-800'">{{ c.name }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <div class="p-4 text-xs text-gray-400">{{ msl.active || '뎁스별 슬라이드' }}</div>
          </div>
        </div>
      </div>

      <!-- 모바일 3: 바텀시트 -->
      <div v-if="mIdx === 3" class="flex flex-col items-center">
        <div class="text-[10px] font-medium text-gray-400 mb-1">바텀시트</div>
        <div class="w-[320px] h-[580px] rounded-[28px] border-2 border-gray-300 bg-white overflow-hidden relative shadow-sm">
          <div class="h-6 bg-[#222] flex items-center justify-center"><div class="w-[50px] h-[5px] rounded-full bg-[#444]" /></div>
          <div class="h-[556px] overflow-hidden relative">
            <div class="h-11 bg-[#287dff] flex items-center justify-between px-3 text-white shrink-0">
              <button @click="mbt.open = !mbt.open" class="bg-transparent border-none text-white text-xl cursor-pointer p-1">☰</button>
              <span class="font-bold text-sm">피치CRM</span><span class="w-7"></span>
            </div>
            <div class="p-4 text-xs text-gray-400">{{ mbt.active || '하단 시트 아코디언' }}</div>
            <template v-if="mbt.open">
              <div @click="mbt.open = false" class="absolute inset-0 bg-black/30 z-10" />
              <div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-[14px] max-h-[70%] overflow-y-auto z-[11]">
                <div class="flex justify-center py-2 pb-1"><div class="w-8 h-1 rounded-sm bg-gray-300" /></div>
                <template v-for="m in allMenus" :key="m.id">
                  <div @click="m.children?.length ? toggleArr(mbt, 'exp', m.id) : (mbt.active = m.name, mbt.open = false)" class="px-[18px] py-[11px] flex justify-between cursor-pointer border-b border-gray-100 text-[13px]">
                    <span>{{ m.icon }} {{ m.name }}</span><span v-if="m.children?.length" class="text-[9px] text-gray-400">{{ mbt.exp.includes(m.id) ? '▲' : '▼' }}</span>
                  </div>
                  <template v-if="mbt.exp.includes(m.id)">
                    <div v-for="c in m.children" :key="c.id" @click="mbt.active = c.name; mbt.open = false" class="pl-10 pr-[18px] py-2.5 text-xs cursor-pointer border-b border-gray-50" :class="mbt.active === c.name ? 'text-[#287dff]' : 'text-gray-500'">{{ c.name }}</div>
                  </template>
                </template>
                <div class="h-4" />
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- 모바일 4: 그리드 -->
      <div v-if="mIdx === 4" class="flex flex-col items-center">
        <div class="text-[10px] font-medium text-gray-400 mb-1">풀스크린 그리드</div>
        <div class="w-[320px] h-[580px] rounded-[28px] border-2 border-gray-300 bg-white overflow-hidden relative shadow-sm">
          <div class="h-6 bg-[#222] flex items-center justify-center"><div class="w-[50px] h-[5px] rounded-full bg-[#444]" /></div>
          <div class="h-[556px] overflow-hidden relative">
            <div class="h-11 bg-[#287dff] flex items-center justify-between px-3 text-white shrink-0">
              <button @click="mgr.open = !mgr.open; mgr.sel = null" class="bg-transparent border-none text-white text-xl cursor-pointer p-1">☰</button>
              <span class="font-bold text-sm">피치CRM</span><span class="w-7"></span>
            </div>
            <template v-if="mgr.open">
              <div class="absolute inset-0 top-11 bg-white z-10 overflow-y-auto">
                <div class="flex justify-end px-2.5 py-1.5"><button @click="mgr.open = false" class="bg-transparent border-none text-lg cursor-pointer">✕</button></div>
                <template v-if="!mgr.sel">
                  <div class="grid grid-cols-2 gap-2.5 px-4 pb-4">
                    <div v-for="s in menuData" :key="s.id" @click="mgr.sel = s" class="bg-[#f8faff] rounded-[10px] p-4 text-center cursor-pointer border border-[#e8edf5]">
                      <div class="text-2xl">{{ s.icon }}</div><div class="text-xs font-semibold mt-1">{{ s.title }}</div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="px-4">
                    <div @click="mgr.sel = null" class="text-[#287dff] text-xs cursor-pointer mb-2.5">‹ 전체</div>
                    <div class="text-[15px] font-bold mb-3">{{ mgr.sel.icon }} {{ mgr.sel.title }}</div>
                    <div v-for="m in mgr.sel.menus" :key="m.id" class="mb-3">
                      <div class="text-xs font-semibold text-gray-500 mb-1">{{ m.name }}</div>
                      <div v-if="m.children?.length" class="grid grid-cols-2 gap-1.5">
                        <div v-for="c in m.children" :key="c.id" @click="mgr.active = c.name; mgr.open = false" class="px-2.5 py-2 rounded-md text-[11px] cursor-pointer text-center" :class="mgr.active === c.name ? 'bg-[#287dff] text-white' : 'bg-gray-100 text-gray-800'">{{ c.name }}</div>
                      </div>
                      <div v-else @click="mgr.active = m.name; mgr.open = false" class="px-2.5 py-2 bg-gray-100 rounded-md text-[11px] cursor-pointer">{{ m.name }}</div>
                    </div>
                  </div>
                </template>
              </div>
            </template>
            <div v-if="!mgr.open" class="p-4 text-xs text-gray-400">{{ mgr.active || '그리드 카드 탐색' }}</div>
          </div>
        </div>
      </div>

      <!-- 모바일 5: 세그먼트 -->
      <div v-if="mIdx === 5" class="flex flex-col items-center">
        <div class="text-[10px] font-medium text-gray-400 mb-1">세그먼트 탭</div>
        <div class="w-[320px] h-[580px] rounded-[28px] border-2 border-gray-300 bg-white overflow-hidden relative shadow-sm">
          <div class="h-6 bg-[#222] flex items-center justify-center"><div class="w-[50px] h-[5px] rounded-full bg-[#444]" /></div>
          <div class="h-[556px] overflow-hidden relative">
            <div class="h-11 bg-[#287dff] flex items-center justify-between px-3 text-white shrink-0">
              <button @click="mseg.open = !mseg.open" class="bg-transparent border-none text-white text-xl cursor-pointer p-1">☰</button>
              <span class="font-bold text-sm">피치CRM</span><span class="w-7"></span>
            </div>
            <template v-if="mseg.open">
              <div @click="mseg.open = false" class="absolute inset-0 bg-black/30 z-10" />
              <div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-[14px] max-h-[75%] z-[11] overflow-y-auto">
                <div class="flex justify-center py-2 pb-1"><div class="w-8 h-1 rounded-sm bg-gray-300" /></div>
                <div class="flex gap-0 px-2.5 pb-1.5 overflow-x-auto">
                  <button v-for="(s, i) in menuData" :key="s.id" @click="mseg.tab = i" :class="['px-[11px] py-[5px] text-[11px] border-none rounded-2xl cursor-pointer whitespace-nowrap mr-1', mseg.tab === i ? 'font-bold bg-[#287dff] text-white' : 'bg-gray-100 text-gray-500']">{{ s.title }}</button>
                </div>
                <template v-for="m in menuData[mseg.tab]?.menus" :key="m.id">
                  <div class="px-3.5 py-[5px] text-[10px] text-gray-400 font-semibold">{{ m.name }}</div>
                  <template v-if="m.children?.length">
                    <div v-for="c in m.children" :key="c.id" @click="mseg.active = c.name; mseg.open = false" class="pl-6 pr-3.5 py-2.5 text-xs cursor-pointer border-b border-gray-100" :class="mseg.active === c.name ? 'text-[#287dff]' : 'text-gray-800'">{{ c.name }}</div>
                  </template>
                  <div v-else @click="mseg.active = m.name; mseg.open = false" class="pl-6 pr-3.5 py-2.5 text-xs cursor-pointer border-b border-gray-100">{{ m.name }} →</div>
                </template>
              </div>
            </template>
            <div class="p-4 text-xs text-gray-400">{{ mseg.active || '세그먼트 필터 + 리스트' }}</div>
          </div>
        </div>
      </div>

      <!-- 모바일 6: 바텀 네비 -->
      <div v-if="mIdx === 6" class="flex flex-col items-center">
        <div class="text-[10px] font-medium text-gray-400 mb-1">바텀 네비</div>
        <div class="w-[320px] h-[580px] rounded-[28px] border-2 border-gray-300 bg-white overflow-hidden relative shadow-sm">
          <div class="h-6 bg-[#222] flex items-center justify-center"><div class="w-[50px] h-[5px] rounded-full bg-[#444]" /></div>
          <div class="h-[556px] overflow-hidden relative flex flex-col">
            <div class="h-11 bg-[#287dff] flex items-center justify-center text-white font-bold text-sm">피치CRM</div>
            <div class="flex-1 p-4 text-xs text-gray-400">{{ mbn.active || '하단 탭 → 팝업 서브메뉴' }}</div>
            <template v-if="mbn.sel">
              <div @click="mbn.sel = null" class="absolute inset-0 bg-black/15 z-10" />
              <div class="absolute bottom-[52px] left-1.5 right-1.5 bg-white rounded-[10px] shadow-[0_-2px_14px_rgba(0,0,0,0.1)] z-[11] py-2.5 max-h-[260px] overflow-y-auto">
                <template v-for="m in mbn.sel.menus" :key="m.id">
                  <div class="px-3.5 py-[3px] text-[10px] text-gray-400 font-semibold">{{ m.name }}</div>
                  <template v-if="m.children?.length">
                    <div v-for="c in m.children" :key="c.id" @click="mbn.active = c.name; mbn.sel = null" class="pl-6 pr-3.5 py-2 text-xs cursor-pointer" :class="mbn.active === c.name ? 'text-[#287dff]' : 'text-gray-800'">{{ c.name }}</div>
                  </template>
                  <div v-else @click="mbn.active = m.name; mbn.sel = null" class="pl-6 pr-3.5 py-2 text-xs cursor-pointer">{{ m.name }}</div>
                </template>
              </div>
            </template>
            <div class="h-[52px] border-t border-gray-200 flex bg-white relative z-[5]">
              <div v-for="s in menuData" :key="s.id" @click="mbn.sel = mbn.sel?.id === s.id ? null : s" class="flex-1 flex flex-col items-center justify-center cursor-pointer" :class="mbn.sel?.id === s.id ? 'text-[#287dff]' : 'text-gray-400'">
                <span class="text-base">{{ s.icon }}</span><span class="text-[8px] mt-px">{{ s.title }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 모바일 7: 스와이프 카드 -->
      <div v-if="mIdx === 7" class="flex flex-col items-center">
        <div class="text-[10px] font-medium text-gray-400 mb-1">스와이프 카드</div>
        <div class="w-[320px] h-[580px] rounded-[28px] border-2 border-gray-300 bg-white overflow-hidden relative shadow-sm">
          <div class="h-6 bg-[#222] flex items-center justify-center"><div class="w-[50px] h-[5px] rounded-full bg-[#444]" /></div>
          <div class="h-[556px] overflow-hidden relative">
            <div class="h-11 bg-[#287dff] flex items-center justify-center text-white font-bold text-sm">피치CRM</div>
            <div class="px-3.5 pt-2.5 pb-1">
              <div class="flex gap-[5px] overflow-x-auto pb-1.5">
                <button v-for="(s, i) in menuData" :key="s.id" @click="msw.idx = i" :class="['px-3 py-[5px] text-[11px] rounded-2xl cursor-pointer whitespace-nowrap', msw.idx === i ? 'font-bold bg-[#287dff] text-white border-none' : 'bg-transparent text-gray-400 border border-gray-300']">{{ s.icon }} {{ s.title }}</button>
              </div>
            </div>
            <div class="px-3.5 overflow-y-auto">
              <div v-for="m in menuData[msw.idx]?.menus" :key="m.id" class="bg-gray-50 rounded-[10px] mb-2 overflow-hidden border border-gray-200">
                <div class="px-3 py-2.5 font-semibold text-xs" :class="m.children?.length ? 'border-b border-gray-200' : ''">{{ m.icon }} {{ m.name }}</div>
                <div v-for="c in m.children" :key="c.id" @click="msw.active = c.name" class="pl-7 pr-3 py-2 text-[11px] cursor-pointer border-b border-gray-100" :class="msw.active === c.name ? 'text-[#287dff]' : 'text-gray-500'">{{ c.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 모바일 8: 검색 -->
      <div v-if="mIdx === 8" class="flex flex-col items-center">
        <div class="text-[10px] font-medium text-gray-400 mb-1">검색 + 트리</div>
        <div class="w-[320px] h-[580px] rounded-[28px] border-2 border-gray-300 bg-white overflow-hidden relative shadow-sm">
          <div class="h-6 bg-[#222] flex items-center justify-center"><div class="w-[50px] h-[5px] rounded-full bg-[#444]" /></div>
          <div class="h-[556px] overflow-hidden relative">
            <div class="h-11 bg-[#287dff] flex items-center justify-between px-3 text-white shrink-0">
              <button @click="msr.open = !msr.open" class="bg-transparent border-none text-white text-xl cursor-pointer p-1">☰</button>
              <span class="font-bold text-sm">피치CRM</span><span class="w-7"></span>
            </div>
            <template v-if="msr.open">
              <div class="absolute inset-0 top-11 bg-white z-10 overflow-y-auto">
                <div class="px-2.5 pt-2.5 pb-1.5 sticky top-0 bg-white border-b border-gray-200">
                  <input v-model="msr.q" placeholder="메뉴 검색..." class="w-full px-2.5 py-2 border border-gray-300 rounded-md text-xs outline-none box-border" />
                </div>
                <div v-for="(x, i) in filteredMenuItems" :key="i" @click="msr.active = x.name; msr.open = false" class="px-3.5 py-2.5 text-[11px] border-b border-gray-50 cursor-pointer" :class="msr.active === x.name ? 'text-[#287dff]' : 'text-gray-800'">{{ x.label }}</div>
                <div class="p-3.5 text-center"><button @click="msr.open = false" class="px-5 py-1.5 bg-gray-100 border-none rounded-md cursor-pointer text-[11px]">닫기</button></div>
              </div>
            </template>
            <div class="p-4 text-xs text-gray-400">{{ msr.active || '검색 기반 탐색' }}</div>
          </div>
        </div>
      </div>

      <!-- 모바일 9: FAB -->
      <div v-if="mIdx === 9" class="flex flex-col items-center">
        <div class="text-[10px] font-medium text-gray-400 mb-1">FAB 팝업</div>
        <div class="w-[320px] h-[580px] rounded-[28px] border-2 border-gray-300 bg-white overflow-hidden relative shadow-sm">
          <div class="h-6 bg-[#222] flex items-center justify-center"><div class="w-[50px] h-[5px] rounded-full bg-[#444]" /></div>
          <div class="h-[556px] overflow-hidden relative">
            <div class="h-11 bg-[#287dff] flex items-center justify-center text-white font-bold text-sm">피치CRM</div>
            <div class="p-4 text-xs text-gray-400">{{ mfab.active || 'FAB → 섹션 → 서브메뉴' }}</div>
            <!-- FAB 섹션 선택 -->
            <template v-if="mfab.open && !mfab.sel">
              <div @click="mfab.open = false" class="absolute inset-0 bg-black/30 z-10" />
              <div class="absolute bottom-[72px] right-3.5 z-[11] flex flex-col gap-[7px] items-end">
                <div v-for="s in menuData" :key="s.id" @click="mfab.sel = s" class="flex items-center gap-1.5 cursor-pointer">
                  <span class="bg-white px-2.5 py-[5px] rounded-md text-[11px] shadow-[0_1px_6px_rgba(0,0,0,0.1)]">{{ s.title }}</span>
                  <span class="w-9 h-9 rounded-full bg-[#287dff] text-white flex items-center justify-center text-base">{{ s.icon }}</span>
                </div>
              </div>
            </template>
            <!-- FAB 서브메뉴 -->
            <template v-if="mfab.sel">
              <div @click="mfab.sel = null; mfab.open = false" class="absolute inset-0 bg-black/30 z-10" />
              <div class="absolute bottom-[72px] right-3.5 left-3.5 bg-white rounded-[10px] z-[11] p-3.5 shadow-[0_4px_18px_rgba(0,0,0,0.15)]">
                <div class="font-bold text-[13px] mb-2">{{ mfab.sel.icon }} {{ mfab.sel.title }}</div>
                <template v-for="m in mfab.sel.menus" :key="m.id">
                  <div class="text-[11px] text-gray-400 font-semibold mt-1.5 mb-[3px]">{{ m.name }}</div>
                  <template v-if="m.children?.length">
                    <div v-for="c in m.children" :key="c.id" @click="mfab.active = c.name; mfab.sel = null; mfab.open = false" class="px-2.5 py-1.5 text-xs cursor-pointer rounded" :class="mfab.active === c.name ? 'text-[#287dff]' : 'text-gray-800'">{{ c.name }}</div>
                  </template>
                  <div v-else @click="mfab.active = m.name; mfab.sel = null; mfab.open = false" class="px-2.5 py-1.5 text-xs cursor-pointer">{{ m.name }}</div>
                </template>
              </div>
            </template>
            <!-- FAB 버튼 -->
            <div v-if="!mfab.sel" @click="mfab.open = !mfab.open" class="absolute bottom-5 right-3.5 w-12 h-12 rounded-full bg-[#287dff] text-white flex items-center justify-center text-[22px] cursor-pointer shadow-[0_3px_10px_rgba(40,125,255,0.4)] z-[5] transition-transform duration-200" :style="{ transform: mfab.open ? 'rotate(45deg)' : 'rotate(0)' }">+</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { menuData, allMenus, allFlatItems, toggleArr } from './menu-data';

// ── 패턴 선택 인덱스 (내부 state) ──
const mIdx = ref(0);

// ── 모바일 패턴 메타 목록 ──
const mobileMenus = [
  { n: '탭+패널', pick: true },
  { n: '아코디언' },
  { n: '슬라이드' },
  { n: '바텀시트' },
  { n: '그리드' },
  { n: '세그먼트' },
  { n: '바텀네비' },
  { n: '카드' },
  { n: '검색' },
  { n: 'FAB' },
];

// ── 모바일 패턴별 상태 ──
// mp: 탭+패널 (PICK)
const mp = reactive({ open: false, tab: 0, exp: [] as number[], active: null as string | null });
// mc: 클래식 아코디언
const mc = reactive({ open: false, e1: [] as number[], e2: [] as number[], active: null as string | null });
// msl: 슬라이드 네비
const msl = reactive<{ open: boolean; depth: number; s1: (typeof menuData)[0] | null; s2: (typeof menuData)[0]['menus'][0] | null; active: string | null }>({ open: false, depth: 0, s1: null, s2: null, active: null });
// mbt: 바텀시트
const mbt = reactive({ open: false, exp: [] as number[], active: null as string | null });
// mgr: 풀스크린 그리드
const mgr = reactive({ open: false, sel: null as (typeof menuData)[0] | null, active: null as string | null });
// mseg: 세그먼트 탭
const mseg = reactive({ open: false, tab: 0, active: null as string | null });
// mbn: 바텀 네비
const mbn = reactive({ sel: null as (typeof menuData)[0] | null, active: null as string | null });
// msw: 스와이프 카드
const msw = reactive({ idx: 0, active: null as string | null });
// msr: 검색 + 트리
const msr = reactive({ open: false, q: '', active: null as string | null });
// mfab: FAB 팝업
const mfab = reactive({ open: false, sel: null as (typeof menuData)[0] | null, active: null as string | null });

// ── 검색 필터 (모바일 8번 패턴용) ──
const filteredMenuItems = computed(() => {
  if (msr.q) return allFlatItems.filter(x => x.label.includes(msr.q));
  return allFlatItems;
});
</script>
