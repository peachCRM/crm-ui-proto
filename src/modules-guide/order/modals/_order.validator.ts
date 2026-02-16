import * as yup from 'yup';

/**
 * 주문 등록 유효성 검사
 */
export const OrderInsertValidator = yup.object({
  ordererName: yup.string().required('주문자명을 입력해주세요.'),
  ordererPhone: yup.string().required('주문자 연락처를 입력해주세요.'),
  productName: yup.string().required('상품을 선택해주세요.'),
  quantity: yup.number().required('수량을 입력해주세요.').min(1, '수량은 1 이상이어야 합니다.'),
  receiverName: yup.string().required('받는사람을 입력해주세요.'),
  receiverPhone: yup.string().required('받는사람 연락처를 입력해주세요.'),
  receiverAddress: yup.string().required('주소를 입력해주세요.'),
  paymentMethod: yup.string().required('결제수단을 선택해주세요.')
});

/**
 * 주문 수정 유효성 검사
 */
export const OrderUpdateValidator = yup.object({
  orderStatus: yup.string().required('주문상태를 선택해주세요.'),
  receiverName: yup.string().required('받는사람을 입력해주세요.'),
  receiverPhone: yup.string().required('받는사람 연락처를 입력해주세요.'),
  receiverAddress: yup.string().required('주소를 입력해주세요.')
});
