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
          const data = new Uint8Array([]);
          const checksum = converter.getChecksum(0x0000, 0, data);

          expect(checksum).toEqual('00');
        });

        test('starting at 0x00E2', () => {
          const converter = new BinToHex();
          const data = new Uint8Array([]);
          const checksum = converter.getChecksum(0x00E2, 0, data);

          expect(checksum).toEqual('1e');
        });
      });

      describe('with data', () => {
        test('starting at 0x1AF0', () => {
          const converter = new BinToHex();
          const data = new Uint8Array([0xFF]);
          const checksum = converter.getChecksum(0x1AF0, 0x00, data);

          expect(checksum).toEqual('f6');
        });

        test('starting at 0x1220', () => {
          const converter = new BinToHex();
          const data = new Uint8Array([0x0F, 0xDB]);
          const checksum = converter.getChecksum(0x1220, 0x00, data);

          expect(checksum).toEqual('e2');
        });
      });
    });

    describe('type 0x01', () => {
      test('without data', () => {
        const converter = new BinToHex();
        const data = new Uint8Array([]);
        const checksum = converter.getChecksum(0x00, 0x01, data);

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

      test('16 byte - less data', () => {
        // :04 0000 00 deadbeef c4
        const data = new Uint8Array([
          0xDE, 0xAD, 0xBE, 0xEF,
        ]);
        const result = ':04000000deadbeefc4';

        const converter = new BinToHex();
        const line = converter.getLine(0x0000, 0x00, data);

        expect(line).toEqual(result);
      });
    });

    describe('remove empty', () => {
      describe('in the front', () => {
        test('1 empty byte, 0 data', () => {
          const data = new Uint8Array([0xFF]);
          const result = null;

          const converter = new BinToHex();
          converter.setEmpty(0xFF);

          const line = converter.getLine(0x00, 0x00, data);

          expect(line).toEqual(result);
        });

        test('2 empty byte, 0 data', () => {
          const data = new Uint8Array([0xFF, 0xFF]);
          const result = null;

          const converter = new BinToHex();
          converter.setEmpty(0xFF);

          const line = converter.getLine(0x00, 0x00, data);

          expect(line).toEqual(result);
        });

        test('1 empty byte, 1 data', () => {
          // :01 0001 00 00 fe
          const data = new Uint8Array([0xFF, 0x00]);
          const result = ':0100010000fe';

          const converter = new BinToHex();
          converter.setEmpty(0xFF);

          const line = converter.getLine(0x00, 0x00, data);

          expect(line).toEqual(result);
        });

        test('2 empty byte, 2 data', () => {
          // :02 0002 00 0001 fb
          const data = new Uint8Array([0xFF, 0xFF, 0x00, 0x01]);
          const result = ':020002000001fb';

          const converter = new BinToHex();
          converter.setEmpty(0xFF);

          const line = converter.getLine(0x00, 0x00, data);

          expect(line).toEqual(result);
        });
      });

      describe('in the end', () => {
        test('1 empty byte, 0 data', () => {
          const data = new Uint8Array([0xFF]);
          const result = null;

          const converter = new BinToHex();
          converter.setEmpty(0xFF);

          const line = converter.getLine(0x00, 0x00, data);

          expect(line).toEqual(result);
        });

        test('2 empty byte, 0 data', () => {
          const data = new Uint8Array([0xFF, 0xFF]);
          const result = null;

          const converter = new BinToHex();
          converter.setEmpty(0xFF);

          const line = converter.getLine(0x00, 0x00, data);

          expect(line).toEqual(result);
        });

        test('1 empty byte, 1 data', () => {
          // :01 0000 00 00 ff
          const data = new Uint8Array([0x00, 0xFF]);
          const result = ':0100000000ff';

          const converter = new BinToHex();
          converter.setEmpty(0xFF);

          const line = converter.getLine(0x00, 0x00, data);

          expect(line).toEqual(result);
        });

        test('2 empty byte, 2 data', () => {
          // :02 0000 00 0001 fd
          const data = new Uint8Array([0x00, 0x01, 0xFF, 0xFF]);
          const result = ':020000000001fd';

          const converter = new BinToHex();
          converter.setEmpty(0xFF);

          const line = converter.getLine(0x00, 0x00, data);

          expect(line).toEqual(result);
        });
      });

      describe('in the front and end', () => {
        test('1 empty byte, 1 data', () => {
          // :01 0001 00 00 fe
          const data = new Uint8Array([0xFF, 0x00, 0xFF]);
          const result = ':0100010000fe';

          const converter = new BinToHex();
          converter.setEmpty(0xFF);

          const line = converter.getLine(0x00, 0x00, data);

          expect(line).toEqual(result);
        });

        test('2 empty byte, 2 data', () => {
          // :02 0002 00 0001 fb
          const data = new Uint8Array([0xFF, 0xFF, 0x00, 0x01, 0xFF, 0xFF]);
          const result = ':020002000001fb';

          const converter = new BinToHex();
          converter.setEmpty(0xFF);

          const line = converter.getLine(0x00, 0x00, data);

          expect(line).toEqual(result);
        });
      });
    });
  });

  describe('convert', () => {
    test('no data', () => {
      const data = new Uint8Array([]);
      const result = ':00000001ff';

      const converter = new BinToHex();
      const line = converter.convert(data);

      expect(line).toEqual(result);
    });

    describe('with data', () => {
      test('4 bytes', () => {
        const data = new Uint8Array([
          0xDE, 0xAD, 0xBE, 0xEF,
        ]);
        const result = [
          ':04000000deadbeefc4',
          ':00000001ff',
        ].join("\n");

        const converter = new BinToHex();
        const line = converter.convert(data);

        expect(line).toEqual(result);
      });

      test('remove empty from beginning and end', () => {
        const data = new Uint8Array([
          0xFF, 0xFF, 0xDE, 0xAD, 0xBE, 0xEF, 0xFF, 0xFF
        ]);
        const result = [
          ':04000200deadbeefc2',
          ':00000001ff',
        ].join("\n");

        const converter = new BinToHex();
        converter.setEmpty(0xFF);
        const line = converter.convert(data);

        expect(line).toEqual(result);
      });

      test('remove 1 empty from inbetween', () => {
        const data = new Uint8Array([
          0xDE, 0xAD, 0x0FF, 0xBE, 0xEF, 0xFF, 0xBA, 0xBE,
        ]);
        const result = [
          ':02000000dead73',
          ':02000300beef4e',
          ':02000600babe80',
          ':00000001ff',
        ].join("\n");

        const converter = new BinToHex();
        converter.setEmpty(0xFF);
        const line = converter.convert(data);

        expect(line).toEqual(result);
      });

    });
  });
});
