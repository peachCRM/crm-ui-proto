/**
 * 비상장 주식 평가 레포트 상태
 */
export class StockValuationReportState {
  static GENERATE = '1';
  static COMPLETE = '2';
  static DELETE = '3';

  static names = {
    [StockValuationReportState.GENERATE]: '작성중',
    [StockValuationReportState.COMPLETE]: '작성완료',
    [StockValuationReportState.DELETE]: '삭제'
  };

  static get options() {
    return [
      { text: '전체', value: '' },
      ...Object.entries(StockValuationReportState.names).map(([key, value]) => ({
        text: value,
        value: key
      }))
    ];
  }

  static getName(state: string | number): string {
    return StockValuationReportState.names[state];
  }
}