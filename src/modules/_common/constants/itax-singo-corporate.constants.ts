import { Utils } from '@/utils/utils.ts';

/**
 * ----------------------------------------------------------------------------
 * 스마트세무사(신고현황 법인세)
 * ----------------------------------------------------------------------------
 */
export class ItaxSingoCorporateTaxDivision {
  static FAKE = '1'; // 가결산
  static BEFORE = '2'; // 중간예납
  static FIX = '3'; // 정기신고
  static ALL = '9'; // 중간예납+정기신고

  static names = {
    [ItaxSingoCorporateTaxDivision.FAKE]: '가결산',
    [ItaxSingoCorporateTaxDivision.BEFORE]: '중간예납',
    [ItaxSingoCorporateTaxDivision.FIX]: '정기신고',
    [ItaxSingoCorporateTaxDivision.ALL]: '중간예납+정기신고'
  };

  static get options() {
    return Utils.buildSelectOptions(this.names, '신고구분');
  }

  static getName(code: string | number): string {
    return this.names[code] || '';
  }
}