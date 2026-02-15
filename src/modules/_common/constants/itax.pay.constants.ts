import { Utils } from '@/utils/utils.ts';

/**
 * 결제_넥스페이회원 상태
 */
export class ItaxPayNexpayMemberState {
  static COMPLETE = '10';
  static FAIL = '11';

  static names = {
    [ItaxPayNexpayMemberState.COMPLETE]: '가입완료',
    [ItaxPayNexpayMemberState.FAIL]: '가입실패'
  };

  static get options() {
    return Utils.buildSelectOptions(this.names, '회원상태');
  }

  static getName(code: string | number): string {
    return this.names[code] || '';
  }
}

/**
 * 결제_넥스페이회원 정산주기
 */
export class ItaxPayNexpayMemberPaymentCycle {
  static NEXTDAY = '1';
  static NORMAL = '3';

  static names = {
    [ItaxPayNexpayMemberPaymentCycle.NEXTDAY]: '익일정산',
    [ItaxPayNexpayMemberPaymentCycle.NORMAL]: '일반정산'
  };

  static get options() {
    return Utils.buildSelectOptions(this.names, '정산주기');
  }

  static getName(code: string | number): string {
    return this.names[code] || '';
  }
}


/**
 * 은행코드
 *
 */
export class ItaxPayNexpayBankCode {
  static KEB_HANA_BANK = '81'; // KEB하나은행
  static NH_BANK = '16'; // 농협은행
  static KB_BANK = '04'; // 국민은행
  static IBK_BANK = '03'; // 기업은행
  static SHINHAN_BANK = '88'; // 신한은행
  static WOORI_BANK = '20'; // 우리은행
  static SC_BANK = '23'; // SC은행
  static KYONGNAM_BANK = '39'; // 경남은행
  static GWANGJU_BANK = '34'; // 광주은행
  static DAEGU_BANK = '31'; // 대구은행
  static BUSAN_BANK = '32'; // 부산은행
  static INDUSTRIAL_BANK = '02'; // 산업은행
  static MUTUAL_SAVINGS = '50'; // 상호저축
  static SAEMAEUL_BANK = '45'; // 새마을금고
  static SUHYUP = '07'; // 수협
  static SINHYUP = '48'; // 신협
  static POST_OFFICE = '71'; // 우체국
  static JEONBUK_BANK = '37'; // 전북은행
  static JEJU_BANK = '35'; // 제주은행
  static CITI_BANK = '53'; // 씨티은행
  static DEUTSCHE_BANK = '55'; // 도이치은행
  static HSBC_BANK = '54'; // HSBC은행
  static EXCHANGE_BANK = '05'; // 외환은행
  static K_BANK = '89'; // 케이뱅크
  static KAKAO_BANK = '90'; // 카카오뱅크
  static SANRIM_BANK = '64'; // 산림조합중앙회

  static names = {
    [ItaxPayNexpayBankCode.KEB_HANA_BANK]: 'KEB하나은행',
    [ItaxPayNexpayBankCode.NH_BANK]: '농협은행',
    [ItaxPayNexpayBankCode.KB_BANK]: '국민은행',
    [ItaxPayNexpayBankCode.IBK_BANK]: '기업은행',
    [ItaxPayNexpayBankCode.SHINHAN_BANK]: '신한은행',
    [ItaxPayNexpayBankCode.WOORI_BANK]: '우리은행',
    [ItaxPayNexpayBankCode.SC_BANK]: 'SC은행',
    [ItaxPayNexpayBankCode.KYONGNAM_BANK]: '경남은행',
    [ItaxPayNexpayBankCode.GWANGJU_BANK]: '광주은행',
    [ItaxPayNexpayBankCode.DAEGU_BANK]: '대구은행',
    [ItaxPayNexpayBankCode.BUSAN_BANK]: '부산은행',
    [ItaxPayNexpayBankCode.INDUSTRIAL_BANK]: '산업은행',
    [ItaxPayNexpayBankCode.MUTUAL_SAVINGS]: '상호저축',
    [ItaxPayNexpayBankCode.SAEMAEUL_BANK]: '새마을금고',
    [ItaxPayNexpayBankCode.SUHYUP]: '수협',
    [ItaxPayNexpayBankCode.SINHYUP]: '신협',
    [ItaxPayNexpayBankCode.POST_OFFICE]: '우체국',
    [ItaxPayNexpayBankCode.JEONBUK_BANK]: '전북은행',
    [ItaxPayNexpayBankCode.JEJU_BANK]: '제주은행',
    [ItaxPayNexpayBankCode.CITI_BANK]: '씨티은행',
    [ItaxPayNexpayBankCode.DEUTSCHE_BANK]: '도이치은행',
    [ItaxPayNexpayBankCode.HSBC_BANK]: 'HSBC은행',
    [ItaxPayNexpayBankCode.EXCHANGE_BANK]: '외환은행',
    [ItaxPayNexpayBankCode.K_BANK]: '케이뱅크',
    [ItaxPayNexpayBankCode.KAKAO_BANK]: '카카오뱅크',
    [ItaxPayNexpayBankCode.SANRIM_BANK]: '산림조합중앙회'
  };

  static get options() {
    return Object.entries(ItaxPayNexpayBankCode.names).map(([key, value]) => ({
      text: value,
      value: key
    }));
  }
}

/**
 * 결제 상태
 */
export class ItaxPayState {
  static REQUEST = '1';
  static COMPLETE = '2';
  static FAIL = '3';
  static CANCEL = '9';

  static names = {
    [ItaxPayState.REQUEST]: '결제요청',
    [ItaxPayState.COMPLETE]: '결제완료',
    [ItaxPayState.FAIL]: '결제실패',
    [ItaxPayState.CANCEL]: '결제취소'
  };

  static get options() {
    return Utils.buildSelectOptions(this.names, '결제_상태');
  }

  static getName(code: string | number): string {
    return this.names[code] || '';
  }
}

/**
 * 결제 시스템 구분
 */
export class ItaxPaySystemType {
  static NEXPAY = '1';

  static names = {
    [ItaxPaySystemType.NEXPAY]: '넥스페이'
  };

  static get options() {
    return Utils.buildSelectOptions(this.names, '결제 시스템 구분');
  }

  static getName(code: string | number): string {
    return this.names[code] || '';
  }
}