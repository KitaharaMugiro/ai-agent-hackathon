import { google } from 'googleapis';
import path from 'path';
import { promises as fs } from 'fs';

export async function writeToSheet(a1: string, b1: string, c1: string, d1: string, e1: string) {
    const keyFilePath = path.join(process.cwd(), 'keys', 'langcore-427201-22e5f4337d0d.json');
    const keyFileContent = await fs.readFile(keyFilePath, 'utf8');
    const credentials = JSON.parse(keyFileContent);

    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = '1IjXpZXKhbsxkuo4Fo3r80HYonebVoYsamSwtWxZVGOQ';
    const range = 'A1:E1'; // Adjust the range as needed

    const request = {
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        resource: {
            values: [
                [a1, b1, c1, d1, e1],
            ],
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
