const express = require('express');
const { spawn } = require('child_process');
const app = express();
const port = 3000;

app.use(express.static('../frontend'));

// Simulate Pipe Communication
app.get('/simulate-pipe', (req, res) => {
    const child = spawn('node', ['child.js']);
    let data = '';

    child.stdout.on('data', (chunk) => {
        data += chunk;
    });

    child.on('close', () => {
        res.json({ message: data });
    });

    child.stdin.write('Hello from Parent\n');
    child.stdin.end();
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});