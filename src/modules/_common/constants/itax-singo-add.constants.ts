import { Utils } from '@/utils/utils.ts';

/**
 * ----------------------------------------------------------------------------
 * 스마트세무사(신고현황 부가세)
 * ----------------------------------------------------------------------------
 */
export class ItaxSingoAddTaxDivision {
  static ONE_BEFORE = '10';
  static ONE_FIX = '11';
  static ONE_ALL = '19';
  static TWO_BEFORE = '20';
  static TWO_FIX = '21';
  static TWO_ALL = '29';

  static names = {
    [ItaxSingoAddTaxDivision.ONE_BEFORE]: '1기예정',
    [ItaxSingoAddTaxDivision.ONE_FIX]: '1기확정',
    [ItaxSingoAddTaxDivision.ONE_ALL]: '1기예정+1기확정',
    [ItaxSingoAddTaxDivision.TWO_BEFORE]: '2기예정',
    [ItaxSingoAddTaxDivision.TWO_FIX]: '2기확정',
    [ItaxSingoAddTaxDivision.TWO_ALL]: '2기예정+2기확정'
  };

  static get options() {
    return Utils.buildSelectOptions(this.names, '구분전체');
  }

  static getName(code: string | number): string {
    return this.names[code] || '';
  }
}