const JSBI = require('jsbi');
const Big = require('big.js');
const { format } = require('../../src');

const HEX_64 = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const HEX_40 = '0x0123456789012345678901234567890123456789';

test('any', () => {
  expect(format.any()).toEqual(undefined);
  expect(format.any(null)).toEqual(null);
  expect(format.any(1)).toEqual(1);
  expect(format.any(true)).toEqual(true);
  expect(format.any('string')).toEqual('string');
});

test('hex(null)', () => {
  expect(format.hex(null)).toEqual('0x');

  expect(() => format.hex()).toThrow('not match hex');
  expect(() => format.hex(undefined)).toThrow('not match hex');
});

test('hex(Number)', () => {
  expect(() => format.hex(-1)).toThrow('not match hex');
  expect(format.hex(0)).toEqual('0x00');
  expect(format.hex(1)).toEqual('0x01');
  expect(() => format.hex(3.14)).toThrow('not match hex');
  expect(format.hex(256)).toEqual('0x0100');
  expect(format.hex(0x1fffffffffffff)).toEqual('0x1fffffffffffff');
});

test('hex(Buffer)', () => {
  expect(format.hex(Buffer.from([]))).toEqual('0x');
  expect(format.hex(Buffer.from([1, 10, 255]))).toEqual('0x010aff');
});

test('hex(bool)', () => {
  expect(format.hex(false)).toEqual('0x00');
  expect(format.hex(true)).toEqual('0x01');
  expect(() => format.hex('true')).toThrow('not match hex');
});

test('hex(string)', () => {
  expect(() => format.hex('')).toThrow('not match hex');
  expect(format.hex('0x')).toEqual('0x');

  expect(format.hex('0x1234')).toEqual('0x1234');
  expect(() => format.hex('1234')).toThrow('not match hex');

  expect(format.hex('0x0a')).toEqual('0x0a');
  expect(format.hex('0X0A')).toEqual('0x0a');
  expect(format.hex('0xa')).toEqual('0x0a');
  expect(() => format.hex('a')).toThrow('not match hex');
  expect(() => format.hex(' a')).toThrow('not match hex');
  expect(() => format.hex('a ')).toThrow('not match hex');
});

test('uint', () => {
  expect(() => format.uInt()).toThrow('not match uint');
  expect(() => format.uInt(null)).toThrow('not match number');
  expect(() => format.uInt(3.14)).toThrow('not match uint');
  expect(() => format.uInt('3.14')).toThrow('not match uint');
  expect(() => format.uInt(-1)).toThrow('not match uint');
  expect(format.uInt(0)).toEqual(0);
  expect(format.uInt(1)).toEqual(1);
  expect(format.uInt(3.00)).toEqual(3);
  expect(format.uInt('3.00')).toEqual(3);
  expect(format.uInt(JSBI.BigInt(100))).toEqual(100);
  expect(format.uInt('0x10')).toEqual(16);
  expect(format.uInt(true)).toEqual(1);
  expect(format.uInt(false)).toEqual(0);
  expect(format.uInt('')).toEqual(0);
  expect(format.uInt(Buffer.from([0, 1, 2]))).toEqual(0x102);
  expect(() => format.uInt(Number.MAX_SAFE_INTEGER + 1)).toThrow('not match uint');
  expect(() => format.uInt(Infinity)).toThrow('not match uint');
});

test('bigInt', () => {
  expect(() => format.bigInt(false)).toThrow('false not match BigInt');
  expect(() => format.bigInt(true)).toThrow('true not match BigInt');
  expect(() => format.bigInt(3.14)).toThrow('cannot be converted to');
  expect(() => format.bigInt('3.14')).toThrow('Cannot convert 3.14 to a BigInt');
  expect(() => format.bigInt(Buffer.from([0, 1, 2]))).toThrow('not match BigInt');
  expect(format.bigInt('')).toEqual(JSBI.BigInt(0));
  expect(format.bigInt('-1')).toEqual(JSBI.BigInt(-1));
  expect(format.bigInt('0')).toEqual(JSBI.BigInt(0));
  expect(format.bigInt(1)).toEqual(JSBI.BigInt(1));
  expect(format.bigInt(3.00)).toEqual(JSBI.BigInt(3));
  expect(format.bigInt('3.00')).toEqual(JSBI.BigInt(3));
  expect(format.bigInt('0x10')).toEqual(JSBI.BigInt(16));
  expect(format.bigInt(Number.MAX_SAFE_INTEGER + 1)).toEqual(JSBI.BigInt(2 ** 53));
});

test('bigUIntDec', () => {
  expect(format.bigUIntDec('')).toEqual('0');
  expect(format.bigUIntDec(100)).toEqual('100');
  expect(format.bigUIntDec('10')).toEqual('10');
  expect(format.bigUIntDec('0x000a')).toEqual('10');
  expect(format.bigUIntDec(JSBI.BigInt(10))).toEqual('10');
  expect(format.bigUIntDec(Number.MAX_SAFE_INTEGER)).toEqual('9007199254740991');
  expect(() => format.bigUIntDec(Buffer.from([0, 1, 2]))).toThrow('not match BigInt');
  expect(() => format.bigUIntDec(3.50)).toThrow('cannot be converted to');
  expect(() => format.bigUIntDec(-0.5)).toThrow('cannot be converted to');
  expect(() => format.bigUIntDec(-1)).toThrow('not match bigUInt');
  expect(() => format.bigUIntDec('-0x1')).toThrow('Cannot');
  expect(() => format.bigUIntDec(null)).toThrow('Cannot');
});

test('bigUInt', () => {
  expect(() => format.bigUInt(3.14)).toThrow('cannot be converted to');
  expect(() => format.bigUInt('3.14')).toThrow('Cannot convert 3.14 to a BigInt');
  expect(() => format.bigUInt(-1)).toThrow('not match bigUInt');
  expect(() => format.bigUInt('-1')).toThrow('not match bigUInt');
  expect(format.bigUInt('0')).toEqual(JSBI.BigInt(0));
  expect(format.bigUInt('0.0')).toEqual(JSBI.BigInt(0));
});

test('bigUIntHex', () => {
  expect(format.bigUIntHex('')).toEqual('0x0');
  expect(format.bigUIntHex(100)).toEqual('0x64');
  expect(format.bigUIntHex('10')).toEqual('0xa');
  expect(format.bigUIntHex('0x000a')).toEqual('0xa');
  expect(format.bigUIntHex(JSBI.BigInt(10))).toEqual('0xa');
  expect(format.bigUIntHex(Number.MAX_SAFE_INTEGER)).toEqual('0x1fffffffffffff');
  expect(() => format.bigUIntHex(Buffer.from([0, 1, 2]))).toThrow('not match BigInt');
  expect(() => format.bigUIntHex(3.50)).toThrow('cannot be converted to');
  expect(() => format.bigUIntHex(-0.5)).toThrow('cannot be converted to');
  expect(() => format.bigUIntHex(-1)).toThrow('not match bigUInt');
  expect(() => format.bigUIntHex(null)).toThrow('Cannot');
});

test('big', () => {
  expect(format.big('0b10')).toEqual(Big(2));
  expect(format.big('0O10')).toEqual(Big(8));
  expect(format.big('010')).toEqual(Big(10));
  expect(format.big('0x10')).toEqual(Big(16));
  expect(format.big(3.14)).toEqual(Big(3.14));
  expect(format.big('-03.140')).toEqual(Big(-3.14));
  expect(() => format.big()).toThrow('Invalid number');
  expect(() => format.big(null)).toThrow('Invalid number');
  expect(() => format.big(true)).toThrow('Invalid number');
  expect(() => format.big('-0x10')).toThrow('Invalid number');
});

test('epochNumber', () => {
  expect(() => format.epochNumber(-1)).toThrow('match bigUInt');
  expect(format.epochNumber(0)).toEqual('0x0');
  expect(format.epochNumber(10)).toEqual('0xa');
  expect(format.epochNumber('latest_mined')).toEqual('latest_mined');
  expect(format.epochNumber('latest_state')).toEqual('latest_state');
  expect(() => format.epochNumber('LATEST_MINED')).toThrow('not equal latest_mined');
});

test('hex40', () => {
  expect(format.hex40(HEX_40)).toEqual(HEX_40);
  expect(format.hex40(HEX_40.toUpperCase())).toEqual(HEX_40);
  expect(() => format.hex40(HEX_64)).toThrow('not match hex40');

  expect(format.checksumAddress('0x1b716c51381e76900ebaa7999a488511a4e1fd0a'))
    .toEqual('0x1B716c51381e76900EBAA7999A488511A4E1fD0a');
  expect(format.checksumAddress('0X1B716C51381E76900EBAA7999A488511A4E1FD0A'))
    .toEqual('0x1B716c51381e76900EBAA7999A488511A4E1fD0a');
  expect(format.checksumAddress('0x1B716c51381e76900EBAA7999A488511A4E1fD0A'))
    .toEqual('0x1B716c51381e76900EBAA7999A488511A4E1fD0a');

  expect(format.address('0x1b716c51381e76900ebaa7999a488511a4e1fd0a'))
    .toEqual('0x1b716c51381e76900ebaa7999a488511a4e1fd0a');
  expect(format.address('0X1B716C51381E76900EBAA7999A488511A4E1FD0A'))
    .toEqual('0x1b716c51381e76900ebaa7999a488511a4e1fd0a');
  expect(format.address('0x1B716c51381e76900EBAA7999A488511A4E1fD0a'))
    .toEqual('0x1b716c51381e76900ebaa7999a488511a4e1fd0a');
  expect(() => format.address('0x1B716c51381e76900EBAA7999A488511A4E1fD0A'))
    .toThrow('checksum error');
});

test('hex64', () => {
  expect(format.hex64(HEX_64)).toEqual(HEX_64);
  expect(() => format.hex64(HEX_40)).toThrow('not match hex64');

  expect(format.privateKey(HEX_64)).toEqual(HEX_64);
  expect(() => format.privateKey(HEX_40)).toThrow('not match hex64');

  expect(format.blockHash(HEX_64)).toEqual(HEX_64);
  expect(() => format.blockHash(HEX_40)).toThrow('not match hex64');

  expect(format.transactionHash(HEX_64)).toEqual(HEX_64);
  expect(() => format.transactionHash(HEX_40)).toThrow('not match hex64');
});

test('hexBuffer', () => {
  expect(() => format.hexBuffer(undefined)).toThrow('not match hex');

  expect(format.hexBuffer(Buffer.from([0, 1]))).toEqual(Buffer.from([0, 1]));

  expect(format.hexBuffer(null)).toEqual(Buffer.from([]));

  expect(format.hexBuffer(0)).toEqual(Buffer.from([0]));
  expect(() => format.hexBuffer(3.14)).toThrow('not match hex');
  expect(format.hexBuffer(1024)).toEqual(Buffer.from([4, 0]));
  expect(format.hexBuffer('0x0a')).toEqual(Buffer.from([10]));

  expect(format.hexBuffer(false)).toEqual(Buffer.from([0]));
  expect(format.hexBuffer(true)).toEqual(Buffer.from([1]));
});

test('bytes', () => {
  expect(() => format.bytes(undefined)).toThrow('type');
  expect(() => format.bytes(null)).toThrow('type');
  expect(() => format.bytes(0)).toThrow('type');
  expect(() => format.bytes(3.14)).toThrow('type');

  expect(format.bytes('abcd')).toEqual(Buffer.from([97, 98, 99, 100]));
  expect(format.bytes('0x0a')).toEqual(Buffer.from([48, 120, 48, 97]));
  expect(format.bytes([0, 1])).toEqual(Buffer.from([0, 1]));
  expect(format.bytes(Buffer.from([0, 1]))).toEqual(Buffer.from([0, 1]));
});

test('boolean', () => {
  expect(() => format.boolean(undefined)).toThrow('not match boolean');
  expect(() => format.boolean(1)).toThrow('not match boolean');

  expect(format.boolean(true)).toEqual(true);
  expect(format.boolean(false)).toEqual(false);
});
