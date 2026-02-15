/**
 * 파일 업로드 컴포넌트에서 사용하는 공통 타입 정의
 */

// 파일 기본 정보 인터페이스
export interface FileInfo {
  fileUuid: string;              // 파일 고유 식별자
  fileName: string;              // 파일명
  fileSize: number;              // 파일 크기
  fileType: string;              // MIME 타입
  storageType: 'LOCAL' | 'S3';  // 저장소 타입
  fileAuth: 'PUBLIC' | 'PRIVATE'; // 접근 권한
  filePath: string;              // 파일 경로 (S3 URL 생성용)
}

// 업로드 파일 정보 인터페이스 (내부 사용)
export interface UploadFile extends FileInfo {
  uploadId: string;
  fileObj: File;
  progressVal: number;
  uploadStatus: 'pending' | 'uploading' | 'completed' | 'error';
  errorMessage?: string;
  orderIndex: number;
  downUrl?: string;
  isEditorAdd?: boolean;  // p-file-upload-local.vue 전용
}

// 업로드 핸들러 타입
export type UploadHandler = (file: File, progressCallback: (progress: number) => void) => Promise<any>;

// 다운로드 URL 리졸버 타입
export type DownUrlResolver = (file: FileInfo) => string;