import { defineStore } from 'pinia';
import type { Space, SpaceInsertDto, SpaceState, SpaceType } from '../type/space.type';

/**
 * 스페이스 스토어 - Mock 데이터 기반
 * 워크스페이스 생성/선택/관리
 */
export const useSpaceStore = defineStore('space', {
  state: (): SpaceState => ({
    listData: [
      {
        spaceSeq: 1,
        spaceName: '피치 필라테스',
        spaceType: 'pilates',
        description: '필라테스 스튜디오 고객 관리',
        memberCount: 5,
        insertDate: '2025-01-15'
      },
      {
        spaceSeq: 2,
        spaceName: '피치 부동산',
        spaceType: 'realestate',
        description: '부동산 매물 및 고객 관리',
        memberCount: 3,
        insertDate: '2025-02-01'
      },
      {
        spaceSeq: 3,
        spaceName: '기본 CRM',
        spaceType: 'basic',
        description: '기본 고객 관계 관리',
        memberCount: 8,
        insertDate: '2025-03-10'
      }
    ],
    currentSpace: {
      spaceSeq: 0,
      spaceName: '',
      spaceType: 'basic',
      description: '',
      memberCount: 0,
      insertDate: ''
    }
  }),

  getters: {
    /** 스페이스 유형별 라벨 */
    spaceTypeLabel(): (type: SpaceType) => string {
      return (type: SpaceType) => {
        const labels: Record<SpaceType, string> = {
          basic: '기본 CRM',
          pilates: '필라테스',
          realestate: '부동산'
        };
        return labels[type] || '기본 CRM';
      };
    },

    /** 스페이스 유형별 배지 색상 */
    spaceTypeBadgeColor(): (type: SpaceType) => string {
      return (type: SpaceType) => {
        const colors: Record<SpaceType, string> = {
          basic: 'primary',
          pilates: 'success',
          realestate: 'warning'
        };
        return colors[type] || 'primary';
      };
    }
  },

  actions: {
    /** 스페이스 목록 조회 */
    async list() {
      // Mock: 이미 state에 초기 데이터가 있음
      return this.listData;
    },

    /** 스페이스 생성 */
    async insert(data: SpaceInsertDto) {
      const newSeq = Math.max(...this.listData.map(s => s.spaceSeq)) + 1;
      const newSpace: Space = {
        spaceSeq: newSeq,
        spaceName: data.spaceName,
        spaceType: data.spaceType,
        description: data.description,
        memberCount: 1,
        insertDate: new Date().toISOString().split('T')[0]
      };
      this.listData.push(newSpace);
      return newSpace;
    },

    /** 스페이스 삭제 */
    async softDelete(spaceSeq: number) {
      this.listData = this.listData.filter(s => s.spaceSeq !== spaceSeq);
      return true;
    },

    /** 현재 스페이스 설정 */
    setCurrentSpace(space: Space) {
      this.currentSpace = space;
      localStorage.setItem('currentSpaceSeq', String(space.spaceSeq));
    },

    /** 로컬 스토리지에서 마지막 스페이스 복원 */
    restoreCurrentSpace() {
      const lastSeq = localStorage.getItem('currentSpaceSeq');
      if (lastSeq) {
        const found = this.listData.find(s => s.spaceSeq === Number(lastSeq));
        if (found) {
          this.currentSpace = found;
        }
      }
    }
  }
});
