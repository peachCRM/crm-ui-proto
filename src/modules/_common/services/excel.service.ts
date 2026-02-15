import { read, utils, writeFileXLSX } from 'xlsx';

export class ExcelService {
  static async parser(file: File, rowRange = 0): Promise<{ sheetName: string; data: unknown }[]> {
    const data = await file.arrayBuffer();
    const workbook = read(data, { type: 'array' });
    const result: any = [];
    workbook.SheetNames.forEach((sheetName) => {
      let roa = null;
      if (rowRange > 0) {
        roa = utils.sheet_to_json(workbook.Sheets[sheetName], {
          header: 1,
          range: rowRange + 1
        });
      } else {
        // roa = utils.sheet_to_json(workbook.Sheets[sheetName]);
        roa = utils.sheet_to_json(workbook.Sheets[sheetName], {
          header: 1,
          range: 0
        });
      }

      const sheet = {
        sheetName,
        data: roa.length ? roa : null
      };
      result.push(sheet);
    });

    return result;
  }

  static download(
    excelData: {
      sheetName: string;
      explain?: { memo: string; height: number }; // Optional 속성으로 정의
      data: { [key: string]: unknown }[];
    }[],
    fileName: string
  ) {
    const wb = utils.book_new();
    for (const sheet of excelData) {
      // const dataWithExplain = sheet.data[0]?.explain ? [sheet.data[0]] : [];
      // const ws = utils.json_to_sheet([...dataWithExplain, ...sheet.data]);
      // utils.book_append_sheet(wb, ws, sheet.sheetName);
      //
      const wsData = sheet.data;
      const ws = utils.aoa_to_sheet([]);

      // Merge the first row (1번 행) if "explain" exists
      if (sheet.explain) {
        const range = {
          s: { r: 0, c: 0 }, // start at the first row and first column
          e: { r: 0, c: 9 } // end at the first row and the 10th column
        };
        ws['!merges'] = [range];

        // 높이 설정이 0 보다 크면 설정
        if (sheet.explain.height > 0) {
          ws['!rows'] = ws['!rows'] || [];
          ws['!rows'][0] = { hpx: sheet.explain.height };
        }

        ws.A1 = { t: 's', v: sheet.explain.memo };
      }

      // Add headers in the second row (2번째 행)
      const headers = Object.keys(wsData[0]);
      utils.sheet_add_aoa(ws, [headers], { origin: 'A2' });

      // Add data starting from the third row (3번째 행)
      if (wsData) {
        const data = wsData.map((item) => headers.map((key) => item[key]));
        utils.sheet_add_aoa(ws, data, { origin: 'A3' });
      }

      utils.book_append_sheet(wb, ws, sheet.sheetName);
    }
    writeFileXLSX(wb, fileName);
  }
}
