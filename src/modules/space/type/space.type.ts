/** CRM 유형 */
export type SpaceType = 'basic' | 'pilates' | 'realestate';

/** 스페이스 정보 */
export interface Space {
  spaceSeq: number; // 스페이스 시퀀스
  spaceName: string; // 스페이스 이름
  spaceType: SpaceType; // CRM 유형
  description: string; // 설명
  memberCount: number; // 멤버 수
  insertDate: string; // 등록일
}

/** 스페이스 생성 DTO */
export interface SpaceInsertDto {
  spaceName: string; // 스페이스 이름
  spaceType: SpaceType; // CRM 유형
  description: string; // 설명
}

/** 스페이스 스토어 상태 */
export interface SpaceState {
  listData: Space[]; // 스페이스 목록
  currentSpace: Space; // 현재 선택된 스페이스
}
