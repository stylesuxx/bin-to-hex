class BinToHex {
  private addressBytes: number;

  private maxBytes: number;

  private offset: number;

  private empty: number;

  constructor(addressBytes: number = 2, maxBytes: number = 16, offset: number = 0, empty: number = null) {
    this.addressBytes = addressBytes;
    this.maxBytes = maxBytes;
    this.offset = offset;
    this.empty = empty;
  }

  setAddressBytes(length: number) {
    this.addressBytes = length;
  }

  getAddressBytes() : number {
    return this.addressBytes;
  }

  setMaxBytes(maxBytes: number) {
    this.maxBytes = maxBytes;
  }

  getMaxBytes() : number {
    return this.maxBytes;
  }

  setOffset(offset: number) {
    this.offset = offset;
  }

  getOffset() : number {
    return this.offset;
  }

  setEmpty(empty: number) {
    this.empty = empty;
  }

  getEmpty() : number {
    return this.empty;
  }

  getChecksum(address: number, type: number, data: Uint8Array) : string {
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

  getLine(address: number, type: number, data: Uint8Array) : string{
    let currentAddress = address;
    const typeHex = type.toString(16).padStart(2, '0');
    const checksumHex = this.getChecksum(address, type, data);

    let startOffset = 0;
    let endOffset = data.length;
    if(this.empty !== null) {
      // Remove empty bytes from beginning of data
      for (startOffset; startOffset < data.length; startOffset += 1) {
        const byte = data[startOffset];
        if(byte !== this.empty) {
          break;
        }
      }
      currentAddress += startOffset;

      // Remove empty bytes from end of data
      for(endOffset; endOffset > 0; endOffset -= 1) {
        const byte = data[endOffset - 1];
        if(byte !== this.empty) {
          break;
        }
      }
    }
    console.log(this.empty, data, startOffset, endOffset);
    const dataBytes = data.slice(startOffset, endOffset);

    // No line if empty data record
    if(dataBytes.length <= 0 && type === 0x00) {
      return null;
    }

    let dataHex = '';
    for (let i = 0; i < dataBytes.length; i += 1) {
      const byte = dataBytes[i];
      dataHex += byte.toString(16).padStart(2, '0');
    }

    const byteCountHex = dataBytes.length.toString(16).padStart(2, '0');
    const paddedAddressHex = currentAddress.toString(16).padStart(this.addressBytes * 2, '0');
    const line = `:${byteCountHex}${paddedAddressHex}${typeHex}${dataHex}${checksumHex}`;

    return line;
  }

  convert(bin: Uint8Array) : string {
    const hex = [];
    let currentAddress = 0;
    const binLength = bin.length;
    const byteArrays = [];

    while (currentAddress < binLength) {
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

    for(let i = 0; i < byteArrays.length; i += 1) {
      const data = byteArrays[i];
      hex.push(this.getLine(data.address, data.type, data.data));
    }
    hex.push(this.getLine(0x00, 0x01, new Uint8Array([])));

    return hex.join("\n");
  }
}

export default BinToHex;
