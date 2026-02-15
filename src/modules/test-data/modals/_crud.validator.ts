import * as yup from 'yup';

// 파일 객체 스키마 정의
const fileSchema = yup.object({
  fileSeq: yup.mixed().nullable(),
  parentCode: yup.mixed().nullable(),
  storageType: yup.string(),
  fileAuth: yup.string(),
  fileUuid: yup.string(),
  fileFolder: yup.string(),
  filePath: yup.string(),
  fileName: yup.string(),
  fileSize: yup.number(),
  fileType: yup.string(),
  downloadCnt: yup.number(),
  orderValue: yup.number(),
  insertSeq: yup.mixed().nullable(),
  insertDate: yup.string(),
  updateSeq: yup.mixed().nullable(),
  updateDate: yup.string()
});

export const CrudInsertValidator = yup.object({
  subject: yup
    .string()
    .required('subject는 필수 입력 항목입니다.')
    .min(2, 'subject는 최소 2자 이상 입력해주세요.'),
  value: yup
    .string()
    .required('value는 필수 입력 항목입니다.'),
  imageList: yup
    .array()
    .of(fileSchema)
    .min(1, '이미지는 최소 1개 이상 선택해주세요.')
    .required('이미지는 최소 1개 이상 선택해주세요.'),
  contents: yup
    .string()
    .required('contents는 필수 입력 항목입니다.')
    .min(10, 'contents는 최소 10자 이상 입력해주세요.')
});

export const CrudUpdateValidator = yup.object({
  subject: yup
    .string()
    .required('subject는 필수 입력 항목입니다.')
    .min(2, 'subject는 최소 2자 이상 입력해주세요.'),
  value: yup
    .string()
    .required('value는 필수 입력 항목입니다.')
    .min(2, 'value는 최소 2자 이상 입력해주세요.'),
  imageList: yup
    .array()
    .of(fileSchema)
    .min(1, '이미지는 최소 1개 이상 선택해주세요.')
    .required('이미지는 최소 1개 이상 선택해주세요.'),
  contents: yup
    .string()
    .required('contents는 필수 입력 항목입니다.')
    .min(10, 'contents는 최소 10자 이상 입력해주세요.')
});
