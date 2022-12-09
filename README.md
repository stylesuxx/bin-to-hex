# BIN to HEX converter

Converts a bin array to an [(Intel) HEX](https://en.wikipedia.org/wiki/Intel_HEX) string. More specifically **I8HEX** since only record types 00 and 01 are being used.

## Usage

Can be used in both nodeJs and Browser context, you only need to supply the binary data in form of a Uint8Array:

```JavaScript
const data = new Uint8Array([0xDE, 0xAD, 0xBE, 0xEF]);
const converter = new BinToHex();
const hex = converter.convert(data);
```

Alternatively you can pass configuration to the consturctur, the following values are assumed to be the defaults if you do not instantiate with parameters:

```JavaScript
const addressBytes = 2;
const maxBytes = 16;
offset = 0;
empty = null;
const converter = new BinToHex(addressBytes, maxBytes, offset, empty);
```

Those parameters additionally have setters and getters:
```JavaScript
converter.setAddressBytes(4);
converter.getAddressBytes();
```

* **addressBytes**: The length of the address Bytes - 2 means that `0xFFFF`. Addresses are always padded to the maximal length. If set to 2, address `0x00` will be padded to `0x0000`.
* **maxBytes**: The maximum amount of data bytes per record
* **offset**: Offset for the address in case the data should not start at `0x00`
* **empty**: If empty value is set, bytes with this value will be removed from the resulting HEX. If the flash hast the value `0xFF` after bein erased, the hex file does not need to include those segments of memory, reducing the overall file size of the HEX file.

You can provide the binary datea to the `convert` methods in different ways, for example by reading a local file or converting a [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob/arrayBuffer) to a Buffer.

## HEX format

Each line in a HEX file represents a chunk of data at a specific address:

```
:{RCLEN}{ADDRESS}{RECTYPE}{DATA}{CHECKSUM}
```

* **:**: Startcode
* **RCLEN**: Length of {DATA} in bytes
* **ADDRESS**: The address of the data
* **RECTYPE**: Record type - this can either be 00 (Data) or 01 (End of file)
* **DATA**: {RCLEN} amount of data bytes
* **CHECKSUM**: Checksum over the whole record ({ADDRESS}, {RECTYPE} and {DATA})

Every HEX file ends with a 01 (End of file) record.

The binary representation of `0xDEADBEEF` would end up in the following HEX file representation:

```
:04 0000 00 DEADBEEF
```

## Development

```
yarn install
```

### Run linter

```
yarn lint
```

### Run tests

```
yarn test
```

### Build for NPM

```
yarn build
```


### Publish to NPM
Lint, test and build

```
yarn pre-publish
```

and finally publish to NPM

```
yarn publish
```

### Using locally
In order to use the library locally it needs to be linked like so:

1. In the root directory of this library run: ```yarn link```
2. Make sure a build exists ```yarn build```
3. In the root directory where you want to use this library run ```yarn link "node-library-template"``` - replace *node-library-template* with the actual package name as defined in *package.json*

Then you can import and use the library:
```javascript
import BinToHex from 'bin-to-hex';

const main = new Main();
main.echo('Testing');
```

### Contributing
Contributions are very welcome, please direct your PRs against the develop branch.