const fs = require('fs');

function generateCSV(filePath, rows) {
  const writeStream = fs.createWriteStream(filePath);
  const headers = 'id,name,age\n';
  writeStream.write(headers);
  for (let i = 1; i <= rows; i++) {
    const row = `${i},John Doe,${Math.floor(Math.random() * 100) + 1}\n`;
    writeStream.write(row);
  }
  writeStream.end();
  writeStream.on('finish', () => {
    console.log('CSV file created successfully');
  });
  writeStream.on('error', err => {
    console.error(err);
  });
}

const filePath = 'data.csv';
const rows = 1000000;
generateCSV(filePath, rows);