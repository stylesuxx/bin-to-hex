class BinToHex {
  constructor() {
    this.addressLength = 4;
    this.maxBytes = 16;
  }

  setAddressLength(length) {
    this.addressLength = length;
  }

  getAddressLength() {
    return this.addressLength;
  }

  setMaxBytes(maxBytes) {
    this.maxBytes = maxBytes;
  }

  getMaxBytes() {
    return this.maxBytes;
  }

  getChecksum(address, type, data) {
    const byteCount = data.length;

    let dataSum = 0;
    for (let i = 0; i < data.length; i += 1) {
      dataSum += data[i];
    }

    const addressString = address.toString(16);
    const addressLength = addressString.length + (addressString.length % 2);

    let addressSum = 0;
    for (let i = 0; i < addressLength / 2; i += 1) {
      addressSum += (address & 0xFF);
      address >>= 8;
    }

    const sum = byteCount + type + dataSum + addressSum;
    const sumLow = sum & 0xFF;
    const twoComplement = (~sumLow + 1) & 0xFF;

    return twoComplement.toString(16).padStart(2, '0');
  }

  getLine(address, type, data) {
    const paddedAddressHex = address.toString(16).padStart(this.addressLength, '0');
    const typeHex = type.toString(16).padStart(2, '0');
    const byteCountHex = data.length.toString(16).padStart(2, '0');
    const checksumHex = this.getChecksum(address, type, data);

    let dataHex = '';
    for (let i = 0; i < data.length; i += 1) {
      dataHex += data[i].toString(16).padStart(2, '0');
    }

    const line = `:${byteCountHex}${paddedAddressHex}${typeHex}${dataHex}${checksumHex}`;

    return line;
  }

  convert(bin) {
    const hex = '';
    let currentAddress = 0;
    const binLength = bin.length;
    const byteArrays = [];

    while (currentAddress < binLength) {

      const currentLength = 0;
      const currentByteArray = [];
      const startAddress = currentAddress;
      while (currentAddress < binLength && currentByteArray.length < this.maxBytes) {
        const byte = bin[currentAddress];
        currentByteArray.push(byte);

        currentAddress += 1;
      }

      byteArrays.push({
        address: startAddress,
        data: currentByteArray,
        type: 0x00,
      });
    }

    byteArrays.push({
      address: 0,
      data: [],
      type: 0x01,
    });

    return hex;
  }
}

export default BinToHex;
