import * as ExcelJS from 'exceljs';
import axios from 'axios';

/**
 * ExcelJS 기반 템플릿 Excel 처리 유틸리티
 * 백엔드 ExcelUtils와 동일한 방식으로 템플릿 기반 Excel 생성
 */
export class ExcelTemplateUtil {
  /**
   * 템플릿을 기반으로 Excel 파일을 생성합니다 (백엔드 ExcelUtils.generateFromTemplate과 동일)
   *
   * @param data 삽입할 데이터 배열
   * @param options 템플릿 옵션
   * @description
   * - startRowNum: 데이터가 기록되는 시작 행 번호 (예: 5)
   * - startRowNum - 1: 템플릿 스타일이 정의된 행 (예: 4행) - 데이터 삽입 후 삭제됨
   */
  public static async generateFromTemplate<T extends Record<string, any>>(
    data: T[],
    options: {
      templateUrl: string;
      fileName: string;
      startRowNum: number; // 데이터 기록 시작점 (예: 5행)
      fieldMappings: Array<{ field: string; column: number; defaultValue: string }>;
      preserveTemplateStyles: boolean;
    }
  ): Promise<ArrayBuffer> {
    const { templateUrl, startRowNum, fieldMappings } = options;

    // 입력 데이터 검증
    if (!data || data.length === 0) {
      throw new Error('익스포트할 데이터가 없습니다');
    }

    // 1. 템플릿 파일 로드
    const templateResponse = await axios.get(templateUrl, {
      responseType: 'arraybuffer',
      timeout: 30000
    });

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(templateResponse.data);

    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
      throw new Error('템플릿 워크시트를 찾을 수 없습니다');
    }

    // 원본 워크시트 뷰 저장 (고정 창 등)
    const originalViews = worksheet.views;

    // 2. 템플릿 스타일 행 가져오기 (startRowNum - 1 행)
    const templateStyleRow = worksheet.getRow(startRowNum - 1);

    // 3. 데이터 삽입 (startRowNum부터 시작)
    let currentRowNum = startRowNum;

    for (const item of data) {
      const dataRow = worksheet.getRow(currentRowNum);

      // 각 필드 매핑 처리
      for (const mapping of fieldMappings) {
        const cell = dataRow.getCell(mapping.column);
        const templateCell = templateStyleRow.getCell(mapping.column);

        // 템플릿 셀 스타일 복사 (간결한 방식)
        if (templateCell.style) {
          cell.style = { ...templateCell.style };
        }

        // 셀 값 설정
        this.setCellValue(cell, item, mapping);
      }

      currentRowNum++;
    }

    // 4. 템플릿 스타일 행 삭제 (데이터 삽입 완료 후)
    worksheet.spliceRows(startRowNum - 1, 1);

    // 5. 원본 워크시트 뷰 복원
    if (originalViews) {
      worksheet.views = originalViews;
    }

    // 6. 최종 엑셀 버퍼 생성
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }

  /**
   * 셀 값을 설정하고 적절한 타입 처리 및 포맷팅을 적용합니다
   * 백엔드 ExcelUtils.setCellValue와 동일한 로직
   */
  private static setCellValue(
    cell: ExcelJS.Cell,
    item: any,
    mapping: { field: string; column: number; defaultValue: string }
  ): void {
    let value = item[mapping.field];

    // 셀 값 설정 (적절한 타입 처리)
    if (value !== null && value !== undefined) {
      //날짜 필드 처리 안함
      //if (mapping.field.includes('Date') && typeof value === 'string') {
      //  cell.value = new Date(value);
      //} else
      if (typeof value === 'number') {
        // 숫자 필드 처리
        cell.value = value;
      } else {
        // 문자열 필드 처리
        const sanitized = this.sanitizeString(value);
        cell.value = sanitized;
        // 줄바꿈이 포함된 경우 wrapText 적용
        if (sanitized.includes('\n')) {
          cell.alignment = { ...cell.alignment, wrapText: true };
        }
      }
    } else {
      // null/undefined인 경우 기본값 사용
      cell.value = mapping.defaultValue || '-';
    }
  }

  /**
   * Excel 호환성을 위한 문자열 정제
   * 제어 문자 제거 및 길이 제한
   */
  private static sanitizeString(value: any): string {
    if (value === null || value === undefined) return '';

    // 문자열로 안전하게 변환
    let str: string;
    try {
      str = String(value);
    } catch {
      return '';
    }

    // 기본 정제 - Excel 문제 문자 제거
    let result = '';
    for (const char of str) {
      const code = char.charCodeAt(0);

      // 출력 가능한 문자와 일반 공백 유지
      if (code >= 32 && code <= 126) {
        // 표준 ASCII 출력 가능 문자
        result += char;
      } else if (code >= 160) {
        // 확장 문자 (Unicode)
        result += char;
      } else if (char === '\t' || char === '\r') {
        // 탭, 캐리지 리턴을 스페이스로 변환
        result += ' ';
      } else if (char === '\n') {
        // 줄바꿈 문자 유지 (multi-line 셀용)
        result += '\n';
      }
      // 제어 문자 (0-31, 127-159) 제거
    }

    return result
      .replace(/[ \t]+/g, ' ') // 여러 공백을 단일 스페이스로 치환 (줄바꿈 유지)
      .trim()
      .substring(0, 32767); // Excel 셀 제한
  }
}
