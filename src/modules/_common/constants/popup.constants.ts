//팝업 타입
export class PopupCloseType {
  static TODAY = '01'; //오늘 하루 열지 않기
  static WEEK = '02'; //일주일동안 열지 않기
  static NEVER = '03'; //더 이상 이 창 열지 않기

  static names = {
    [PopupCloseType.TODAY]: '오늘 하루 열지 않기',
    [PopupCloseType.WEEK]: '일주일동안 열지 않기',
    [PopupCloseType.NEVER]: '더 이상 이 창 열지 않기'
  };
}