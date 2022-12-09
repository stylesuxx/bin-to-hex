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
