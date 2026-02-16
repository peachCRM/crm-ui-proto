import type { NgoBanner } from '../type/ngo-banner.type';

/**
 * NGO 배너 모듈용 Mock 데이터
 * 1시간마다 크롤링된 네이버/카카오톡 배너 샘플 데이터
 */

const now = new Date().toISOString();
const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
const twoHoursAgo = new Date(Date.now() - 7200000).toISOString();
const threeHoursAgo = new Date(Date.now() - 10800000).toISOString();
const yesterday = new Date(Date.now() - 86400000).toISOString();
const twoDaysAgo = new Date(Date.now() - 172800000).toISOString();

/**
 * Mock NGO 배너 데이터 목록
 */
export const mockNgoBannerList: NgoBanner[] = [
  {
    bannerSeq: 1,
    ngoName: '유니세프 한국위원회',
    platform: 'naver',
    bannerTitle: '아이들에게 깨끗한 물을',
    bannerImageUrl: 'https://picsum.photos/seed/unicef-naver-1/728/90',
    bannerLinkUrl: 'https://www.unicef.or.kr/campaign/water',
    crawledDate: now,
    insertDate: now
  },
  {
    bannerSeq: 2,
    ngoName: '유니세프 한국위원회',
    platform: 'kakao',
    bannerTitle: '매달 1만원으로 아이를 살려주세요',
    bannerImageUrl: 'https://picsum.photos/seed/unicef-kakao-1/640/100',
    bannerLinkUrl: 'https://www.unicef.or.kr/donate/monthly',
    crawledDate: now,
    insertDate: now
  },
  {
    bannerSeq: 3,
    ngoName: '월드비전',
    platform: 'naver',
    bannerTitle: '긴급구호 캠페인 - 지진 피해 아동 지원',
    bannerImageUrl: 'https://picsum.photos/seed/worldvision-naver-1/728/90',
    bannerLinkUrl: 'https://www.worldvision.or.kr/emergency',
    crawledDate: oneHourAgo,
    insertDate: oneHourAgo
  },
  {
    bannerSeq: 4,
    ngoName: '월드비전',
    platform: 'kakao',
    bannerTitle: '해외아동 결연 후원',
    bannerImageUrl: 'https://picsum.photos/seed/worldvision-kakao-1/640/100',
    bannerLinkUrl: 'https://www.worldvision.or.kr/sponsor',
    crawledDate: oneHourAgo,
    insertDate: oneHourAgo
  },
  {
    bannerSeq: 5,
    ngoName: '굿네이버스',
    platform: 'naver',
    bannerTitle: '희망편지 쓰기 캠페인',
    bannerImageUrl: 'https://picsum.photos/seed/goodneighbors-naver-1/728/90',
    bannerLinkUrl: 'https://www.goodneighbors.kr/campaign/letter',
    crawledDate: twoHoursAgo,
    insertDate: twoHoursAgo
  },
  {
    bannerSeq: 6,
    ngoName: '굿네이버스',
    platform: 'kakao',
    bannerTitle: '아이들의 꿈을 응원해주세요',
    bannerImageUrl: 'https://picsum.photos/seed/goodneighbors-kakao-1/640/100',
    bannerLinkUrl: 'https://www.goodneighbors.kr/donate',
    crawledDate: twoHoursAgo,
    insertDate: twoHoursAgo
  },
  {
    bannerSeq: 7,
    ngoName: '세이브더칠드런',
    platform: 'naver',
    bannerTitle: '신생아 살리기 모자뜨기 캠페인',
    bannerImageUrl: 'https://picsum.photos/seed/savechildren-naver-1/728/90',
    bannerLinkUrl: 'https://www.sc.or.kr/campaign/knitting',
    crawledDate: threeHoursAgo,
    insertDate: threeHoursAgo
  },
  {
    bannerSeq: 8,
    ngoName: '세이브더칠드런',
    platform: 'kakao',
    bannerTitle: '아동학대 예방 캠페인',
    bannerImageUrl: 'https://picsum.photos/seed/savechildren-kakao-1/640/100',
    bannerLinkUrl: 'https://www.sc.or.kr/campaign/prevention',
    crawledDate: threeHoursAgo,
    insertDate: threeHoursAgo
  },
  {
    bannerSeq: 9,
    ngoName: '초록우산 어린이재단',
    platform: 'naver',
    bannerTitle: '따뜻한 겨울나기 캠페인',
    bannerImageUrl: 'https://picsum.photos/seed/childfund-naver-1/728/90',
    bannerLinkUrl: 'https://www.childfund.or.kr/campaign/winter',
    crawledDate: yesterday,
    insertDate: yesterday
  },
  {
    bannerSeq: 10,
    ngoName: '초록우산 어린이재단',
    platform: 'kakao',
    bannerTitle: '아이들의 건강한 성장을 위해',
    bannerImageUrl: 'https://picsum.photos/seed/childfund-kakao-1/640/100',
    bannerLinkUrl: 'https://www.childfund.or.kr/donate',
    crawledDate: yesterday,
    insertDate: yesterday
  },
  {
    bannerSeq: 11,
    ngoName: '한국컴패션',
    platform: 'naver',
    bannerTitle: '어린이 1:1 결연 후원',
    bannerImageUrl: 'https://picsum.photos/seed/compassion-naver-1/728/90',
    bannerLinkUrl: 'https://www.compassion.or.kr/sponsor',
    crawledDate: yesterday,
    insertDate: yesterday
  },
  {
    bannerSeq: 12,
    ngoName: '한국컴패션',
    platform: 'kakao',
    bannerTitle: '생일 축하 선물 보내기',
    bannerImageUrl: 'https://picsum.photos/seed/compassion-kakao-1/640/100',
    bannerLinkUrl: 'https://www.compassion.or.kr/gift',
    crawledDate: twoDaysAgo,
    insertDate: twoDaysAgo
  },
  {
    bannerSeq: 13,
    ngoName: '대한적십자사',
    platform: 'naver',
    bannerTitle: '재난구호 기금 모금',
    bannerImageUrl: 'https://picsum.photos/seed/redcross-naver-1/728/90',
    bannerLinkUrl: 'https://www.redcross.or.kr/donate/disaster',
    crawledDate: twoDaysAgo,
    insertDate: twoDaysAgo
  },
  {
    bannerSeq: 14,
    ngoName: '대한적십자사',
    platform: 'kakao',
    bannerTitle: '헌혈 참여 캠페인',
    bannerImageUrl: 'https://picsum.photos/seed/redcross-kakao-1/640/100',
    bannerLinkUrl: 'https://www.redcross.or.kr/campaign/blood',
    crawledDate: twoDaysAgo,
    insertDate: twoDaysAgo
  },
  {
    bannerSeq: 15,
    ngoName: '그린피스',
    platform: 'naver',
    bannerTitle: '플라스틱 제로 캠페인',
    bannerImageUrl: 'https://picsum.photos/seed/greenpeace-naver-1/728/90',
    bannerLinkUrl: 'https://www.greenpeace.org/korea/plastic-free',
    crawledDate: twoDaysAgo,
    insertDate: twoDaysAgo
  }
];

/**
 * Mock 데이터 생성 함수
 * 추가 테스트 데이터가 필요할 때 사용
 */
export const generateMockNgoBannerData = (count: number): NgoBanner[] => {
  const ngoNames = ['유니세프', '월드비전', '굿네이버스', '세이브더칠드런', '초록우산', '한국컴패션', '대한적십자사', '그린피스'];
  const platforms = ['naver', 'kakao'];
  const result: NgoBanner[] = [];
  const baseSeq = 100;

  for (let i = 0; i < count; i++) {
    const seq = baseSeq + i;
    const ngo = ngoNames[i % ngoNames.length];
    const platform = platforms[i % platforms.length];
    result.push({
      bannerSeq: seq,
      ngoName: ngo,
      platform,
      bannerTitle: `${ngo} ${platform === 'naver' ? '네이버' : '카카오'} 배너 #${seq}`,
      bannerImageUrl: `https://picsum.photos/seed/${ngo}-${platform}-${seq}/${platform === 'naver' ? '728/90' : '640/100'}`,
      bannerLinkUrl: `https://example.com/${ngo}/${seq}`,
      crawledDate: new Date(Date.now() - i * 3600000).toISOString(),
      insertDate: new Date(Date.now() - i * 3600000).toISOString()
    });
  }

  return result;
};

/**
 * 전체 Mock 데이터 (기본 + 추가 생성)
 */
export const getAllMockNgoBannerData = (additionalCount: number = 0): NgoBanner[] => {
  return [...mockNgoBannerList, ...generateMockNgoBannerData(additionalCount)];
};
