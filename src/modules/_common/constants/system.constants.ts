/**
 * ----------------------------------------------------------------------------
 * 시스템
 * ----------------------------------------------------------------------------
 */
export class SystemId {
  static MEM_SYSTEM = -1; // System
  static MEM_EXCEL = -2; // Excel
  static MEM_API = -3; // API
  static MEM_BATCH = -4; // 배치
  static MEM_TDD = -5; // 배치

  static names = {
    [SystemId.MEM_SYSTEM]: 'System',
    [SystemId.MEM_EXCEL]: 'Excel',
    [SystemId.MEM_API]: 'Api',
    [SystemId.MEM_BATCH]: 'Batch',
    [SystemId.MEM_TDD]: 'TDD'
  };
}