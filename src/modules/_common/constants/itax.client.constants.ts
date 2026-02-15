/**
 * ----------------------------------------------------------------------------
 * 스마트세무사(수임업체)
 * ----------------------------------------------------------------------------
 */

/**
 * 수임업체 개업상태 코드
 */
export class TaxiClientState {
  static OPEN = '1'; // 개업
  static CLOSE = '2'; // 폐업
  static SHUTDOWN = '3'; // 휴업
  static NONE = '4'; // 미등록사업자

  static names = {
    [TaxiClientState.OPEN]: '개업',
    [TaxiClientState.CLOSE]: '폐업',
    [TaxiClientState.SHUTDOWN]: '휴업',
    [TaxiClientState.NONE]: '미등록사업자'
  };

  static get optTaxiClientState() {
    return [
      { text: '사업자 상태', value: '' },
      ...Object.entries(TaxiClientState.names).map(([key, value]) => ({
        text: value,
        value: key
      }))
    ];
  }

  static getStateName(state: string | number): string {
    return TaxiClientState.names[state];
  }
}

/**
 * 수임업체 수임상태 코드
 */
export class ItaxClientAcceptState {
  static ACC = '1'; // 수임
  static DIS = '2'; // 해임

  static names = {
    [ItaxClientAcceptState.ACC]: '수임',
    [ItaxClientAcceptState.DIS]: '해임'
  };

  static get optTaxiClientAcceptState() {
    return [
      { text: '수임상태', value: '' },
      ...Object.entries(ItaxClientAcceptState.names).map(([key, value]) => ({
        text: value,
        value: key
      }))
    ];
  }

  static getAcceptStateName(acceptState: string | number): string {
    return ItaxClientAcceptState.names[acceptState];
  }
}

/**
 * 수임업체 기장료 당월 코드
 */
export class ItaxClientChargeOption {
  static OPT1 = '1'; // 당월
  static OPT2 = '2'; // 익월
  static OPT3 = '3'; // 익익월

  static names = {
    [ItaxClientChargeOption.OPT1]: '당월',
    [ItaxClientChargeOption.OPT2]: '익월',
    [ItaxClientChargeOption.OPT3]: '익익월'
  };

  static get optTaxiClientChargeDay() {
    return [
      { text: '기장료 당월', value: '' },
      ...Object.entries(ItaxClientChargeOption.names).map(([key, value]) => ({
        text: value,
        value: key
      }))
    ];
  }

  static getChargeDayName(chargeDay: string | number): string {
    return ItaxClientChargeOption.names[chargeDay];
  }
}

/**
 * 수임업체 급여 신고유형 코드
 */
export class ItaxClientPay {
  static MONTH = '1'; // 매월
  static HALF = '2'; // 반기
  static NONE = '3'; // 무실적

  static names = {
    [ItaxClientPay.MONTH]: '매월',
    [ItaxClientPay.HALF]: '반기',
    [ItaxClientPay.NONE]: '무실적'
  };

  static get optTaxiClientPay() {
    return [
      { text: '급여 신고유형', value: '' },
      ...Object.entries(ItaxClientPay.names).map(([key, value]) => ({
        text: value,
        value: key
      }))
    ];
  }

  static getPayName(pay: string | number): string {
    return ItaxClientPay.names[pay];
  }
}

/**
 * 수임업체 급여 당월 코드
 */
export class ItaxClientPayDay {
  static OPT1 = '1'; // 당월
  static OPT2 = '2'; // 익월
  static OPT3 = '3'; // 익익월

  static names = {
    [ItaxClientPayDay.OPT1]: '당월',
    [ItaxClientPayDay.OPT2]: '익월',
    [ItaxClientPayDay.OPT3]: '익익월'
  };

  static get optTaxiClientPayDay() {
    return [
      { text: '급여 당월', value: '' },
      ...Object.entries(ItaxClientPayDay.names).map(([key, value]) => ({
        text: value,
        value: key
      }))
    ];
  }

  static getPayDayName(payDay: string | number): string {
    return ItaxClientPayDay.names[payDay];
  }
}

/**
 * 수임업체 급여 퇴직연금 코드
 */
export class ItaxClientRetirementPension {
  static NONE = '1'; // 미가입
  static DEFINED_BENEFIT = '2'; // 확정급여형
  static DEFINED_CONTRIBUTION = '3'; // 확정기여형
  static ENTERPRISE = '4'; // 기업형

  static names = {
    [ItaxClientRetirementPension.NONE]: '미가입',
    [ItaxClientRetirementPension.DEFINED_BENEFIT]: '확정급여형',
    [ItaxClientRetirementPension.DEFINED_CONTRIBUTION]: '확정기여형',
    [ItaxClientRetirementPension.ENTERPRISE]: '기업형'
  };

  static get optTaxiClientRetirementPension() {
    return [
      { text: '퇴직연금', value: '' },
      ...Object.entries(ItaxClientRetirementPension.names).map(([key, value]) => ({
        text: value,
        value: key
      }))
    ];
  }

  static getRetirementPensionName(retirementPension: string | number): string {
    return ItaxClientRetirementPension.names[retirementPension];
  }
}

/**
 * 수임업체 급여 4대보험 코드
 */
export class ItaxClientInsurance {
  static NONE = '1'; // 미신고
  static E_INDUSTRIAL = '2'; // e공단
  static AGENCY = '3'; // 사무대행기관
  static CERT = '4'; // 공인인증서
  static FAX = '5'; // 팩스신고
  static ETC = '6'; // 기타

  static names = {
    [ItaxClientInsurance.NONE]: '미신고',
    [ItaxClientInsurance.E_INDUSTRIAL]: 'e공단',
    [ItaxClientInsurance.AGENCY]: '사무대행기관',
    [ItaxClientInsurance.CERT]: '공인인증서',
    [ItaxClientInsurance.FAX]: '팩스신고',
    [ItaxClientInsurance.ETC]: '기타'
  };

  static get optTaxiClientInsurance() {
    return [
      { text: '4대보험', value: '' },
      ...Object.entries(ItaxClientInsurance.names).map(([key, value]) => ({
        text: value,
        value: key
      }))
    ];
  }

  static getInsuranceName(insurance: string | number): string {
    return ItaxClientInsurance.names[insurance];
  }
}

/**
 * 수임업체 홈택스 동의 코드
 */
export class ItaxClientHometaxAgree {
  static OUT = '1';
  static NONE = '2';
  static REQUEST = '3';
  static COMPLETE = '4';
  static REMOVE = '9';
  static names = {
    [ItaxClientHometaxAgree.OUT]: '타세무 동의',
    [ItaxClientHometaxAgree.NONE]: '미동의 상태',
    [ItaxClientHometaxAgree.REQUEST]: '수임동의 요청',
    [ItaxClientHometaxAgree.COMPLETE]: '수임동의 완료',
    [ItaxClientHometaxAgree.REMOVE]: '해임 상태'
  };

  static get optTaxiClientHometaxAgree() {
    return [
      { text: '홈택스 동의여부', value: '' },
      ...Object.entries(ItaxClientHometaxAgree.names).map(([key, value]) => ({
        text: value,
        value: key
      }))
    ];
  }

  static getHometaxAgreeName(hometaxAgree: string | number): string {
    return ItaxClientHometaxAgree.names[hometaxAgree];
  }
}

/**
 * 수임업체 과세유형 코드
 */
export class ItaxClientGwase {
  static GENERAL = '1'; // 일반과세자
  static SIMPLE = '2'; // 간이과세자
  static FREE = '3'; // 면세사업자
  static SIMPLE2 = '4'; // 간이(세금계산서발급)
  static NONE = '9'; // 비사업자

  static names = {
    [ItaxClientGwase.GENERAL]: '일반과세자',
    [ItaxClientGwase.SIMPLE]: '간이과세자',
    [ItaxClientGwase.FREE]: '면세사업자',
    [ItaxClientGwase.SIMPLE2]: '간이(세금계산서발급)',
    [ItaxClientGwase.NONE]: '비사업자'
  };

  static get optTaxiClientGwase() {
    return [
      { text: '과세유형', value: '' },
      ...Object.entries(ItaxClientGwase.names).map(([key, value]) => ({
        text: value,
        value: key
      }))
    ];
  }

  static getGwaseName(gwase: string | number): string {
    return ItaxClientGwase.names[gwase];
  }
}

export class ItaxClientPayDivision {
  static MONTH = '1'; // 매월
  static HALF = '2'; // 반기
  static NONE = '3'; // 무실적

  static names = {
    [ItaxClientPayDivision.MONTH]: '매월',
    [ItaxClientPayDivision.HALF]: '반기',
    [ItaxClientPayDivision.NONE]: '무실적'
  };

  static get optTaxiClientPayDivision() {
    return [
      { text: '급여 신고유형', value: '' },
      ...Object.entries(ItaxClientPayDivision.names).map(([key, value]) => ({
        text: value,
        value: key
      }))
    ];
  }

  static getPayDivisionName(payDivision: string | number): string {
    return ItaxClientPayDivision.names[payDivision];
  }
}

export class ItaxClientInsuranceDivision {
  static NONE = '1'; // 미신고
  static E_INDUSTRIAL = '2'; // e공단
  static AGENCY = '3'; // 사무대행기관
  static CERT = '4'; // 공인인증서
  static FAX = '5'; // 팩스신고

  static names = {
    [ItaxClientInsuranceDivision.NONE]: '미신고',
    [ItaxClientInsuranceDivision.E_INDUSTRIAL]: 'e공단',
    [ItaxClientInsuranceDivision.AGENCY]: '사무대행기관',
    [ItaxClientInsuranceDivision.CERT]: '공인인증서',
    [ItaxClientInsuranceDivision.FAX]: '팩스신고'
  };

  static get optTaxiClientInsuranceDivision() {
    return [
      { text: '4대보험', value: '' },
      ...Object.entries(ItaxClientInsuranceDivision.names).map(([key, value]) => ({
        text: value,
        value: key
      }))
    ];
  }

  static getInsuranceDivisionName(insuranceDivision: string | number): string {
    return ItaxClientInsuranceDivision.names[insuranceDivision];
  }
}

export class ItaxClientIsBizAccount {
  static NO = 'N'; // 미등록
  static YES = 'Y'; // 등록

  static names = {
    [ItaxClientIsBizAccount.NO]: '사업자계좌 미등록',
    [ItaxClientIsBizAccount.YES]: '사업자계좌 등록'
  };

  static get optTaxiClientIsBizAccount() {
    return [
      { text: '사업자계좌', value: '' },
      ...Object.entries(ItaxClientIsBizAccount.names).map(([key, value]) => ({
        text: value,
        value: key
      }))
    ];
  }

  static getIsBizAccountName(isBizAccount: string | number): string {
    return ItaxClientIsBizAccount.names[isBizAccount];
  }
}

export class ItaxClientIsBizAccountSingo {
  static NO = 'N'; // 신고의무 미해당
  static YES = 'Y'; // 신고의무 해당

  static names = {
    [ItaxClientIsBizAccountSingo.NO]: '신고의무 미해당',
    [ItaxClientIsBizAccountSingo.YES]: '신고의무 해당'
  };

  static get optTaxiClientIsBizAccountSingo() {
    return [
      { text: '사업자계좌 신고의무', value: '' },
      ...Object.entries(ItaxClientIsBizAccountSingo.names).map(([key, value]) => ({
        text: value,
        value: key
      }))
    ];
  }

  static getIsBizAccountSingoName(isBizAccountSingo: string | number): string {
    return ItaxClientIsBizAccountSingo.names[isBizAccountSingo];
  }
}

export class ItaxClientIsBizCard {
  static NO = 'N'; // 사업용카드 미등록
  static YES = 'Y'; // 사업용카드

  static names = {
    [ItaxClientIsBizCard.NO]: '사업용카드 미등록',
    [ItaxClientIsBizCard.YES]: '사업용카드 등록'
  };

  static get optTaxiIsBizCard() {
    return [
      { text: '사업용카드', value: '' },
      ...Object.entries(ItaxClientIsBizCard.names).map(([key, value]) => ({
        text: value,
        value: key
      }))
    ];
  }

  static getIsBizCardName(isBizCard: string | number): string {
    return ItaxClientIsBizCard.names[isBizCard];
  }
}

