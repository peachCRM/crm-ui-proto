/**
 * ----------------------------------------------------------------------------
 * 스마트세무사(미수관리 CMS)
 * ----------------------------------------------------------------------------
 */
import { Utils } from '@/utils/utils.ts';

export class ItaxUnpaidCmsDataDivision {
  static EXCEL = 'excel'; // 엑셀
  static SYNC = 'sync'; // 동기화

  static names = {
    [ItaxUnpaidCmsDataDivision.EXCEL]: '엑셀',
    [ItaxUnpaidCmsDataDivision.SYNC]: '동기화'
  };

  static get options() {
    return Utils.buildSelectOptions(this.names, '데이터구분');
  }

  static getName(code: string | number): string {
    return this.names[code] || '';
  }
}

export class ItaxUnpaidCmsDivision {
  static BEST_CMS = '1';
  static THEBILL_CMS = '2';
  static EFNC_CMS = '3';

  static names = {
    [ItaxUnpaidCmsDivision.BEST_CMS]: '베스트CMS',
    [ItaxUnpaidCmsDivision.THEBILL_CMS]: 'TheBILL',
    [ItaxUnpaidCmsDivision.EFNC_CMS]: '효성CMS'
  };

  static get options() {
    return Utils.buildSelectOptions(this.names, 'CMS구분');
  }

  static getName(code: string | number): string {
    return this.names[code] || '';
  }
}

export class ItaxUnpaidCmsPayKind {
  static CMS = 'CMS';
  static CARD = 'CARD';

  static names = {
    [ItaxUnpaidCmsPayKind.CMS]: 'CMS',
    [ItaxUnpaidCmsPayKind.CARD]: 'CARD'
  };

  static get options() {
    return Utils.buildSelectOptions(this.names, '출금구분');
  }

  static getName(code: string | number): string {
    return this.names[code] || '';
  }
}