# items.dat Decoder & Encoder

A simple tool to decode and encode `items.dat` files, with support for version 18 of the file format.

## Features

- **Decode**: Convert `items.dat` files into a JSON format.
- **Encode**: Convert JSON files back into the `items.dat` format.
- **Support**: Compatible with `items.dat` version 18.

## Installation

To use this tool, you need to install the `itemsdat-tool` package. 

```bash
npm install itemsdat-tool
```

## Usage

### Encoding JSON to items.dat

To encode an `items.json` file into an `items.dat` file:

```js
const itemsDat = require('itemsdat-tool');

itemsDat.encode('path/to/items.json', 'path/to/output/directory');
```

### Decoding items.dat to JSON

To decode an `items.dat` file into a JSON file:

```js
const itemsDat = require('itemsdat-tool');

itemsDat.decode('path/to/items.dat', 'path/to/output/directory');
```

### Example

Here is an example of how to decode an `items.dat` file:

```js
const itemsDat = require('itemsdat-tool');

itemsDat.decode('items.dat', 'output');
```

## Notes

- Ensure that the output directory exists before running the encode or decode functions. If it doesn't exist, the tool will automatically create it for you.
- The tool is specifically designed to work with `items.dat` version 18.