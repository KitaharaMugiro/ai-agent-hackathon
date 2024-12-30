import { google } from 'googleapis';
import path from 'path';
import { promises as fs } from 'fs';

async function writeToSheet(data: any[]) {
    if (data.length !== 5) {
        throw new Error('Data must contain exactly 5 elements');
    }

    const keyFilePath = path.join(process.cwd(), 'keys', 'langcore-427201-22e5f4337d0d.json');
    const keyFileContent = await fs.readFile(keyFilePath, 'utf8');
    const credentials = JSON.parse(keyFileContent);

    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = '14w8OQNee2Yz-fyfllN8ZIWxgbx0cc4h-9VeGgNHmNq8';
    const range = 'A1:E1'; // Adjust the range as needed

    const request = {
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        resource: {
            values: [data],
        },
    };

    try {
        await sheets.spreadsheets.values.append(request);
        console.log('Data written to spreadsheet');
    } catch (err) {
        console.error('Error writing to spreadsheet:', err);
        throw err;
    }
}