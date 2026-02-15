export const Ast = {
  /**
   * 전화번호 자동 포맷팅
   * 010으로 시작하면 hpNumberUnderBar, 아니면 telNumberUnderBar 적용
   * @param phoneNumber 전화번호
   * @returns 포맷팅된 전화번호
   */
  formatPhoneNumber(phoneNumber: string) {
    // trim 처리
    const trimmed = phoneNumber.trim();

    // 빈 문자열 처리
    if (!trimmed) return '';

    // 하이픈이 있으면 그대로 반환
    if (trimmed.includes('-')) return trimmed;

    // 010으로 시작하는지 체크
    if (trimmed.startsWith('010')) {
        return Ast.hpNumberUnderBar(trimmed);
    }

    return Ast.telNumberUnderBar(trimmed);
  },
  hpNumberUnderBar(hpNumber: string) {
    const value = hpNumber.split('-').join('');
    if (value.length <= 3) return value;

    if (value.length < 10) {
      return value.substring(0, 3) + '-' + value.substring(3, value.length);
    } else if (value.length >= 10 && value.length < 11) {
      return (
        value.substring(0, 3) + '-' + value.substring(3, 6) + '-' + value.substring(6, value.length)
      );
    } else if (value.length >= 11) {
      return (
        value.substring(0, 3) + '-' + value.substring(3, 7) + '-' + value.substring(7, value.length)
      );
    }
  },
  telNumberUnderBar(telNumber: string) {
    const value = telNumber.split('-').join('');
    if (value.length <= 3) return value;

    let inputValue = '';
    if (value.length <= 8 && value.substring(0, 1) === '1') {
      if (value.length >= 4) {
        inputValue = value.substring(0, 4) + '-' + value.substring(4, value.length);
      }
      return inputValue;
    }

    if (value.length >= 4 && value.substring(0, 3) === '030') {
      if (value.length >= 4 && value.length < 7) {
        inputValue = value.substring(0, 4) + '-' + value.substring(4, value.length);
      } else if (value.length >= 11 && value.length < 12) {
        inputValue =
          value.substring(0, 4) +
          '-' +
          value.substring(4, 7) +
          '-' +
          value.substring(7, value.length);
      } else {
        inputValue =
          value.substring(0, 4) +
          '-' +
          value.substring(4, 8) +
          '-' +
          value.substring(8, value.length);
      }
      return inputValue;
    }

    if (value.length >= 4 && value.substring(0, 3) === '050') {
      if (value.length >= 4 && value.length < 7) {
        inputValue = value.substring(0, 4) + '-' + value.substring(4, value.length);
      } else if (value.length >= 11 && value.length < 12) {
        inputValue =
          value.substring(0, 4) +
          '-' +
          value.substring(4, 7) +
          '-' +
          value.substring(7, value.length);
      } else {
        inputValue =
          value.substring(0, 4) +
          '-' +
          value.substring(4, 8) +
          '-' +
          value.substring(8, value.length);
      }
      return inputValue;
    }

    if (value.length >= 2 && value.substring(0, 2) === '02') {
      if (value.length >= 2 && value.length < 5) {
        inputValue = value.substring(0, 2) + '-' + value.substring(2, value.length);
      } else if (value.length >= 9 && value.length < 10) {
        inputValue =
          value.substring(0, 2) +
          '-' +
          value.substring(2, 5) +
          '-' +
          value.substring(5, value.length);
      } else {
        inputValue =
          value.substring(0, 2) +
          '-' +
          value.substring(2, 6) +
          '-' +
          value.substring(6, value.length);
      }
      return inputValue;
    }

    if (value.length < 6) {
      inputValue = value.substring(0, 3) + '-' + value.substring(3, value.length);
    } else if (value.length < 11) {
      inputValue =
        value.substring(0, 3) +
        '-' +
        value.substring(3, 6) +
        '-' +
        value.substring(6, value.length);
    } else {
      inputValue =
        value.substring(0, 3) +
        '-' +
        value.substring(3, 7) +
        '-' +
        value.substring(7, value.length);
    }
    return inputValue;
  },
  dateUnderBar(value: string) {
    const text = value.split('-').join('');
    if (text.length >= 4 && text.length < 6) {
      return text.substring(0, 4) + '-' + text.substring(4, text.length);
    } else if (text.length >= 6) {
      return (
        text.substring(0, 4) + '-' + text.substring(4, 6) + '-' + text.substring(6, text.length)
      );
    } else {
      return value;
    }
  },
  juminUnderBar(value: string) {
    value = value.split('-').join('');
    if (value.length >= 6) {
      value = value.substring(0, 6) + '-' + value.substring(6, value.length);
    }
    return value;
  },
  bizUnderBar(value: string) {
    value = value.split('-').join('');
    if (value.length >= 3 && value.length < 5) {
      value = value.substring(0, 3) + '-' + value.substring(3, value.length);
    } else if (value.length >= 5) {
      value =
        value.substring(0, 3) +
        '-' +
        value.substring(3, 5) +
        '-' +
        value.substring(5, value.length);
    }
    return value;
  },
  juridicalUnderBar(value: string) {
    value = value.split('-').join('');
    if (value.length >= 6) {
      value = value.substring(0, 6) + '-' + value.substring(6, value.length);
    }
    return value;
  },
  cardUnderBar(value: string) {
    value = value.split('-').join('');
    if (value.length >= 4 && value.length < 8) {
      value = value.substring(0, 4) + '-' + value.substring(4, value.length);
    } else if (value.length >= 8 && value.length < 12) {
      value =
        value.substring(0, 4) +
        '-' +
        value.substring(4, 8) +
        '-' +
        value.substring(8, value.length);
    } else if (value.length >= 12) {
      value =
        value.substring(0, 4) +
        '-' +
        value.substring(4, 8) +
        '-' +
        value.substring(8, 12) +
        '-' +
        value.substring(12, value.length);
    }
    return value;
  },
  comma(value: any) {
    // Convert the value to a string
    let num = value.toString();

    // Check for the presence of a decimal point
    let [integerPart, decimalPart] = num.split('.');

    // Handle negative numbers
    let sign = '';
    if (integerPart.startsWith('-')) {
      sign = '-';
      integerPart = integerPart.substring(1);
    }

    // Add commas to the integer part
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Reassemble the number
    num = sign + integerPart;
    if (decimalPart !== undefined) {
      num += '.' + decimalPart;
    }

    return num;
  },
  removeComma(value: any) {
    if (!value) return '';
    if (typeof value !== 'string') value = String(value);
    return value.replace(/,/gi, '');
  },
  juminCheck(jumin1: string, jumin2: string) {
    if (Number(jumin1.substring(0, 1)) < 4) {
      return false;
    }

    if (Number(jumin2.substring(0, 1)) > 2) {
      return false;
    }

    if (jumin1.length > 7 || jumin2.length > 8) {
      return false;
    }

    if (jumin1 === '72' || jumin2 === '18') {
      return false;
    }

    const f1 = Number(jumin1.substring(0, 1));
    const f2 = Number(jumin1.substring(1, 2));
    const f3 = Number(jumin1.substring(2, 3));
    const f4 = Number(jumin1.substring(3, 4));
    const f5 = Number(jumin1.substring(4, 5));
    const f6 = Number(jumin1.substring(5, 6));
    let hap = f1 * 2 + f2 * 3 + f3 * 4 + f4 * 5 + f5 * 6 + f6 * 7;
    const l1 = Number(jumin2.substring(0, 1));
    const l2 = Number(jumin2.substring(1, 2));
    const l3 = Number(jumin2.substring(2, 3));
    const l4 = Number(jumin2.substring(3, 4));
    const l5 = Number(jumin2.substring(4, 5));
    const l6 = Number(jumin2.substring(5, 6));
    const l7 = Number(jumin2.substring(6, 7));
    hap = hap + l1 * 8 + l2 * 9 + l3 * 2 + l4 * 3 + l5 * 4 + l6 * 5;
    hap = hap % 11;
    hap = 11 - hap;
    hap = hap % 10;

    if (hap !== l7) return false;
    return true;
  }
};
