import * as yup from 'yup';

/**
 * 상품 등록 유효성 검사
 */
export const ProductInsertValidator = yup.object({
  productName: yup.string().required('상품명을 입력해주세요.'),
  productCode: yup.string().required('상품코드를 입력해주세요.'),
  category: yup.string().required('카테고리를 선택해주세요.'),
  price: yup.number().required('판매가를 입력해주세요.').min(0, '판매가는 0 이상이어야 합니다.'),
  stockQty: yup.number().required('재고수량을 입력해주세요.').min(0, '재고수량은 0 이상이어야 합니다.')
});

/**
 * 상품 수정 유효성 검사
 */
export const ProductUpdateValidator = yup.object({
  productName: yup.string().required('상품명을 입력해주세요.'),
  productCode: yup.string().required('상품코드를 입력해주세요.'),
  category: yup.string().required('카테고리를 선택해주세요.'),
  price: yup.number().required('판매가를 입력해주세요.').min(0, '판매가는 0 이상이어야 합니다.'),
  stockQty: yup.number().required('재고수량을 입력해주세요.').min(0, '재고수량은 0 이상이어야 합니다.')
});
