const fs = require('fs');
const {Transform} = require('stream');
const path = require('path');

class CsvToJson extends Transform {
  constructor(separator) {
    super({readableObjectMode: true});
    this.separator = separator || ',';
    this.headers = null;
  }

  _transform(chunk, encoding, callback) {
    const lines = chunk.toString().split('\n');
    lines.forEach(line => {
      if (line.trim() === "") return;
      const row = line.split(this.separator);
      if (!this.headers) {
        this.headers = row;
        return callback();
      }
      const jsonObj = this.headers.reduce((obj, header, index) => {
        obj[header.trim()] = row[index] ? row[index].trim() : null;
        return obj;
      }, {});
      this.push(JSON.stringify(jsonObj) + "\n");
    })
    callback();
  }

}

const args = process.argv.slice(2);
const sourceFile = args.find(arg => arg.startsWith('--sourceFile'))?.split('=')[1];
const resultFile = args.find(arg => arg.startsWith('--resultFile'))?.split('=')[1];
const separator = args.find(arg => arg.startsWith('--separator'))?.split('=')[1];

if (!sourceFile || !resultFile) {
  console.error('Please provide source and result file as arguments');
  process.exit(1);
}

const readableStream = fs.createReadStream(sourceFile);
const writebleStream = fs.createWriteStream(resultFile);
const csvTransform = new CsvToJson(separator);

readableStream.pipe(csvTransform).pipe(writebleStream).on('finish', () => {
  console.log('Conversion completed');
}).on('error', err => {
  console.error(err);
})
