import { Utils } from '@/utils/utils.ts';

/**
 * ----------------------------------------------------------------------------
 * 스마트세무사(신고현황 종소세)
 * ----------------------------------------------------------------------------
 */
export class ItaxSingoIncomeTaxDivision {
  static FAKE = '1'; // 가결산
  static BEFORE = '2'; // 중간예납
  static FIX = '3'; // 정기신고
  static ALL = '9'; // 중간예납+정기신고

  static names = {
    [ItaxSingoIncomeTaxDivision.FAKE]: '가결산',
    [ItaxSingoIncomeTaxDivision.BEFORE]: '중간예납',
    [ItaxSingoIncomeTaxDivision.FIX]: '정기신고',
    [ItaxSingoIncomeTaxDivision.ALL]: '중간예납+정기신고'
  };

  static get options() {
    return Utils.buildSelectOptions(this.names, '신고구분');
  }

  static getName(code: string | number): string {
    return this.names[code] || '';
  }
}

export class ItaxSingoIncomeSingoDivision {
  static DOUBLE_ENTRY = '1';
  static SIMPLE_LEDGER = '2';

  static names = {
    [ItaxSingoIncomeSingoDivision.DOUBLE_ENTRY]: '복식부기',
    [ItaxSingoIncomeSingoDivision.SIMPLE_LEDGER]: '간편장부'
  };

  static get options() {
    return Utils.buildSelectOptions(this.names, '장부유형');
  }

  static getName(code: string | number): string {
    return this.names[code];
  }
}

export class ItaxSingoIncomeSingoCategory {
  static SELF_SIMPLE = '1';
  static SELF_DOUBLE = '2';
  static EXTERNAL_DOUBLE = '3';
  static SINCERE_DOUBLE = '4';
  static RATE_SIMPLE = '5';
  static ETC = '99';

  static names = {
    [ItaxSingoIncomeSingoCategory.SELF_SIMPLE]: '간편장부',
    [ItaxSingoIncomeSingoCategory.SELF_DOUBLE]: '복식부기(자기조정)',
    [ItaxSingoIncomeSingoCategory.EXTERNAL_DOUBLE]: '복식부기(외부조정)',
    [ItaxSingoIncomeSingoCategory.SINCERE_DOUBLE]: '복식부기(성실신고)',
    [ItaxSingoIncomeSingoCategory.RATE_SIMPLE]: '단순경비율',
    [ItaxSingoIncomeSingoCategory.ETC]: '금융,근로,기타,연금소득자'
  };

  static get options() {
    return Utils.buildSelectOptions(this.names, '신고유형');
  }

  static getName(code: string | number): string {
    return this.names[code];
  }
}

export class ItaxSingoIncomeExpenseRatio {
  static SIMPLE = '1';
  static STANDARD = '2';

  static names = {
    [ItaxSingoIncomeExpenseRatio.SIMPLE]: '단순경비율',
    [ItaxSingoIncomeExpenseRatio.STANDARD]: '기준경비율'
  };

  static get options() {
    return Utils.buildSelectOptions(this.names, '추계시경비율');
  }

  static getName(code: string | number): string {
    return ItaxSingoIncomeExpenseRatio.names[code];
  }
}

export class ItaxSingoIncomeBizDivision {
  static BIZ01 = '1';
  static BIZ02 = '2';

  static names = {
    [ItaxSingoIncomeBizDivision.BIZ01]: '일반',
    [ItaxSingoIncomeBizDivision.BIZ02]: '간이'
  };

  static get options() {
    return Utils.buildSelectOptions(this.names, '사업자구분');
  }

  static getName(code: string | number): string {
    return this.names[code] || '';
  }
}

export class ItaxSingoIncomeBizCategory {
  static BIZ01 = '1';
  static BIZ02 = '2';
  static BIZ03 = '3';
  static BIZ04 = '4';
  static BIZ05 = '5';
  static BIZ06 = '6';
  static BIZ07 = '7';
  static BIZ08 = '8';
  static BIZ99 = '99';

  static names = {
    [ItaxSingoIncomeBizCategory.BIZ08]: '운송업(라이더, 택배, 대리기사)',
    [ItaxSingoIncomeBizCategory.BIZ01]: 'IT개발자',
    [ItaxSingoIncomeBizCategory.BIZ02]: '유튜버',
    [ItaxSingoIncomeBizCategory.BIZ05]: '학원강사',
    [ItaxSingoIncomeBizCategory.BIZ04]: '세일즈(자동차, 보험, 분양 등 외판원)',
    [ItaxSingoIncomeBizCategory.BIZ03]: '쇼핑몰',
    [ItaxSingoIncomeBizCategory.BIZ06]: '부동산임대업',
    [ItaxSingoIncomeBizCategory.BIZ07]: '음식업',
    [ItaxSingoIncomeBizCategory.BIZ99]: '기타'
  };

  static get options() {
    return [
      ...Object.entries(ItaxSingoIncomeBizCategory.names).map(([key, value]) => ({
        text: value,
        value: key
      }))
    ];
  }

  static getName(isTaxDivision: string | number): string {
    return ItaxSingoIncomeBizCategory.names[isTaxDivision];
  }
}

export class ItaxSingoIncomeHumanRelation {
  static Relation01 = '1';
  static Relation02 = '2';
  static Relation03 = '3';
  static Relation04 = '4';
  static Relation05 = '5';
  static Relation06 = '6';
  static Relation07 = '7';
  static Relation99 = '99';

  static names = {
    [ItaxSingoIncomeHumanRelation.Relation01]: '본인',
    [ItaxSingoIncomeHumanRelation.Relation02]: '배우자',
    [ItaxSingoIncomeHumanRelation.Relation03]: '부',
    [ItaxSingoIncomeHumanRelation.Relation04]: '모',
    [ItaxSingoIncomeHumanRelation.Relation05]: '장인장모',
    [ItaxSingoIncomeHumanRelation.Relation06]: '시부모',
    [ItaxSingoIncomeHumanRelation.Relation07]: '자녀',
    [ItaxSingoIncomeHumanRelation.Relation99]: '기타'
  };

  static get options() {
    return Utils.buildSelectOptions(this.names, '관계');
  }

  static getName(code: string | number): string {
    return this.names[code] || '';
  }
}