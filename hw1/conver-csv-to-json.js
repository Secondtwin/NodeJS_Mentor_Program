const csvtojson = require('csvtojson');
const fs = require('fs');

function convertCSVtoJSON() {
  const filePath = './csv/nodejs-hw1-ex1.csv';
  const csvData = [];

  csvtojson({
    headers: ['book', 'author', 'amount', 'price'],
    ignoreColumns: /(amount)/,
    colParser: { price: 'number' },
  })
    .fromFile(filePath)
    .on('data',(data) => {
      csvData.push(data.toString());
    })
    .on('done',(error) => {
      if (error) return console.log(`Error happened during reading file: ${error}`);

      fs.writeFile('./hw1/task2res.txt', csvData.join(''), (err) => {
        if (err) {
          return console.log(`Error happened during writing to file: ${err}`);
        } else {
          return console.log('Parsing finished successfully');
        }
      });
    })
}

module.exports = { convertCSVtoJSON };
