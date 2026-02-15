import type { TestDataDetail } from '../type/test-data.type';

/**
 * test-data 모듈용 Mock 데이터
 * 기획자가 UI 프로토타이핑 시 사용할 샘플 데이터
 */

const now = new Date().toISOString();
const yesterday = new Date(Date.now() - 86400000).toISOString();
const lastWeek = new Date(Date.now() - 604800000).toISOString();

/**
 * Mock 테스트 데이터 목록
 */
export const mockTestDataList: TestDataDetail[] = [
  {
    testSeq: 1,
    value: 'sample-001',
    subject: '첫 번째 테스트 데이터',
    contents: '이것은 첫 번째 테스트 데이터의 내용입니다. 기획자가 UI를 확인할 때 사용됩니다.',
    bigint: 1000000,
    isUse: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: lastWeek,
    updateSeq: 1,
    updateDate: yesterday,
    fileList: [],
    imageList: []
  },
  {
    testSeq: 2,
    value: 'sample-002',
    subject: '두 번째 테스트 데이터',
    contents: '두 번째 테스트 데이터입니다. 다양한 상태를 테스트할 수 있습니다.',
    bigint: 2500000,
    isUse: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: lastWeek,
    updateSeq: 2,
    updateDate: now,
    fileList: [
      {
        fileSeq: 101,
        parentCode: null,
        storageType: 'LOCAL',
        fileAuth: 'PUBLIC',
        fileUuid: 'mock-file-uuid-001',
        fileFolder: '/uploads/test-data',
        filePath: '/uploads/test-data/sample.pdf',
        fileName: '샘플문서.pdf',
        fileSize: 102400,
        fileType: 'application/pdf',
        downloadCnt: 5,
        orderValue: 1,
        insertSeq: 1,
        insertDate: lastWeek,
        updateSeq: 1,
        updateDate: lastWeek
      }
    ],
    imageList: []
  },
  {
    testSeq: 3,
    value: 'sample-003',
    subject: '세 번째 테스트 데이터 (미사용)',
    contents: '미사용 상태의 테스트 데이터입니다.',
    bigint: 500000,
    isUse: 'N',
    isDelete: 'N',
    insertSeq: 2,
    insertDate: yesterday,
    updateSeq: 2,
    updateDate: yesterday,
    fileList: [],
    imageList: [
      {
        fileSeq: 201,
        parentCode: null,
        storageType: 'LOCAL',
        fileAuth: 'PUBLIC',
        fileUuid: 'mock-image-uuid-001',
        fileFolder: '/uploads/test-data/images',
        filePath: '/uploads/test-data/images/sample.jpg',
        fileName: '샘플이미지.jpg',
        fileSize: 51200,
        fileType: 'image/jpeg',
        downloadCnt: 10,
        orderValue: 1,
        insertSeq: 2,
        insertDate: yesterday,
        updateSeq: 2,
        updateDate: yesterday
      }
    ]
  },
  {
    testSeq: 4,
    value: 'sample-004',
    subject: '네 번째 테스트 데이터',
    contents: '일반적인 테스트 데이터입니다. CRUD 기능을 테스트할 수 있습니다.',
    bigint: 7500000,
    isUse: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: now,
    updateSeq: 1,
    updateDate: now,
    fileList: [],
    imageList: []
  },
  {
    testSeq: 5,
    value: 'sample-005',
    subject: '다섯 번째 테스트 데이터 (긴 내용)',
    contents: `이것은 긴 내용을 가진 테스트 데이터입니다.

여러 줄에 걸쳐 내용이 작성되어 있으며,
에디터 컴포넌트의 동작을 확인하는 데 사용됩니다.

- 목록 항목 1
- 목록 항목 2
- 목록 항목 3

위와 같이 다양한 형식의 내용을 포함할 수 있습니다.`,
    bigint: 9999999,
    isUse: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: lastWeek,
    updateSeq: 1,
    updateDate: now,
    fileList: [],
    imageList: []
  }
];

/**
 * Mock 데이터 생성 함수
 * 추가 테스트 데이터가 필요할 때 사용
 */
export const generateMockTestData = (count: number): TestDataDetail[] => {
  const result: TestDataDetail[] = [];
  const baseSeq = 100;

  for (let i = 0; i < count; i++) {
    const seq = baseSeq + i;
    result.push({
      testSeq: seq,
      value: `generated-${String(seq).padStart(3, '0')}`,
      subject: `자동 생성 테스트 데이터 #${seq}`,
      contents: `이것은 자동으로 생성된 테스트 데이터 #${seq}입니다.`,
      bigint: seq * 10000,
      isUse: i % 3 === 0 ? 'N' : 'Y',
      isDelete: 'N',
      insertSeq: 1,
      insertDate: new Date(Date.now() - i * 86400000).toISOString(),
      updateSeq: 1,
      updateDate: new Date(Date.now() - i * 43200000).toISOString(),
      fileList: [],
      imageList: []
    });
  }

  return result;
};

/**
 * 전체 Mock 데이터 (기본 + 추가 생성)
 */
export const getAllMockTestData = (additionalCount: number = 0): TestDataDetail[] => {
  return [...mockTestDataList, ...generateMockTestData(additionalCount)];
};
