import BinToHex from '../src/BinToHex';

describe('BinToHex.js', () => {
  test('Creates instance of Class main', () => {
    const converter = new BinToHex();

    expect(typeof converter).toEqual('object');
    expect(converter instanceof BinToHex).toBeTruthy();
  });

  describe('getChecksum', () => {
    describe('type 0x00', () => {
      describe('without data', () => {
        test('starting at 0x0000', () => {
          const converter = new BinToHex();
          const checksum = converter.getChecksum(0x0000, 0, []);

          expect(checksum).toEqual('00');
        });

        test('starting at 0x00E2', () => {
          const converter = new BinToHex();
          const checksum = converter.getChecksum(0x00E2, 0, []);

          expect(checksum).toEqual('1e');
        });
      });

      describe('with data', () => {
        test('starting at 0x1AF0', () => {
          const converter = new BinToHex();
          const checksum = converter.getChecksum(0x1AF0, 0x00, [0xFF]);

          expect(checksum).toEqual('f6');
        });

        test('starting at 0x1220', () => {
          const converter = new BinToHex();
          const checksum = converter.getChecksum(0x1220, 0x00, [0x0F, 0xDB]);

          expect(checksum).toEqual('e2');
        });
      });
    });

    describe('type 0x01', () => {
      test('without data', () => {
        const converter = new BinToHex();
        const checksum = converter.getChecksum(0x00, 0x01, []);

        expect(checksum).toEqual('ff');
      });
    });
  });

  describe('getLine', () => {
    test('no byte, type 0x01', () => {
      const data = new Uint8Array([]);
      const result = ':00000001ff';

      const converter = new BinToHex();
      const line = converter.getLine(0x00, 0x01, data);

      expect(line).toEqual(result);
    });

    describe('type 0x00', () => {
      test('1 byte', () => {
        // :01 0000 00 FF 00
        const data = new Uint8Array([0xFF]);
        const result = ':01000000ff00';

        const converter = new BinToHex();
        const line = converter.getLine(0x00, 0x00, data);

        expect(line).toEqual(result);
      });

      test('2 byte', () => {
        // :02 1220 00 0FDB E2
        const data = new Uint8Array([0x0F, 0xDB]);
        const result = ':021220000fdbe2';

        const converter = new BinToHex();
        const line = converter.getLine(0x1220, 0x00, data);

        expect(line).toEqual(result);
      });

      test('8 byte', () => {
        // :06 000000 0219FD020359 84
        const data = new Uint8Array([0x02, 0x19, 0xFD, 0x02, 0x03, 0x59]);
        const result = ':060000000219fd02035984';

        const converter = new BinToHex();
        const line = converter.getLine(0x00, 0x00, data);

        expect(line).toEqual(result);
      });

      test('16 byte', () => {
        // :10 19FD 00 020E5F0010CCFF33010119FF091801FF 22
        const data = new Uint8Array([
          0x02, 0x0E, 0x5F, 0x00, 0x10, 0xCC, 0xFF, 0x33,
          0x01, 0x01, 0x19, 0xFF, 0x09, 0x18, 0x01, 0xFF,
        ]);
        const result = ':1019fd00020e5f0010ccff33010119ff091801ff22';

        const converter = new BinToHex();
        const line = converter.getLine(0x19FD, 0x00, data);

        expect(line).toEqual(result);
      });
    });
  });
});
