import { defineStore } from 'pinia';
import dayjs from 'dayjs';
import type {
  PilatesClass,
  PilatesClassInsertDto,
  Membership,
  MembershipInsertDto,
  MembershipUpdateDto,
  MembershipPagingDto,
  Attendance,
  AttendanceCheckDto
} from '../type/pilates.type';

/**
 * 필라테스 모듈 스토어 - Mock 데이터 기반
 */
export const usePilatesStore = defineStore('pilates', {
  state: () => {
    // 수업 Mock 데이터 (월~금 10건)
    const classList: PilatesClass[] = [
      { classSeq: 1, className: '기초 필라테스', instructorName: '김서연', classType: '그룹', dayOfWeek: '1', startTime: '09:00', endTime: '10:00', maxCapacity: 8, currentCapacity: 5, classRoom: 'A룸', status: '활성', isUse: 'Y', isDelete: 'N', insertSeq: 1, insertDate: '2025-01-01', updateSeq: 1, updateDate: '2025-01-01' },
      { classSeq: 2, className: '코어 강화', instructorName: '이민호', classType: '그룹', dayOfWeek: '1', startTime: '11:00', endTime: '12:00', maxCapacity: 10, currentCapacity: 8, classRoom: 'B룸', status: '활성', isUse: 'Y', isDelete: 'N', insertSeq: 1, insertDate: '2025-01-01', updateSeq: 1, updateDate: '2025-01-01' },
      { classSeq: 3, className: '개인 레슨', instructorName: '박지훈', classType: '개인', dayOfWeek: '2', startTime: '10:00', endTime: '11:00', maxCapacity: 1, currentCapacity: 0, classRoom: 'A룸', status: '활성', isUse: 'Y', isDelete: 'N', insertSeq: 1, insertDate: '2025-01-01', updateSeq: 1, updateDate: '2025-01-01' },
      { classSeq: 4, className: '듀엣 필라테스', instructorName: '최유나', classType: '듀엣', dayOfWeek: '2', startTime: '14:00', endTime: '15:00', maxCapacity: 2, currentCapacity: 1, classRoom: 'B룸', status: '활성', isUse: 'Y', isDelete: 'N', insertSeq: 1, insertDate: '2025-01-01', updateSeq: 1, updateDate: '2025-01-01' },
      { classSeq: 5, className: '스트레칭', instructorName: '김서연', classType: '그룹', dayOfWeek: '3', startTime: '09:00', endTime: '10:00', maxCapacity: 12, currentCapacity: 10, classRoom: 'A룸', status: '활성', isUse: 'Y', isDelete: 'N', insertSeq: 1, insertDate: '2025-01-01', updateSeq: 1, updateDate: '2025-01-01' },
      { classSeq: 6, className: '리포머 클래스', instructorName: '이민호', classType: '그룹', dayOfWeek: '3', startTime: '15:00', endTime: '16:00', maxCapacity: 6, currentCapacity: 4, classRoom: 'B룸', status: '활성', isUse: 'Y', isDelete: 'N', insertSeq: 1, insertDate: '2025-01-01', updateSeq: 1, updateDate: '2025-01-01' },
      { classSeq: 7, className: '개인 레슨', instructorName: '박지훈', classType: '개인', dayOfWeek: '4', startTime: '10:00', endTime: '11:00', maxCapacity: 1, currentCapacity: 1, classRoom: 'A룸', status: '활성', isUse: 'Y', isDelete: 'N', insertSeq: 1, insertDate: '2025-01-01', updateSeq: 1, updateDate: '2025-01-01' },
      { classSeq: 8, className: '기초 필라테스', instructorName: '최유나', classType: '그룹', dayOfWeek: '4', startTime: '18:00', endTime: '19:00', maxCapacity: 8, currentCapacity: 6, classRoom: 'A룸', status: '활성', isUse: 'Y', isDelete: 'N', insertSeq: 1, insertDate: '2025-01-01', updateSeq: 1, updateDate: '2025-01-01' },
      { classSeq: 9, className: '코어 강화', instructorName: '김서연', classType: '그룹', dayOfWeek: '5', startTime: '09:00', endTime: '10:00', maxCapacity: 10, currentCapacity: 7, classRoom: 'B룸', status: '활성', isUse: 'Y', isDelete: 'N', insertSeq: 1, insertDate: '2025-01-01', updateSeq: 1, updateDate: '2025-01-01' },
      { classSeq: 10, className: '듀엣 필라테스', instructorName: '이민호', classType: '듀엣', dayOfWeek: '5', startTime: '14:00', endTime: '15:00', maxCapacity: 2, currentCapacity: 0, classRoom: 'A룸', status: '활성', isUse: 'Y', isDelete: 'N', insertSeq: 1, insertDate: '2025-01-01', updateSeq: 1, updateDate: '2025-01-01' }
    ];

    // 멤버십 Mock 데이터 (8건 이상)
    const membershipListData: Membership[] = [
      { membershipSeq: 1, customerSeq: 1, customerName: '김영희', membershipType: '프리미엄', totalSessions: 20, remainingSessions: 15, startDate: '2025-01-15', endDate: '2025-04-15', status: '활성', price: 300000, isUse: 'Y', isDelete: 'N', insertSeq: 1, insertDate: '2025-01-15', updateSeq: 1, updateDate: '2025-02-01' },
      { membershipSeq: 2, customerSeq: 2, customerName: '이철수', membershipType: '기본', totalSessions: 10, remainingSessions: 3, startDate: '2025-01-20', endDate: '2025-03-20', status: '활성', price: 150000, isUse: 'Y', isDelete: 'N', insertSeq: 1, insertDate: '2025-01-20', updateSeq: 1, updateDate: '2025-02-10' },
      { membershipSeq: 3, customerSeq: 3, customerName: '박지민', membershipType: 'VIP', totalSessions: 30, remainingSessions: 25, startDate: '2025-02-01', endDate: '2025-05-01', status: '활성', price: 500000, isUse: 'Y', isDelete: 'N', insertSeq: 1, insertDate: '2025-02-01', updateSeq: 1, updateDate: '2025-02-05' },
      { membershipSeq: 4, customerSeq: 4, customerName: '최수영', membershipType: '기본', totalSessions: 10, remainingSessions: 2, startDate: '2025-02-10', endDate: '2025-04-10', status: '활성', price: 150000, isUse: 'Y', isDelete: 'N', insertSeq: 1, insertDate: '2025-02-10', updateSeq: 1, updateDate: '2025-02-12' },
      { membershipSeq: 5, customerSeq: 5, customerName: '정민우', membershipType: '프리미엄', totalSessions: 20, remainingSessions: 20, startDate: '2025-02-15', endDate: '2025-05-15', status: '활성', price: 300000, isUse: 'Y', isDelete: 'N', insertSeq: 1, insertDate: '2025-02-15', updateSeq: 1, updateDate: '2025-02-15' },
      { membershipSeq: 6, customerSeq: 6, customerName: '한소희', membershipType: 'VIP', totalSessions: 30, remainingSessions: 18, startDate: '2025-01-05', endDate: '2025-04-05', status: '활성', price: 500000, isUse: 'Y', isDelete: 'N', insertSeq: 1, insertDate: '2025-01-05', updateSeq: 1, updateDate: '2025-02-14' },
      { membershipSeq: 7, customerSeq: 7, customerName: '윤도현', membershipType: '기본', totalSessions: 10, remainingSessions: 0, startDate: '2025-01-01', endDate: '2025-03-01', status: '만료', price: 150000, isUse: 'Y', isDelete: 'N', insertSeq: 1, insertDate: '2025-01-01', updateSeq: 1, updateDate: '2025-02-10' },
      { membershipSeq: 8, customerSeq: 8, customerName: '강지원', membershipType: '프리미엄', totalSessions: 20, remainingSessions: 20, startDate: '2025-02-16', endDate: '2025-05-16', status: '일시정지', price: 300000, isUse: 'Y', isDelete: 'N', insertSeq: 1, insertDate: '2025-02-16', updateSeq: 1, updateDate: '2025-02-16' }
    ];

    // 출석 Mock 데이터 (당일 수업별)
    const attendanceListData: Attendance[] = [];
    const todayClasses: PilatesClass[] = [];

    return {
      classList,
      classTotalRow: 10,
      membershipListData,
      membershipTotalRow: 8,
      membershipDetailData: {} as Membership,
      attendanceListData,
      todayClasses,
      // 원본 데이터 보존용 (필터/페이징 시 복원)
      _classListOriginal: [...classList],
      _membershipListOriginal: [...membershipListData]
    };
  },

  actions: {
    /**
     * 달력용 수업 목록 반환 (날짜별 그룹핑)
     * dayOfWeek 기준으로 요일별 수업 반환
     */
    classCalendar(): Record<string, PilatesClass[]> {
      const grouped: Record<string, PilatesClass[]> = {};
      const list = this.classList.filter((c) => c.isDelete === 'N' && c.status === '활성');
      for (const c of list) {
        const key = c.dayOfWeek;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(c);
      }
      return grouped;
    },

    /**
     * 수업 등록
     */
    classInsert(params: PilatesClassInsertDto): void {
      const newSeq = Math.max(...this.classList.map((c) => c.classSeq), 0) + 1;
      const newClass: PilatesClass = {
        classSeq: newSeq,
        ...params,
        currentCapacity: 0,
        status: '활성',
        isUse: 'Y',
        isDelete: 'N',
        insertSeq: 1,
        insertDate: dayjs().format('YYYY-MM-DD'),
        updateSeq: 1,
        updateDate: dayjs().format('YYYY-MM-DD')
      };
      this.classList.unshift(newClass);
      this._classListOriginal.unshift(newClass);
      this.classTotalRow = this.classList.length;
    },

    /**
     * 수업 수정
     */
    classUpdate(classSeq: number, params: Partial<PilatesClassInsertDto>): void {
      const idx = this.classList.findIndex((c) => c.classSeq === classSeq);
      if (idx !== -1) {
        this.classList[idx] = { ...this.classList[idx], ...params, updateDate: dayjs().format('YYYY-MM-DD') };
        const origIdx = this._classListOriginal.findIndex((c) => c.classSeq === classSeq);
        if (origIdx !== -1) this._classListOriginal[origIdx] = { ...this.classList[idx] };
      }
    },

    /**
     * 수업 삭제 (논리삭제)
     */
    classDelete(classSeq: number): void {
      const idx = this.classList.findIndex((c) => c.classSeq === classSeq);
      if (idx !== -1) {
        this.classList[idx].isDelete = 'Y';
        const origIdx = this._classListOriginal.findIndex((c) => c.classSeq === classSeq);
        if (origIdx !== -1) (this._classListOriginal[origIdx] as PilatesClass).isDelete = 'Y';
      }
    },

    /**
     * 멤버십 페이징 조회
     */
    membershipPaging(params: MembershipPagingDto): void {
      let filtered = [...this._membershipListOriginal].filter((m) => m.isDelete === 'N');

      if (params.keyword) {
        const kw = params.keyword.toLowerCase();
        filtered = filtered.filter((m) => m.customerName.toLowerCase().includes(kw));
      }
      if (params.membershipType) {
        filtered = filtered.filter((m) => m.membershipType === params.membershipType);
      }
      if (params.status) {
        filtered = filtered.filter((m) => m.status === params.status);
      }

      const sortBy = params.sortBy || 'insertDate';
      const sortType = params.sortType || 'desc';
      filtered.sort((a: Membership, b: Membership) => {
        const aVal = (a as Record<string, unknown>)[sortBy];
        const bVal = (b as Record<string, unknown>)[sortBy];
        if (sortType === 'asc') return aVal > bVal ? 1 : -1;
        return aVal < bVal ? 1 : -1;
      });

      this.membershipTotalRow = filtered.length;
      const row = params.row || 10;
      const page = params.page || 1;
      const start = (page - 1) * row;
      this.membershipListData = filtered.slice(start, start + row);
    },

    /**
     * 고객번호로 활성 멤버십 조회 (출석 체크용)
     */
    getMembershipByCustomerSeq(customerSeq: number): Membership | undefined {
      return this._membershipListOriginal.find(
        (m) => m.customerSeq === customerSeq && m.isDelete === 'N' && m.status === '활성'
      );
    },

    /**
     * 멤버십 상세 조회
     */
    membershipDetail(membershipSeq: number): Membership {
      const found = this._membershipListOriginal.find((m) => m.membershipSeq === membershipSeq);
      this.membershipDetailData = found ? { ...found } : ({} as Membership);
      return this.membershipDetailData;
    },

    /**
     * 멤버십 등록
     */
    membershipInsert(params: MembershipInsertDto): void {
      const newSeq = Math.max(...this._membershipListOriginal.map((m) => m.membershipSeq), 0) + 1;
      const newMembership: Membership = {
        membershipSeq: newSeq,
        customerSeq: newSeq,
        customerName: params.customerName,
        membershipType: params.membershipType,
        totalSessions: params.totalSessions,
        remainingSessions: params.totalSessions,
        startDate: params.startDate,
        endDate: params.endDate,
        status: '활성',
        price: params.price,
        isUse: 'Y',
        isDelete: 'N',
        insertSeq: 1,
        insertDate: dayjs().format('YYYY-MM-DD'),
        updateSeq: 1,
        updateDate: dayjs().format('YYYY-MM-DD')
      };
      this._membershipListOriginal.unshift(newMembership);
      this.membershipTotalRow = this._membershipListOriginal.length;
      this.membershipPaging({
        keyword: '',
        membershipType: '',
        status: '',
        sortBy: 'insertDate',
        sortType: 'desc',
        sortData: 'insertDate,desc',
        row: 10,
        page: 1,
        time: ''
      });
    },

    /**
     * 멤버십 수정
     */
    membershipUpdate(params: MembershipUpdateDto): void {
      const idx = this._membershipListOriginal.findIndex((m) => m.membershipSeq === params.membershipSeq);
      if (idx !== -1) {
        this._membershipListOriginal[idx] = {
          ...this._membershipListOriginal[idx],
          ...params,
          updateDate: dayjs().format('YYYY-MM-DD')
        };
        this.membershipDetailData = { ...this._membershipListOriginal[idx] };
      }
    },

    /**
     * 멤버십 논리 삭제
     */
    membershipSoftDelete(membershipSeq: number): void {
      const idx = this._membershipListOriginal.findIndex((m) => m.membershipSeq === membershipSeq);
      if (idx !== -1) {
        this._membershipListOriginal[idx].isDelete = 'Y';
      }
    },

    /**
     * 오늘 수업 목록 (요일 기준)
     * 1=월, 2=화, ..., 5=금
     */
    setTodayClasses(): void {
      const dayNum = dayjs().day();
      // 일요일=0, 월요일=1, ... 토요일=6
      const mapDay: Record<number, string> = { 0: '7', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6' };
      const todayDayOfWeek = mapDay[dayNum] || '1';
      this.todayClasses = this.classList.filter(
        (c) => c.isDelete === 'N' && c.status === '활성' && c.dayOfWeek === todayDayOfWeek
      );
    },

    /**
     * 특정 수업의 출석 목록
     */
    attendanceList(classSeq: number): Attendance[] {
      const today = dayjs().format('YYYY-MM-DD');
      const cls = this.classList.find((c) => c.classSeq === classSeq);
      // Mock: 멤버십 활성 회원을 해당 수업 수강생으로 반환
      const members = this._membershipListOriginal.filter((m) => m.isDelete === 'N' && m.status === '활성');
      const list: Attendance[] = members.map((m) => {
        const existing = this.attendanceListData.find(
          (a) => a.classSeq === classSeq && a.customerSeq === m.customerSeq && a.attendanceDate === today
        );
        return existing || {
          attendanceSeq: 0,
          classSeq,
          className: cls?.className || '',
          customerSeq: m.customerSeq,
          customerName: m.customerName,
          attendanceDate: today,
          attendanceTime: '',
          status: '출석',
          memo: '',
          insertDate: ''
        };
      });
      this.attendanceListData = list;
      return list;
    },

    /**
     * 출석 체크/변경
     */
    attendanceCheck(dto: AttendanceCheckDto): void {
      const idx = this.attendanceListData.findIndex(
        (a) => a.classSeq === dto.classSeq && a.customerSeq === dto.customerSeq && a.attendanceDate === dto.attendanceDate
      );
      if (idx !== -1) {
        this.attendanceListData[idx] = {
          ...this.attendanceListData[idx],
          status: dto.status,
          memo: dto.memo,
          attendanceTime: dto.attendanceTime || dayjs().format('HH:mm'),
          insertDate: dayjs().format('YYYY-MM-DD HH:mm:ss')
        };
      } else {
        const cls = this.classList.find((c) => c.classSeq === dto.classSeq);
        this.attendanceListData.push({
          attendanceSeq: this.attendanceListData.length + 1,
          classSeq: dto.classSeq,
          className: cls?.className || '',
          customerSeq: dto.customerSeq,
          customerName: '',
          attendanceDate: dto.attendanceDate,
          attendanceTime: dayjs().format('HH:mm'),
          status: dto.status,
          memo: dto.memo,
          insertDate: dayjs().format('YYYY-MM-DD HH:mm:ss')
        });
      }
    }
  }
});
