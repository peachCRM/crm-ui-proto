import { Utils } from '@/utils/utils.ts';

export class FileFolder {
  static ITAX_MEMO = 'itax/memo';
  static ITAX_CALENDAR = 'itax/calendar';
  static ITAX_CLIENT_DOC = 'itax/client_doc';
  static ITAX_SINGO_PAY = 'itax/singo_pay'; // 원천세
  static ITAX_SINGO_ADDITIONAL = 'itax/singo_additional'; // 부가세
  static ITAX_SINGO_CORPORATE = 'itax/singo_corporate'; // 법인세
  static ITAX_SINGO_INCOME = 'itax/singo_income'; // 종소세
  static ITAX_DOCUMENTS = 'itax/documents'; // 결재문서
  static ITAX_BOARD = 'itax/board';
  static E_APPROVAL_TEMPLATES = 'electronic-approval/templates';
}

export class FileGroupType {
  static FILE1 = '01';
  static FILE2 = '02';
  static FILE3 = '03';
  static FILE4 = '04';
  static FILE5 = '05';
  static FILE6 = '06';
  static FILE7 = '07';
  static FILE8 = '08';
  static FILE9 = '09';
  static FILE10 = '10';
  static FILE11 = '11';
  static FILE12 = '12';
  static FILE13 = '13';
  static FILE14 = '14';
  static FILE15 = '15';
  static FILE16 = '16';
  static FILE17 = '17';
  static FILE18 = '18';
  static FILE19 = '19';
  static FILE20 = '20';
  static FILE21 = '21';

  static names = {
    [FileGroupType.FILE1]: '수임업체관리-수임업체관리-문서관리[지출증빙 및 매출내역]',
    [FileGroupType.FILE2]: '수임업체관리-수임업체관리-문서관리[사업자등록증]',
    [FileGroupType.FILE3]: '수임업체관리-수임업체관리-문서관리[기본서류문서]',
    [FileGroupType.FILE4]: '수임업체관리-수임업체관리-문서관리[업무매뉴얼(조서)]',
    [FileGroupType.FILE5]: '수임업체관리-수임업체관리-문서관리[정산서(월별손익보고)]',
    [FileGroupType.FILE6]: '신고현황-원천세-신고문서[신고서(매입,매출장)]',
    [FileGroupType.FILE7]: '신고현황-원천세-신고문서[납부서]',
    [FileGroupType.FILE8]: '신고현황-원천세-신고문서[파일]',
    [FileGroupType.FILE9]: '신고현황-부가세-신고문서[신고서(매입,매출장)]',
    [FileGroupType.FILE10]: '신고현황-부가세-신고문서[납부서]',
    [FileGroupType.FILE11]: '신고현황-부가세-신고문서[파일]',
    [FileGroupType.FILE12]: '신고현황-법인세-신고문서[신고서(매입,매출장)]',
    [FileGroupType.FILE13]: '신고현황-법인세-신고문서[납부서]',
    [FileGroupType.FILE14]: '신고현황-법인세-신고문서[파일]',
    [FileGroupType.FILE15]: '신고현황-종소세-신고문서[신고서(매입,매출장)]',
    [FileGroupType.FILE16]: '신고현황-종소세-신고문서[납부서]',
    [FileGroupType.FILE17]: '신고현황-종소세-신고문서[파일]',
    [FileGroupType.FILE18]: '세무대리인 도장',
    [FileGroupType.FILE19]: '세무대행기관 도장',
    [FileGroupType.FILE20]: '',
    [FileGroupType.FILE21]: '국민의 세무사(앱) 소개 이미지'
  };

  static get options() {
    return Utils.buildSelectOptions(this.names, '파일그룹');
  }

  static getName(code: string | number): string {
    return this.names[code] || '';
  }
}