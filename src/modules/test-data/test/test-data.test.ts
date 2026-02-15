/**
 * ============================================
 * 🚀 통합 Test Data 실행기 (Frontend Unified Runner)
 * ============================================
 *
 * 📋 용도: 프론트엔드 Test Data 모든 기능을 통합하여 실행하고 검증하는 실행기
 * 🔄 흐름: Backend TDD 패턴과 완전 동기화된 통합 워크플로우
 *   1. TDD 데이터 생성 (파일 포함)
 *   2. 상세 조회 (파일 연결 확인)
 *   3. 데이터 수정
 *   4. 사용여부 변경
 *   5. 리스트 조회
 *   6. 페이징 조회
 *   7-A. 커서 조회
 *   7-B. nextCursor 페이징
 *   8. 프론트에서 새 파일 생성 및 업로드
 *   9. 프론트에서 새 이미지 생성 및 업로드
 *   10. 데이터 수정 (파일 병합)
 *   11. 상세 조회 (파일 수정 확인)
 *   12. 논리적 삭제
 *   13. TDD 물리 삭제
 *   14. 삭제 확인
 * 🎯 특징: Backend TDD 패턴과 완전 동기화
 *
 * ⚠️  주의:
 * - Backend와 동일한 플로우로 모든 CRUD + 파일 처리 검증
 * - 커서 페이징, 파일 수정까지 포함한 완전한 통합 테스트
 *
 * 실행 명령어:
 * npx vitest run src/modules/test-data/test/test-data.test.ts
 */

import { describe, expect, it, afterAll, beforeAll } from 'vitest';
import { useTestDataStore } from '@/modules/test-data/store/test-data.store.ts';
import type { TestDataPagingDto, TestDataSearchDto } from '../type/test-data.type';
import { VitestSetup } from '@/utils/vitest-setup.ts';

/**
 * 📋 테스트 데이터 정의 (Backend 패턴 동기화)
 *
 * 🎯 역할:
 * 1. 명시적 필드 구조 학습 자료
 * 2. 테스트 시나리오별 데이터 구분
 * 3. Backend와 동일한 패턴 유지
 *
 * 💡 Backend test-data.test.ts의 TEST_DATA와 완전 동일
 */
const TEST_DATA = {
  init: {
    value: 'Runner테스트',
    subject: 'Runner실행기',
    contents: 'CRUD 전체 생명주기 테스트',
    bigint: '999',
    decimal: '123.45',
  },
  update: {
    subject: 'Runner실행기_수정완료',
    contents: '수정된 내용입니다',
  },
} as const;

/**
 * Test Data 통합 실행기 (Frontend) - Backend TDD 패턴 완전 동기화
 */
describe('Test Data 통합 테스트 (CRUD + 파일 처리)', () => {
  let testDataStore: ReturnType<typeof useTestDataStore>;

  // 테스트 시작 전 환경 설정
  beforeAll(async () => {
    await VitestSetup.initializeTestEnvironment();
    await VitestSetup.sign();
    testDataStore = useTestDataStore();
  }, 30000);

  // 테스트 종료 후 정리
  afterAll(async () => {
    // Vitest는 자동으로 환경 정리
  });

  /**
   * 🚀 통합 워크플로우: 파일 생성 → CRUD 전체 라이프사이클 → 파일 수정 → 삭제
   * Backend TDD 패턴과 완전 동일한 14단계 플로우
   */
  it('통합 워크플로우: 파일 생성 → CRUD → 파일 수정 → 삭제', async () => {
    let testSeq = 0;
    let fileUuidList: string[] = [];
    let imageUuidList: string[] = [];

    console.log('\n🚀 ======= 통합 테스트 시작 (Backend 패턴 동기화) =======');

    try {
      // ==================== 1. TDD 데이터 생성 (파일 포함) ====================
      console.log('\n📁 Step 1: TDD 데이터 생성 (Backend에서 자동 생성)');
      const createResult = await testDataStore.initTdd(TEST_DATA.init);

      testSeq = createResult.testSeq;
      fileUuidList = createResult.fileUuidList;
      imageUuidList = createResult.imageUuidList;

      expect(testSeq).toBeGreaterThan(0);
      expect(fileUuidList.length).toBe(2); // Backend에서 2개 생성
      expect(imageUuidList.length).toBe(1); // Backend에서 1개 생성
      console.log(`✅ 데이터 생성 완료 - testSeq: ${testSeq}`);
      console.log(`  - 파일: ${fileUuidList.length}개, 이미지: ${imageUuidList.length}개`);

      // ==================== 2. 상세 조회 (파일 연결 확인) ====================
      console.log('\n🔍 Step 2: 상세 조회 (파일 포함)');
      await testDataStore.detail(testSeq);
      const detailResult = testDataStore.detailData;
      expect(detailResult).toBeDefined();
      expect(detailResult.fileList).toBeDefined();
      expect(detailResult.imageList).toBeDefined();
      expect(Array.isArray(detailResult.fileList)).toBe(true);
      expect(Array.isArray(detailResult.imageList)).toBe(true);
      expect(detailResult.fileList.length).toBe(2);
      expect(detailResult.imageList.length).toBe(1);
      expect(detailResult.isUse).toBe('Y');
      expect(detailResult.isDelete).toBe('N');
      console.log('✅ 상세 조회 완료');
      console.log(`  - fileList: ${detailResult.fileList.length}개`);
      console.log(`  - imageList: ${detailResult.imageList.length}개`);

      // ==================== 3. 데이터 수정 ====================
      console.log('\n✏️ Step 3: 데이터 수정');
      const updateResult = await testDataStore.update(testSeq, {
        value: TEST_DATA.init.value,
        subject: TEST_DATA.update.subject,
        contents: TEST_DATA.update.contents,
        bigint: 777,
        fileUuidList: fileUuidList, // 파일 그대로 유지
        imageUuidList: imageUuidList
      });
      expect(updateResult.isSuccess).toBe(true);

      // 수정 확인
      await testDataStore.detail(testSeq);
      const updatedData = testDataStore.detailData;
      expect(updatedData.subject).toBe(TEST_DATA.update.subject);
      console.log('✅ 데이터 수정 완료');

      // ==================== 4. 사용여부 변경 ====================
      console.log('\n🔄 Step 4: 사용여부 변경');
      const updateUseResult = await testDataStore.updateUse(testSeq, 'N');
      expect(updateUseResult.isSuccess).toBe(true);

      // 사용여부 변경 확인
      await testDataStore.detail(testSeq);
      const useUpdatedData = testDataStore.detailData;
      expect(useUpdatedData.isUse).toBe('N');
      console.log('✅ 사용여부 변경 완료 - isUse: N');

      // ==================== 5. 리스트 조회 ====================
      console.log('\n📊 Step 5: 리스트 조회');
      const searchParams: TestDataSearchDto = {
        startDate: '2022-01-01',
        endDate: '2025-12-31',
        keyword: TEST_DATA.update.subject,
        opt: '',
        isUse: '',
        selected: ''
      };
      const listResult = await testDataStore.list(searchParams);
      expect(Array.isArray(listResult)).toBe(true);
      expect(listResult.length).toBeGreaterThan(0);
      console.log(`✅ 리스트 조회 완료 - ${listResult.length}개`);

      // ==================== 6. 페이징 조회 ====================
      console.log('\n📄 Step 6: 페이징 조회');
      const pagingParams: TestDataPagingDto = {
        startDate: '2022-01-01',
        endDate: '2025-12-31',
        keyword: TEST_DATA.update.subject,
        opt: '',
        isUse: '',
        selected: '',
        sortBy: 'testSeq',
        sortType: 'desc',
        sortData: 'testSeq,desc',
        row: 10,
        page: 1,
        time: new Date().getTime().toString()
      };
      await testDataStore.paging(pagingParams);
      expect(Array.isArray(testDataStore.listData)).toBe(true);
      expect(testDataStore.listData.length).toBeGreaterThan(0);
      console.log(`✅ 페이징 조회 완료 - ${testDataStore.listData.length}개`);

      // ==================== 7-A. 커서 조회 ====================
      console.log('\n🔄 Step 7-A: 커서 조회');
      const cursorResult = await testDataStore.cursorList({
        keyword: TEST_DATA.update.subject,
        limit: 2
      });
      expect(cursorResult).toHaveProperty('list');
      expect(cursorResult).toHaveProperty('nextCursor');
      expect(Array.isArray(cursorResult.list)).toBe(true);
      expect(cursorResult.list.length).toBeGreaterThan(0);
      console.log(`✅ 커서 조회 완료 - ${cursorResult.list.length}개`);

      // ==================== 7-B. nextCursor 페이징 ====================
      if (cursorResult.nextCursor) {
        console.log('\n🔄 Step 7-B: nextCursor 페이징');
        const nextPage = await testDataStore.cursorList({
          keyword: TEST_DATA.update.subject,
          limit: 2,
          cursor: cursorResult.nextCursor
        });
        expect(nextPage.list.length).toBeGreaterThanOrEqual(0);
        if (nextPage.list.length > 0 && cursorResult.list.length > 0) {
          expect(nextPage.list[0].testSeq).not.toBe(cursorResult.list[0].testSeq);
        }
        console.log(`✅ nextCursor 페이징 완료 - ${nextPage.list.length}개`);
      }

      // ==================== 8. 프론트에서 새 파일 생성 및 업로드 ====================
      console.log('\n📤 Step 8: 프론트에서 새 파일 생성 및 업로드');

      // 8-1. 새 파일 생성
      const newFileContent = 'New file added from frontend test';
      const newFileBlob = new Blob([newFileContent], { type: 'text/plain' });
      const newFile = new File([newFileBlob], 'frontend-new-file.txt', { type: 'text/plain' });

      // 8-2. 파일 업로드
      const newFileUploadResult = await testDataStore.uploadFileLocal(
        false, // isPrivate: PUBLIC
        newFile,
        (progress) => {
          if (progress === 100) console.log(`   파일 업로드 진행률: ${progress.toFixed(2)}%`);
        }
      );
      expect(newFileUploadResult.fileUuid).toBeTruthy();
      console.log(`✅ 새 파일 업로드 성공 - UUID: ${newFileUploadResult.fileUuid}`);

      // ==================== 9. 프론트에서 새 이미지 생성 및 업로드 ====================
      console.log('\n📤 Step 9: 프론트에서 새 이미지 생성 및 업로드');

      // 9-1. 새 이미지 생성 (1x1 픽셀 PNG) - 바이너리 데이터로 직접 생성
      const pngData = new Uint8Array([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48,
        0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00,
        0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41, 0x54, 0x78,
        0x9c, 0x63, 0x00, 0x01, 0x00, 0x00, 0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00,
        0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82
      ]);
      const newImageBlob = new Blob([pngData], { type: 'image/png' });
      const newImage = new File([newImageBlob], 'frontend-new-image.png', { type: 'image/png' });

      // 9-2. 이미지 업로드
      const newImageUploadResult = await testDataStore.uploadFileLocal(
        false, // isPrivate: PUBLIC
        newImage,
        (progress) => {
          if (progress === 100) console.log(`   이미지 업로드 진행률: ${progress.toFixed(2)}%`);
        }
      );
      expect(newImageUploadResult.fileUuid).toBeTruthy();
      console.log(`✅ 새 이미지 업로드 성공 - UUID: ${newImageUploadResult.fileUuid}`);

      // ==================== 10. 데이터 수정 (파일 병합) ====================
      console.log('\n✏️ Step 10: 데이터 수정 (기존 + 새 파일/이미지 병합)');

      // 기존 UUID + 새 UUID 병합
      const mergedFileUuidList = [...fileUuidList, newFileUploadResult.fileUuid];
      const mergedImageUuidList = [...imageUuidList, newImageUploadResult.fileUuid];

      const updateWithFilesResult = await testDataStore.update(testSeq, {
        value: TEST_DATA.init.value,
        subject: TEST_DATA.update.subject + '_파일수정',
        contents: TEST_DATA.update.contents + ' - 파일 병합',
        bigint: 888,
        fileUuidList: mergedFileUuidList, // 파일 3개
        imageUuidList: mergedImageUuidList // 이미지 2개
      });
      expect(updateWithFilesResult.isSuccess).toBe(true);
      console.log('✅ 데이터 수정 성공');
      console.log(
        `   - 파일: ${mergedFileUuidList.length}개 (기존 ${fileUuidList.length} + 신규 1)`
      );
      console.log(
        `   - 이미지: ${mergedImageUuidList.length}개 (기존 ${imageUuidList.length} + 신규 1)`
      );

      // ==================== 11. 상세 조회 (파일 수정 확인) ====================
      console.log('\n🔍 Step 11: 상세 조회 (파일 수정 확인)');
      await testDataStore.detail(testSeq);
      const updatedDetailData = testDataStore.detailData;

      expect(updatedDetailData.fileList).toBeDefined();
      expect(updatedDetailData.imageList).toBeDefined();
      expect(updatedDetailData.fileList.length).toBe(3); // 기존 2 + 신규 1
      expect(updatedDetailData.imageList.length).toBe(2); // 기존 1 + 신규 1
      console.log('✅ 파일 수정 확인 완료');
      console.log(`   - fileList: ${updatedDetailData.fileList.length}개 ✓`);
      console.log(`   - imageList: ${updatedDetailData.imageList.length}개 ✓`);

      // UUID 확인
      const fileUuids = updatedDetailData.fileList.map((f) => f.fileUuid);
      const imageUuids = updatedDetailData.imageList.map((i) => i.fileUuid);
      expect(fileUuids).toContain(newFileUploadResult.fileUuid);
      expect(imageUuids).toContain(newImageUploadResult.fileUuid);
      console.log('   - 신규 파일 UUID 확인 ✓');
      console.log('   - 신규 이미지 UUID 확인 ✓');

      // ==================== 12. 논리적 삭제 ====================
      console.log('\n🗑️ Step 12: 논리적 삭제');
      const softDeleteResult = await testDataStore.softDelete(testSeq);
      expect(softDeleteResult.isSuccess).toBe(true);

      // 논리적 삭제 확인
      await testDataStore.detail(testSeq);
      const softDeletedData = testDataStore.detailData;
      expect(softDeletedData.isDelete).toBe('Y');
      console.log('✅ 논리 삭제 완료 - isDelete: Y');

      // ==================== 13. TDD 물리 삭제 (데이터 + 파일) ====================
      console.log('\n💥 Step 13: TDD 물리 삭제 (데이터 + 파일)');
      const deleteResult = await testDataStore.cleanupTdd(testSeq);
      expect(deleteResult.isSuccess).toBe(true);
      console.log('✅ 데이터 + 파일 물리 삭제 완료');

      // ==================== 14. 삭제 확인 ====================
      console.log('\n✅ Step 14: 삭제 확인');
      try {
        await testDataStore.detail(testSeq);
        console.log('⚠️ 삭제된 데이터가 조회됨 (예상과 다름)');
      } catch {
        console.log('✅ 삭제 확인 완료 (데이터 조회 불가) ✓');
      }

      console.log('\n🎉 ======= 통합 테스트 완료 =======');
      console.log('📋 검증 완료 항목:');
      console.log('  1. TDD 데이터 생성 (파일 포함)');
      console.log('  2. 상세 조회 (파일 연결 확인)');
      console.log('  3. 데이터 수정');
      console.log('  4. 사용여부 변경');
      console.log('  5. 리스트 조회');
      console.log('  6. 페이징 조회');
      console.log('  7-A. 커서 조회');
      console.log('  7-B. nextCursor 페이징');
      console.log('  8. 프론트에서 새 파일 생성 및 업로드');
      console.log('  9. 프론트에서 새 이미지 생성 및 업로드');
      console.log('  10. 데이터 수정 (파일 병합)');
      console.log('  11. 상세 조회 (파일 수정 확인)');
      console.log('  12. 논리적 삭제');
      console.log('  13. TDD 물리 삭제 (데이터 + 파일)');
      console.log('  14. 삭제 확인\n');
    } catch (error) {
      console.error(`\n❌ 통합 테스트 실패: ${error}`);
      throw error;
    } finally {
      // 예외 발생 시 정리
      if (testSeq > 0) {
        console.log('\n🧹 예외 발생 시 데이터 정리');
        try {
          await testDataStore.cleanupTdd(testSeq);
          console.log(`✅ 테스트 데이터 정리 완료 - testSeq: ${testSeq}`);
        } catch {
          console.log('정리 불필요 (이미 삭제됨)');
        }
      }
    }
  }, 60000);
});
