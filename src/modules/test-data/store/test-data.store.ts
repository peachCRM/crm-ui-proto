import { useApi } from '@/modules/_common/services/api.service.ts';
import { defineStore } from 'pinia';
import axios from 'axios';
import type { AxiosProgressEvent } from 'axios';
import { ExcelTemplateUtil } from '@/utils/excel-template.util.ts';
import type {
  TestDataDetail,
  TestDataFile,
  TestDataFileLocalUploadResult,
  TestDataFileS3UploadResult,
  TestDataInsertDto,
  TestDataPagingDto,
  TestDataSearchDto,
  TestDataUpdateDto,
  TestDataExcelUploadDto
} from '../type/test-data.type';

type ProgressCallback = (progress: number) => void;

/**
 * 테스트 데이터 통합 관리 스토어
 * CRUD, 파일 업로드/다운로드, 엑셀 다운로드 기능을 모두 포함
 * AI 협업 개발을 위해 모든 관련 기능을 하나의 파일에 통합
 */
export const useTestDataStore = defineStore('test-data', {
  state: () => ({
    // ===== LIST/DETAIL STATE =====
    listData: [] as TestDataDetail[],
    listTotalRow: 0,
    detailData: {} as TestDataDetail
  }),

  getters: {
  },

  actions: {
    // ===== CRUD OPERATIONS =====

    /**
     * 상세 데이터 초기화
     * 신규 등록 또는 상세 조회 전 호출
     */
    detailDataInit(): void {
      this.detailData = {} as TestDataDetail;
    },

    /**
     * 페이징 목록 조회
     * @route GET /test-data
     * @param params 페이징 조건 (page, row, sortBy, sortType, keyword, isUse, startDate, endDate)
     * @updates listData, listTotalRow
     */
    async paging(params: TestDataPagingDto): Promise<void> {
      // API 호출하여 데이터 목록 가져오기
      const result = await useApi().get<{ totalRow: number; data: TestDataDetail[] }>(
        '/test-data',
        {
          params
        }
      );

      // 테이블 표시용 부가 정보 추가 (nIndex: 순번, chk: 체크박스)
      this.listData = result.data.map((item, nIndex: number) => {
        return { ...item, nIndex, chk: false };
      });

      this.listTotalRow = Number(result.totalRow);
    },

    /**
     * 전체 목록 조회 (페이징 없음)
     * Select Box, Auto Complete 등에서 사용
     * @route GET /test-data/list
     */
    list(params: TestDataSearchDto): Promise<TestDataDetail[]> {
      return useApi().get<TestDataDetail[]>(`/test-data/list`, { params });
    },

    /**
     * 상세 조회 (파일 포함)
     * @route GET /test-data/:testSeq
     * @updates detailData
     */
    async detail(testSeq: number): Promise<void> {
      this.detailData = await useApi().get<TestDataDetail>(`/test-data/${testSeq}`);
    },

    /**
     * 커서 기반 목록 조회 (무한 스크롤)
     * @route GET /test-data/cursor-list
     * @param params limit, cursor, keyword
     * @returns {list, nextCursor}
     */
    async cursorList(params: {
      limit?: number;
      cursor?: string;
      keyword?: string;
    }): Promise<{ list: TestDataDetail[]; nextCursor: string | null }> {
      return useApi().get<{ list: TestDataDetail[]; nextCursor: string | null }>(
        '/test-data/cursor-list',
        { params }
      );
    },

    /**
     * 신규 등록 (파일 포함)
     * @route POST /test-data
     * @returns {isSuccess, testSeq}
     */
    insert(params: TestDataInsertDto): Promise<{ isSuccess: boolean; testSeq: number }> {
      return useApi().post<{ isSuccess: boolean; testSeq: number }>('/test-data', params);
    },

    /**
     * 데이터 수정 (파일 포함)
     * @route PUT /test-data/:testSeq
     * @returns {isSuccess}
     */
    update(testSeq: number, params: TestDataUpdateDto): Promise<{ isSuccess: boolean }> {
      return useApi().put<{ isSuccess: boolean }>(`/test-data/${testSeq}`, params);
    },

    /**
     * 사용여부 변경 (단일/다중)
     * @route PATCH /test-data/use
     * @returns {isSuccess}
     */
    updateUse(testSeq: number | number[], isUse: string): Promise<{ isSuccess: boolean }> {
      return useApi().patch<{ isSuccess: boolean }>(`/test-data/use`, { testSeq, isUse });
    },

    /**
     * 논리 삭제 (단일/다중)
     * is_delete를 'Y'로 변경
     * @route PATCH /test-data/delete
     * @returns {isSuccess}
     */
    softDelete(testSeq: number | number[]): Promise<{ isSuccess: boolean }> {
      return useApi().patch<{ isSuccess: boolean }>(`/test-data/delete`, { testSeq });
    },

    /**
     * 물리 삭제 (테스트 환경 전용)
     * 실제 DB에서 데이터 삭제, 운영 환경에서는 에러 발생
     * @route DELETE /test-data/:testSeq
     * @access 로컬/테스트 환경만 허용
     * @see softDelete 일반적인 삭제는 논리 삭제 사용
     */
    hardDelete(testSeq: number): Promise<{ isSuccess: boolean }> {
      // 테스트 환경(local, test)에서만 작동
      const env = import.meta.env.MODE;
      if (env !== 'local' && env !== 'test') {
        throw new Error('hardDelete는 테스트 환경에서만 사용 가능합니다.');
      }
      return useApi().delete<{ isSuccess: boolean }>(`/test-data/${testSeq}`);
    },

    // ===== FILE OPERATIONS =====

    /**
     * Local 파일 업로드
     * @route POST /test-data/file/upload/local
     * @param isPrivate 비공개 여부
     * @param file 업로드 파일
     * @param callback 진행률 콜백 (0-100)
     * @returns {fileSeq, fileUuid, fileName, fileSize, filePath}
     */
    uploadFileLocal(
      isPrivate: boolean,
      file: File,
      callback: ProgressCallback
    ): Promise<TestDataFileLocalUploadResult> {
      const metadata = { isPrivate };
      const formData = new FormData();
      formData.append('metadata', JSON.stringify(metadata));
      formData.append('file', file);

      // 백엔드 통합 API 엔드포인트 사용
      return useApi().post<TestDataFileLocalUploadResult>(
        '/test-data/file/upload/local',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            if (progressEvent.total) {
              const progress = (progressEvent.loaded * 100) / progressEvent.total;
              callback(progress);
            }
          }
        }
      );
    },

    /**
     * S3 파일 업로드 (Presigned URL 방식)
     * 1) 백엔드에서 Presigned URL 획득
     * 2) S3에 직접 업로드
     * @route POST /test-data/file/upload/s3
     * @param isPrivate 비공개 여부
     * @param file 업로드 파일
     * @param callback 진행률 콜백 (0-100)
     * @returns {fileSeq, fileUuid, uploadUrl, fileName, fileSize, filePath}
     */
    async uploadFileS3(
      isPrivate: boolean,
      file: File,
      callback: ProgressCallback
    ): Promise<TestDataFileS3UploadResult> {
      const res = await useApi().post<TestDataFileS3UploadResult>('/test-data/file/upload/s3', {
        isPrivate,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });

      if (!res?.uploadUrl) throw new Error('Upload URL not received from server');

      // S3에 직접 업로드
      await this.uploadFileToS3(res.uploadUrl, file, callback);
      return res;
    },

    /**
     * S3 직접 업로드 (내부 헬퍼)
     * uploadFileS3에서만 사용
     */
    uploadFileToS3(uploadUrl: string, file: File, callback: ProgressCallback) {
      return axios.put(uploadUrl, file, {
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total) {
            const progress = (progressEvent.loaded * 100) / progressEvent.total;
            callback(progress);
          }
        }
      });
    },

    /**
     * 다운로드 URL 생성
     * - S3 PUBLIC: CloudFront URL
     * - Local PUBLIC: 로컬 파일 서버 URL
     * - PRIVATE: getS3PresignedUrl 사용 필요
     * @throws PRIVATE 파일은 직접 다운로드 불가
     */
    getDownloadUrl(file: TestDataFile): string {
      // PRIVATE 파일은 직접 다운로드 불가
      if (file.fileAuth === 'PRIVATE') throw new Error('비공개 파일은 직접 다운로드 불가');

      // S3 PUBLIC 파일 → CloudFront URL
      if (file.storageType === 'S3') {
        return `${import.meta.env.VITE_CF_ORIGIN_URL}/${file.filePath}`;
      }

      // Local 파일 처리
      if (import.meta.env.MODE === 'localhost') {
        return `${import.meta.env.VITE_API}/test-data/file/download/local/${file.fileUuid}`;
      }

      // 개발/운영 환경 → FILE_HOST 필수
      if (!import.meta.env.VITE_FILE_HOST) throw new Error('VITE_FILE_HOST 환경변수 필수');
      return `${import.meta.env.VITE_FILE_HOST}/${file.filePath}`;
    },

    /**
     * S3 PRIVATE 파일 Presigned URL 획득
     * 시간 제한이 있는 임시 다운로드 URL 발급
     * @route GET /test-data/file/download/s3/:fileUuid
     * @throws S3 PRIVATE 파일만 지원
     */
    async getS3PresignedUrl(file: TestDataFile): Promise<string> {
      if (file.storageType !== 'S3') {
        throw new Error('S3 파일만 지원합니다.');
      }

      if (file.fileAuth !== 'PRIVATE') {
        throw new Error('PRIVATE 파일만 지원합니다.');
      }

      const response = await useApi().get<{ url: string; expiresIn: number }>(
        `/test-data/file/download/s3/${file.fileUuid}`
      );
      return response.url;
    },

    // ===== EXCEL DOWNLOAD OPERATIONS =====

    /**
     * Excel 템플릿 다운로드
     * 템플릿 스타일 유지하며 데이터만 채움
     * @param params 조회 조건
     * @returns Excel Blob
     */
    async downloadExcel(params: TestDataPagingDto): Promise<Blob> {
      // 전체 데이터 조회
      const exportParams: TestDataPagingDto = {
        ...params,
        row: 999999,
        page: 1
      };

      // API 호출하여 데이터 목록 가져오기
      const result = await useApi().get<{ totalRow: number; data: TestDataDetail[] }>(
        '/test-data',
        {
          params: exportParams
        }
      );
      const data = result.data;

      if (!data || data.length === 0) {
        console.error('❌ 내보낼 데이터가 없습니다');
        throw new Error('내보낼 데이터가 없습니다');
      }

      // 필드 매핑 정의
      const fieldMappings = [
        { field: 'testSeq', column: 1, defaultValue: '' },
        { field: 'value', column: 2, defaultValue: '' },
        { field: 'subject', column: 3, defaultValue: '' },
        { field: 'contents', column: 4, defaultValue: '' },
        { field: 'bigint', column: 5, defaultValue: '' },
        { field: 'isUse', column: 6, defaultValue: '' },
        { field: 'insertDate', column: 7, defaultValue: '' },
        { field: 'updateDate', column: 8, defaultValue: '' }
      ];

      const templateFileUrl = '/template/test-data/test_data_excel_template.xlsx';

      const buffer = await ExcelTemplateUtil.generateFromTemplate(data, {
        templateUrl: templateFileUrl,
        fileName: 'test_data_export',
        startRowNum: 4, // 데이터 시작 행 (4행부터)
        fieldMappings,
        preserveTemplateStyles: true
      });

      return new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
    },

    // ===== EXCEL UPLOAD OPERATIONS =====

    /**
     * Excel 데이터 업로드 (subject 기준 upsert)
     * subject 존재 시 update, 없으면 insert
     * @route POST /test-data/excel/upload
     * @returns {isSuccess, method: 'insert' | 'update'}
     */
    async excelUpload(
      params: TestDataExcelUploadDto
    ): Promise<{ isSuccess: boolean; method: 'insert' | 'update' }> {
      return useApi().post<{ isSuccess: boolean; method: 'insert' | 'update' }>(
        '/test-data/excel/upload',
        params
      );
    },

    // ===== TDD OPERATIONS =====

    /**
     * TDD 데이터 초기화 (로컬 전용)
     * 테스트 데이터 및 파일 자동 생성
     * @route POST /test-data/tdd/init
     * @access 로컬 환경만 허용
     * @returns {testSeq, fileUuidList, imageUuidList}
     */
    initTdd(params: {
      value: string;
      subject: string;
      contents: string;
      bigint: string;
      decimal: string;
    }): Promise<{ testSeq: number; fileUuidList: string[]; imageUuidList: string[] }> {
      return useApi().post<{ testSeq: number; fileUuidList: string[]; imageUuidList: string[] }>(
        '/test-data/tdd/init',
        params
      );
    },

    /**
     * TDD 데이터 정리 (로컬 전용)
     * initTdd로 생성된 데이터 및 파일 물리 삭제
     * @route DELETE /test-data/tdd/cleanup/:testSeq
     * @access 로컬 환경만 허용
     */
    cleanupTdd(testSeq: number): Promise<{ isSuccess: boolean }> {
      return useApi().delete<{ isSuccess: boolean }>(`/test-data/tdd/cleanup/${testSeq}`);
    }
  }
});
