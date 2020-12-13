const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

// 只支持整数型十进制输入
function number2String(number, radix) {
    if (radix === 10) return String(number);

    let result = '';
    let nextNumber = Math.abs(number);
    let isNegative = number < 0;


    while (nextNumber > 0) {
        result = `${DIGITS[nextNumber % radix]}${result}`;
        nextNumber = Math.floor(nextNumber / radix);
    }

    return isNegative ? `-${result}` : result;
}

console.log(number2String(1234, 16));
console.log(number2String(1234, 10));
console.log(number2String(1234, 8));
console.log(number2String(1234, 2));

// 只支持整数字符串形式，十进制支持带符号位，因为除十进制外小数部分都不是用点表示为了简化计算
function string2Number(string) {
    let isNegative = string.slice(0, 1) === '-';
    let result = 0;
    let strWithoutSign;
    let numberPart;
    let starts = {
        '0b': 2,
        '0o': 8,
        '0x': 16
    }

    // 判断是否有负号，获取非负号的字符串部分
    if (isNegative) {
        strWithoutSign = string.slice(1);
    } else {
        strWithoutSign = string;
    }

    // 根据前缀判断进制数
    let radix = starts[strWithoutSign.slice(0, 2)] || 10;

    // 如果不是十进制，则从第三位开始取
    if (radix === 10) {
        numberPart = strWithoutSign;
    } else {
        numberPart = strWithoutSign.slice(2);
    }

    numberPart.split('').forEach((digit, idx) => {
        result += Number(DIGITS.indexOf(digit) * Math.pow(radix, numberPart.length - 1 - idx))
    });

    return isNegative ? 0 - result: result;
}

console.log(string2Number('0b0'))
console.log(string2Number('-0b110'))
console.log(string2Number('0xFE'))
console.log(string2Number('-0b0001'))
console.log(string2Number('0b11111111'))