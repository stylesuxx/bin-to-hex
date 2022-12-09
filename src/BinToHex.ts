class BinToHex {
  private maxBytes: number;

  private offset: number;

  private empty: number;

  constructor(maxBytes = 10, offset = 0, empty: number = null) {
    this.maxBytes = maxBytes;
    this.offset = offset;
    this.empty = empty;
  }

  public setMaxBytes(maxBytes: number) {
    this.maxBytes = maxBytes;
  }

  public getMaxBytes() : number {
    return this.maxBytes;
  }

  public setOffset(offset: number) {
    this.offset = offset;
  }

  public getOffset() : number {
    return this.offset;
  }

  public setEmpty(empty: number) {
    this.empty = empty;
  }

  public getEmpty() : number {
    return this.empty;
  }

  private getChecksum(address: number, type: number, data: Uint8Array) : string {
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

  // Split into segments by empty delimiter
  private getSegments(address: number, data: Uint8Array) {
    let startOffset = 0;
    let endOffset = data.length;

    // Remove empty bytes from beginning of data
    for (startOffset; startOffset < data.length; startOffset += 1) {
      const byte = data[startOffset];
      if(byte !== this.empty) {
        break;
      }
    }

    // Remove empty bytes from end of data
    for(endOffset; endOffset > 0; endOffset -= 1) {
      const byte = data[endOffset - 1];
      if(byte !== this.empty) {
        break;
      }
    }
    const dataBytes = data.slice(startOffset, endOffset);

    const segments = [];
    let start = 0;
    let end = 0;
    while (end < dataBytes.length) {
      if(dataBytes[end] === this.empty) {
        segments.push({
          address: address + startOffset + start,
          data: dataBytes.slice(start, end),
        });

        start = end + 1;
      }

      end += 1;
    }

    // Push the last segment
    segments.push({
      address: address + startOffset + start,
      data: dataBytes.slice(start, end),
    });

    return segments;
  }

  private getLine(address: number, type: number, data: Uint8Array) : string{
    const typeHex = type.toString(16).padStart(2, '0');
    let segments = [{
      address: address,
      data: data,
    }];

    if(this.empty !== null && data.length > 0) {
      segments = this.getSegments(address, data);
    }

    const lines = [];
    for(let j = 0; j < segments.length; j += 1) {
      const segment = segments[j];
      const { address, data} = segment;

      // No line if empty data record
      if(data.length <= 0 && type === 0x00) {
        continue;
      }

      let dataHex = '';
      for (let i = 0; i < data.length; i += 1) {
        const byte = data[i];
        dataHex += byte.toString(16).padStart(2, '0');
      }

      const byteCountHex = data.length.toString(16).padStart(2, '0');
      const paddedAddressHex = address.toString(16).padStart(4, '0');
      const checksumHex = this.getChecksum(address, type, data);
      lines.push(`:${byteCountHex}${paddedAddressHex}${typeHex}${dataHex}${checksumHex}`);
    }

    if(lines.length > 0) {
      return lines.join("\n");
    }

    return null;
  }

  public convert(bin: Uint8Array) : string {
    const binLength = bin.length;
    const hex = [];
    const byteArrays = [];

    // Split data into chunks
    let currentAddress = 0;
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

    // Process chunks of data
    for(let i = 0; i < byteArrays.length; i += 1) {
      const {address, type, data} = byteArrays[i];
      hex.push(this.getLine(address + this.offset, type, data));
    }

    // Append End of file record
    hex.push(this.getLine(0x00, 0x01, new Uint8Array([])));

    return hex.join("\n");
  }
}

export default BinToHex;
