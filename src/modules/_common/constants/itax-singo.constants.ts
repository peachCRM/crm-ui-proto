import { Utils } from '@/utils/utils.ts';

/**
 * ----------------------------------------------------------------------------
 * 스마트세무사(신고현황)
 * ----------------------------------------------------------------------------
 */
export class ItaxSingoTaxItem {
  static PAY = 'pay';
  static YEA = 'yearend';
  static DLY = 'daily';
  static CON = 'condition';
  static RWD = 'reward';
  static ADD = 'additional';
  static COR = 'corporate';
  static INC = 'income';

  static names = {
    [ItaxSingoTaxItem.PAY]: '원천세',
    [ItaxSingoTaxItem.YEA]: '지급명세서',
    [ItaxSingoTaxItem.DLY]: '일용직지급명세서',
    [ItaxSingoTaxItem.CON]: '사업장현황신고',
    [ItaxSingoTaxItem.RWD]: '보수총액신고',
    [ItaxSingoTaxItem.ADD]: '부가세',
    [ItaxSingoTaxItem.COR]: '법인세',
    [ItaxSingoTaxItem.INC]: '종소세'
  };

  static get options() {
    return Utils.buildSelectOptions(this.names, '세목 전체');
  }

  static getName(code: string | number): string {
    return this.names[code] || '';
  }
}

/**
 * 신고현황_신고종류
 */
export class ItaxSingoKind {
  static REPORT = '1';
  static UPDATE = '2';
  static REVISED = '3';
  static DEADLINE = '4';

  static names = {
    [ItaxSingoKind.REPORT]: '신고',
    [ItaxSingoKind.UPDATE]: '수정',
    [ItaxSingoKind.REVISED]: '경정',
    [ItaxSingoKind.DEADLINE]: '기한후'
  };

  static get options() {
    return Utils.buildSelectOptions(this.names, '신고종류');
  }

  static getName(code: string | number): string {
    return this.names[code] || '';
  }
}

/**
 * 신고현황_자료수취방법
 */
export class ItaxSingoDataWay {
  static NODATA = '1';
  static POST = '2';
  static EMAIL = '3';
  static KAKAO = '4';
  static SMS = '5';
  static VISIT = '6';
  static TEL = '7';
  static ETC = '99';

  static names = {
    [ItaxSingoDataWay.NODATA]: '자료없음',
    [ItaxSingoDataWay.POST]: '우편',
    [ItaxSingoDataWay.EMAIL]: '메일',
    [ItaxSingoDataWay.KAKAO]: '카카오톡',
    [ItaxSingoDataWay.SMS]: '문자',
    [ItaxSingoDataWay.VISIT]: '방문',
    [ItaxSingoDataWay.TEL]: '전화',
    [ItaxSingoDataWay.ETC]: '기타'
  };

  static get options() {
    return Utils.buildSelectOptions(this.names, '자료수취방법');
  }

  static getName(code: string | number): string {
    return ItaxSingoDataWay.names[code];
  }
}

/**
 * 신고현황_납부방법안내
 */
export class ItaxSingoPaymentWay {
  static EMAIL = '1';
  static FAX = '2';
  static VIRTUAL = '3';
  static REFUND = '4';
  static EARLY = '5';
  static NONE = '6';
  static PROXY = '7';
  static TEL = '8';
  static SMS = '9';
  static DIRECT = '10';
  static ETC = '99';

  static names = {
    [ItaxSingoPaymentWay.EMAIL]: '이메일',
    [ItaxSingoPaymentWay.FAX]: '팩스',
    [ItaxSingoPaymentWay.VIRTUAL]: '가상계좌',
    [ItaxSingoPaymentWay.REFUND]: '환급',
    [ItaxSingoPaymentWay.EARLY]: '조기환급',
    [ItaxSingoPaymentWay.NONE]: '없음',
    [ItaxSingoPaymentWay.PROXY]: '대납',
    [ItaxSingoPaymentWay.TEL]: '전화',
    [ItaxSingoPaymentWay.SMS]: '문자/카톡',
    [ItaxSingoPaymentWay.DIRECT]: '직접납부',
    [ItaxSingoPaymentWay.ETC]: '기타'
  };

  static get options() {
    return Utils.buildSelectOptions(this.names, '납부방법안내');
  }

  static getName(code: string | number): string {
    return this.names[code] || '';
  }
}

/**
 * 신고현황_영수증발급
 */
export class ItaxSingoBillCode {
  static BEFORE = '1'; // 영수증 발행 전
  static TAX = '2'; // 세금계산서 발행
  static RECEIPT = '3'; // 현금영수증 발행
  static NO = '99'; // 영수증 발행 안함

  static names = {
    [ItaxSingoBillCode.BEFORE]: '영수증 발행 전',
    [ItaxSingoBillCode.TAX]: '세금계산서 발행',
    [ItaxSingoBillCode.RECEIPT]: '현금영수증 발행',
    [ItaxSingoBillCode.NO]: '영수증 발행 안함'
  };

  static get options() {
    return Utils.buildSelectOptions(this.names, '영수증발행');
  }

  static getName(billCode: string | number): string {
    return ItaxSingoBillCode.names[billCode];
  }
}

/**
 * 신고현황_환급구분
 */
export class ItaxSingoRefundDivision {
  /*
  static REFUND = '1';
  static EARLY_REFUND = '2';
  static NON_REFUND = '3';
  static NO_TAX = '99';

  static names = {
    [TaxiSingoRefundDivision.REFUND]: '환급',
    [TaxiSingoRefundDivision.EARLY_REFUND]: '조기환급',
    [TaxiSingoRefundDivision.NON_REFUND]: '미환급',
    [TaxiSingoRefundDivision.NO_TAX]: '세금없음'
  };
  */

  static REFUND = '1';
  static PAYMENT = '2';

  static names = {
    [ItaxSingoRefundDivision.REFUND]: '환급',
    [ItaxSingoRefundDivision.PAYMENT]: '납부'
  };

  static get options() {
    return Utils.buildSelectOptions(this.names, '환급구분');
  }

  static getName(code: string | number): string {
    return this.names[code] || '';
  }
}

/**
 * 신고현황_수수료
 */
export class ItaxSingoUnpaid {
  static UNPAID = '1';
  static COMPLETE = '2';
  static NONE = '3';

  static names = {
    [ItaxSingoUnpaid.UNPAID]: '미수 내역',
    [ItaxSingoUnpaid.COMPLETE]: '완납 내역',
    [ItaxSingoUnpaid.NONE]: '수수료 업음'
  };

  static get options() {
    return Utils.buildSelectOptions(this.names, '수수료');
  }

  static getName(code: string | number): string {
    return this.names[code] || '';
  }
}

/**
 * 신고현황 메모 구분
 */
export class ItaxSingoMemoDivsion {
  static MEMO = '1';
  static HIST = '2';

  static names = {
    [ItaxSingoMemoDivsion.MEMO]: '메모',
    [ItaxSingoMemoDivsion.HIST]: '변경이력'
  };
}