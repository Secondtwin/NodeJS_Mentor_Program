function reverseUserInput() {
  process.stdin.on('data', data => {
    let result = `${data.toString().split('').reverse().join('')}\n`;

    process.stdout.write(result);
  });
}

module.exports = { reverseUserInput };
