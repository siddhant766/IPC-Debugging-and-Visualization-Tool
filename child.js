process.stdin.on('data', function (data) {
    process.stdout.write(`Child received: ${data}`);
});