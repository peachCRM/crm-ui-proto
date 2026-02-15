import type { AxiosRequestConfig } from 'axios';

/**
 * Mock API 서비스
 * Backend API 없이 프론트엔드만 독립 실행하기 위한 Mock 구현
 */

// Mock 데이터 저장소
const mockDataStore: Record<string, any[]> = {};

// Mock 시퀀스 카운터
let mockSeqCounter = 100;

// API 인스턴스 타입 정의
interface MockAxiosInstance {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

/**
 * Mock API 응답 지연 시뮬레이션 (ms)
 */
const delay = (ms: number = 100) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * URL에서 모듈명 추출
 */
const getModuleName = (url: string): string => {
  const parts = url.split('/').filter(Boolean);
  return parts[0] || 'unknown';
};

/**
 * URL에서 ID 추출 (예: /test-data/123 -> 123)
 */
const extractIdFromUrl = (url: string): number | null => {
  const match = url.match(/\/(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
};

/**
 * 상품 Mock 데이터 생성
 */
const createProductMockData = () => {
  const products = [
    { name: '프리미엄 코튼 티셔츠', code: 'CLO-001', category: 'clothing', price: 39000, cost: 15000, stock: 150, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200' },
    { name: '슬림핏 청바지', code: 'CLO-002', category: 'clothing', price: 69000, cost: 28000, stock: 80, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200' },
    { name: '무선 블루투스 이어폰', code: 'ELE-001', category: 'electronics', price: 89000, cost: 35000, stock: 200, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200' },
    { name: '스마트 워치 프로', code: 'ELE-002', category: 'electronics', price: 299000, cost: 150000, stock: 50, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200' },
    { name: '유기농 그래놀라', code: 'FOO-001', category: 'food', price: 12000, cost: 5000, stock: 300, image: 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=200' },
    { name: '프리미엄 올리브오일', code: 'FOO-002', category: 'food', price: 25000, cost: 12000, stock: 100, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200' },
    { name: '모던 원목 책상', code: 'FUR-001', category: 'furniture', price: 450000, cost: 200000, stock: 20, image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=200' },
    { name: '인체공학 의자', code: 'FUR-002', category: 'furniture', price: 380000, cost: 180000, stock: 30, image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=200' },
    { name: '수분 에센스', code: 'BEA-001', category: 'beauty', price: 45000, cost: 18000, stock: 120, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200' },
    { name: '선크림 SPF50+', code: 'BEA-002', category: 'beauty', price: 28000, cost: 10000, stock: 200, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200' }
  ];

  return products.map((p, i) => {
    const seq = mockSeqCounter++;
    const now = new Date().toISOString();
    return {
      productSeq: seq,
      productName: p.name,
      productCode: p.code,
      category: p.category,
      price: p.price,
      costPrice: p.cost,
      stockQty: p.stock,
      description: `${p.name}에 대한 상세 설명입니다. 고품질의 제품으로 고객 만족도가 높습니다.`,
      imageUrl: p.image,
      isUse: i % 4 === 0 ? 'N' : 'Y',
      isDelete: 'N',
      insertSeq: 1,
      insertDate: now,
      updateSeq: 1,
      updateDate: now,
      fileList: [],
      imageList: []
    };
  });
};

/**
 * 주문 Mock 데이터 생성
 */
const createOrderMockData = () => {
  const orders = [
    { orderer: '김철수', phone: '010-1234-5678', product: '프리미엄 코튼 티셔츠', qty: 2, price: 39000, status: 'delivered', payment: 'card' },
    { orderer: '이영희', phone: '010-2345-6789', product: '무선 블루투스 이어폰', qty: 1, price: 89000, status: 'shipped', payment: 'card' },
    { orderer: '박민수', phone: '010-3456-7890', product: '유기농 그래놀라', qty: 3, price: 12000, status: 'confirmed', payment: 'bank' },
    { orderer: '최지영', phone: '010-4567-8901', product: '모던 원목 책상', qty: 1, price: 450000, status: 'pending', payment: 'cash' },
    { orderer: '정대호', phone: '010-5678-9012', product: '수분 에센스', qty: 2, price: 45000, status: 'delivered', payment: 'card' },
    { orderer: '한소희', phone: '010-6789-0123', product: '스마트 워치 프로', qty: 1, price: 299000, status: 'cancelled', payment: 'card' },
    { orderer: '강민준', phone: '010-7890-1234', product: '슬림핏 청바지', qty: 1, price: 69000, status: 'shipped', payment: 'bank' },
    { orderer: '윤서연', phone: '010-8901-2345', product: '인체공학 의자', qty: 1, price: 380000, status: 'confirmed', payment: 'card' }
  ];

  return orders.map((o, i) => {
    const seq = mockSeqCounter++;
    const orderDate = new Date(Date.now() - i * 86400000).toISOString();
    const shipping = o.price * o.qty >= 50000 ? 0 : 3000;
    return {
      orderSeq: seq,
      orderNo: `ORD-${String(seq).padStart(8, '0')}`,
      orderDate,
      orderStatus: o.status,
      ordererName: o.orderer,
      ordererPhone: o.phone,
      ordererEmail: `${o.orderer.toLowerCase().replace(/[^a-z]/g, '')}@example.com`,
      productSeq: 100 + i,
      productName: o.product,
      productCode: `PRD-${String(i + 1).padStart(3, '0')}`,
      productImageUrl: `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200`,
      quantity: o.qty,
      unitPrice: o.price,
      receiverName: o.orderer,
      receiverPhone: o.phone,
      receiverZipcode: '12345',
      receiverAddress: '서울시 강남구 테헤란로 123',
      receiverAddressDetail: `${i + 1}층 ${i + 101}호`,
      deliveryMemo: '부재시 경비실에 맡겨주세요',
      paymentMethod: o.payment,
      totalAmount: o.price * o.qty + shipping,
      shippingFee: shipping,
      discountAmount: 0,
      isUse: 'Y',
      isDelete: 'N',
      insertSeq: 1,
      insertDate: orderDate,
      updateSeq: 1,
      updateDate: orderDate,
      fileList: [],
      imageList: []
    };
  });
};

/**
 * Mock 데이터 초기화 (기본 데이터 생성)
 */
const initMockData = (moduleName: string) => {
  if (!mockDataStore[moduleName]) {
    // 모듈별 특화 데이터 생성
    if (moduleName === 'product') {
      mockDataStore[moduleName] = createProductMockData();
      return;
    }
    if (moduleName === 'order') {
      mockDataStore[moduleName] = createOrderMockData();
      return;
    }

    // 기본 Mock 데이터 생성 (20개)
    mockDataStore[moduleName] = [];
    for (let i = 1; i <= 20; i++) {
      const seq = mockSeqCounter++;
      const now = new Date().toISOString();
      mockDataStore[moduleName].push({
        testSeq: seq,
        [`${moduleName.replace(/-/g, '')}Seq`]: seq,
        value: `value-${i}`,
        subject: `테스트 제목 ${i}`,
        contents: `테스트 내용 ${i}입니다.`,
        bigint: i * 1000,
        isUse: i % 3 === 0 ? 'N' : 'Y',
        isDelete: 'N',
        insertSeq: 1,
        insertDate: now,
        updateSeq: 1,
        updateDate: now,
        fileList: [],
        imageList: []
      });
    }
  }
};

/**
 * Mock API 생성
 */
const createMockApi = (): MockAxiosInstance => {
  return {
    /**
     * GET 요청 처리
     */
    async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
      await delay();
      logMockApi('GET', url, config?.params);

      const moduleName = getModuleName(url);
      initMockData(moduleName);

      // 상세 조회 (예: /test-data/123)
      const id = extractIdFromUrl(url);
      if (id !== null) {
        const item = mockDataStore[moduleName].find(
          (item) => item[`${moduleName.replace(/-/g, '')}Seq`] === id || item.testSeq === id
        );
        if (item) {
          return { ...item, fileList: item.fileList || [], imageList: item.imageList || [] } as T;
        }
        throw createMockError(404, '데이터를 찾을 수 없습니다.');
      }

      // 목록 조회
      if (url.includes('/list')) {
        return mockDataStore[moduleName] as T;
      }

      // 커서 기반 목록 (무한 스크롤, 더보기)
      if (url.includes('/cursor-list')) {
        const limit = config?.params?.limit || 10;
        const cursor = config?.params?.cursor;
        // cursor가 있으면 다음 페이지, 없으면 첫 페이지
        const startIndex = cursor ? Math.min(limit, mockDataStore[moduleName].length) : 0;
        const list = mockDataStore[moduleName].slice(startIndex, startIndex + limit);
        const hasMore = startIndex + limit < mockDataStore[moduleName].length;
        return {
          list,
          nextCursor: hasMore ? `cursor-${startIndex + limit}` : null
        } as T;
      }

      // 페이징 목록 (기본)
      const params = config?.params || {};
      const page = params.page || 1;
      const row = params.row || 10;
      const start = (page - 1) * row;
      const data = mockDataStore[moduleName].slice(start, start + row);

      return {
        data,
        totalRow: mockDataStore[moduleName].length
      } as T;
    },

    /**
     * POST 요청 처리
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async post<T = any>(url: string, data?: any, _config?: AxiosRequestConfig): Promise<T> {
      await delay();
      logMockApi('POST', url, data);

      const moduleName = getModuleName(url);
      initMockData(moduleName);

      // 파일 업로드
      if (url.includes('/file/upload')) {
        const fileUuid = `mock-uuid-${Date.now()}`;
        return {
          fileSeq: mockSeqCounter++,
          storageType: 'LOCAL',
          fileAuth: 'PUBLIC',
          fileUuid,
          fileFolder: '/mock/uploads',
          filePath: `/mock/uploads/${fileUuid}`,
          fileName: 'mock-file.txt',
          fileSize: 1024,
          fileType: 'text/plain'
        } as T;
      }

      // 엑셀 업로드
      if (url.includes('/excel/upload')) {
        const items = Array.isArray(data) ? data : [data];
        items.forEach((item) => {
          const newItem = createMockItem(moduleName, item);
          mockDataStore[moduleName].unshift(newItem);
        });
        return { isSuccess: true, insertedCount: items.length } as T;
      }

      // TDD 초기화
      if (url.includes('/tdd/init')) {
        const newItem = createMockItem(moduleName, data);
        mockDataStore[moduleName].unshift(newItem);
        return { isSuccess: true, testSeq: newItem.testSeq } as T;
      }

      // 일반 등록
      const newItem = createMockItem(moduleName, data);
      mockDataStore[moduleName].unshift(newItem);

      const seqKey = `${moduleName.replace(/-/g, '')}Seq`;
      return {
        isSuccess: true,
        [seqKey]: newItem[seqKey] || newItem.testSeq
      } as T;
    },

    /**
     * PUT 요청 처리
     */
    async put<T = any>(url: string, data?: any): Promise<T> {
      await delay();
      logMockApi('PUT', url, data);

      const moduleName = getModuleName(url);
      const id = extractIdFromUrl(url);

      if (id !== null) {
        const index = mockDataStore[moduleName]?.findIndex(
          (item) => item[`${moduleName.replace(/-/g, '')}Seq`] === id || item.testSeq === id
        );
        if (index !== -1) {
          mockDataStore[moduleName][index] = {
            ...mockDataStore[moduleName][index],
            ...data,
            updateDate: new Date().toISOString()
          };
          return { isSuccess: true } as T;
        }
      }

      throw createMockError(404, '수정할 데이터를 찾을 수 없습니다.');
    },

    /**
     * PATCH 요청 처리
     */
    async patch<T = unknown>(url: string, data?: unknown): Promise<T> {
      await delay();
      logMockApi('PATCH', url, data);

      const moduleName = getModuleName(url);
      const patchData = data as Record<string, any>;
      const seqKey = `${moduleName.replace(/-/g, '')}Seq`;

      // 사용여부 변경
      if (url.includes('/use')) {
        const seqs = Array.isArray(patchData?.[seqKey] || patchData?.testSeq)
          ? (patchData?.[seqKey] || patchData?.testSeq)
          : [patchData?.[seqKey] || patchData?.testSeq];
        seqs.forEach((seq: number) => {
          const item = mockDataStore[moduleName]?.find((i) => i[seqKey] === seq || i.testSeq === seq);
          if (item) {
            item.isUse = patchData?.isUse;
            item.updateDate = new Date().toISOString();
          }
        });
        return { isSuccess: true } as T;
      }

      // 주문 상태 변경
      if (url.includes('/status')) {
        const seqs = Array.isArray(patchData?.[seqKey])
          ? patchData[seqKey]
          : [patchData?.[seqKey]];
        seqs.forEach((seq: number) => {
          const item = mockDataStore[moduleName]?.find((i) => i[seqKey] === seq);
          if (item) {
            item.orderStatus = patchData?.orderStatus;
            item.updateDate = new Date().toISOString();
          }
        });
        return { isSuccess: true } as T;
      }

      // 소프트 삭제
      if (url.includes('/delete')) {
        const seqs = Array.isArray(patchData?.[seqKey] || patchData?.testSeq)
          ? (patchData?.[seqKey] || patchData?.testSeq)
          : [patchData?.[seqKey] || patchData?.testSeq];
        seqs.forEach((seq: number) => {
          const item = mockDataStore[moduleName]?.find((i) => i[seqKey] === seq || i.testSeq === seq);
          if (item) {
            item.isDelete = 'Y';
            item.updateDate = new Date().toISOString();
          }
        });
        return { isSuccess: true } as T;
      }

      return { isSuccess: true } as T;
    },

    /**
     * DELETE 요청 처리
     */
    async delete<T = any>(url: string): Promise<T> {
      await delay();
      logMockApi('DELETE', url);

      const moduleName = getModuleName(url);
      const id = extractIdFromUrl(url);

      // TDD 정리
      if (url.includes('/tdd/cleanup')) {
        if (id !== null) {
          mockDataStore[moduleName] = mockDataStore[moduleName]?.filter(
            (item) => item.testSeq !== id
          );
        }
        return { isSuccess: true } as T;
      }

      // 일반 삭제
      if (id !== null) {
        mockDataStore[moduleName] = mockDataStore[moduleName]?.filter(
          (item) =>
            item[`${moduleName.replace(/-/g, '')}Seq`] !== id && item.testSeq !== id
        );
        return { isSuccess: true } as T;
      }

      throw createMockError(400, '삭제할 ID가 필요합니다.');
    }
  };
};

/**
 * Mock 아이템 생성
 */
const createMockItem = (moduleName: string, data: any) => {
  const seq = mockSeqCounter++;
  const now = new Date().toISOString();

  return {
    testSeq: seq,
    [`${moduleName.replace(/-/g, '')}Seq`]: seq,
    value: data?.value || `mock-value-${seq}`,
    subject: data?.subject || `Mock 제목 ${seq}`,
    contents: data?.contents || `Mock 내용 ${seq}`,
    bigint: data?.bigint || seq * 1000,
    isUse: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: now,
    updateSeq: 1,
    updateDate: now,
    fileList: [],
    imageList: [],
    ...data
  };
};

/**
 * Mock 에러 생성
 */
const createMockError = (status: number, message: string) => {
  const error = new Error(message) as any;
  error.response = { status, data: { message } };
  return error;
};

/**
 * Mock API 로깅
 */
const logMockApi = (method: string, url: string, data?: any) => {
  console.log(`[MOCK API] ${method} ${url}`, data || '');
};

// Mock API 인스턴스 (싱글톤)
const mockApiInstance = createMockApi();

/**
 * API 서비스 (Mock 모드)
 */
export const useApi = (): MockAxiosInstance => mockApiInstance;
export const usePublicApi = (): MockAxiosInstance => mockApiInstance;
export const useRawApi = (): MockAxiosInstance => mockApiInstance;
export const usePublicRawApi = (): MockAxiosInstance => mockApiInstance;
export const useJavaApi = (): MockAxiosInstance => mockApiInstance;
export const useMultiApi = (): MockAxiosInstance => mockApiInstance;
export const useJavaPublicApi = (): MockAxiosInstance => mockApiInstance;
export const useFilingsApi = (): MockAxiosInstance => mockApiInstance;
export const usePaymentApi = (): MockAxiosInstance => mockApiInstance;
