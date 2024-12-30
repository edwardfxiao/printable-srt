const fs = require('fs');
const path = require('path');

// Check if input file is provided
if (process.argv.length !== 3) {
    console.log('Usage: node remove_timing.js input_file');
    process.exit(1);
}

const inputFile = process.argv[2];
// Create output filename by changing extension to .txt
const outputFile = path.join(
    path.dirname(inputFile),
    path.basename(inputFile, path.extname(inputFile)) + '.txt'
);

const MAX_LINE_LENGTH = 80; // A4 width

// Function to wrap text
function wrapText(text, maxLength) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
        if (currentLine.length + word.length + 1 <= maxLength) {
            currentLine += (currentLine.length === 0 ? '' : ' ') + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    });

    if (currentLine) {
        lines.push(currentLine);
    }

    return lines.join('\n');
}

// Read and process the file
fs.readFile(inputFile, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    const result = data
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
            if (/^\d+$/.test(line.trim())) {
                return '  ';
            }
            if (/^\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}$/.test(line.trim())) {
                return '--';
            }
            return line.trim();
        })
        .join(' ');

    // Wrap the text and save to file
    fs.writeFile(outputFile, wrapText(result, MAX_LINE_LENGTH), 'utf8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }
        console.log(`Processed file saved as: ${outputFile}`);
    });
});