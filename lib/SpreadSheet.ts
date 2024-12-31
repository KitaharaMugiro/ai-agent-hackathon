"use server"
import { google } from 'googleapis';

export async function writeToSheet(a1: string, b1: string, c1: string, d1: string, e1: string) {

    const serviceAccount = {
        type: "service_account",
        project_id: process.env.GOOGLE_PROJECT_ID ?? '',
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID ?? '',
        private_key: (process.env.GOOGLE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'), // 改行を復元
        client_email: process.env.GOOGLE_CLIENT_EMAIL ?? '',
        client_id: process.env.GOOGLE_CLIENT_ID ?? '',
        auth_uri: process.env.GOOGLE_AUTH_URI ?? '',
        token_uri: process.env.GOOGLE_TOKEN_URI ?? '',
        auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
        client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
    };

    const auth = new google.auth.GoogleAuth({
        credentials: serviceAccount,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = '1IjXpZXKhbsxkuo4Fo3r80HYonebVoYsamSwtWxZVGOQ';
    const range = 'A1:F1'; // Adjust the range as needed

    const currentDate = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
    const request = {
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        resource: {
            values: [
                [currentDate, a1, b1, c1, d1, e1],
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
