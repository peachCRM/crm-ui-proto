import * as yup from 'yup';

export const ExcelUploadValidator = yup.object({
  excelData: yup.array().min(1, '엑셀 파일을 업로드해주세요.').required('엑셀 파일이 필요합니다.'),
  selectedRows: yup
    .array()
    .min(1, '업로드할 행을 최소 1개 이상 선택해주세요.')
    .required('업로드할 행을 선택해주세요.'),
  columnSelections: yup
    .object()
    .test('required-columns', '필수 선택 항목을 모두 선택해주세요.', function (value) {
      if (!value) return false;

      const requiredFields = ['contents', 'subject', 'value', 'bigint'];
      const selectedValues = Object.values(value);

      return requiredFields.every((field) => selectedValues.includes(field));
    })
    .required('필수 선택 항목을 모두 선택해주세요.')
});
