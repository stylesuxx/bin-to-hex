import fs from 'fs';
import util from 'util';
import BinToHex from '../src/BinToHex';

describe('BinToHex.js', () => {
  test('Creates instance of Class main', () => {
    const converter = new BinToHex();

    expect(typeof converter).toEqual('object');
    expect(converter instanceof BinToHex).toBeTruthy();
  });

  describe('convert', () => {
    test('no data', () => {
      const data = new Uint8Array([]);
      const result = ':00000001FF';

      const converter = new BinToHex();
      const hexString = converter.convert(data);

      expect(hexString).toEqual(result);
    });

    describe('with data', () => {
      test('4 bytes', () => {
        const data = new Uint8Array([
          0xDE, 0xAD, 0xBE, 0xEF,
        ]);
        const result = [
          ':04000000DEADBEEFC4',
          ':00000001FF',
        ].join("\n");

        const converter = new BinToHex();
        const hexString = converter.convert(data);

        expect(hexString).toEqual(result);
      });

      test('16 bytes', () => {
        const data = new Uint8Array([
          0xDE, 0xAD, 0xBE, 0xEF, 0xDE, 0xAD, 0xBE, 0xEF, 0xDE, 0xAD,
          0xBE, 0xEF,
        ]);
        const result = [
          ':0A000000DEADBEEFDEADBEEFDEADFB',
          ':02000A00BEEF47',
          ':00000001FF',
        ].join("\n");

        const converter = new BinToHex();
        const hexString = converter.convert(data);

        expect(hexString).toEqual(result);
      });

      describe('remove empty', () => {
        test('from beginning and end', () => {
          const data = new Uint8Array([
            0xFF, 0xFF, 0xDE, 0xAD, 0xBE, 0xEF, 0xFF, 0xFF
          ]);
          const result = [
            ':04000200DEADBEEFC2',
            ':00000001FF',
          ].join("\n");

          const converter = new BinToHex();
          converter.setEmpty(0xFF);
          const hexString = converter.convert(data);

          expect(hexString).toEqual(result);
        });

        test('leave 1 empty inbetween', () => {
          const data = new Uint8Array([
            0xDE, 0xAD, 0x0FF, 0xBE, 0xEF, 0xFF, 0xBA, 0xBE,
          ]);
          const result = [
            ':08000000DEADFFBEEFFFBABE4A',
            ':00000001FF',
          ].join("\n");

          const converter = new BinToHex();
          converter.setEmpty(0xFF);
          const hexString = converter.convert(data);

          expect(hexString).toEqual(result);
        });

        test('remove 5 empty inbetween', () => {
          const data = new Uint8Array([
            0xDE, 0xAD, 0x0FF, 0x0FF, 0x0FF, 0x0FF, 0x0FF, 0xBE, 0xEF, 0xBA,
            0xBE,
          ]);
          const result = [
            ':02000000DEAD73',
            ':03000700BEEFBA8F',
            ':01000A00BE37',
            ':00000001FF',
          ].join("\n");

          const converter = new BinToHex();
          converter.setEmpty(0xFF);
          const hexString = converter.convert(data);

          expect(hexString).toEqual(result);
        });
      });
    });

    describe('with offset', () => {
      test('4 bytes', () => {
        const data = new Uint8Array([
          0xDE, 0xAD, 0xBE, 0xEF,
        ]);
        const result = [
          ':0400FF00DEADBEEFC5',
          ':00000001FF',
        ].join("\n");

        const converter = new BinToHex(16, 0xFF);
        const hexString = converter.convert(data);

        expect(hexString).toEqual(result);
      });

      describe('remove empty', () => {
        test('remove empty from beginning and end', () => {
          const data = new Uint8Array([
            0xFF, 0xFF, 0xDE, 0xAD, 0xBE, 0xEF, 0xFF, 0xFF
          ]);
          const result = [
            ':04010100DEADBEEFC2',
            ':00000001FF',
          ].join("\n");

          const converter = new BinToHex(16, 0xFF);
          converter.setEmpty(0xFF);
          const hexString = converter.convert(data);

          expect(hexString).toEqual(result);
        });

        test('remove 1 empty inbetween', () => {
          const data = new Uint8Array([
            0xDE, 0xAD, 0x0FF, 0xBE, 0xEF, 0xFF, 0xBA, 0xBE,
          ]);
          const result = [
            ':0800FF00DEADFFBEEFFFBABE4B',
            ':00000001FF',
          ].join("\n");

          const converter = new BinToHex(16, 0xFF);
          converter.setEmpty(0xFF);
          const hexString = converter.convert(data);

          expect(hexString).toEqual(result);
        });

        test('remove 5 empty inbetween', () => {
          const data = new Uint8Array([
            0xDE, 0xAD, 0x0FF, 0x0FF, 0x0FF, 0x0FF, 0x0FF, 0xBE, 0xEF, 0xBA,
            0xBE,
          ]);
          const result = [
            ':0200FF00DEAD74',
            ':04010600BEEFBABED0',
            ':00000001FF',
          ].join("\n");

          const converter = new BinToHex(16, 0xFF);
          converter.setEmpty(0xFF);
          const hexString = converter.convert(data);

          expect(hexString).toEqual(result);
        });
      });
    });

    describe('from file', () => {
      test('convert removing empty', () => {
        const inputFileContent = fs.readFileSync('./test/files/input.BIN');
        const data = new Uint8Array(inputFileContent);

        const result = fs.readFileSync('./test/files/output.HEX', 'utf8');

        const converter = new BinToHex(16, 0x00, 0xFF);
        const hexString = converter.convert(data);

        expect(hexString).toEqual(result);
      });
    });
  });
});
